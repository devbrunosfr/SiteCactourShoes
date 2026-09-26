const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3333;
const JWT_SECRET = process.env.JWT_SECRET || 'navycare-development-secret-change-me';

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const users = [
  { id: 'usr_001', name: 'Jailson', email: 'jailson@senai.com', role: 'Administrador', passwordHash: bcrypt.hashSync('senai123', 10) },
];

function tokenFor(user) {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
}

function auth(req, res, next) {
  const value = req.headers.authorization || '';
  const token = value.startsWith('Bearer ') ? value.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Token de acesso não informado.' });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { return res.status(401).json({ message: 'Sessão expirada. Entre novamente.' }); }
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'navycare-api', timestamp: new Date().toISOString() }));

app.post('/api/auth/login', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!email || !password) return res.status(400).json({ message: 'Informe e-mail e senha.' });
  const user = users.find((item) => item.email === email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
  const { passwordHash, ...safeUser } = user;
  res.json({ token: tokenFor(user), user: safeUser, expiresIn: 28800 });
});

app.get('/api/auth/me', auth, (req, res) => {
  const user = users.find((item) => item.id === req.user.sub);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });
  const { passwordHash, ...safeUser } = user;
  res.json({ user: safeUser });
});

app.post('/api/auth/logout', auth, (_req, res) => res.json({ success: true }));

app.get('/api/dashboard', auth, (_req, res) => res.json({
  kpis: { assets: 10, upcoming: 3, openOrders: 2, monthlyCost: 1280 },
  alert: { asset: 'Ar-condicionado #03', days: 12, location: 'Sala de reunião' },
  assets: { airConditioners: 4, computers: 3, printers: 2, generator: 1 },
}));

app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ message: 'Erro interno do servidor.' }); });
app.listen(PORT, '0.0.0.0', () => console.log(`NavyCare API running on http://localhost:${PORT}`));
