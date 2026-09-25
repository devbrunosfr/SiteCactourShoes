import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type IconName =
  | 'lock' | 'arrow-up-right' | 'arrow-right' | 'back' | 'bag' | 'check' | 'ruler'
  | 'menu' | 'close' | 'chevron-down' | 'qr' | 'plus' | 'trash' | 'user' | 'edit' | 'card' | 'star' | 'eye' | 'eye-off';

@Component({
  selector: 'senso-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         [attr.stroke-width]="stroke" stroke-linecap="round" stroke-linejoin="round"
         [attr.aria-hidden]="label ? null : 'true'" [attr.aria-label]="label || null" [attr.role]="label ? 'img' : null"
         focusable="false">
      @switch (name) {
        @case ('lock') { <rect x="4" y="10" width="16" height="10" rx="2"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/> }
        @case ('arrow-up-right') { <path d="M7 17 17 7M9 7h8v8"/> }
        @case ('arrow-right') { <path d="M5 12h14M13 6l6 6-6 6"/> }
        @case ('back') { <path d="M15 6l-6 6 6 6"/> }
        @case ('bag') { <path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/> }
        @case ('check') { <path d="M5 12l5 5 9-10"/> }
        @case ('ruler') { <path d="M3 7h18v10H3z"/><path d="M7 7v4M11 7v6M15 7v4M19 7v6"/> }
        @case ('menu') { <path d="M4 7h16M4 12h16M4 17h16"/> }
        @case ('close') { <path d="M6 6l12 12M18 6 6 18"/> }
        @case ('chevron-down') { <path d="M6 9l6 6 6-6"/> }
        @case ('qr') { <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM18 18h3v3h-3z"/> }
        @case ('plus') { <path d="M12 5v14M5 12h14"/> }
        @case ('trash') { <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/> }
        @case ('eye') { <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/> }
        @case ('eye-off') { <path d="M3 3l18 18"/><path d="M10.6 5.1A10.4 10.4 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.1M6.6 6.6A17.4 17.4 0 0 0 2 12s3.6 7 10 7a9.8 9.8 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/> }
        @case ('edit') { <path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/> }
        @case ('card') { <rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/> }
        @case ('star') { <path d="M12 4l2.4 5 5.4.6-4 3.7 1.1 5.3L12 16l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6z"/> }
        @case ('user') { <circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/> }
      }
    </svg>
  `,
  styles: [':host{display:inline-flex;flex:none;line-height:0}']
})
export class IconComponent {
  @Input({ required: true }) name!: IconName;
  @Input() size = 18;
  @Input() stroke = 2;
  
  @Input() label = '';
}
