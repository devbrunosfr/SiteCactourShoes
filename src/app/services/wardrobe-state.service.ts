import { Injectable } from '@angular/core';

export interface WizardOption {
  id: string;
  title: string;
  desc: string;
  img: string;
}

export interface WizardStep {
  id: string;
  label: string;
  question: string;
  hint: string;
  options: WizardOption[];
}

@Injectable({ providedIn: 'root' })
export class WardrobeStateService {
  selections: Record<string, WizardOption> = {};

  carouselPositions: Record<string, number> = {};

  index = 0;

  computing = false;

  lockPhase: 'locked' | 'opening' | 'unlocked' = 'locked';

  lock(): void {
    this.lockPhase = 'locked';
  }
}

