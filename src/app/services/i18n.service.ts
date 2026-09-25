import { Injectable, signal } from '@angular/core';
import { EN } from '../i18n/en';
import { PT } from '../i18n/pt';

export type Lang = 'pt' | 'en';
export type Params = Record<string, string | number>;

const DICTS: Record<Lang, unknown> = { pt: PT, en: EN };
const LANG_KEY = 'cactour.lang';

/**
 * Tradução leve feita no front-end: dicionários em src/app/i18n/ (pt.ts é a referência;
 * en.ts precisa ter exatamente as mesmas chaves — o TypeScript acusa se faltar alguma).
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly lang = signal<Lang>(this.initialLang());

  constructor() {
    this.applyDocumentLang();
  }

  /** Locale usado em números e datas. */
  get locale(): string {
    return this.lang() === 'en' ? 'en-US' : 'pt-BR';
  }

  setLang(lang: Lang): void {
    this.lang.set(lang);
    this.applyDocumentLang();
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* sem armazenamento: vale só nesta visita */
    }
  }

  /** Busca "a.b.c" no dicionário atual e troca {param} pelos valores informados. */
  t(key: string, params?: Params): string {
    const value = lookup(DICTS[this.lang()], key) ?? lookup(DICTS.pt, key);
    if (typeof value !== 'string') return key;
    return params ? value.replace(/\{(\w+)\}/g, (_, name: string) => String(params[name] ?? `{${name}}`)) : value;
  }

  /** Lista de textos (ex.: tópicos de uma seção dos Termos). */
  list(key: string): string[] {
    const value = lookup(DICTS[this.lang()], key) ?? lookup(DICTS.pt, key);
    return Array.isArray(value) ? (value as string[]) : [];
  }

  date(iso: string): string {
    return new Date(iso).toLocaleDateString(this.locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  dateTime(iso: string): string {
    return new Date(iso).toLocaleString(this.locale, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  time(date = new Date()): string {
    return date.toLocaleTimeString(this.locale, { hour: '2-digit', minute: '2-digit' });
  }

  number(value: number): string {
    return value.toLocaleString(this.locale);
  }

  private initialLang(): Lang {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === 'pt' || saved === 'en') return saved;
    } catch {
      /* ignora */
    }
    return 'pt'; // loja brasileira: português é o padrão
  }

  private applyDocumentLang(): void {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = this.lang() === 'en' ? 'en' : 'pt-BR';
    }
  }
}

function lookup(dict: unknown, key: string): unknown {
  return key.split('.').reduce<unknown>(
    (node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined),
    dict
  );
}
