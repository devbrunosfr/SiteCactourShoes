import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isLoggedIn
    ? true
    : router.createUrlTree(['/entrar'], { queryParams: { returnUrl: state.url } });
};

export const guestGuard: CanActivateFn = route => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn) return true;

  return router.parseUrl(safeReturnUrl(route.queryParamMap.get('returnUrl')) ?? '/');
};

export function safeReturnUrl(url: string | null | undefined): string | null {
  return url && url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/entrar') ? url : null;
}
