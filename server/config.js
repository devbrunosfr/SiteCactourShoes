const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const IS_PRODUCTION = process.env.NODE_ENV === "production";

function loadJwtSecret() {
    if (process.env.JWT_SECRET) {
        return process.env.JWT_SECRET;
    }

    if (IS_PRODUCTION) {
        throw new Error("Defina a variável de ambiente JWT_SECRET antes de iniciar em produção.");
    }

    const secretFile = path.join(DATA_DIR, ".jwt-secret");

    if (fs.existsSync(secretFile)) {
        return fs.readFileSync(secretFile, "utf8").trim();
    }

    fs.mkdirSync(DATA_DIR, { recursive: true });
    const secret = crypto.randomBytes(48).toString("hex");
    fs.writeFileSync(secretFile, secret, { mode: 0o600 });
    return secret;
}

module.exports = {
    PORT: Number(process.env.PORT) || 3001,

    CORS_ORIGIN: (process.env.CORS_ORIGIN || "http://localhost:4200").split(",").map((origin) => origin.trim()),
    DATA_DIR,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
    BCRYPT_ROUNDS: 10,

    ENABLE_SOCIAL_DEMO: process.env.ENABLE_SOCIAL_DEMO ? process.env.ENABLE_SOCIAL_DEMO === "true" : !IS_PRODUCTION,

    getJwtSecret: loadJwtSecret
};
