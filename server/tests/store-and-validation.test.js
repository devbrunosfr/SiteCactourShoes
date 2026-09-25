const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

process.env.DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "cactour-test-"));

const config = require("../config");
const users = require("../users-store");
const { validateRegister, validateLogin, validateSocial, validateForgot } = require("../validation");

test("cadastro válido normaliza nome e e-mail", () => {
    const { value, error } = validateRegister({ nome: "  Maria   Silva ", email: " Maria@Email.COM ", senha: "123456", acceptedTerms: true });
    assert.equal(error, undefined);
    assert.deepEqual(value, { nome: "Maria Silva", email: "maria@email.com", senha: "123456" });
});

test("cadastro rejeita campos inválidos", () => {
    const ok = { acceptedTerms: true };
    assert.match(validateRegister({}).error, /Preencha/);
    assert.match(validateRegister({ ...ok, nome: "A", email: "a@b.com", senha: "123456" }).error, /nome/);
    assert.match(validateRegister({ ...ok, nome: "x".repeat(51), email: "a@b.com", senha: "123456" }).error, /50/);
    assert.match(validateRegister({ ...ok, nome: "Ana", email: "sem-arroba", senha: "123456" }).error, /e-mail/);
    assert.match(validateRegister({ ...ok, nome: "Ana", email: "ana@b.com", senha: "12345" }).error, /6 caracteres/);
    assert.match(validateRegister({ ...ok, nome: "Ana", email: "ana@b.com", senha: "x".repeat(31) }).error, /30/);
    assert.match(validateRegister({ ...ok, nome: { a: 1 }, email: ["x"], senha: 123 }).error, /Preencha/);
    assert.equal(validateRegister({}).code, "invalidData");
});

test("cadastro exige o aceite dos termos", () => {
    const body = { nome: "Ana", email: "ana@b.com", senha: "123456" };
    assert.equal(validateRegister(body).code, "termsRequired");
    assert.equal(validateRegister({ ...body, acceptedTerms: "true" }).code, "termsRequired");
    assert.equal(validateRegister({ ...body, acceptedTerms: true }).error, undefined);
});

test("login exige e-mail e senha", () => {
    assert.match(validateLogin({ email: "a@b.com" }).error, /não foi preenchido/);
    assert.deepEqual(validateLogin({ email: " A@B.com ", senha: "x" }).value, { email: "a@b.com", senha: "x" });
});

test("login social e esqueci a senha validam a entrada", () => {
    assert.equal(validateSocial({ provider: "facebook" }).code, "invalidData");
    assert.deepEqual(validateSocial({ provider: "google", acceptedTerms: true }).value, { provider: "google", acceptedTerms: true });
    assert.equal(validateSocial({ provider: "apple" }).value.acceptedTerms, false);
    assert.equal(validateForgot({ email: "sem-arroba" }).code, "invalidData");
    assert.deepEqual(validateForgot({ email: " Ana@B.com " }).value, { email: "ana@b.com" });
});

test("armazenamento cria, busca e impede e-mail repetido", () => {
    assert.equal(users.findByEmail("ana@email.com"), null);

    const created = users.create({ nome: "Ana", email: "ana@email.com", senhaHash: "hash" });
    assert.ok(created.id);
    assert.equal(users.findByEmail("ana@email.com").id, created.id);
    assert.equal(users.findById(created.id).nome, "Ana");

    assert.throws(() => users.create({ nome: "Outra", email: "ana@email.com", senhaHash: "hash" }), { code: "EMAIL_IN_USE" });
    assert.deepEqual(users.toPublic(created), { id: created.id, nome: "Ana", email: "ana@email.com" });
    assert.equal(created.provider, "email");
    assert.ok(created.acceptedTermsAt);

    const social = users.create({ nome: "Cliente Google", email: "cliente.demo@gmail.com", provider: "google" });
    assert.equal(social.senhaHash, undefined);
    assert.equal(social.provider, "google");
});

test("segredo JWT é gerado uma vez e reaproveitado", () => {
    delete process.env.JWT_SECRET;
    const first = config.getJwtSecret();
    assert.ok(first.length >= 64);
    assert.equal(config.getJwtSecret(), first);
    assert.ok(fs.existsSync(path.join(config.DATA_DIR, ".jwt-secret")));
});

