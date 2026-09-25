import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { I18nService, Lang } from '../services/i18n.service';
import { TranslatePipe } from './t.pipe';

/** Alterna entre português (Brasil) e inglês. */
@Component({
  selector: 'senso-lang-switch',
  standalone: true,
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <div class="switch" role="group" [attr.aria-label]="'lang.label' | t" [class.light]="light">
      @for (l of langs; track l) {
        <button type="button" [class.on]="i18n.lang() === l" [attr.aria-pressed]="i18n.lang() === l"
                [attr.lang]="l === 'pt' ? 'pt-BR' : 'en'" [title]="(l === 'pt' ? 'lang.ptName' : 'lang.enName') | t"
                (click)="i18n.setLang(l)">
          {{ (l === 'pt' ? 'lang.pt' : 'lang.en') | t }}
        </button>
      }
    </div>
  `,
  styles: [`
    .switch { display: inline-flex; padding: 3px; border-radius: 999px; border: 1px solid var(--line-strong); }
    button { min-width: 40px; min-height: 36px; padding: 0 10px; border: 0; border-radius: 999px; background: none; color: var(--text-dim); font: 700 12px var(--font-body); letter-spacing: .06em; cursor: pointer; }
    button:hover { color: var(--bone); }
    button.on { background: var(--bone); color: var(--ink); }
    .light { border-color: #10130f33; }
    .light button { color: var(--text-dim-light); }
    .light button:hover { color: var(--ink); }
    .light button.on { background: var(--ink); color: var(--bone); }
  `]
})
export class LangSwitchComponent {
  readonly i18n = inject(I18nService);
  readonly langs: Lang[] = ['pt', 'en'];
  /** Versão para fundo claro. */
  @Input() light = false;
}
