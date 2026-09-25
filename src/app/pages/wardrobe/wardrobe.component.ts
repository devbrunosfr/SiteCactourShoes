import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ShellService } from '../../services/shell.service';
import { WardrobeStateService, WizardOption, WizardStep } from '../../services/wardrobe-state.service';

@Component({
  selector: 'senso-wardrobe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wardrobe.component.html',
  styleUrl: './wardrobe.component.css'
})
export class WardrobeComponent implements AfterViewInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly shell = inject(ShellService);

  private readonly auth = inject(AuthService);

  private readonly state = inject(WardrobeStateService);

  playHeroVideo(event: Event): void {
    const video = event.target as HTMLVideoElement;
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;

    const tryPlay = () => {
      video.play().catch(() => {
        const playOnFirstInteraction = () => {
          video.play().catch(() => {});
        };
        document.addEventListener('click', playOnFirstInteraction, { once: true });
        document.addEventListener('touchstart', playOnFirstInteraction, { once: true });
        video.addEventListener('canplay', () => video.play().catch(() => {}), { once: true });
      });
    };

    tryPlay();
  }

  @ViewChild('heroVideo') heroVideoRef?: ElementRef<HTMLVideoElement>;

  ngAfterViewInit(): void {
    const video = this.heroVideoRef?.nativeElement;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.play().catch(() => {
      const playOnFirstInteraction = () => video.play().catch(() => {});
      document.addEventListener('click', playOnFirstInteraction, { once: true });
      document.addEventListener('touchstart', playOnFirstInteraction, { once: true });
    });
  }

  wizardSteps: WizardStep[] = [
    {
      id: 'genero',
      label: 'GÊNERO',
      question: 'Qual seção você costuma comprar?',
      hint: 'Isso nos ajuda a entender as proporções iniciais do seu guarda-roupa.',
      options: [
        { id: 'masculino', title: 'Masculino', desc: 'Cortes e silhuetas baseadas no padrão masculino.', img: 'assets/manequim_masculino.png' },
        { id: 'feminino', title: 'Feminino', desc: 'Cortes e silhuetas baseadas no padrão feminino.', img: 'assets/manequim_feminino.png' },
        { id: 'unissex', title: 'Unissex', desc: 'Foco exclusivo no caimento, sem distinção de seção.', img: 'assets/manequim_unissex.png' }
      ]
    },
    {
      id: 'estilo',
      label: 'ESTILO',
      question: 'Como você descreveria o seu estilo?',
      hint: 'Isso ajuda a plataforma a calibrar as primeiras recomendações.',
      options: [
        { id: 'streetwear', title: 'Streetwear', desc: 'Peças amplas, neutras e com presença.', img: 'assets/estilo_streetwear.png' },
        { id: 'casual', title: 'Casual', desc: 'Conforto no dia a dia, sem exageros.', img: 'assets/estilo_casual.png' },
        { id: 'formal', title: 'Formal', desc: 'Alfaiataria e caimento mais estruturado.', img: 'assets/estilo_formal.png' },
        { id: 'sport', title: 'Sport', desc: 'Performance e conforto para o movimento.', img: 'assets/estilo_sport.png' },
        { id: 'custom', title: 'Custom', desc: 'Uma mistura sob medida de várias referências.', img: 'assets/estilo_custom.png' }
      ]
    },
    {
      id: 'camisetas',
      label: 'CAMISETAS',
      question: 'Qual modelagem de camiseta é mais comum no seu armário?',
      hint: 'A proporção da parte de cima influencia toda a leitura do look.',
      options: [
        { id: 'oversized', title: 'Oversized', desc: 'Caimento solto, ombro caído e presença street.', img: 'assets/camiseta_oversized_busto.png' },
        { id: 'regular', title: 'Regular', desc: 'Caimento equilibrado para o dia a dia.', img: 'assets/camiseta_regular_busto.png' },
        { id: 'slim', title: 'Slim', desc: 'Caimento próximo ao corpo, sem sobras.', img: 'assets/camiseta_slim_busto.png' },
        { id: 'boxy', title: 'Boxy', desc: 'Corpo quadrado, manga ampla e estruturada.', img: 'assets/camiseta_boxy_busto.png' },
        { id: 'cropped', title: 'Cropped', desc: 'Barra curta e proporção contemporânea.', img: 'assets/camiseta_cropped_busto.png' }
      ]
    },
    {
      id: 'calcas',
      label: 'CALÇAS',
      question: 'E na parte de baixo, o que predomina?',
      hint: 'A modelagem da calça define o equilíbrio final da silhueta.',
      options: [
        { id: 'wide-leg', title: 'Wide leg', desc: 'Perna ampla, longa e confortável.', img: 'assets/calca_wide_leg.png' },
        { id: 'regular-pants', title: 'Regular', desc: 'Caimento reto e equilibrado.', img: 'assets/calca_regular.png' },
        { id: 'skinny', title: 'Skinny', desc: 'Caimento justo do quadril ao tornozelo.', img: 'assets/calca_skinny.png' },
        { id: 'cargo', title: 'Cargo', desc: 'Bolsos utilitários e presença técnica.', img: 'assets/calca_cargo.png' },
        { id: 'jogger', title: 'Jogger', desc: 'Conforto esportivo com barra ajustada.', img: 'assets/calca_jogger.png' }
      ]
    }
  ];

  wizardIndex = this.state.index;

  wizardSelections: Record<string, WizardOption> = this.state.selections;

  /** A opção já escolhida na etapa atual (ainda pode não existir escolha, por isso a checagem fica aqui e não no template). */
  isChosen(option: WizardOption): boolean {
    return this.wizardSelections[this.wizardStep.id]?.id === option.id;
  }

  get wizardStep(): WizardStep {
    return this.wizardSteps[this.wizardIndex];
  }

  get wizardSelectionsList(): { stepId: string; stepLabel: string; option: WizardOption }[] {
    return this.wizardSteps
      .filter(step => this.wizardSelections[step.id])
      .map(step => ({ stepId: step.id, stepLabel: step.label, option: this.wizardSelections[step.id] }));
  }

  private advanceTimer?: number;

  get wizardAllChosen(): boolean {
    return this.firstPendingStepIndex() === -1;
  }

  wizardComputing = this.state.computing;

  private firstPendingStepIndex(): number {
    return this.wizardSteps.findIndex(step => !this.wizardSelections[step.id]);
  }

  chooseWizardOption(option: WizardOption): void {
    const step = this.wizardStep;
    this.wizardSelections[step.id] = option;
    window.clearTimeout(this.advanceTimer);

    const next = this.firstPendingStepIndex();
    if (next === -1) {
      this.advanceTimer = window.setTimeout(() => {
        this.wizardComputing = true;
      }, 350);
      return;
    }
    this.advanceTimer = window.setTimeout(() => {
      this.wizardIndex = next;
    }, 350);
  }

  clearWizardSelection(stepId: string): void {
    const index = this.wizardSteps.findIndex(step => step.id === stepId);
    if (index < 0) return;

    window.clearTimeout(this.advanceTimer);

    delete this.wizardSelections[stepId];
    delete this.carouselPositions[stepId];
    this.wizardComputing = false;
    this.wizardIndex = index;

    if (window.matchMedia('(max-width:1000px)').matches) {
      document.querySelector('.wizard')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  clearAllWizardSelections(): void {
    window.clearTimeout(this.advanceTimer);

    for (const key of Object.keys(this.wizardSelections)) {
      delete this.wizardSelections[key];
    }
    for (const key of Object.keys(this.carouselPositions)) {
      delete this.carouselPositions[key];
    }

    this.wizardComputing = false;
    this.wizardIndex = 0;

    if (window.matchMedia('(max-width:1000px)').matches) {
      document.querySelector('.wizard')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  goToMatch(): void {
    void this.router.navigate(['/recomendacao']);
  }

  private carouselPositions: Record<string, number> = this.state.carouselPositions;

  private touchStartX = 0;

  get carouselIndex(): number {
    const step = this.wizardStep;
    const stored = this.carouselPositions[step.id];
    if (stored !== undefined) return stored;

    const chosen = this.wizardSelections[step.id];
    if (chosen) {
      const chosenIndex = step.options.findIndex(o => o.id === chosen.id);
      if (chosenIndex >= 0) return chosenIndex;
    }
    return Math.floor((step.options.length - 1) / 2);
  }

  isFar(index: number): boolean {
    return Math.abs(index - this.carouselIndex) > 1;
  }

  setCarouselIndex(index: number): void {
    const last = this.wizardStep.options.length - 1;
    this.carouselPositions[this.wizardStep.id] = Math.max(0, Math.min(index, last));
  }

  moveCarousel(direction: number): void {
    this.setCarouselIndex(this.carouselIndex + direction);
  }

  onOptionClick(option: WizardOption, index: number): void {
    if (index !== this.carouselIndex) {
      this.setCarouselIndex(index);
      return;
    }
    if (this.wizardSelections[this.wizardStep.id]) {
      this.toast('Para trocar, apague esta escolha no X do painel "Seu guarda-roupa".');
      return;
    }
    this.chooseWizardOption(option);
  }

  onCarouselTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  onCarouselTouchEnd(event: TouchEvent): void {
    const deltaX = event.changedTouches[0].clientX - this.touchStartX;
    if (Math.abs(deltaX) < 40) return;
    this.moveCarousel(deltaX < 0 ? 1 : -1);
  }

  go(id: string): void {
    this.shell.go(id);
  }

  get wardrobeLock(): 'locked' | 'opening' | 'unlocked' {
    return this.state.lockPhase;
  }

  private lockTimers: number[] = [];

  startWardrobe(): void {
    document.getElementById('wardrobe')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (this.state.lockPhase !== 'locked') return;

    this.lockTimers.push(
      window.setTimeout(() => (this.state.lockPhase = 'opening'), 450),
      window.setTimeout(() => this.finishUnlock(), 1150)
    );
  }

  private finishUnlock(): void {
    this.state.lockPhase = 'unlocked';
  }

  toast(message: string): void {
    this.shell.toast(message);
  }

  howItWorksOpen = false;

  toggleHowItWorks(): void {
    this.howItWorksOpen = !this.howItWorksOpen;
  }

  toolLoginPromptOpen = false;

  toolLoginPromptPos = { top: 0, left: 0 };

  onToolClick(message: string, event: Event): void {
    event.stopPropagation();

    if (this.auth.isLoggedIn) {
      this.toolLoginPromptOpen = false;
      this.toast(message);
      return;
    }

    const button = event.currentTarget as HTMLElement;
    this.shakeButton(button);

    const rect = button.getBoundingClientRect();
    const bubbleWidth = 260;
    const maxLeft = window.scrollX + document.documentElement.clientWidth - bubbleWidth - 16;
    this.toolLoginPromptPos = {
      top: rect.bottom + window.scrollY + 10,
      left: Math.min(rect.left + window.scrollX, Math.max(16, maxLeft))
    };
    this.toolLoginPromptOpen = true;
  }

  private shakeButton(button: HTMLElement): void {
    button.classList.remove('shake-anim');
    void button.offsetWidth;
    button.classList.add('shake-anim');
    window.setTimeout(() => button.classList.remove('shake-anim'), 500);
  }

  goToLoginFromTool(): void {
    this.toolLoginPromptOpen = false;
    void this.router.navigate(['/entrar']);
  }

  @HostListener('document:click')
  closeHowItWorks(): void {
    this.howItWorksOpen = false;
    this.toolLoginPromptOpen = false;
  }

  @HostListener('document:keydown.escape')
  closeHowItWorksOnEscape(): void {
    this.howItWorksOpen = false;
    this.toolLoginPromptOpen = false;
  }

  ngOnDestroy(): void {
    window.clearTimeout(this.advanceTimer);

    this.lockTimers.forEach(timer => window.clearTimeout(timer));
    if (this.state.lockPhase !== 'unlocked') this.finishUnlock();

    const next = this.firstPendingStepIndex();
    if (next === -1) {
      this.wizardComputing = true;
    } else if (this.wizardSelections[this.wizardStep.id]) {
      this.wizardIndex = next;
    }

    this.state.index = this.wizardIndex;
    this.state.computing = this.wizardComputing;
  }
}
