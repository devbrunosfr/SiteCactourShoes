import { Component, Input } from '@angular/core';
import { Shoe } from '../../data/catalog';

@Component({
  selector: 'senso-shoe-art',
  standalone: true,
  template: `
    @if (shoe.photos && shoe.photos.length > 1) {
      <div class="carousel" tabindex="0" role="group" aria-roledescription="carrossel"
           [attr.aria-label]="'Fotos de ' + shoe.name + ' ' + shoe.colorway"
           (keydown.arrowleft)="move(-1)" (keydown.arrowright)="move(1)"
           (touchstart)="onTouchStart($event)" (touchend)="onTouchEnd($event)">
        <div class="track" [style.transform]="'translateX(-' + index * 100 + '%)'">
          @for (src of shoe.photos; track src; let i = $index) {
            <img class="slide" [src]="src" [alt]="shoe.name + ' ' + shoe.colorway + ' — foto ' + (i + 1)"
                 [attr.aria-hidden]="i !== index" draggable="false">
          }
        </div>
      </div>
    } @else if (shoe.photo) {
      <img class="photo" [src]="shoe.photo" [alt]="shoe.name + ' ' + shoe.colorway">
    } @else {
      <svg viewBox="0 0 200 110" role="img" [attr.aria-label]="shoe.name + ' ' + shoe.colorway">
        <ellipse cx="102" cy="100" rx="86" ry="5" fill="#000" opacity=".35"/>
        <path [attr.d]="upper" [attr.fill]="shoe.colors.upper"/>
        <rect x="12" [attr.y]="soleTop" width="180" [attr.height]="soleH" [attr.rx]="soleRx" [attr.fill]="shoe.colors.sole"/>
        <rect x="12" [attr.y]="soleTop + soleH - 4" width="180" height="4" [attr.rx]="2" [attr.fill]="shoe.colors.accent" opacity=".9"/>
        @if (shoe.kind !== 'sapato') {
          <path [attr.d]="laces" fill="none" [attr.stroke]="shoe.colors.accent" stroke-width="3" stroke-linecap="round"/>
        }
      </svg>
    }
  `,
  styles: [`
    :host{display:block;width:100%;height:100%;background:#ffffff}
    svg,.photo{width:100%;height:100%;display:block}
    .photo{object-fit:contain;background:#ffffff}
    svg{padding:6px 10px}

    .carousel{position:relative;width:100%;height:100%;overflow:hidden;background:#ffffff;outline:none}
    .carousel:focus-visible{box-shadow:inset 0 0 0 2px #c8ff2f}
    .track{display:flex;height:100%;transition:transform .35s ease}
    .slide{flex:0 0 100%;width:100%;height:100%;object-fit:contain;display:block;user-select:none}
  `]
})
export class ShoeArtComponent {
  @Input({ required: true }) shoe!: Shoe;

  index = 0;

  get lastIndex(): number {
    return (this.shoe.photos?.length ?? 1) - 1;
  }
  private touchX = 0;

  go(i: number): void {
    this.index = Math.max(0, Math.min(i, this.lastIndex));
  }

  move(direction: number): void {
    this.go(this.index + direction);
  }

  onTouchStart(e: TouchEvent): void {
    this.touchX = e.touches[0].clientX;
  }

  onTouchEnd(e: TouchEvent): void {
    const dx = e.changedTouches[0].clientX - this.touchX;
    if (Math.abs(dx) > 40) this.move(dx < 0 ? 1 : -1);
  }

  get soleH(): number {
    return this.shoe.kind === 'sapato' ? 8 : 10 + this.shoe.volume * 2.2;
  }

  get soleTop(): number {
    return 96 - this.soleH;
  }

  get soleRx(): number {
    return Math.min(this.soleH / 2, 12);
  }

  get upper(): string {
    const t = this.soleTop;
    switch (this.shoe.kind) {
      case 'bota':
        return `M22,${t} L22,${t - 58} L74,${t - 58} L80,${t - 32} C104,${t - 26} 150,${t - 22} 186,${t - 8} L188,${t} Z`;
      case 'sapato':
        return `M20,${t} L20,${t - 24} C20,${t - 34} 34,${t - 36} 54,${t - 34} L92,${t - 28} C130,${t - 24} 170,${t - 14} 192,${t} Z`;
      default:
        return `M18,${t} L18,${t - 22} C18,${t - 34} 30,${t - 38} 48,${t - 38} L78,${t - 38} C92,${t - 38} 100,${t - 22} 118,${t - 18} C150,${t - 14} 184,${t - 10} 188,${t} Z`;
    }
  }

  get laces(): string {
    const t = this.soleTop;
    const y = this.shoe.kind === 'bota' ? t - 50 : t - 32;
    return `M62,${y} l16,10 M74,${y - 4} l16,10 M86,${y + 2} l16,10`;
  }
}

