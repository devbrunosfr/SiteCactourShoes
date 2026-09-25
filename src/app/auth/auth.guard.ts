import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Rotas que exigem login. Sem sessão, manda para /entrar guardando o destino em returnUrl. */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isLoggedIn
    ? true
    : router.createUrlTree(['/entrar'], { queryParams: { returnUrl: state.url } });
};

/** A página /entrar só faz sentido para visitantes. Quem já está logado segue para o destino. */
export const guestGuard: CanActivateFn = route => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn) return true;

  return router.parseUrl(safeReturnUrl(route.queryParamMap.get('returnUrl')) ?? '/');
};

/** Aceita apenas caminhos internos (evita redirecionamento aberto para outro site). */
export function safeReturnUrl(url: string | null | undefined): string | null {
  return url && url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/entrar') ? url : null;
}
