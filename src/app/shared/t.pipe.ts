import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService, Params } from '../services/i18n.service';

/**
 * Uso: {{ 'nav.collection' | t }} ou {{ 'orders.total' | t: { value: total } }}.
 * É "impuro" para reagir na hora à troca de idioma (a busca no dicionário é barata).
 */
@Pipe({ name: 't', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(key: string, params?: Params): string {
    return this.i18n.t(key, params);
  }
}
