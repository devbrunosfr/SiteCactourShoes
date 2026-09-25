import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { API_URL } from '../config';
import { AuthService } from './auth.service';

/** Chamadas que enviam credenciais: um 401 aqui é "senha errada", não "sessão expirada". */
const CREDENTIALS_PATHS = ['/auth/login', '/auth/register', '/auth/social', '/auth/forgot'];

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith(API_URL)) {
    return next(request);
  }

  const auth = inject(AuthService);
  const authorized = auth.token
    ? request.clone({ setHeaders: { Authorization: `Bearer ${auth.token}` } })
    : request;

  const isCredentialsCall = CREDENTIALS_PATHS.some(path => request.url.startsWith(`${API_URL}${path}`));

  return next(authorized).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && auth.token && !isCredentialsCall) {
        auth.logout();
      }
      return throwError(() => error);
    })
  );
};
