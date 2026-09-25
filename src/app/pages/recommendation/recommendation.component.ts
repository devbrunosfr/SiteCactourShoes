import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShellService } from '../../services/shell.service';
import { WardrobeStateService } from '../../services/wardrobe-state.service';
import { SavedAnalysesService } from '../../services/saved-analyses.service';
import { AuthService } from '../../auth/auth.service';
import { BRANDS, CATALOG, EDIT_OPTIONS, Occasion, PALETTES, Shoe } from '../../data/catalog';
import {
  Profile, Score, brl, costPerUse, equivalentOf, fitLabel,
  pickHighlights, pieceFit, scoreShoe, sizeFor, targetVolume, usesEstimate, verdict, why
} from '../../data/engine';
import { ShoeArtComponent } from './shoe-art.component';

interface Ranked { shoe: Shoe; score: Score; }
interface HighlightCard { tag: string; icon: string; featured: boolean; item: Ranked; }

const STORE_KEY = 'cactour.recommendation.v1';

@Component({
  selector: 'senso-recommendation',
  standalone: true,
  imports: [ShoeArtComponent, RouterLink],
  templateUrl: './recommendation.component.html',
  styleUrl: './recommendation.component.css'
})
export class RecommendationComponent implements OnInit {
  private readonly shell = inject(ShellService);
  private readonly state = inject(WardrobeStateService);
  private readonly auth = inject(AuthService);
  private readonly savedAnalyses = inject(SavedAnalysesService);

  readonly brands = BRANDS;
  readonly palettes = PALETTES;
  readonly sizes = [37, 38, 39, 40, 41, 42, 43, 44, 45];

  choice: Record<string, string> = { genero: 'unissex', estilo: 'streetwear', camisetas: 'oversized', calcas: 'wide-leg' };

  palette: Shoe['palette'] | null = null;

  brand: string | null = null;
  boldness = 50;
  budget = 1000;

  occasion: Occasion | null = null;
  perWeek = 3;
  baseSize = 42;

  liked: string[] = [];
  disliked: string[] = [];
  owned: string[] = [];
  wish: string[] = [];
  compareIds: string[] = [];

  openStores: string | null = null;
  openParts: string | null = null;
  showCompare = false;
  showDismissed = false;

  ranked: Ranked[] = [];
  highlights: HighlightCard[] = [];

  ngOnInit(): void {
    const sel = this.state.selections;
    this.choice = {
      genero: sel['genero']?.id ?? 'unissex',
      estilo: sel['estilo']?.id ?? 'streetwear',
      camisetas: sel['camisetas']?.id ?? 'oversized',
      calcas: sel['calcas']?.id ?? 'wide-leg'
    };
    this.load();
    this.recompute();
  }

  get profile(): Profile {
    return {
      estilo: this.choice['estilo'],
      camiseta: this.choice['camisetas'],
      calca: this.choice['calcas'],
      palette: this.palette,
      boldness: this.boldness,
      budget: this.budget,
      occasion: this.occasion,
      liked: this.liked
    };
  }

  get summary(): { key: string; label: string; value: string }[] {
    const opt = (key: string) => EDIT_OPTIONS[key].find(o => o.id === this.choice[key])?.title ?? '—';
    const t = targetVolume(this.profile);
    const silhouette = t >= 7 ? 'Ampla' : t >= 4.5 ? 'Equilibrada' : 'Ajustada';
    return [
      { key: 'estilo', label: 'Estética', value: opt('estilo') },
      { key: 'camisetas', label: 'Camisetas', value: opt('camisetas') },
      { key: 'calcas', label: 'Calças', value: opt('calcas') },
      { key: 'cores', label: 'Cores', value: this.paletteLabel },
      { key: 'silhueta', label: 'Silhueta', value: silhouette }
    ];
  }

  get paletteLabel(): string {
    return this.palettes.find(p => p.id === this.palette)?.label ?? 'Todas';
  }

  get brandLabel(): string {
    return this.brand ?? 'Todas';
  }

  get dismissed(): Shoe[] {
    return CATALOG.filter(s => this.disliked.includes(s.id));
  }

  get compareShoes(): Shoe[] {
    return this.compareIds.map(id => CATALOG.find(s => s.id === id)).filter((s): s is Shoe => !!s);
  }

  get interacted(): boolean {
    return this.liked.length + this.owned.length + this.wish.length > 0;
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn;
  }

