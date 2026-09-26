import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './privacy.component.html',
  styles: [`
    :host { display: block; background: var(--background); color: var(--foreground); }
    .privacy-shell { max-width: 780px; margin: 0 auto; padding: clamp(28px, 5vw, 56px) clamp(20px, 5vw, 32px) 64px; }
    .privacy-back { display: inline-flex; align-items: center; gap: 8px; color: var(--slate); font-size: 12px; font-weight: 700; margin-bottom: 26px; }
    .privacy-back:hover { color: var(--navy); }
    .privacy-eyebrow { text-transform: uppercase; letter-spacing: .11em; color: var(--blue); font-size: 10px; font-weight: 800; }
    h1 { color: var(--navy); letter-spacing: -.05em; margin: 14px 0 6px; font: 800 clamp(28px, 3.4vw, 40px)/1.1 Manrope, sans-serif; }
    .privacy-meta { color: var(--slate); font-size: 12px; margin: 0 0 34px; }
    section { padding-top: 26px; margin-top: 26px; border-top: 1px dashed var(--line); }
    h2 { color: var(--navy); font: 800 18px Manrope, sans-serif; margin: 0 0 4px; }
    h3 { color: var(--blue); font: 700 13px Manrope, sans-serif; margin: 18px 0 6px; }
    p, li { color: #4a5b71; line-height: 1.7; font-size: 14px; }
    p { margin: 0; }
    ul, ol { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 6px; }
  `],
})
export class PrivacyComponent {}
