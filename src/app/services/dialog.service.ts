import { Injectable, signal } from '@angular/core';

export type DialogTone = 'info' | 'success' | 'warning' | 'danger';

export interface DialogConfig {
  tone?: DialogTone;
  
  title: string;
  message?: string;
  confirmLabel: string;
  
  cancelLabel?: string;
  
  input?: {
    label: string;
    
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

@Injectable({ providedIn: 'root' })
export class DialogService {
  readonly current = signal<OpenDialog | null>(null);

  open(config: DialogConfig): Promise<DialogResult> {
    
    this.current()?.resolve({ confirmed: false });
    return new Promise(resolve => this.current.set({ ...config, resolve }));
  }

  async confirm(config: Omit<DialogConfig, 'input'>): Promise<boolean> {
    return (await this.open(config)).confirmed;
  }

  async alert(config: Omit<DialogConfig, 'input' | 'cancelLabel'>): Promise<void> {
    await this.open(config);
  }

  close(result: DialogResult): void {
    const dialog = this.current();
    this.current.set(null);
    dialog?.resolve(result);
  }
}
