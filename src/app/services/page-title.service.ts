import { Injectable, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { I18nService, Params } from './i18n.service';

/**
 * Títulos da aba traduzidos. Nas rotas com tradução (login, termos), `title` guarda a CHAVE do
 * dicionário (ex.: 'titles.login'). Nas demais rotas o `title` é um texto normal e é usado como está.
 */
@Injectable({ providedIn: 'root' })
export class PageTitleService extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly i18n = inject(I18nService);
  private current: { key: string; params?: Params } | null = null;

  constructor() {
    super();
    // Reaplica o título quando o idioma muda.
    effect(() => {
      this.i18n.lang();
      this.apply();
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const key = this.buildTitle(snapshot);
    if (key) this.set(key);
  }

  set(key: string, params?: Params): void {
    this.current = { key, params };
    this.apply();
  }

  private apply(): void {
    if (!this.current) return;

    const { key, params } = this.current;
    const text = this.i18n.t(key, params);
    // Sem tradução no dicionário, `t` devolve a própria chave: é um título comum, então vai como está.
    this.title.setTitle(text === key ? key : `${text} — CactourShoes`);
  }
}
