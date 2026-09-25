import { Injectable } from '@angular/core';

export interface SavedAnalysis {
  id: string;
  savedAt: number;
  shoeId: string;
  shoeName: string;
  brand: string;
  score: number;
  verdict: string;
  why: string;
  estilo: string;
  cores: string;
  snapshot?: {
    choice: Record<string, string>;
    palette: string | null;
    brandFilter: string | null;
    boldness: number;
    budget: number;
    perWeek: number;
    baseSize: number;
  };
}

const STORE_KEY = 'cactour.saved-analyses.v1';

@Injectable({ providedIn: 'root' })
export class SavedAnalysesService {
  list: SavedAnalysis[] = this.load();

  add(entry: Omit<SavedAnalysis, 'id' | 'savedAt'>): SavedAnalysis {
    const saved: SavedAnalysis = { ...entry, id: `${entry.shoeId}-${Date.now()}`, savedAt: Date.now() };
    this.list = [saved, ...this.list.filter(a => a.shoeId !== entry.shoeId)];
    this.persist();
    return saved;
  }

  remove(id: string): void {
    this.list = this.list.filter(a => a.id !== id);
    this.persist();
  }

  has(shoeId: string): boolean {
    return this.list.some(a => a.shoeId === shoeId);
  }

  private persist(): void {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(this.list)); } catch {  }
  }

  private load(): SavedAnalysis[] {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
