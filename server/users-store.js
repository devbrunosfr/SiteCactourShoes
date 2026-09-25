const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const config = require("./config");

const USERS_FILE = path.join(config.DATA_DIR, "users.json");

function readAll() {
    if (!fs.existsSync(USERS_FILE)) {
        fs.mkdirSync(config.DATA_DIR, { recursive: true });
        fs.writeFileSync(USERS_FILE, "[]");
    }

    return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
}

function writeAll(users) {

    const tempFile = `${USERS_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(users, null, 2));
    fs.renameSync(tempFile, USERS_FILE);
}

function findByEmail(email) {
    return readAll().find((user) => user.email === email) || null;
}

function findById(id) {
    return readAll().find((user) => user.id === id) || null;
}

function create({ nome, email, senhaHash, provider = "email", acceptedTermsAt = new Date().toISOString() }) {
    const users = readAll();

    if (users.some((user) => user.email === email)) {
        const error = new Error("E-mail já cadastrado");
        error.code = "EMAIL_IN_USE";
        throw error;
    }

    const user = {
        id: crypto.randomUUID(),
        nome,
        email,
        // Contas de login social não têm senha.
        ...(senhaHash ? { senhaHash } : {}),
        provider,
        acceptedTermsAt,
        criadoEm: new Date().toISOString()
    };

    users.push(user);
    writeAll(users);
    return user;
}

function toPublic(user) {
    return { id: user.id, nome: user.nome, email: user.email };
}

module.exports = { findByEmail, findById, create, toPublic };

