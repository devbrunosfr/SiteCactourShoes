import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ShellService } from '../services/shell.service';
import { WardrobeStateService } from '../services/wardrobe-state.service';

@Component({
  selector: 'senso-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  readonly shell = inject(ShellService);

  readonly auth = inject(AuthService);

  private readonly router = inject(Router);

  private readonly wardrobe = inject(WardrobeStateService);

  menuOpen = false;

  get active(): string {
    return this.shell.active;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  go(id: string): void {
    this.closeMenu();
    this.shell.go(id);
  }

  goHome(): void {
    this.closeMenu();
    if (this.wardrobe.lockPhase !== 'locked') {
      this.wardrobe.lock();
    }
    this.shell.go('overview');
  }

  toast(message: string): void {
    this.shell.toast(message);
  }

  goLogin(): void {
    this.closeMenu();
    void this.router.navigate(['/entrar']);
  }

  logout(): void {
    this.closeMenu();
    this.auth.logout();
    this.shell.toast('Você saiu da sua conta.');
  }
}

