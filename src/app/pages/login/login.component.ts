import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { safeReturnUrl } from '../../auth/auth.guard';
import {
  AuthError, AuthService, AuthUser, EMAIL_MAX, EMAIL_PATTERN, NAME_MAX, PASSWORD_MAX, PASSWORD_MIN, Provider
} from '../../auth/auth.service';
import { DialogService } from '../../services/dialog.service';
import { I18nService } from '../../services/i18n.service';
import { ShellService } from '../../services/shell.service';
import { IconComponent } from '../../shared/icon.component';
import { LangSwitchComponent } from '../../shared/lang-switch.component';
import { LogoComponent } from '../../shared/logo.component';
import { TranslatePipe } from '../../shared/t.pipe';

type Mode = 'entrar' | 'criar';
type SocialProvider = Provider;

const TOOL_ROUTES = ['/comparar', '/alertas-preco', '/tamanho-ideal', '/radar-preco', '/durabilidade'];

@Component({
  selector: 'senso-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, IconComponent, LogoComponent, LangSwitchComponent, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly shell = inject(ShellService);
  private readonly i18n = inject(I18nService);
  private readonly dialog = inject(DialogService);

  readonly passwordRange = { min: PASSWORD_MIN, max: PASSWORD_MAX };
  readonly nameMax = NAME_MAX;
  readonly emailMax = EMAIL_MAX;
  readonly providers: { id: SocialProvider; name: string }[] = [
    { id: 'google', name: 'Google' },
    { id: 'microsoft', name: 'Microsoft' },
    { id: 'apple', name: 'Apple' }
  ];

  mode: Mode = 'entrar';
  loading = false;
  showPassword = false;
  
  errorKey = '';
  
  context: { key: string } | null = null;

  readonly form = this.fb.nonNullable.group({
    nome: [''],
    email: ['', [Validators.required, Validators.maxLength(EMAIL_MAX), Validators.pattern(EMAIL_PATTERN)]],
    senha: ['', [Validators.required, Validators.minLength(PASSWORD_MIN), Validators.maxLength(PASSWORD_MAX)]],
    termos: [false],
    lembrar: [false]
  });

  ngOnInit(): void {
    
    if (this.route.snapshot.queryParamMap.get('modo') === 'criar') {
      this.setMode('criar');
    }
    this.context = this.contextFor(this.target);
  }

  get target(): string | null {
    return safeReturnUrl(this.route.snapshot.queryParamMap.get('returnUrl'));
  }

  get backLink(): string {
    return '/';
  }

  get passwordMissing(): number {
    return Math.max(0, PASSWORD_MIN - this.form.controls.senha.value.length);
  }

  get emailErrorKey(): string {
    const email = this.form.controls.email;
    if (!email.touched || email.valid) return '';
    return email.value.trim() ? 'login.emailError' : 'login.emailRequired';
  }

  get termsMissing(): boolean {
    const termos = this.form.controls.termos;
    return this.mode === 'criar' && termos.touched && !termos.value;
  }

  setMode(mode: Mode): void {
    if (this.mode === mode) return;

    this.mode = mode;
    this.errorKey = '';
    this.showPassword = false;

    const { nome, senha, termos } = this.form.controls;
    nome.setValidators(mode === 'criar' ? [Validators.required, Validators.minLength(2), Validators.maxLength(NAME_MAX)] : []);
    senha.setValidators(
      mode === 'criar'
        ? [Validators.required, Validators.minLength(PASSWORD_MIN), Validators.maxLength(PASSWORD_MAX)]
        : [Validators.required, Validators.minLength(PASSWORD_MIN), Validators.maxLength(PASSWORD_MAX)]
    );
    termos.setValidators(mode === 'criar' ? [Validators.requiredTrue] : []);
    nome.updateValueAndValidity();
    senha.updateValueAndValidity();
    termos.updateValueAndValidity();
    this.form.markAsUntouched();
  }

  async submit(): Promise<void> {
    if (this.loading) return;
    this.errorKey = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.focusFirstInvalid();
      return;
    }

    const { nome, email, senha, termos, lembrar } = this.form.getRawValue();
    const creating = this.mode === 'criar';
    this.loading = true;
    try {
      const user = creating
        ? await this.auth.register(nome, email, senha, termos, lembrar)
        : await this.auth.login(email, senha, lembrar);
      this.loading = false;
      if (creating) {
        await this.dialog.alert({
          tone: 'success',
          title: this.i18n.t('login.createdTitle'),
          message: this.i18n.t('login.createdText', { name: firstName(user) }),
          confirmLabel: this.i18n.t('login.createdOk')
        });
      }
      this.finish(user, creating);
    } catch (error) {
      this.errorKey = `login.errors.${error instanceof AuthError ? error.code : 'generic'}`;
    } finally {
      this.loading = false;
    }
  }

  async social(provider: SocialProvider, name: string): Promise<void> {
    if (this.loading) return;
    this.errorKey = '';

    if (this.mode === 'criar' && !this.form.controls.termos.value) {
      this.form.controls.termos.markAsTouched();
      document.getElementById('termos')?.focus();
      return;
    }

    this.loading = true;
    try {
      const user = await this.auth.socialLogin(
        provider, this.mode === 'criar' || this.form.controls.termos.value, this.form.controls.lembrar.value
      );
      this.loading = false;
      await this.dialog.alert({
        tone: 'success',
        title: this.i18n.t('login.socialTitle', { provider: name }),
        message: this.i18n.t('login.socialText', { provider: name }),
        confirmLabel: this.i18n.t('login.createdOk')
      });
      this.finish(user, false, true);
    } catch (error) {
      if (error instanceof AuthError && error.code === 'termsRequired') {
        
        this.setMode('criar');
        this.form.controls.termos.markAsTouched();
      }
      this.errorKey = `login.errors.${error instanceof AuthError ? error.code : 'generic'}`;
    } finally {
      this.loading = false;
    }
  }

  focusTab(mode: Mode): void {
    setTimeout(() => document.getElementById(`tab-${mode}`)?.focus());
  }

  async forgotPassword(): Promise<void> {
    const email = this.form.controls.email;
    const result = await this.dialog.open({
      title: this.i18n.t('login.forgotTitle'),
      message: this.i18n.t('login.forgotText'),
      confirmLabel: this.i18n.t('login.forgotSend'),
      cancelLabel: this.i18n.t('common.cancel'),
      input: {
        label: this.i18n.t('login.email'),
        type: 'email',
        value: email.valid ? email.value : '',
        pattern: EMAIL_PATTERN,
        maxLength: EMAIL_MAX,
        error: this.i18n.t('login.emailError')
      }
    });
    if (!result.confirmed || !result.value) return;
    await this.auth.requestPasswordReset(result.value);
    await this.dialog.alert({
      tone: 'success',
      title: this.i18n.t('login.forgotDoneTitle'),
      message: this.i18n.t('login.forgotDoneText', { email: result.value }),
      confirmLabel: this.i18n.t('common.ok')
    });
  }

  private finish(user: AuthUser, created: boolean, silent = false): void {
    
    if (!silent && !created) {
      this.shell.toast(this.i18n.t('login.welcomeBack', { name: firstName(user) }));
    }
    void this.router.navigateByUrl(this.target ?? '/');
  }

  private focusFirstInvalid(): void {
    setTimeout(() => (document.querySelector('.form-panel [aria-invalid="true"], .form-panel .terms.invalid input') as HTMLElement | null)?.focus());
  }

  private contextFor(url: string | null): { key: string } | null {
    if (!url) return null;
    if (url.startsWith('/guarda-roupa')) return { key: 'login.contexts.wardrobe' };
    if (url.startsWith('/perfil')) return { key: 'login.contexts.profile' };
    if (TOOL_ROUTES.some(route => url.startsWith(route))) return { key: 'login.contexts.tools' };
    return null;
  }
}

function firstName(user: AuthUser): string {
  return user.nome.trim().split(' ')[0];
}
