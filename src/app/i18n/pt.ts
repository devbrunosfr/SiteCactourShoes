/**
 * Dicionário em português (idioma padrão) da tela de login, do pop-up e dos Termos.
 * en.ts precisa ter as mesmas chaves (o TypeScript acusa se faltar alguma).
 * Parâmetros entre chaves, ex.: {name}, são preenchidos pelo pipe `t`.
 */
export const PT = {
  common: {
    ok: 'Entendi',
    cancel: 'Cancelar',
    newTab: '(abre em nova aba)'
  },

  lang: {
    label: 'Idioma',
    pt: 'PT',
    en: 'EN',
    ptName: 'Português (Brasil)',
    enName: 'Inglês'
  },

  nav: {
    home: 'CactourShoes — início'
  },

  titles: {
    login: 'Entrar ou criar conta',
    terms: 'Termos de Uso e Privacidade'
  },

  terms: {
    eyebrow: 'Termos e privacidade',
    title: 'Termos de Uso e Política de Privacidade',
    updated: 'Última atualização: {date}',
    notice: 'Modelo para um projeto acadêmico. Antes de uso comercial, revise com um profissional de Direito.',
    termsTitle: 'Termos de Uso',
    terms: [
      'A CactourShoes é uma plataforma inteligente de calçados: ela usa as escolhas do seu guarda-roupa e do seu estilo para sugerir calçados que combinam com você.',
      'Recomendações, comparações e estimativas de preço são apoios para a sua decisão e podem mudar com o tempo.',
      'Você é responsável por manter a sua senha em sigilo e pelo que for feito na sua conta.',
      'Para criar uma conta, é preciso aceitar estes Termos e a Política de Privacidade.'
    ],
    privacyTitle: 'Política de Privacidade (LGPD — Lei nº 13.709/2018)',
    dataTitle: 'Quais dados tratamos',
    data: [
      'Nome e e-mail, para identificar sua conta.',
      'Senha, guardada apenas de forma criptografada (hash) — nunca em texto puro.',
      'Data e hora em que você aceitou estes Termos e a Política de Privacidade.'
    ],
    purposeTitle: 'Para que usamos',
    purpose: 'Somente para criar e manter a sua conta e permitir o seu acesso à plataforma, com o seu consentimento (art. 7º, I da LGPD).',
    storageTitle: 'Onde ficam',
    storage: 'Os dados da conta ficam no servidor da plataforma. No seu navegador guardamos apenas a sessão (o token de acesso); com "Manter conectado", ela continua valendo depois que você fecha o navegador.',
    rightsTitle: 'Seus direitos (art. 18)',
    rights: [
      'Confirmar e acessar os dados que temos sobre você.',
      'Corrigir dados incompletos ou desatualizados.',
      'Pedir a eliminação da conta e dos dados, pelo contato abaixo.',
      'Revogar o consentimento a qualquer momento.'
    ],
    contactTitle: 'Contato do encarregado (DPO)',
    contact: '[E-MAIL DO ENCARREGADO]'
  },

  login: {
    remember: 'Manter conectado',
    rememberHint: 'Não marque em computadores compartilhados.',
    forgot: 'Esqueci a senha',
    forgotTitle: 'Redefinir senha',
    forgotText: 'Informe o e-mail da sua conta. Enviaremos um link para criar uma nova senha.',
    forgotSend: 'Enviar link',
    forgotDoneTitle: 'Verifique seu e-mail',
    forgotDoneText: 'Se existir uma conta com {email}, você vai receber o link em alguns minutos. (Simulação: este projeto não envia e-mails.)',
    emailRequired: 'Informe seu e-mail.',
    passwordShort: 'Mínimo de {min} caracteres — faltam {n}.',
    passwordEnough: 'Tamanho mínimo atingido.',
    createdTitle: 'Conta criada!',
    createdText: 'Bem-vindo(a), {name}. Sua conta está pronta.',
    createdOk: 'Continuar',
    socialTitle: 'Entrou com {provider}',
    socialText: 'Login simulado: este projeto ainda não tem integração real com a sua conta {provider}.',
    back: 'Voltar',
    brandTitle: 'Seu próximo calçado começa com uma conta.',
    perks: ['Monte o seu guarda-roupa', 'Receba recomendações que combinam com você', 'Use as ferramentas: comparar, tamanho ideal e radar de preço'],
    contexts: {
      wardrobe: 'Entre para montar o seu guarda-roupa. Levamos você de volta.',
      profile: 'Entre para ver o seu perfil.',
      tools: 'Entre para usar as ferramentas da CactourShoes. Levamos você de volta.'
    },
    modeLabel: 'Escolha entre entrar e criar conta',
    tabLogin: 'Entrar',
    tabSignup: 'Criar conta',
    titleLogin: 'Entrar na sua conta',
    titleSignup: 'Criar sua conta',
    social: 'Continuar com {provider}',
    socialGroup: 'Entrar com outra conta',
    or: 'ou continue com',
    name: 'Nome',
    nameError: 'Informe seu nome, com 2 a 50 caracteres.',
    email: 'E-mail',
    emailError: 'Use o formato nome@dominio.com.',
    password: 'Senha',
    showPassword: 'Mostrar senha',
    hidePassword: 'Ocultar senha',
    passwordHint: 'Use de {min} a {max} caracteres.',
    passwordErrorSignup: 'A senha precisa ter de {min} a {max} caracteres.',
    passwordErrorLogin: 'A senha tem no mínimo {min} caracteres.',
    acceptA: 'Li e aceito os',
    acceptTerms: 'Termos de Uso',
    acceptB: 'e a',
    acceptPrivacy: 'Política de Privacidade (LGPD)',
    acceptError: 'Para criar a conta, aceite os Termos de Uso e a Política de Privacidade.',
    submitLogin: 'Entrar e continuar',
    submitSignup: 'Criar conta e continuar',
    loadingLogin: 'Entrando…',
    loadingSignup: 'Criando conta…',
    errors: {
      invalidCredentials: 'E-mail ou senha incorretos.',
      emailTaken: 'Já existe uma conta com este e-mail. Tente entrar.',
      termsRequired: 'Para criar a conta, aceite os Termos de Uso e a Política de Privacidade.',
      invalidData: 'Confira os dados informados e tente de novo.',
      tooManyRequests: 'Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo.',
      network: 'Não foi possível conectar ao servidor. Confira se a API está rodando (npm run api).',
      generic: 'Algo deu errado. Tente novamente.'
    },
    welcomeBack: 'Olá de novo, {name}.'
  }
};

type Widen<T> = T extends string ? string : T extends readonly (infer U)[] ? Widen<U>[] : { [K in keyof T]: Widen<T[K]> };

/** Formato que o dicionário em inglês precisa seguir. */
export type Dictionary = Widen<typeof PT>;
