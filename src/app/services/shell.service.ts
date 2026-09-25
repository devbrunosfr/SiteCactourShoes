import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShellService {
  private readonly router = inject(Router);

  active = 'overview';

  notice = '';

  private noticeTimer?: number;

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        const [path, fragment] = event.urlAfterRedirects.split('#');
        const route = path.split('?')[0];

        const routeMap: Record<string, string> = {
          '/recomendacao': 'wardrobe', '/guarda-roupa': 'wardrobe', '/alertas-preco': 'radar',
          '/comparar': 'compare', '/tamanho-ideal': 'size',
          '/radar-preco': 'radar', '/durabilidade': 'durability', '/perfil': 'profile'
        };
        this.active = routeMap[route] || fragment || 'overview';
      });
  }

  go(id: string): void {
    this.active = id;

    const routes: Record<string, string> = {
      wardrobe: '/guarda-roupa', compare: '/comparar',
      size: '/tamanho-ideal', radar: '/radar-preco',
      durability: '/durabilidade', profile: '/perfil'
    };
    if (routes[id]) {
      void this.router.navigate([routes[id]]);
      return;
    }

    if (this.onHome()) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    void this.router.navigate(['/'], { fragment: id });
  }

  toast(message: string): void {
    this.notice = message;
    window.clearTimeout(this.noticeTimer);
    this.noticeTimer = window.setTimeout(() => (this.notice = ''), 2800);
  }

  private onHome(): boolean {
    return this.router.url.split(/[?#]/)[0] === '/';
  }
}
