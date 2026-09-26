import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface UnitProfile {
  id: string;
  name: string;
  address: string;
  responsible: string;
  segment: string;
  assets: string[];
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresIn: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3333/api';
  private tokenKey = 'navycare_token';
  private userKey = 'navycare_user';
  private unitsKey = 'navycare_units';
  private activeUnitKey = 'navycare_active_unit';

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/auth/login`, { email, password })
      .pipe(
        tap((response) => {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.userKey, JSON.stringify(response.user));
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  currentUser(): User | null {
    const value = localStorage.getItem(this.userKey);
    if (!value) return null;
    const user = JSON.parse(value) as User;
    if (user.email === 'mariana@acmeoffice.com' || user.name === 'Mariana Costa') {
      const migrated: User = { ...user, name: 'Jailson', email: 'jailson@senai.com', role: 'Administrador' };
      localStorage.setItem(this.userKey, JSON.stringify(migrated));
      return migrated;
    }
    return user;
  }

  units(): UnitProfile[] {
    const user = this.currentUser();
    if (!user) return [];
    const stored = localStorage.getItem(`${this.unitsKey}_${user.id}`);
    if (stored) return JSON.parse(stored) as UnitProfile[];
    const primary: UnitProfile = {
      id: 'unit_main',
      name: 'Sede administrativa',
      address: '',
      responsible: user.name,
      segment: 'Escritório',
      assets: ['Ar-condicionado', 'Computador', 'Impressora'],
      createdAt: new Date().toISOString(),
    };
    this.saveUnits([primary]);
    this.setActiveUnit(primary.id);
    return [primary];
  }

  createUnit(data: Omit<UnitProfile, 'id' | 'createdAt'>): UnitProfile {
    const unit: UnitProfile = { ...data, id: `unit_${Date.now()}`, createdAt: new Date().toISOString() };
    this.saveUnits([...this.units(), unit]);
    this.setActiveUnit(unit.id);
    return unit;
  }

  updateUnit(unitId: string, changes: Partial<Omit<UnitProfile, 'id' | 'createdAt'>>): void {
    const updated = this.units().map((unit) => (unit.id === unitId ? { ...unit, ...changes } : unit));
    this.saveUnits(updated);
  }

  removeUnit(unitId: string): void {
    const remaining = this.units().filter((unit) => unit.id !== unitId);
    this.saveUnits(remaining);
    if (localStorage.getItem(this.activeUnitKey) === unitId) {
      const fallback = remaining[0];
      if (fallback) this.setActiveUnit(fallback.id);
    }
  }

  activeUnit(): UnitProfile | null {
    const units = this.units();
    const activeId = localStorage.getItem(this.activeUnitKey);
    return units.find((unit) => unit.id === activeId) || units[0] || null;
  }

  setActiveUnit(unitId: string): void {
    if (this.units().some((unit) => unit.id === unitId)) localStorage.setItem(this.activeUnitKey, unitId);
  }

  private saveUnits(units: UnitProfile[]): void {
    const user = this.currentUser();
    if (user) localStorage.setItem(`${this.unitsKey}_${user.id}`, JSON.stringify(units));
  }

  dashboard(): Observable<unknown> {
    return this.http.get(`${this.baseUrl}/dashboard`, {
      headers: { Authorization: `Bearer ${this.token()}` },
    });
  }
}
