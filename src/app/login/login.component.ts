import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = 'jailson@senai.com';
  password = 'senai123';
  remember = true;
  lgpdAccepted = false;
  showPassword = false;
  loading = false;
  error = '';

  submit(): void {
    this.error = '';
    if (!this.email || !this.password) {
      this.error = 'Informe seu e-mail e sua senha para continuar.';
      return;
    }
    if (!this.lgpdAccepted) {
      this.error = 'Para entrar, confirme que está de acordo com o tratamento dos seus dados (LGPD).';
      return;
    }
    this.loading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/app/visao-geral']),
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Não foi possível entrar agora.';
      },
    });
  }
}
