import { Dictionary } from './pt';

/** English dictionary — same keys as pt.ts (TypeScript checks it). */
export const EN: Dictionary = {
  common: {
    ok: 'Got it',
    cancel: 'Cancel',
    newTab: '(opens in a new tab)'
  },

  lang: {
    label: 'Language',
    pt: 'PT',
    en: 'EN',
    ptName: 'Portuguese (Brazil)',
    enName: 'English'
  },

  nav: {
    home: 'CactourShoes — home'
  },

  titles: {
    login: 'Log in or sign up',
    terms: 'Terms of Use & Privacy'
  },

  terms: {
    eyebrow: 'Terms and privacy',
    title: 'Terms of Use and Privacy Policy',
    updated: 'Last updated: {date}',
    notice: 'Template for an academic project. Have it reviewed by a legal professional before commercial use.',
    termsTitle: 'Terms of Use',
    terms: [
      'CactourShoes is a smart footwear platform: it uses the choices in your wardrobe and style to suggest shoes that suit you.',
      'Recommendations, comparisons and price estimates are aids for your decision and may change over time.',
      'You are responsible for keeping your password secret and for what is done in your account.',
      'To create an account, you must accept these Terms and the Privacy Policy.'
    ],
    privacyTitle: 'Privacy Policy (LGPD — Brazilian Law 13,709/2018)',
    dataTitle: 'Data we process',
    data: [
      'Name and e-mail, to identify your account.',
      'Password, kept only in encrypted form (hash) — never as plain text.',
      'The date and time you accepted these Terms and the Privacy Policy.'
    ],
    purposeTitle: 'Why we use it',
    purpose: 'Only to create and keep your account and let you access the platform, with your consent (LGPD art. 7, I).',
    storageTitle: 'Where it is kept',
    storage: 'Account data is kept on the platform’s server. In your browser we only keep the session (the access token); with “Stay logged in”, it remains valid after you close the browser.',
    rightsTitle: 'Your rights (art. 18)',
    rights: [
      'Confirm and access the data we hold about you.',
      'Correct incomplete or outdated data.',
      'Ask for your account and data to be deleted, using the contact below.',
      'Withdraw your consent at any time.'
    ],
    contactTitle: 'Data Protection Officer (DPO) contact',
    contact: '[DPO E-MAIL]'
  },

  login: {
    remember: 'Stay logged in',
    rememberHint: 'Don’t check this on shared computers.',
    forgot: 'Forgot password',
    forgotTitle: 'Reset password',
    forgotText: 'Enter your account e-mail. We will send you a link to create a new password.',
    forgotSend: 'Send link',
    forgotDoneTitle: 'Check your e-mail',
    forgotDoneText: 'If there is an account for {email}, you will receive the link in a few minutes. (Simulation: this project does not send e-mails.)',
    emailRequired: 'Enter your e-mail.',
    passwordShort: 'At least {min} characters — {n} to go.',
    passwordEnough: 'Minimum length reached.',
    createdTitle: 'Account created!',
    createdText: 'Welcome, {name}. Your account is ready.',
    createdOk: 'Continue',
    socialTitle: 'Logged in with {provider}',
    socialText: 'Simulated login: this project does not yet have a real integration with your {provider} account.',
    back: 'Back',
    brandTitle: 'Your next pair starts with an account.',
    perks: ['Build your wardrobe', 'Get recommendations that suit you', 'Use the tools: compare, ideal size and price radar'],
    contexts: {
      wardrobe: 'Log in to build your wardrobe. We will bring you back.',
      profile: 'Log in to see your profile.',
      tools: 'Log in to use the CactourShoes tools. We will bring you back.'
    },
    modeLabel: 'Choose between logging in and signing up',
    tabLogin: 'Log in',
    tabSignup: 'Sign up',
    titleLogin: 'Log in to your account',
    titleSignup: 'Create your account',
    social: 'Continue with {provider}',
    socialGroup: 'Log in with another account',
    or: 'or continue with',
    name: 'Name',
    nameError: 'Enter your name, 2 to 50 characters.',
    email: 'E-mail',
    emailError: 'Use the name@domain.com format.',
    password: 'Password',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    passwordHint: 'Use {min} to {max} characters.',
    passwordErrorSignup: 'The password must have {min} to {max} characters.',
    passwordErrorLogin: 'The password has at least {min} characters.',
    acceptA: 'I have read and accept the',
    acceptTerms: 'Terms of Use',
    acceptB: 'and the',
    acceptPrivacy: 'Privacy Policy (LGPD)',
    acceptError: 'To create an account, accept the Terms of Use and the Privacy Policy.',
    submitLogin: 'Log in and continue',
    submitSignup: 'Sign up and continue',
    loadingLogin: 'Logging in…',
    loadingSignup: 'Creating account…',
    errors: {
      invalidCredentials: 'Incorrect e-mail or password.',
      emailTaken: 'An account with this e-mail already exists. Try logging in.',
      termsRequired: 'To create an account, accept the Terms of Use and the Privacy Policy.',
      invalidData: 'Check the information you entered and try again.',
      tooManyRequests: 'Too many attempts in a row. Wait a few minutes and try again.',
      network: 'Could not connect to the server. Check that the API is running (npm run api).',
      generic: 'Something went wrong. Please try again.'
    },
    welcomeBack: 'Welcome back, {name}.'
  }
};
