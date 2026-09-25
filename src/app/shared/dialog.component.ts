import { Component, ElementRef, ViewChild, effect, inject } from '@angular/core';
import { DialogService } from '../services/dialog.service';
import { IconComponent } from './icon.component';

@Component({
  selector: 'senso-dialog',
  standalone: true,
  imports: [IconComponent],
  template: `
    <dialog #el class="dialog" [class]="'dialog tone-' + (d?.tone ?? 'info')"
            aria-labelledby="dlg-title" [attr.aria-describedby]="d?.message ? 'dlg-text' : null"
            (cancel)="onCancel($event)" (click)="onBackdrop($event)">
      @if (d; as d) {
        <form method="dialog" class="box" (submit)="confirm($event)" novalidate>
          <span class="badge" aria-hidden="true">
            @switch (d.tone) {
              @case ('success') { <senso-icon name="check" [size]="22" [stroke]="2.6" /> }
              @case ('danger') { <senso-icon name="trash" [size]="20" /> }
              @case ('warning') { <b>!</b> }
              @default { <b>i</b> }
            }
          </span>
          <h2 id="dlg-title">{{ d.title }}</h2>
          @if (d.message) { <p id="dlg-text">{{ d.message }}</p> }

          @if (d.input; as field) {
            <div class="field">
              <label for="dlg-input">{{ field.label }}</label>
              @if (field.type === 'select') {
                <select #input id="dlg-input" class="select" (change)="inputError = false" [class.invalid]="inputError" [attr.aria-invalid]="inputError" aria-describedby="dlg-err">
                  <option value="" disabled [selected]="!field.value">{{ field.placeholder ?? '' }}</option>
                  @for (o of field.options ?? []; track o.value) {
                    <option [value]="o.value" [selected]="o.value === field.value">{{ o.label }}</option>
                  }
                </select>
              } @else {
                <input #input id="dlg-input" class="input" [type]="field.type" [value]="field.value ?? ''"
                       [placeholder]="field.placeholder ?? ''" [attr.autocomplete]="field.type === 'email' ? 'email' : 'off'"
                       spellcheck="false" (input)="inputError = false" [attr.maxlength]="field.maxLength ?? null" [class.invalid]="inputError" [attr.aria-invalid]="inputError" aria-describedby="dlg-err">
              }
              @if (inputError) { <p class="field-error" id="dlg-err">{{ field.error }}</p> }
            </div>
          }

          <div class="actions">
            @if (d.cancelLabel) {
              <button type="button" class="btn btn-ghost" (click)="cancel()">{{ d.cancelLabel }}</button>
            }
            <button type="submit" class="btn" [class.btn-danger]="d.tone === 'danger'" [class.btn-ink]="d.tone !== 'danger'" autofocus>
              {{ d.confirmLabel }}
            </button>
          </div>
        </form>
      }
    </dialog>
  `,
  styles: [`
    .dialog {
      width: min(440px, calc(100vw - 32px));
      padding: 0;
      border: 0;
      border-radius: 24px;
      background: var(--bone);
      color: var(--ink);
      box-shadow: 0 30px 80px #000a;
    }
    .dialog::backdrop { background: #10130fcc; backdrop-filter: blur(3px); }
    .dialog[open] { animation: pop .18s ease-out; }
    @keyframes pop { from { opacity: 0; transform: translateY(10px) scale(.98); } }
    .box { display: flex; flex-direction: column; gap: 14px; padding: 28px; }
    .badge {
      display: grid; place-items: center;
      width: 48px; height: 48px; border-radius: 16px;
      background: var(--ink); color: var(--lime);
      font: 700 22px var(--font-display);
    }
    .tone-success .badge { background: var(--lime); color: var(--lime-ink); }
    .tone-danger .badge { background: #b3261e; color: #fff; }
    .tone-warning .badge { background: #f2c14e; color: var(--ink); }
    h2 { margin: 4px 0 0; font: 700 24px/1.15 var(--font-display); letter-spacing: -0.01em; }
    p { margin: 0; font-size: 15px; line-height: 1.55; color: var(--text-dim-light); }
    .field { margin-top: 4px; }
    .actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; flex-wrap: wrap; }
    .actions .btn { min-height: 48px; }
    .actions .btn-ghost { border-color: #10130f40; }
    .btn-danger { background: #b3261e; color: #fff; }
    .btn-danger:hover { background: #8c1d18; }
    @media (max-width: 420px) { .actions .btn { flex: 1 1 100%; } }
    @media (prefers-reduced-motion: reduce) { .dialog[open] { animation: none; } }
  `]
})
export class DialogComponent {
  private readonly service = inject(DialogService);
  @ViewChild('el', { static: true }) el!: ElementRef<HTMLDialogElement>;
  @ViewChild('input') input?: ElementRef<HTMLInputElement | HTMLSelectElement>;

  inputError = false;

  get d() {
    return this.service.current();
  }

  constructor() {
    effect(() => {
      const open = this.service.current();
      const el = this.el?.nativeElement;
      if (!el) return;
      this.inputError = false;
      if (open && !el.open) el.showModal();
      if (!open && el.open) el.close();
      if (open?.input) setTimeout(() => this.input?.nativeElement.focus());
    });
  }

  confirm(event: Event): void {
    event.preventDefault();
    const field = this.d?.input;
    if (field) {
      const value = this.input?.nativeElement.value.trim() ?? '';
      if (!value || (field.pattern && !field.pattern.test(value))) {
        this.inputError = true;
        this.input?.nativeElement.focus();
        return;
      }
      this.service.close({ confirmed: true, value });
      return;
    }
    this.service.close({ confirmed: true });
  }

  cancel(): void {
    this.service.close({ confirmed: false });
  }

  onCancel(event: Event): void {
    
    event.preventDefault();
    this.service.close({ confirmed: !this.d?.cancelLabel });
  }

  onBackdrop(event: MouseEvent): void {
    if (event.target === this.el.nativeElement) this.onCancel(event);
  }
}
