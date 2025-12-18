# DTTools - Design Thinking Tools

[![Deploy Status](https://img.shields.io/badge/deploy-active-brightgreen)](https://www.designthinkingtools.com)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)]()
[![License](https://img.shields.io/badge/license-proprietary-red)]()

**Plataforma SaaS de Design Thinking** que guia usuários pelas 5 fases do processo e pelo **Double Diamond**, com ferramentas específicas, **IA com Google Gemini** e sistema de progresso.

🌐 **Site:** [https://www.designthinkingtools.com](https://www.designthinkingtools.com)

---

## 📋 Visão Geral

DTTools digitaliza completamente o processo de Design Thinking, oferecendo:

- ✅ **5 Fases Estruturadas**: Empatizar, Definir, Idear, Prototipar, Testar
- 💎 **Double Diamond**: Descobrir, Definir, Desenvolver, Entregar (com geração guiada)
- 🤖 **IA Integrada (Google Gemini)**: geração assistida, sugestões e automações (dependendo do plano/limites)
- 🎮 **Gamificação**: Sistema de badges, pontos e progresso visual
- 📊 **Benchmarking**: Compare sua evolução com o mercado
- 📤 **Exportação**: PDF, PowerPoint e Markdown com templates profissionais
- 👥 **Colaboração**: Workspace compartilhado em tempo real

---

## 🚀 Tecnologias

### Frontend
- **React 18** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **TanStack Query** para state management
- **Wouter** para roteamento
- **Vite** para build

### Backend
- **Express.js** + **TypeScript**
- **PostgreSQL** com **Drizzle ORM**
- **Render.com** para deploy
- Sessões com **express-session**

### Integrações
- **Google Gemini** para recursos de IA
- **Stripe** para pagamentos (quando configurado)

---

## 📂 Estrutura do Projeto

```
dttools-app/
├── client/              # Frontend React
│   ├── src/
│   │   ├── pages/      # Páginas da aplicação
│   │   ├── components/ # Componentes reutilizáveis
│   │   └── lib/        # Utilitários
├── server/              # Backend Express
│   ├── routes.ts       # Rotas da API
│   ├── storage.ts      # Camada de dados
│   └── index.ts        # Servidor principal
├── shared/              # Código compartilhado
│   └── schema.ts       # Schemas do banco de dados
├── docs/                # 📚 Documentação Técnica
├── marketing/           # 📢 Material de Marketing
├── wireframes/          # 🎨 Wireframes e Design
└── build.js            # Build de produção
```

---

## 📚 Documentação

### 📖 Documentação Técnica
Localizada em [`docs/`](./docs/):

- **[DOCUMENTACAO_TECNICA_COMPLETA.md](./docs/DOCUMENTACAO_TECNICA_COMPLETA.md)** - Arquitetura completa do sistema (4.080 linhas)
- **[guia-usuario.md](./docs/guia-usuario.md)** - Manual de uso (Guia do usuário)
- **[O_QUE_E_DTTOOLS.md](./docs/O_QUE_E_DTTOOLS.md)** - Visão geral detalhada do produto
- **[BENCHMARK_DTTOOLS.md](./docs/BENCHMARK_DTTOOLS.md)** - Notas e referências de benchmarking
- **[dttools_pitch_deck.md](./docs/dttools_pitch_deck.md)** - Apresentação
- **[RENDER_DEPLOY.md](./docs/RENDER_DEPLOY.md)** - Guia de deploy no Render

### 📢 Material de Marketing
Localizado em [`marketing/`](./marketing/):

#### Redes Sociais
- **[Instagram](./marketing/redes-sociais/instagram.md)** - Posts e stories para Instagram
- **[LinkedIn](./marketing/redes-sociais/linkedin.md)** - Conteúdo profissional
- **[Facebook](./marketing/redes-sociais/facebook.md)** - Posts para Facebook

#### App Stores
- **[Apple App Store](./marketing/app-stores/app-store-apple.md)** - Listing completo
- **[Google Play Store](./marketing/app-stores/app-store-google.md)** - Listing completo

#### Lançamento
- **[Calendário](./marketing/lancamento/calendario.md)** - Cronograma de lançamento
- **[Checklist](./marketing/lancamento/checklist.md)** - Checklist completo de Go-to-Market
- **[Roteiro de Apresentação](./marketing/lancamento/roteiro-apresentacao.md)** - Script para pitch

#### Sumário
- **[README Marketing](./marketing/README.md)** - Pacote completo de marketing 2025

---

## 🛠️ Instalação e Desenvolvimento

### Pré-requisitos
- Node.js 20+
- PostgreSQL
- Conta no Render.com (para deploy)

### Setup Local

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/dttools-app.git
cd dttools-app

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# Execute as migrações do banco
npm run db:push

# Inicie o servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em `http://localhost:5000`

### Build de Produção

```bash
# Build completo (frontend + backend)
npm run build

# Inicia o servidor de produção
npm start
```

---

## 🌐 Deploy

O projeto está configurado para deploy automático no **Render.com**:

1. Push para a branch `main` no GitHub
2. Render detecta automaticamente e faz o build
3. Deploy automático em produção

**URL de Produção:** https://www.designthinkingtools.com

Consulte [`docs/RENDER_DEPLOY.md`](./docs/RENDER_DEPLOY.md) para mais detalhes.

---

## 💰 Planos de Assinatura

Os planos, limites e add-ons podem variar ao longo do tempo.

Consulte a página **/pricing** dentro do app para ver valores e o que está incluído em cada plano.

---

## 🎨 Wireframes e Design

Os wireframes SVG estão disponíveis em [`wireframes/`](./wireframes/):

- [Dashboard](./wireframes/dashboard.svg)
- [Mapa de Empatia](./wireframes/empathy-map.svg)
- [Canvas de Ideação](./wireframes/ideation-canvas.svg)
- [Canvas de Prototipagem](./wireframes/prototype-canvas.svg)
- [Benchmarking](./wireframes/benchmarking.svg)

---

## 📄 Licença

Este projeto é **propriedade privada** da DTTools. Todos os direitos reservados.

**Contato:** dttools.app@gmail.com

---

## 🤝 Contribuindo

Este é um projeto privado. Para reportar bugs ou sugerir melhorias:

1. Envie um email para dttools.app@gmail.com
2. Ou abra um ticket no sistema de suporte

---

## 📞 Suporte

- **Email:** dttools.app@gmail.com
- **Site:** https://www.designthinkingtools.com
- **Documentação:** https://www.designthinkingtools.com/help

---

**Feito com ❤️ para revolucionar o Design Thinking** 🚀
