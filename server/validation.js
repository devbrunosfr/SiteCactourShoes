const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const NAME_MIN = 2;
const NAME_MAX = 50;
const PASSWORD_MIN = 6;
const PASSWORD_MAX = 30;

const SOCIAL_PROVIDERS = ["google", "microsoft", "apple"];

function text(value) {
    return typeof value === "string" ? value : "";
}

function invalid(error, code = "invalidData") {
    return { error, code };
}

function validateRegister(body) {
    const nome = text(body?.nome).trim().replace(/\s+/g, " ");
    const email = text(body?.email).trim().toLowerCase();
    const senha = text(body?.senha);

    if (!nome || !email || !senha) {
        return invalid("Preencha nome, e-mail e senha.");
    }

    if (nome.length < NAME_MIN || nome.length > NAME_MAX) {
        return invalid(`O nome deve ter entre ${NAME_MIN} e ${NAME_MAX} caracteres.`);
    }

    if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
        return invalid("Informe um e-mail válido.");
    }

    if (senha.length < PASSWORD_MIN) {
        return invalid(`A senha deve ter pelo menos ${PASSWORD_MIN} caracteres.`);
    }

    if (senha.length > PASSWORD_MAX) {
        return invalid(`A senha pode ter no máximo ${PASSWORD_MAX} caracteres.`);
    }

    if (body?.acceptedTerms !== true) {
        return invalid("Para criar a conta, aceite os Termos de Uso e a Política de Privacidade.", "termsRequired");
    }

    return { value: { nome, email, senha } };
}

function validateLogin(body) {
    const email = text(body?.email).trim().toLowerCase();
    const senha = text(body?.senha);

    if (!email || !senha) {
        return invalid("O campo de e-mail ou senha não foi preenchido!");
    }

    return { value: { email, senha } };
}

function validateSocial(body) {
    const provider = text(body?.provider);

    if (!SOCIAL_PROVIDERS.includes(provider)) {
        return invalid("Provedor de login não reconhecido.");
    }

    return { value: { provider, acceptedTerms: body?.acceptedTerms === true } };
}

function validateForgot(body) {
    const email = text(body?.email).trim().toLowerCase();

    if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
        return invalid("Informe um e-mail válido.");
    }

    return { value: { email } };
}

module.exports = { validateRegister, validateLogin, validateSocial, validateForgot };
