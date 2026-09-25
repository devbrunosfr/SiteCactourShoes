import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CATALOG } from '../../data/catalog';
import { SavedAnalysesService } from '../../services/saved-analyses.service';

@Component({
  selector: 'senso-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  readonly auth = inject(AuthService);
  readonly catalog = CATALOG;
  private readonly savedAnalyses = inject(SavedAnalysesService);

  get analyses() { return this.savedAnalyses.list; }

  get stats() {
    return [
      { value: String(this.analyses.length).padStart(2, '0'), label: 'análises salvas' },
      { value: '02', label: 'alertas ativos' },
      { value: '87%', label: 'perfil preenchido' }
    ];
  }

  get name(): string { return this.auth.user?.nome ?? 'Seu perfil'; }
  get email(): string { return this.auth.user?.email ?? 'cliente@cactourshoes.com'; }

  removeAnalysis(id: string): void {
    this.savedAnalyses.remove(id);
  }
}
