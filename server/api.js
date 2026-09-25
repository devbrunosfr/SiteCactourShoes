const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const config = require("./config");
const users = require("./users-store");
const { validateRegister, validateLogin, validateSocial, validateForgot } = require("./validation");

const JWT_SECRET = config.getJwtSecret();

const DUMMY_HASH = bcrypt.hashSync("senha-que-nunca-sera-usada", config.BCRYPT_ROUNDS);

const app = express();

app.disable("x-powered-by");
app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(express.json({ limit: "10kb" }));

function createLimiter({ max, windowMs, message }) {
    const attempts = new Map();

    const cleanup = setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of attempts) {
            if (entry.resetAt <= now) attempts.delete(key);
        }
    }, 60 * 1000);
    cleanup.unref();

    const middleware = (req, res, next) => {
        const now = Date.now();
        const entry = attempts.get(req.ip);

        if (!entry || entry.resetAt <= now) {
            attempts.set(req.ip, { count: 1, resetAt: now + windowMs });
            return next();
        }

        entry.count += 1;

        if (entry.count > max) {
            res.set("Retry-After", String(Math.ceil((entry.resetAt - now) / 1000)));
            return res.status(429).json({ code: "tooManyRequests", message });
        }

        return next();
    };

    middleware.reset = (key) => attempts.delete(key);
    return middleware;
}

const loginLimiter = createLimiter({
    max: 10,
    windowMs: 15 * 60 * 1000,
    message: "Muitas tentativas de login. Aguarde alguns minutos e tente novamente."
});

const registerLimiter = createLimiter({
    max: 10,
    windowMs: 60 * 60 * 1000,
    message: "Muitos cadastros feitos deste endereço. Tente novamente mais tarde."
});

const forgotLimiter = createLimiter({
    max: 5,
    windowMs: 15 * 60 * 1000,
    message: "Muitos pedidos de redefinição. Aguarde alguns minutos e tente novamente."
});

// Contas de demonstração do login social simulado.
const SOCIAL_DEMO = {
    google: { nome: "Cliente Google", email: "cliente.demo@gmail.com" },
    microsoft: { nome: "Cliente Microsoft", email: "cliente.demo@outlook.com" },
    apple: { nome: "Cliente Apple", email: "cliente.demo@icloud.com" }
};

function signToken(user) {
    return jwt.sign({ sub: user.id }, JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: config.JWT_EXPIRES_IN
    });
}

function authenticate(req, res, next) {
    const [type, token] = (req.headers.authorization || "").split(" ");

    if (type !== "Bearer" || !token) {
        return res.status(401).json({
            message: "Você precisa entrar para acessar este recurso."
        });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
        const user = users.findById(payload.sub);

        if (!user) {
            return res.status(401).json({ message: "Sessão inválida. Entre novamente." });
        }

        req.user = user;
        return next();
    } catch (error) {
        return res.status(401).json({ message: "Sessão expirada. Entre novamente." });
    }
}

app.get("/", (req, res) => {
    return res.status(200).json({ message: "API da CactourShoes está funcionando." });
});

app.post("/api/auth/register", registerLimiter, async (req, res) => {
    try {
        const { value, error, code } = validateRegister(req.body);

        if (error) {
            return res.status(400).json({ code, message: error });
        }

        if (users.findByEmail(value.email)) {
            return res.status(409).json({
                code: "emailTaken",
                message: "Este e-mail já está cadastrado. Tente entrar."
            });
        }

        const senhaHash = await bcrypt.hash(value.senha, config.BCRYPT_ROUNDS);

        let user;
        try {
            user = users.create({ nome: value.nome, email: value.email, senhaHash });
        } catch (createError) {
            if (createError.code === "EMAIL_IN_USE") {
                return res.status(409).json({
                    code: "emailTaken",
                    message: "Este e-mail já está cadastrado. Tente entrar."
                });
            }
            throw createError;
        }

        return res.status(201).json({
            token: signToken(user),
            user: users.toPublic(user)
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Falha na comunicação com o servidor!"
        });
    }
});

app.post("/api/auth/login", loginLimiter, async (req, res) => {
    try {
        const { value, error, code } = validateLogin(req.body);

        if (error) {
            return res.status(400).json({ code, message: error });
        }

        const user = users.findByEmail(value.email);
        // Conta de login social não tem senha: compara com o hash falso, como se o e-mail não existisse.
        const passwordMatches = await bcrypt.compare(value.senha, user && user.senhaHash ? user.senhaHash : DUMMY_HASH);

        if (!user || !user.senhaHash || !passwordMatches) {
            return res.status(401).json({
                code: "invalidCredentials",
                message: "E-mail ou senha incorretos."
            });
        }

        loginLimiter.reset(req.ip);

        return res.status(200).json({
            token: signToken(user),
            user: users.toPublic(user)
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Falha na comunicação com o servidor!"
        });
    }
});

// Login social SIMULADO: cria (ou reaproveita) uma conta de demonstração do provedor escolhido.
// Não há OAuth de verdade — por isso só existe quando ENABLE_SOCIAL_DEMO está ligado (padrão: fora de produção).
if (config.ENABLE_SOCIAL_DEMO) {
    app.post("/api/auth/social", loginLimiter, (req, res) => {
        try {
            const { value, error, code } = validateSocial(req.body);

            if (error) {
                return res.status(400).json({ code, message: error });
            }

            const demo = SOCIAL_DEMO[value.provider];
            let user = users.findByEmail(demo.email);

            if (user && user.provider !== value.provider) {
                return res.status(409).json({
                    code: "emailTaken",
                    message: "Já existe uma conta com este e-mail. Tente entrar."
                });
            }

            if (!user) {
                if (!value.acceptedTerms) {
                    return res.status(400).json({
                        code: "termsRequired",
                        message: "Para criar a conta, aceite os Termos de Uso e a Política de Privacidade."
                    });
                }

                user = users.create({ nome: demo.nome, email: demo.email, provider: value.provider });
            }

            return res.status(200).json({
                token: signToken(user),
                user: users.toPublic(user)
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Falha na comunicação com o servidor!"
            });
        }
    });
}

// "Esqueci a senha": não há servidor de e-mail, então só simula o envio.
// A resposta é sempre a mesma, exista ou não uma conta com o e-mail informado.
app.post("/api/auth/forgot", forgotLimiter, (req, res) => {
    const { error, code } = validateForgot(req.body);

    if (error) {
        return res.status(400).json({ code, message: error });
    }

    return res.status(200).json({
        message: "Se existir uma conta com este e-mail, você vai receber o link de redefinição."
    });
});

app.get("/api/auth/me", authenticate, (req, res) => {
    return res.status(200).json({ user: users.toPublic(req.user) });
});

app.use((req, res) => {
    return res.status(404).json({ message: "Rota não encontrada." });
});

app.use((error, req, res, next) => {
    if (error.type === "entity.parse.failed") {
        return res.status(400).json({ message: "O corpo da requisição não é um JSON válido." });
    }

    if (error.type === "entity.too.large") {
        return res.status(413).json({ message: "O corpo da requisição é grande demais." });
    }

    console.error(error);
    return res.status(500).json({ message: "Falha na comunicação com o servidor!" });
});

if (require.main === module) {
    app.listen(config.PORT, () => {
        console.log(`API running on http://localhost:${config.PORT}/`);
    });
}

module.exports = app;

