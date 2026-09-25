import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'senso-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="mark">
      <svg class="cactus" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="9.2" y="2" width="5.6" height="20" rx="2.8"/><rect x="3.6" y="8" width="3" height="8" rx="1.5"/>
        <rect x="3.6" y="13" width="7" height="3" rx="1.5"/><rect x="17.4" y="5.5" width="3" height="8.5" rx="1.5"/>
        <rect x="13.4" y="11" width="7" height="3" rx="1.5"/>
      </svg>
    </span>
    <strong>CactourShoes<span>.</span></strong>
  `,
  styles: [`
    :host { display: inline-flex; align-items: center; gap: 10px; }
    .mark { display: grid; place-items: center; width: 32px; height: 32px; background: var(--lime); color: var(--lime-ink); border-radius: 10px; font-size: 20px; }
    strong { font: 700 20px var(--font-display); letter-spacing: -.01em; }
    strong span { color: var(--lime); }
  `]
})
export class LogoComponent {}
