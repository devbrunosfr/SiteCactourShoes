const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

process.env.DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "cactour-api-test-"));
process.env.JWT_SECRET = "segredo-de-teste";
process.env.ENABLE_SOCIAL_DEMO = "true";

const app = require("../api");

let server;
let base;

test.before(async () => {
    await new Promise((resolve) => {
        server = app.listen(0, resolve);
    });
    base = `http://127.0.0.1:${server.address().port}`;
});

test.after(() => server.close());

async function post(route, body, token) {
    const response = await fetch(`${base}${route}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(body)
    });
    return { status: response.status, body: await response.json() };
}

const ana = { nome: "Ana Souza", email: "ana@email.com", senha: "abc123" };

test("cadastro sem aceitar os termos é recusado com código termsRequired", async () => {
    const { status, body } = await post("/api/auth/register", ana);
    assert.equal(status, 400);
    assert.equal(body.code, "termsRequired");
});

test("cadastro, login e /me funcionam com senha de 6 caracteres", async () => {
    const created = await post("/api/auth/register", { ...ana, acceptedTerms: true });
    assert.equal(created.status, 201);
    assert.ok(created.body.token);
    assert.deepEqual(Object.keys(created.body.user).sort(), ["email", "id", "nome"]);

    const repeated = await post("/api/auth/register", { ...ana, acceptedTerms: true });
    assert.equal(repeated.status, 409);
    assert.equal(repeated.body.code, "emailTaken");

    const wrong = await post("/api/auth/login", { email: ana.email, senha: "errada" });
    assert.equal(wrong.status, 401);
    assert.equal(wrong.body.code, "invalidCredentials");

    const logged = await post("/api/auth/login", { email: " ANA@email.com ", senha: ana.senha });
    assert.equal(logged.status, 200);

    const me = await fetch(`${base}/api/auth/me`, { headers: { Authorization: `Bearer ${logged.body.token}` } });
    assert.equal(me.status, 200);
    assert.equal((await me.json()).user.email, ana.email);
});

test("login social simulado exige termos no primeiro acesso e não abre login por senha", async () => {
    const first = await post("/api/auth/social", { provider: "google", acceptedTerms: false });
    assert.equal(first.status, 400);
    assert.equal(first.body.code, "termsRequired");

    const created = await post("/api/auth/social", { provider: "google", acceptedTerms: true });
    assert.equal(created.status, 200);
    assert.equal(created.body.user.email, "cliente.demo@gmail.com");

    const again = await post("/api/auth/social", { provider: "google", acceptedTerms: false });
    assert.equal(again.status, 200);
    assert.equal(again.body.user.id, created.body.user.id);

    const byPassword = await post("/api/auth/login", { email: "cliente.demo@gmail.com", senha: "qualquer" });
    assert.equal(byPassword.status, 401);

    const unknown = await post("/api/auth/social", { provider: "facebook", acceptedTerms: true });
    assert.equal(unknown.status, 400);
});

test("esqueci a senha responde igual exista ou não a conta", async () => {
    const known = await post("/api/auth/forgot", { email: ana.email });
    const unknown = await post("/api/auth/forgot", { email: "ninguem@email.com" });
    assert.equal(known.status, 200);
    assert.deepEqual(known.body, unknown.body);

    const invalid = await post("/api/auth/forgot", { email: "sem-arroba" });
    assert.equal(invalid.status, 400);
});
