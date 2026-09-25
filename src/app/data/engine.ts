import { CATALOG, Occasion, Shoe } from './catalog';

export interface Profile {
  estilo: string;
  camiseta: string;
  calca: string;

  palette: Shoe['palette'] | null;
  boldness: number;
  budget: number;
  occasion: Occasion | null;
  liked: string[];
}

export interface Score {
  total: number;
  parts: { proporcao: number; estilo: number; cor: number; ocasiao: number };
}

export interface Verdict {
  buy: boolean;
  label: string;
  detail: string;
  pctVsAverage: number;
}

const SHIRT_VOLUME: Record<string, number> = { oversized: 8, regular: 5, slim: 3 };
const PANTS_VOLUME: Record<string, number> = { 'wide-leg': 9, cargo: 8, 'regular-pants': 5, skinny: 2 };

export const SHIRT_LABEL: Record<string, string> = { oversized: 'camisetas oversized', regular: 'camisetas regulares', slim: 'camisetas slim' };
export const PANTS_LABEL: Record<string, string> = { 'wide-leg': 'calças wide leg', cargo: 'calças cargo', 'regular-pants': 'calças regulares', skinny: 'calças skinny' };

const clamp = (n: number, min = 0, max = 1) => Math.max(min, Math.min(max, n));

export function targetVolume(profile: Profile): number {
  const shirt = SHIRT_VOLUME[profile.camiseta] ?? 5;
  const pants = PANTS_VOLUME[profile.calca] ?? 5;
  let target = shirt * 0.4 + pants * 0.6;

  const likedShoes = CATALOG.filter(s => profile.liked.includes(s.id));
  if (likedShoes.length) {
    const avg = likedShoes.reduce((sum, s) => sum + s.volume, 0) / likedShoes.length;
    target = target * 0.85 + avg * 0.15;
  }
  target += ((profile.boldness - 50) / 50) * 1.5;
  return clamp(target, 1, 10);
}

export function scoreShoe(shoe: Shoe, profile: Profile): Score {
  const target = targetVolume(profile);
  const proporcao = clamp(1 - Math.abs(shoe.volume - target) / 8);

  const b = Math.abs(profile.boldness - 50) / 50;
  const styleMatch = profile.estilo === 'custom' ? 0.75 : shoe.styles.includes(profile.estilo) ? 1 : 0.3;
  const boldnessFit = profile.boldness >= 50 ? shoe.boldness / 10 : 1 - shoe.boldness / 10;
  const estilo = styleMatch * (1 - b * 0.6) + boldnessFit * (b * 0.6);

  const cor = !profile.palette || shoe.palette === profile.palette ? 1 : shoe.palette === 'neutras' ? 0.75 : 0.45;
  const ocasiao = profile.occasion ? (shoe.occasions.includes(profile.occasion) ? 1 : 0) : 1;

  const total = Math.round(100 * (proporcao * 0.45 + estilo * 0.3 + cor * 0.15 + ocasiao * 0.1));
  return {
    total,
    parts: {
      proporcao: Math.round(proporcao * 100),
      estilo: Math.round(estilo * 100),
      cor: Math.round(cor * 100),
      ocasiao: Math.round(ocasiao * 100)
    }
  };
}

export function verdict(shoe: Shoe): Verdict {
  const pct = Math.round(((shoe.price - shoe.average) / shoe.average) * 100);
  const nearLow = shoe.price <= shoe.lowest * 1.05;
  const buy = pct <= -8 || nearLow;
  if (buy) {
    return {
      buy: true,
      label: 'Comprar agora',
      detail: pct < 0 ? `${Math.abs(pct)}% abaixo da média dos últimos 90 dias.` : 'Perto do menor preço registrado.',
      pctVsAverage: pct
    };
  }
  return {
    buy: false,
    label: 'Esperar',
    detail: pct > 0 ? `${pct}% acima da média — o preço tende a cair.` : 'Preço próximo da média; vale acompanhar.',
    pctVsAverage: pct
  };
}