  get shareText(): string {
    const best = this.highlights[0]?.item;
    const s = this.summary;
    return `Meu estilo na CactourShoes: ${s[0].value} · ${s[1].value} + ${s[2].value}${this.palette ? ' · cores ' + s[3].value.toLowerCase() : ''}.`
      + (best ? ` Meu próximo calçado ideal: ${best.shoe.brand} ${best.shoe.name} (${best.score.total}% de compatibilidade).` : '');
  }

  brl = brl;
  fitLabel = fitLabel;

  scoreOf(shoe: Shoe): Score { return scoreShoe(shoe, this.profile); }
  verdictOf(shoe: Shoe) { return verdict(shoe); }
  whyOf(shoe: Shoe): string { return why(shoe, this.profile); }
  piecesOf(shoe: Shoe) { return pieceFit(shoe, this.profile); }
  cpu(shoe: Shoe): string { return brl(costPerUse(shoe, this.perWeek)); }

  bestStore(shoe: Shoe): string {
    const best = shoe.stores.reduce((a, b) => (a.price <= b.price ? a : b));
    return `${best.name} · ${brl(best.price)}`;
  }

  occasionsOf(shoe: Shoe): string {
    const labels: Record<string, string> = { dia: 'Dia a dia', trabalho: 'Trabalho', festa: 'Festa', esporte: 'Esporte' };
    return shoe.occasions.map(o => labels[o] ?? o).join(', ');
  }
  usesOf(shoe: Shoe): number { return usesEstimate(shoe, this.perWeek); }
  sizeOf(shoe: Shoe): string { return sizeFor(shoe, this.baseSize); }

  allows(shoe: Shoe): boolean { return this.choice['genero'] !== 'masculino' || shoe.gender !== 'feminino'; }
  equivalent(shoe: Shoe): Shoe | null { return equivalentOf(shoe, s => this.allows(s)); }
  saving(shoe: Shoe, other: Shoe): number { return Math.round(((shoe.price - other.price) / shoe.price) * 100); }
  ring(total: number): string { return `conic-gradient(#c8ff2f ${total * 3.6}deg, #ffffff14 0)`; }
  isLiked(id: string): boolean { return this.liked.includes(id); }
  isOwned(id: string): boolean { return this.owned.includes(id); }
  isWished(id: string): boolean { return this.wish.includes(id); }
  isCompared(id: string): boolean { return this.compareIds.includes(id); }

  spark(shoe: Shoe): string {
    const min = Math.min(...shoe.history);
    const max = Math.max(...shoe.history);
    const span = Math.max(1, max - min);
    return shoe.history
      .map((v, i) => `${(i / (shoe.history.length - 1)) * 100},${28 - ((v - min) / span) * 24}`)
      .join(' ');
  }

  setPalette(v: string): void {
    this.palette = (v || null) as Shoe['palette'] | null;
    this.changed();
  }

  setBoldness(v: string): void { this.boldness = Number(v); this.changed(); }
  setBudget(v: string): void { this.budget = Number(v); this.changed(); }
  setPerWeek(v: string): void { this.perWeek = Number(v); this.changed(); }
  setSize(v: string): void { this.baseSize = Number(v); this.changed(); }

  setBrand(v: string): void {
    this.brand = v || null;
    this.changed();
  }

  like(id: string): void {
    this.liked = this.isLiked(id) ? this.liked.filter(x => x !== id) : [...this.liked, id];
    this.disliked = this.disliked.filter(x => x !== id);
    this.changed(this.isLiked(id) ? 'Curtido. Vamos priorizar calçados parecidos.' : undefined);
  }

  dislike(id: string): void {
    this.disliked = [...this.disliked, id];
    this.liked = this.liked.filter(x => x !== id);
    this.compareIds = this.compareIds.filter(x => x !== id);
    this.changed('Dispensado. Você pode desfazer no fim da lista.');
  }

  restore(id: string): void {
    this.disliked = this.disliked.filter(x => x !== id);
    this.changed();
  }

  own(id: string): void {
    this.owned = this.isOwned(id) ? this.owned.filter(x => x !== id) : [...this.owned, id];
    this.compareIds = this.compareIds.filter(x => x !== id);
    this.changed(this.isOwned(id) ? 'Adicionado aos calçados que você já tem.' : undefined);
  }

  toggleWish(id: string): void {
    this.wish = this.isWished(id) ? this.wish.filter(x => x !== id) : [...this.wish, id];
    this.changed(this.isWished(id) ? 'Salvo na sua lista de desejos.' : undefined);
  }

