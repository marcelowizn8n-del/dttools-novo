# DTTools — Sistema e Manual de Uso

## 1. Visão geral

O **DTTools (Design Thinking Tools)** é uma plataforma **SaaS** que guia usuários pelas **5 fases do Design Thinking** e também oferece o fluxo **Double Diamond** com automações por IA. O sistema combina:

- **Frontend** em React + TypeScript (Vite)
- **Backend** em Express + TypeScript
- **Banco** PostgreSQL via Drizzle ORM
- **Autenticação** por sessão (express-session) e OAuth Google (opcional)
- **Integrações**: Gemini (IA), Stripe (pagamentos) e outros componentes internos

### Principais objetivos do sistema

- Estruturar e acelerar projetos de Design Thinking (do discovery até teste)
- Gerar e organizar artefatos (mapa de empatia, personas, HMW, ideias etc.)
- Automatizar análises e geração de conteúdo com IA
- Permitir exportação profissional (PPTX, PDF, Markdown)
- Controlar acesso por plano/limites e habilitar colaboração

---

## 2. Stack e arquitetura

### Frontend

- **React 18** + **TypeScript**
- **Vite** (dev/build)
- **Wouter** (roteamento)
- **TanStack Query** (server-state)
- **Tailwind CSS** + **shadcn/ui** (UI)

### Backend

- **Express.js** + **TypeScript**
- **PostgreSQL** + **Drizzle ORM**
- **Sessions**: `express-session` com store em **PostgreSQL** em produção (fallback para MemoryStore em dev)
- **Rate limiting** para APIs (inclui limite mais restrito para auth)

### Ambientes

- **Dev**: Vite integrado ao servidor (`npm run dev`)
- **Prod**: serve arquivos estáticos do build do frontend (`client/dist`) e inicia backend compilado em `dist/index.js`

Entrypoints:

- Backend: `server/index.ts`
- Rotas: `server/routes.ts`
- Frontend: `client/src/main.tsx` e `client/src/App.tsx`

---

## 3. Rotas/telas principais (navegação)

Rotas do frontend (Wouter) relevantes:

- `/` — landing (deslogado) ou dashboard (logado)
- `/login` — login
- `/signup` — cadastro
- `/dashboard` — painel do usuário
- `/projects` — lista de projetos
- `/projects/:id` — detalhe do projeto (Design Thinking)
- `/projects/:id/journey` — mapa de jornada
- `/chat` — chat/mentor IA
- `/benchmarking` — benchmarking
- `/library` e `/library/article/:id` — biblioteca de artigos
- `/video-tutorials` — vídeos tutoriais
- `/double-diamond` e `/double-diamond/:id` — fluxo Double Diamond
- `/addons` — add-ons
- `/pricing` — planos/preços

Admin:

- `/admin`
- `/admin/sectors`
- `/admin/cases`
- `/admin/analytics`

---

## 4. Funcionalidades (o que o sistema faz)

### 4.1. Projetos (Design Thinking — 5 fases)

Conjunto de ferramentas por fase (alto nível):

- **Empatizar**
  - Mapa de empatia
  - Personas
  - Entrevistas
  - Observações
  - Jornada do usuário

- **Definir**
  - POV statements
  - HMW questions

- **Idear**
  - Ideias
  - Avaliações/score (ex.: DVF)

- **Prototipar**
  - Protótipos

- **Testar**
  - Planos de teste
  - Resultados de teste

Além disso, há endpoint otimizado para buscar tudo do projeto em uma requisição:

- `GET /api/projects/:id/full`

### 4.2. IA (Geração e análise)

O backend expõe rotas de IA para geração de conteúdo e análises.

Exemplo:

- `POST /api/ai/generate-project` — geração de projeto/MVP via IA (sujeito a limites por plano)

Há também serviços de IA para:

- Analisar fases/progresso
- Geração de entregáveis e recomendações
- Tradução automática de conteúdo (via Gemini)

### 4.3. Double Diamond + BPMN (com add-on)

O sistema possui um fluxo “Double Diamond” com endpoints dedicados:

- `GET /api/double-diamond` — lista projetos
- `GET /api/double-diamond/:id` — detalhe
- `POST /api/double-diamond` — cria (com limites)
- `PATCH /api/double-diamond/:id` — atualiza
- `DELETE /api/double-diamond/:id` — remove

