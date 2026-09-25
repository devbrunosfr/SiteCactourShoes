import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../config';

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
}

export type Provider = 'google' | 'microsoft' | 'apple';

interface AuthResponse {
  token: string;
  user: AuthUser;
}

export type AuthErrorCode =
  | 'invalidCredentials' | 'emailTaken' | 'termsRequired' | 'invalidData' | 'tooManyRequests' | 'network' | 'generic';

const ERROR_CODES: readonly string[] = [
  'invalidCredentials', 'emailTaken', 'termsRequired', 'invalidData', 'tooManyRequests', 'network', 'generic'
];

export class AuthError extends Error {
  constructor(readonly code: AuthErrorCode) {
    super(code);
  }
}

export const EMAIL_PATTERN = /^[a-z0-9._%+-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.com(\.br)?$/i;

export const PASSWORD_MIN = 6;

export const NAME_MAX = 50;

export const PASSWORD_MAX = 30;
export const EMAIL_MAX = 30;

const STORAGE_KEY = 'cactour.auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  token: string | null = null;

  user: AuthUser | null = null;

  private remember = false;

  constructor() {
    this.loadStoredSession();
  }

  get isLoggedIn(): boolean {
    return !!this.token && !!this.user;
  }

  get firstName(): string {
    return this.user?.nome.trim().split(' ')[0] ?? '';
  }

  get initial(): string {
    return this.user?.nome.trim().charAt(0).toUpperCase() ?? '';
  }

  async login(email: string, senha: string, remember = false): Promise<AuthUser> {
    const response = await this.post<AuthResponse>('/auth/login', { email: email.trim(), senha });
    return this.startSession(response, remember);
  }

  async register(nome: string, email: string, senha: string, acceptedTerms: boolean, remember = false): Promise<AuthUser> {
    if (!acceptedTerms) throw new AuthError('termsRequired');

    const response = await this.post<AuthResponse>('/auth/register', {
      nome: nome.trim(), email: email.trim(), senha, acceptedTerms
    });
    return this.startSession(response, remember);
  }

  async socialLogin(provider: Provider, acceptedTerms: boolean, remember = false): Promise<AuthUser> {
    const response = await this.post<AuthResponse>('/auth/social', { provider, acceptedTerms });
    return this.startSession(response, remember);
  }

  async requestPasswordReset(email: string): Promise<void> {
    await this.post<unknown>('/auth/forgot', { email: email.trim() });
  }

  logout(): void {
    this.token = null;
    this.user = null;
    this.remember = false;
    this.local()?.removeItem(STORAGE_KEY);
    this.session()?.removeItem(STORAGE_KEY);
  }

  restoreSession(): void {
    if (!this.token) return;

    this.http.get<{ user: AuthUser }>(`${API_URL}/auth/me`).subscribe({
      next: ({ user }) => {
        this.user = user;
        this.persist();
      },
      error: () => undefined
    });
  }

  private async post<T>(path: string, body: object): Promise<T> {
    try {
      return await firstValueFrom(this.http.post<T>(`${API_URL}${path}`, body));
    } catch (error) {
      throw toAuthError(error);
    }
  }

  private startSession(response: AuthResponse, remember: boolean): AuthUser {
    this.token = response.token;
    this.user = response.user;
    this.remember = remember;
    this.local()?.removeItem(STORAGE_KEY);
    this.session()?.removeItem(STORAGE_KEY);
    this.persist();
    return response.user;
  }

  private persist(): void {
    if (!this.token || !this.user) return;

    try {
      (this.remember ? this.local() : this.session())?.setItem(STORAGE_KEY, JSON.stringify({ token: this.token, user: this.user }));
    } catch {
      
    }
  }

  private loadStoredSession(): void {
    const fromLocal = this.readSaved(this.local());
    const saved = fromLocal ?? this.readSaved(this.session());
    if (!saved) return;

    this.token = saved.token;
    this.user = saved.user;
    this.remember = !!fromLocal;
  }

  private readSaved(storage: Storage | null): AuthResponse | null {
    try {
      const raw = storage?.getItem(STORAGE_KEY);
      if (!raw) return null;

      const saved = JSON.parse(raw) as Partial<AuthResponse>;
      if (typeof saved.token === 'string' && saved.user && typeof saved.user.nome === 'string') {
        return { token: saved.token, user: saved.user };
      }
    } catch {
      storage?.removeItem(STORAGE_KEY);
    }
    return null;
  }

  private local(): Storage | null {
    try {
      return typeof localStorage === 'undefined' ? null : localStorage;
    } catch {
      return null;
    }
  }

  private session(): Storage | null {
    try {
      return typeof sessionStorage === 'undefined' ? null : sessionStorage;
    } catch {
      return null;
    }
  }
}

function toAuthError(error: unknown): AuthError {
  if (error instanceof AuthError) return error;

  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) return new AuthError('network');

    const code: unknown = error.error?.code;
    if (typeof code === 'string' && ERROR_CODES.includes(code)) return new AuthError(code as AuthErrorCode);

    if (error.status === 401) return new AuthError('invalidCredentials');
    if (error.status === 409) return new AuthError('emailTaken');
    if (error.status === 429) return new AuthError('tooManyRequests');
  }

  return new AuthError('generic');
}
