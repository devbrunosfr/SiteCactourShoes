# SENSO Angular

Conversão do site SENSO — Plataforma Inteligente de Calçados para Angular standalone.

## Stack

- Angular 19
- TypeScript
- Componentes standalone
- CSS responsivo sem dependências de UI externas
- Imagens autorais locais em `src/assets`

## Executar em desenvolvimento

```bash
npm install
npm start
```

Abra `http://localhost:4200`.

## Gerar build de produção

```bash
npm run build
```

O resultado estará em `dist/senso-angular/`.

## Estrutura

- `src/app/app.component.ts`: estado e interações da interface.
- `src/app/app.component.html`: template completo do site.
- `src/app/app.component.css`: estilos do componente e responsividade.
- `src/styles.css`: estilos globais.
- `src/assets/`: imagens do hero, guarda-roupa e produto recomendado.
- `dist/senso-angular/`: versão compilada para publicação.

A conversão preserva o MVP visual do projeto original: Meu Guarda-Roupa, leitura de estilo, modelagens, recomendação pessoal, radar de preço, custo por uso e ferramentas de comparação.

## Login e cadastro (API)

O login funciona com uma API própria na pasta `server/` (Node.js + Express). Ela guarda os usuários em `server/data/users.json`, salva a senha com hash (`bcryptjs`) e devolve um token JWT.

### Como rodar (dois terminais)

```bash
# Terminal 1 — API (http://localhost:3001)
npm run api:install   # só na primeira vez
npm run api

# Terminal 2 — site Angular (http://localhost:4200)
npm install           # só na primeira vez
npm start
```

### Rotas da API

| Método | Rota | O que faz |
| --- | --- | --- |
| POST | `/api/auth/register` | Cria a conta (`nome`, `email`, `senha`) e já devolve o token |
| POST | `/api/auth/login` | Entra com `email` e `senha` e devolve o token |
| GET | `/api/auth/me` | Devolve o usuário logado (exige `Authorization: Bearer <token>`) |

### Configuração (variáveis de ambiente, todas opcionais em desenvolvimento)

- `PORT`: porta da API (padrão `3001`; se mudar, ajuste `src/app/config.ts`).
- `CORS_ORIGIN`: endereço do Angular autorizado (padrão `http://localhost:4200`).
- `JWT_SECRET`: segredo dos tokens. Em desenvolvimento é gerado sozinho em `server/data/.jwt-secret`; **em produção é obrigatório**.
- `JWT_EXPIRES_IN`: validade do token (padrão `7d`).

### No Angular

- `src/app/auth/auth.service.ts`: login, cadastro, logout e sessão salva no navegador.
- `src/app/auth/auth.interceptor.ts`: envia o token nas chamadas à API.
- `src/app/auth/auth.guard.ts`: `authGuard`, para proteger rotas com `canActivate: [authGuard]`.
- `src/app/pages/login/`: página `/entrar` (entrar e criar conta).

Testes da API: `cd server && npm test`.