Funcionalidades BPMN (exigem add-on **Double Diamond Pro**):

- `GET /api/double-diamond/:id/bpmn-diagrams`
- `PUT /api/bpmn-diagrams/:id`
- `DELETE /api/bpmn-diagrams/:id`
- `POST /api/bpmn-diagrams/:id/analyze` — análise por IA
- `POST /api/double-diamond/:id/generate/hmw-from-bpmn` — gera HMW com base na análise

### 4.4. Exportação (PPTX, PDF, Markdown)

Endpoints de export (geração server-side):

- `GET /api/projects/:id/export-pptx`
- `GET /api/projects/:id/export-pdf`
- `GET /api/projects/:id/export-markdown`

### 4.5. Pagamentos e assinaturas (Stripe)

Integração Stripe:

- Webhook (assina e processa eventos): `POST /api/stripe-webhook`
- Cancelamento: `POST /api/cancel-subscription`

Add-ons:

- `POST /api/addons/create-checkout-session`
- `POST /api/addons/cancel-subscription`

### 4.6. Autenticação e conta

- Login: `POST /api/auth/login`
- Signup: `POST /api/auth/signup`
- Logout: `POST /api/auth/logout`
- Sessão atual: `GET /api/auth/me` (também usado como **healthcheck** no Render)

OAuth Google (opcional):

- `GET /api/auth/google`
- `GET /api/auth/google/callback`

### 4.7. Healthcheck

- `GET /api/health` — verifica saúde da aplicação e conexão com o banco

---

## 5. Variáveis de ambiente (configuração)

### Obrigatórias (para rodar com banco)

- `DATABASE_URL` — string de conexão Postgres
- `SESSION_SECRET` — segredo das sessões

### Servidor

- `NODE_ENV` — `development` ou `production`
- `PORT` — porta do servidor (local padrão: `5000`; Render: `10000`)
- `FRONTEND_URL` — allowlist extra para CORS (lista separada por vírgula)
- `RENDER` — quando `true`, sinaliza ambiente do Render (usado para pular migrações)

### IA (Gemini)

- `GEMINI_API_KEY` — chave Gemini Developer API

### Stripe

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Price IDs de add-ons (opcionais, conforme monetização):

- `STRIPE_PRICE_ADDON_DOUBLE_DIAMOND_PRO_MONTHLY`
- `STRIPE_PRICE_ADDON_DOUBLE_DIAMOND_PRO_YEARLY`
- `STRIPE_PRICE_ADDON_EXPORT_PRO_MONTHLY`
- `STRIPE_PRICE_ADDON_EXPORT_PRO_YEARLY`
- `STRIPE_PRICE_ADDON_AI_TURBO_MONTHLY`
- `STRIPE_PRICE_ADDON_AI_TURBO_YEARLY`
- `STRIPE_PRICE_ADDON_COLLAB_ADVANCED_MONTHLY`
- `STRIPE_PRICE_ADDON_COLLAB_ADVANCED_YEARLY`
- `STRIPE_PRICE_ADDON_LIBRARY_PREMIUM_MONTHLY`
- `STRIPE_PRICE_ADDON_LIBRARY_PREMIUM_YEARLY`

### Google OAuth

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL` (opcional; padrão: `/api/auth/google/callback`)

### Frontend

No frontend, é utilizado `import.meta.env` (ex.: `import.meta.env.PROD`). O `package.json` sugere uma variável `VITE_API_URL` (para apontar o frontend para o backend em ambientes separados), porém o uso direto não apareceu nos arquivos analisados.

---

## 6. Manual de uso (usuário final)

### 6.1. Acessar e criar conta

- Acesse o site (produção): `https://www.designthinkingtools.com`
- Clique em **Entrar** (`/login`) ou **Criar conta** (`/signup`)
- Após login, você será direcionado ao **Dashboard** (`/dashboard`)

### 6.2. Criar um projeto (Design Thinking)

- Vá em **Projects** (`/projects`)
- Clique em **Novo projeto**
- Preencha nome/descrição
- Use o **navegador de fases** para ir preenchendo os artefatos:
  - Empatia → Definição → Ideação → Protótipo → Teste