export function costPerUse(shoe: Shoe, perWeek: number): number {
  const years = shoe.durability / 3.5;
  const uses = Math.max(1, perWeek * 52 * years);
  return shoe.price / uses;
}

export function usesEstimate(shoe: Shoe, perWeek: number): number {
  return Math.round(perWeek * 52 * (shoe.durability / 3.5));
}

export function sizeFor(shoe: Shoe, base: number): string {
  const s = base + shoe.fit;
  const txt = Number.isInteger(s) ? String(s) : String(s).replace('.', ',');
  return txt;
}

export function fitLabel(shoe: Shoe): string {
  if (shoe.fit > 0) return 'veste justo';
  if (shoe.fit < 0) return 'veste folgado';
  return 'veste conforme o número';
}

export function pieceFit(shoe: Shoe, profile: Profile): { label: string; ok: boolean }[] {
  const shirt = SHIRT_VOLUME[profile.camiseta] ?? 5;
  const pants = PANTS_VOLUME[profile.calca] ?? 5;
  const tol = 3;
  return [
    { label: SHIRT_LABEL[profile.camiseta] ?? 'camisetas', ok: Math.abs(shoe.volume - shirt) <= tol },
    { label: PANTS_LABEL[profile.calca] ?? 'calças', ok: Math.abs(shoe.volume - pants) <= tol }
  ];
}

export function why(shoe: Shoe, profile: Profile): string {
  const shirt = SHIRT_LABEL[profile.camiseta] ?? 'suas camisetas';
  const pants = PANTS_LABEL[profile.calca] ?? 'suas calças';
  const target = targetVolume(profile);
  const diff = shoe.volume - target;
  const lead = `Você usa principalmente ${pants} e ${shirt}.`;
  if (Math.abs(diff) <= 1.5) {
    return `${lead} O volume do ${shoe.name} acompanha a largura do look, então o pé não fica “pequeno” perto das peças.`;
  }
  if (diff > 1.5) {
    return `${lead} O ${shoe.name} tem mais presença que o seu look atual — uma aposta para dar peso ao pé e criar contraste de proporção.`;
  }
  return `${lead} O ${shoe.name} tem perfil mais limpo: deixa a atenção nas peças amplas e evita excesso de volume embaixo.`;
}

export function equivalentOf(shoe: Shoe, allow: (s: Shoe) => boolean = () => true): Shoe | null {
  const candidates = CATALOG.filter(s => s.id !== shoe.id && s.price < shoe.price * 0.92 && allow(s));
  if (!candidates.length) return null;
  const dist = (s: Shoe) => {
    const shared = s.styles.filter(x => shoe.styles.includes(x)).length;
    return Math.abs(s.volume - shoe.volume) + (shared ? 0 : 3) + (s.kind === shoe.kind ? 0 : 1.5);
  };
  return candidates.slice().sort((a, b) => dist(a) - dist(b))[0];
}

export function coverage(ownedIds: string[]): { occasion: Occasion; count: number }[] {
  const occ: Occasion[] = ['dia', 'trabalho', 'festa', 'esporte'];
  return occ.map(o => ({
    occasion: o,
    count: CATALOG.filter(s => ownedIds.includes(s.id) && s.occasions.includes(o)).length
  }));
}

export function brl(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function pickHighlights(ranked: { shoe: Shoe; score: Score }[]) {
  if (!ranked.length) return { best: null, value: null, bold: null };
  const best = ranked[0];
  const rest = ranked.filter(r => r !== best);
  const decent = rest.filter(r => r.score.total >= 45);
  const value = decent.slice().sort((a, b) => b.score.total / b.shoe.price - a.score.total / a.shoe.price)[0] ?? rest[0] ?? null;
  const rest2 = rest.filter(r => r !== value);
  const bold = rest2.filter(r => r.score.total >= 40).slice().sort((a, b) => b.shoe.boldness - a.shoe.boldness)[0] ?? rest2[0] ?? null;
  return { best, value, bold };
}

