import { Injectable, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { I18nService, Params } from './i18n.service';

@Injectable({ providedIn: 'root' })
export class PageTitleService extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly i18n = inject(I18nService);
  private current: { key: string; params?: Params } | null = null;

  constructor() {
    super();
    
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
    
    this.title.setTitle(text === key ? key : `${text} — CactourShoes`);
  }
}
