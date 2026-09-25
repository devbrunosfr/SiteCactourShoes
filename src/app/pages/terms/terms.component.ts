import { Component, inject } from '@angular/core';
import { I18nService } from '../../services/i18n.service';
import { TranslatePipe } from '../../shared/t.pipe';

/** /termos — Termos de Uso e Política de Privacidade (LGPD). Modelo para o projeto acadêmico. */
@Component({
  selector: 'senso-terms',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <article class="terms">
      <header>
        <span class="eyebrow">{{ 'terms.eyebrow' | t }}</span>
        <h1>{{ 'terms.title' | t }}</h1>
        <p class="meta">{{ 'terms.updated' | t: { date: updated } }}</p>
        <p class="notice">{{ 'terms.notice' | t }}</p>
      </header>

      <section id="termos" aria-labelledby="t-uso">
        <h2 id="t-uso">{{ 'terms.termsTitle' | t }}</h2>
        <ol>@for (item of i18n.list('terms.terms'); track $index) { <li>{{ item }}</li> }</ol>
      </section>

      <section id="privacidade" aria-labelledby="t-priv">
        <h2 id="t-priv">{{ 'terms.privacyTitle' | t }}</h2>
        <h3>{{ 'terms.dataTitle' | t }}</h3>
        <ul>@for (item of i18n.list('terms.data'); track $index) { <li>{{ item }}</li> }</ul>
        <h3>{{ 'terms.purposeTitle' | t }}</h3>
        <p>{{ 'terms.purpose' | t }}</p>
        <h3>{{ 'terms.storageTitle' | t }}</h3>
        <p>{{ 'terms.storage' | t }}</p>
        <h3>{{ 'terms.rightsTitle' | t }}</h3>
        <ul>@for (item of i18n.list('terms.rights'); track $index) { <li>{{ item }}</li> }</ul>
        <h3>{{ 'terms.contactTitle' | t }}</h3>
        <p>{{ 'terms.contact' | t }}</p>
      </section>
    </article>
  `,
  styles: [`
    :host { display: block; background: #f3f1eb; color: #10130f; position: relative; isolation: isolate; overflow: hidden; }
    :host::before { content:''; position:absolute; inset:0; z-index:-1; pointer-events:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='960' height='640' viewBox='0 0 960 640'%3E%3Cdefs%3E%3Cg id='a' fill='%23111411'%3E%3Cpath d='M29.5 140V13A13 13 0 0 1 55.5 13V140Z'/%3E%3Cg fill='none' stroke='%23111411' stroke-width='20' stroke-linecap='round'%3E%3Cpath d='M10 36V62Q10 79 28 79H40'/%3E%3Cpath d='M76.5 55V80Q76.5 98 58 98H46'/%3E%3C/g%3E%3C/g%3E%3Cg id='b'%3E%3Cuse href='%23a'/%3E%3Cpath fill='%23f3f1eb' d='M31.7 137.8V13A10.8 10.8 0 0 1 53.3 13V137.8Z'/%3E%3Cg fill='none' stroke='%23f3f1eb' stroke-width='15.6' stroke-linecap='round'%3E%3Cpath d='M10 36V62Q10 79 28 79H40'/%3E%3Cpath d='M76.5 55V80Q76.5 98 58 98H46'/%3E%3C/g%3E%3C/g%3E%3Cg id='c'%3E%3Cuse href='%23a'/%3E%3Cg fill='none' stroke='%23f3f1eb' stroke-width='1.5' stroke-linecap='round'%3E%3Cpath d='M34.7 140V45C34.7 26 39.0 10 42.5 3.2'/%3E%3Cpath d='M39.9 140V45C39.9 26 41.3 10 42.5 3.2'/%3E%3Cpath d='M45.1 140V45C45.1 26 43.7 10 42.5 3.2'/%3E%3Cpath d='M50.3 140V45C50.3 26 46.0 10 42.5 3.2'/%3E%3Cpath d='M31 84H28Q5 84 5 62V44C5 34 7.8 29.5 10 27.2'/%3E%3Cpath d='M31 79H28Q10 79 10 62V44C10 34 10.0 29.5 10 27.2'/%3E%3Cpath d='M31 74H28Q15 74 15 62V44C15 34 12.2 29.5 10 27.2'/%3E%3Cpath d='M55 93H58Q71.5 93 71.5 80V64C71.5 54 74.2 49.5 76.5 46.5'/%3E%3Cpath d='M55 98H58Q76.5 98 76.5 80V64C76.5 54 76.5 49.5 76.5 46.5'/%3E%3Cpath d='M55 103H58Q81.5 103 81.5 80V64C81.5 54 78.8 49.5 76.5 46.5'/%3E%3C/g%3E%3C/g%3E%3C/defs%3E%3Cuse href='%23a' opacity='0.05' transform='translate(84.8 71.4) rotate(-9.8) scale(0.58) translate(-43.5 -70)'/%3E%3Cuse href='%23b' opacity='0.09' transform='translate(225.9 80.1) rotate(-3.8) scale(0.65) translate(-43.5 -70)'/%3E%3Cuse href='%23c' opacity='0.07' transform='translate(386.2 71.8) rotate(-1.9) scale(0.49) translate(-43.5 -70)'/%3E%3Cuse href='%23a' opacity='0.05' transform='translate(548.0 74.5) rotate(9.2) scale(0.62) translate(-43.5 -70)'/%3E%3Cuse href='%23b' opacity='0.09' transform='translate(722.5 77.9) rotate(12.5) scale(0.68) translate(-43.5 -70)'/%3E%3Cuse href='%23c' opacity='0.07' transform='translate(891.5 75.8) rotate(-12.7) scale(0.79) translate(-43.5 -70)'/%3E%3Cuse href='%23c' opacity='0.07' transform='translate(-6.1 246.3) rotate(-10.7) scale(0.53) translate(-43.5 -70)'/%3E%3Cuse href='%23c' opacity='0.07' transform='translate(953.9 246.3) rotate(-10.7) scale(0.53) translate(-43.5 -70)'/%3E%3Cuse href='%23a' opacity='0.05' transform='translate(164.4 237.4) rotate(2.3) scale(0.54) translate(-43.5 -70)'/%3E%3Cuse href='%23b' opacity='0.09' transform='translate(305.9 234.1) rotate(-12.2) scale(0.66) translate(-43.5 -70)'/%3E%3Cuse href='%23c' opacity='0.07' transform='translate(474.1 241.7) rotate(-2.0) scale(0.70) translate(-43.5 -70)'/%3E%3Cuse href='%23a' opacity='0.05' transform='translate(649.4 244.0) rotate(-5.6) scale(0.63) translate(-43.5 -70)'/%3E%3Cuse href='%23b' opacity='0.09' transform='translate(800.8 247.5) rotate(2.1) scale(0.56) translate(-43.5 -70)'/%3E%3Cuse href='%23c' opacity='0.07' transform='translate(95.4 392.4) rotate(-5.9) scale(0.71) translate(-43.5 -70)'/%3E%3Cuse href='%23a' opacity='0.05' transform='translate(228.9 399.8) rotate(7.2) scale(0.61) translate(-43.5 -70)'/%3E%3Cuse href='%23b' opacity='0.09' transform='translate(408.5 401.5) rotate(4.7) scale(0.49) translate(-43.5 -70)'/%3E%3Cuse href='%23c' opacity='0.07' transform='translate(566.2 401.9) rotate(-5.2) scale(0.76) translate(-43.5 -70)'/%3E%3Cuse href='%23a' opacity='0.05' transform='translate(730.9 408.9) rotate(-1.2) scale(0.67) translate(-43.5 -70)'/%3E%3Cuse href='%23b' opacity='0.09' transform='translate(865.9 404.0) rotate(4.6) scale(0.63) translate(-43.5 -70)'/%3E%3Cuse href='%23b' opacity='0.09' transform='translate(10.3 555.7) rotate(13.8) scale(0.69) translate(-43.5 -70)'/%3E%3Cuse href='%23b' opacity='0.09' transform='translate(970.3 555.7) rotate(13.8) scale(0.69) translate(-43.5 -70)'/%3E%3Cuse href='%23c' opacity='0.07' transform='translate(144.7 559.2) rotate(4.7) scale(0.60) translate(-43.5 -70)'/%3E%3Cuse href='%23a' opacity='0.05' transform='translate(305.9 565.4) rotate(-10.7) scale(0.53) translate(-43.5 -70)'/%3E%3Cuse href='%23b' opacity='0.09' transform='translate(476.5 567.4) rotate(-7.1) scale(0.52) translate(-43.5 -70)'/%3E%3Cuse href='%23c' opacity='0.07' transform='translate(641.6 567.7) rotate(-1.4) scale(0.51) translate(-43.5 -70)'/%3E%3Cuse href='%23a' opacity='0.05' transform='translate(792.9 558.3) rotate(10.2) scale(0.74) translate(-43.5 -70)'/%3E%3C/svg%3E"); background-repeat:repeat; background-size:1400px 940px; }
    .terms { max-width: 820px; margin: 0 auto; display: flex; flex-direction: column; gap: 40px; padding: clamp(40px, 5vw, 72px) clamp(16px, 4vw, 48px); }
    header { display: flex; flex-direction: column; gap: 14px; }
    .eyebrow { color: #79851e; font: 700 12px var(--font-body); letter-spacing: .16em; text-transform: uppercase; }
    h1 { margin: 0; font: 700 clamp(34px, 4.2vw, 56px)/1 var(--font-display); letter-spacing: -0.03em; color: #10130f; }
    h2 { margin: 0; font: 600 clamp(19px, 1.6vw, 22px)/1.2 var(--font-display); color: #10130f; }
    .meta { margin: 0; color: #10130f80; font-size: 14px; }
    .notice { margin: 0; padding: 12px 16px; border-radius: 12px; background: #eae6db; color: #10130f; font-size: 14px; }
    section { display: flex; flex-direction: column; gap: 12px; padding-top: 28px; border-top: 1px dashed #10130f2e; scroll-margin-top: 96px; }
    h3 { margin: 12px 0 0; font: 600 16px var(--font-display); color: #79851e; }
    p, li { color: #10130fb3; line-height: 1.7; font-size: 16px; }
    p { margin: 0; }
    ol, ul { margin: 0; padding-left: 22px; display: flex; flex-direction: column; gap: 6px; }
  `]
})
export class TermsComponent {
  readonly i18n = inject(I18nService);

  /** Data de referência do documento — atualize quando o texto mudar. */
  get updated(): string {
    return this.i18n.date('2026-09-24T12:00:00');
  }
}