### 6.3. Usar o Chat/mentor de IA

- Abra `/chat`
- Informe contexto do projeto e peça sugestões orientadas à fase atual

### 6.4. Exportar entregáveis

No detalhe do projeto, utilize as ações de exportação (dependendo do plano/configuração):

- PPTX
- PDF
- Markdown

### 6.5. Double Diamond

- Acesse `/double-diamond`
- Crie um projeto Double Diamond
- Execute o fluxo por etapas (Descobrir/Definir/Desenvolver/Entregar)

Se a funcionalidade BPMN estiver habilitada pelo plano/add-on:

- Crie/edite diagramas
- Rode a análise por IA
- Gere HMW a partir da análise

### 6.6. Benchmarking

- Acesse `/benchmarking`
- Preencha avaliações/métricas
- Use recomendações geradas para orientar próximos passos

### 6.7. Biblioteca e tutoriais

- Biblioteca de artigos: `/library`
- Vídeos tutoriais: `/video-tutorials`

---

## 7. Manual de uso (desenvolvimento local)

### 7.1. Pré-requisitos

- **Node.js 20+**
- **npm**
- **PostgreSQL** acessível (local ou remoto)

Observação importante do ambiente atual:

- No ambiente onde foi feita esta verificação, o comando `npm` **não está disponível** (`zsh: command not found: npm`). Portanto, não foi possível rodar `npm run check/build` aqui.

### 7.2. Configuração

- Copie `.env.example` para `.env`
- Configure pelo menos:
  - `DATABASE_URL`
  - `SESSION_SECRET`
  - `GEMINI_API_KEY` (se for usar IA)

### 7.3. Rodar em desenvolvimento

- `npm install`
- `npm run db:push` (aplica schema via Drizzle)
- `npm run dev`

A aplicação sobe por padrão em:

- `http://localhost:5000`

### 7.4. Checagens recomendadas

- Typecheck: `npm run check`
- Build: `npm run build`
- Produção local: `npm start`

---

## 8. Deploy (Render)

O projeto está configurado para Render via `render.yaml`:

- Build: `npm install && npm run build`
- Start: `npm start`
- Healthcheck: `/api/auth/me`

Checklist de deploy (alto nível):

- `NODE_ENV=production`
- `DATABASE_URL` apontando para o Postgres do Render
- `SESSION_SECRET` configurado/gerado
- (opcional) `GEMINI_API_KEY`
- (opcional) `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET`

---

## 9. Verificação: “o sistema está funcionando?”

### 9.1. O que foi possível verificar por leitura de código

- **Entrypoint do servidor** está configurado para dev (Vite) vs prod (serve `client/dist`)
- Existe **healthcheck** (`/api/health`) e healthcheck do Render (`/api/auth/me`)
- Integração Stripe inclui **webhook com raw body** (necessário para verificação de assinatura)
- Existem endpoints de export (PPTX/PDF/Markdown)
- Existem rotas e middlewares de limite/assinatura para recursos pagos/add-ons

### 9.2. O que não foi possível validar automaticamente neste ambiente

- `npm run check` / `npm run build` não rodaram por falta de `npm` no PATH

### 9.3. Como você valida rapidamente no seu Mac

1. Instale Node 20+ (por exemplo via `nvm` ou instalador oficial)
2. No diretório do projeto:
   - `npm install`
   - `cp .env.example .env` (ajuste variáveis)
   - `npm run db:push`
   - `npm run dev`
3. Teste no navegador:
   - `http://localhost:5000`
4. Teste APIs:
   - `GET http://localhost:5000/api/health`

---

## 10. Troubleshooting rápido

- **Erro: `SESSION_SECRET environment variable is required`**
  - Defina `SESSION_SECRET` no `.env`

- **Erro: `DATABASE_URL must be set`**
  - Configure `DATABASE_URL` no `.env`

- **Problema em produção (Render) com crash loop**
  - Faça **Clear build cache & deploy** no Render
  - Confirme `NODE_ENV=production` e `DATABASE_URL`

- **Stripe não funciona**
  - Sem `STRIPE_SECRET_KEY`, o sistema desabilita recursos de pagamento
  - Confira `STRIPE_WEBHOOK_SECRET` e eventos do webhook
