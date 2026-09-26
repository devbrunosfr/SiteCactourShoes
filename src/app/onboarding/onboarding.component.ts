import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './onboarding.component.html',
})
export class OnboardingComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);

  step = 0;
  addingUnit = false;
  company = 'Senai Cimatec';
  unit = 'Sede administrativa';
  address = '';
  responsible = '';
  segment = 'Escritório';
  assets = ['Ar-condicionado', 'Computador', 'Impressora'];
  lgpdAccepted = false;

  segments = ['Escritório', 'Escola', 'Loja', 'Condomínio', 'Outro'];
  assetOptions = ['Ar-condicionado', 'Computador', 'Impressora', 'Gerador', 'Veículo', 'Outro'];

  constructor() {
    this.addingUnit = this.route.snapshot.queryParamMap.get('newUnit') === '1';
    if (this.addingUnit) {
      this.step = 1;
      this.unit = '';
      this.responsible = this.auth.currentUser()?.name || '';
    }
  }

  next(): void {
    if (this.step < 3) this.step++;
    else if (this.lgpdAccepted) {
      if (this.addingUnit) {
        const unit = this.auth.createUnit({
          name: this.unit.trim() || 'Nova sede',
          address: this.address.trim(),
          responsible: this.responsible.trim() || this.auth.currentUser()?.name || 'Sem responsável',
          segment: this.segment,
          assets: [...this.assets],
        });
        this.router.navigate(['/app/visao-geral'], { queryParams: { unit: unit.id } });
      } else {
        this.router.navigate(['/app/visao-geral']);
      }
    }
  }

  back(): void {
    if (this.step > 0) this.step--;
    else this.router.navigate(['/']);
  }

  toggleAsset(asset: string): void {
    this.assets = this.assets.includes(asset)
      ? this.assets.filter((item) => item !== asset)
      : [...this.assets, asset];
  }
}
