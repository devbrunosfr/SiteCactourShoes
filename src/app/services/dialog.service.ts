import { Injectable, signal } from '@angular/core';

export type DialogTone = 'info' | 'success' | 'warning' | 'danger';

export interface DialogConfig {
  tone?: DialogTone;
  /** Textos já traduzidos. */
  title: string;
  message?: string;
  confirmLabel: string;
  /** Sem cancelLabel, o diálogo é só um aviso com um botão. */
  cancelLabel?: string;
  /** Campo opcional (ex.: e-mail em "Esqueci a senha"). */
  input?: {
    label: string;
    /** 'select' mostra uma lista de opções (ex.: motivo da suspensão). */
    type: 'email' | 'text' | 'select';
    value?: string;
    placeholder?: string;
    pattern?: RegExp;
    maxLength?: number;
    error: string;
    options?: { value: string; label: string }[];
  };
}

export interface DialogResult {
  confirmed: boolean;
  value?: string;
}

interface OpenDialog extends DialogConfig {
  resolve: (result: DialogResult) => void;
}

/**
 * Pop-ups de confirmação e aviso (sair, excluir, conta criada, esqueci a senha…).
 * O DialogComponent (em app.component.html) mostra o diálogo aberto; usa <dialog> nativo,
 * que já prende o foco e fecha com Esc.
 */
@Injectable({ providedIn: 'root' })
export class DialogService {
  readonly current = signal<OpenDialog | null>(null);

  open(config: DialogConfig): Promise<DialogResult> {
    // Fecha um diálogo anterior como "cancelado".
    this.current()?.resolve({ confirmed: false });
    return new Promise(resolve => this.current.set({ ...config, resolve }));
  }

  /** Atalho: pergunta sim/não. */
  async confirm(config: Omit<DialogConfig, 'input'>): Promise<boolean> {
    return (await this.open(config)).confirmed;
  }

  /** Atalho: aviso com um botão. */
  async alert(config: Omit<DialogConfig, 'input' | 'cancelLabel'>): Promise<void> {
    await this.open(config);
  }

  close(result: DialogResult): void {
    const dialog = this.current();
    this.current.set(null);
    dialog?.resolve(result);
  }
}