  toggleCompare(id: string): void {
    if (this.isCompared(id)) {
      this.compareIds = this.compareIds.filter(x => x !== id);
    } else if (this.compareIds.length >= 3) {
      this.toast('Compare até 3 calçados por vez.');
      return;
    } else {
      this.compareIds = [...this.compareIds, id];
    }
    if (this.compareIds.length < 2) this.showCompare = false;
    this.save();
  }

  toggleStores(id: string): void { this.openStores = this.openStores === id ? null : id; }
  toggleParts(id: string): void { this.openParts = this.openParts === id ? null : id; }

  buy(shoe: Shoe): void {
    const best = shoe.stores.reduce((a, b) => (a.price <= b.price ? a : b));
    this.toast(`Abrindo ${best.name} — ${brl(best.price)}.`);
  }

  saveAnalysis(): void {
    this.save();

    const best = this.highlights[0]?.item;
    if (!best) {
      this.toast('Monte sua análise primeiro para poder salvá-la.');
      return;
    }

    this.savedAnalyses.add({
      shoeId: best.shoe.id,
      shoeName: `${best.shoe.brand} ${best.shoe.name}`,
      brand: best.shoe.brand,
      score: best.score.total,
      verdict: this.verdictOf(best.shoe).label,
      why: this.whyOf(best.shoe),
      estilo: this.summary[0].value,
      cores: this.paletteLabel
    });

    this.toast(this.isLoggedIn
      ? 'Análise salva no seu perfil.'
      : 'Análise salva neste navegador. Faça login para vê-la no seu perfil.');
  }

  async share(): Promise<void> {
    const text = this.shareText;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Meu estilo — CactourShoes', text });
        return;
      }
      await navigator.clipboard.writeText(text);
      this.toast('Resultado copiado. É só colar no Instagram ou WhatsApp.');
    } catch {
      this.toast('Não foi possível compartilhar agora.');
    }
  }

  toast(message: string): void { this.shell.toast(message); }

  private changed(message?: string): void {
    this.recompute();
    this.save();
    if (message) this.toast(message);
  }

  private recompute(): void {
    const profile = this.profile;
    this.ranked = CATALOG
      .filter(s => s.price <= this.budget)
      .filter(s => this.allows(s))
      .filter(s => !this.disliked.includes(s.id) && !this.owned.includes(s.id))
      .filter(s => !this.brand || s.brand === this.brand)
      .filter(s => !this.palette || s.palette === this.palette)
      .map(shoe => ({ shoe, score: scoreShoe(shoe, profile) }))
      .sort((a, b) => b.score.total - a.score.total);

    const { best, value, bold } = pickHighlights(this.ranked);
    const cards: HighlightCard[] = [];
    if (best) cards.push({ tag: 'Melhor combinação', icon: '★', featured: true, item: best });
    if (value) cards.push({ tag: 'Melhor custo-benefício', icon: '◈', featured: false, item: value });
    if (bold) cards.push({ tag: 'Mais estiloso', icon: '✧', featured: false, item: bold });
    this.highlights = cards;

  }

  private save(): void {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({
        palette: this.palette, brand: this.brand, boldness: this.boldness, budget: this.budget,
        perWeek: this.perWeek, baseSize: this.baseSize, liked: this.liked, disliked: this.disliked,
        owned: this.owned, wish: this.wish, compareIds: this.compareIds
      }));
    } catch {  }
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return;
      const d = JSON.parse(raw) as Partial<Record<string, unknown>>;
      const ids = new Set(CATALOG.map(s => s.id));
      const list = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && ids.has(x)) : []);
      const num = (v: unknown, fallback: number, min: number, max: number): number =>
        typeof v === 'number' && v >= min && v <= max ? v : fallback;

      this.palette = d['palette'] === 'neutras' || d['palette'] === 'terrosas' || d['palette'] === 'vibrantes' ? d['palette'] : null;
      this.brand = typeof d['brand'] === 'string' && BRANDS.includes(d['brand']) ? d['brand'] : null;
      this.boldness = num(d['boldness'], 50, 0, 100);
      this.budget = num(d['budget'], 1000, 250, 1000);
      this.perWeek = num(d['perWeek'], 3, 1, 7);
      this.baseSize = num(d['baseSize'], 42, 37, 45);
      this.liked = list(d['liked']);
      this.disliked = list(d['disliked']);
      this.owned = list(d['owned']);
      this.wish = list(d['wish']);
      this.compareIds = list(d['compareIds']).slice(0, 3);
    } catch {  }
  }
}

