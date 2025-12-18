# Guia do Usuário — DTTools (Design Thinking Tools)

## 1. Visão geral

O **DTTools** é uma plataforma web para conduzir projetos usando:

- **Design Thinking (5 fases)**: Empatizar → Definir → Idear → Prototipar → Testar
- **Double Diamond**: Descobrir → Definir → Desenvolver → Entregar

Além do fluxo guiado, a plataforma oferece:

- **Central de Ajuda** em `/help` (artigos pesquisáveis)
- **Biblioteca** de conteúdos e recursos
- **Exportações** (formatos variam por plano/add-on)
- **Recursos com IA (Google Gemini)** em funcionalidades específicas

## 2. Acesso e login

1. Acesse o sistema e clique em **Entrar**.
2. Faça login com email/senha (ou outros métodos, se habilitados no ambiente).
3. Após autenticar, você será direcionado ao **Dashboard**.

Se você ainda não tem conta:

1. Clique em **Criar conta**.
2. Preencha os dados solicitados.
3. Em alguns cenários, pode existir a etapa de **completar perfil**.

## 3. Conceitos importantes

- **Projeto**: unidade principal de trabalho (tudo fica organizado por projeto).
- **Fase atual**: indica em qual etapa você está e o que falta para avançar.
- **Entregáveis**: artefatos produzidos nas ferramentas (personas, entrevistas, ideias, protótipos, planos de teste etc.).

## 4. Criar um projeto (Design Thinking — 5 fases)

1. Vá em **Projetos**.
2. Clique em **Criar novo projeto**.
3. Defina um **nome** e uma **descrição**.
4. A partir do projeto, navegue pelas fases do Design Thinking.

### 4.1 Fase 1 — Empatizar

Objetivo: entender profundamente o usuário e o contexto.

Ferramentas comuns nesta fase:

- **Mapa de Empatia**: registre o que o usuário diz, pensa, faz e sente.
- **Personas**: descreva perfis representativos do público-alvo.
- **Entrevistas**: documente perguntas, respostas e insights.
- **Observações**: registre comportamentos observados em campo.

Boa prática: ao final, consolide os aprendizados como base para a fase Definir.

### 4.2 Fase 2 — Definir

Objetivo: transformar pesquisa em um problema claro e acionável.

Ferramentas comuns:

- **POV (Point of View)**: declaração estruturada (usuário + necessidade + insight).
- **HMW (How Might We / Como poderíamos...)**: perguntas que abrem espaço para soluções.

Boa prática: crie mais de uma HMW para o mesmo POV, variando o escopo.

### 4.3 Fase 3 — Idear

Objetivo: gerar muitas soluções e começar a priorizá-las.

Ferramentas comuns:

- **Ideias / Brainstorm**: registre propostas sem “censura” inicial.
- **Priorização (DVF/DFV)**: avalie Desejabilidade, Viabilidade e Exequibilidade/Feasibility.

Boa prática: use critérios definidos na fase anterior para guiar a priorização.

### 4.4 Fase 4 — Prototipar

Objetivo: tornar ideias tangíveis rapidamente.

Ferramentas comuns:

- **Protótipos**: documente versões e aprendizados.
- Quando disponível, use recursos visuais/canvas para rascunhos.

Boa prática: protótipo não é “produto final”; foque em aprender rápido.

### 4.5 Fase 5 — Testar

Objetivo: validar com usuários reais e decidir próximos passos.

Ferramentas comuns:

- **Plano de Teste**: objetivo, metodologia, participantes, tarefas e métricas.
- **Resultados de Teste**: feedback, insights e decisões de iteração.

Boa prática: registre o que você vai mudar (e por quê) antes de voltar para fases anteriores.

## 5. Criar um projeto (Double Diamond)

O fluxo **Double Diamond** é focado em:

- explorar o problema (divergir)
- definir o foco (convergir)
- explorar soluções (divergir)
- entregar e validar (convergir)

Em muitos ambientes, o Double Diamond pode ter funcionalidades com **IA** para apoiar geração/estruturação (dependendo do plano/add-ons).

Caminhos comuns:

1. Acesse **Double Diamond**.
2. Crie um novo projeto.
3. Preencha o contexto do desafio (problema, público, setor/vertical etc.).
4. Avance pelas etapas do framework e revise os entregáveis gerados.

## 6. Biblioteca

A **Biblioteca** reúne conteúdos de referência.

- Use a busca e filtros para encontrar artigos.
- Abra um artigo e navegue pelos detalhes.

Observação: o acesso a parte do conteúdo pode variar por plano/add-on.

## 7. Central de Ajuda (Manual dentro do app)

Acesse `/help` (ou `/ajuda`) para:

- pesquisar artigos
- abrir artigos por categoria
- marcar um artigo como **Útil**

Categorias comuns:

- **Início Rápido**
- **Fases do DT**
- **Colaboração**
- **Exportação**

Se você é admin, existe também um CRUD de artigos de ajuda via API (rotas administrativas) — útil para manter o manual atualizado dentro do próprio produto.

## 8. Exportação de projetos

Os formatos disponíveis podem variar por plano/add-on. Em geral, você pode encontrar opções de exportação dentro do projeto.

- **PDF**: para compartilhar com stakeholders.
- **PPTX**: apresentações.
- **Markdown/CSV/PNG**: quando habilitado.

Se uma exportação estiver bloqueada, isso normalmente indica limitação do plano ou necessidade de um add-on.

## 9. Colaboração (quando habilitada)

Quando habilitada no plano/add-on, você pode:

- convidar membros
- definir permissões (ex.: owner/editor/viewer)
- trabalhar com histórico e compartilhamento

## 10. Dicas de uso

- Mantenha o projeto com **descrição clara**: melhora organização e suporte de IA.
- Complete uma fase antes de “pular”: a qualidade dos próximos artefatos melhora.
- Use a Central de Ajuda como checklist do que preencher em cada etapa.

## 11. Solução de problemas (Troubleshooting)

### 11.1 Não consigo logar

- Verifique email/senha.
- Tente redefinir senha (se a funcionalidade estiver habilitada).
- Confirme se cookies/sessão não estão bloqueados no browser.

### 11.2 Recursos de IA não funcionam

- Em ambiente de desenvolvimento, confirme se a variável `GEMINI_API_KEY` está configurada.
- Em produção, verifique limites do plano/add-ons (quando aplicável).

### 11.3 Pagamentos/assinatura não aparecem

- Algumas rotas de pagamento dependem de configuração do **Stripe** (`STRIPE_SECRET_KEY`).
- Se o Stripe não estiver configurado no ambiente, funcionalidades de pagamento podem ficar desativadas.

## 12. Suporte

- Use a **Central de Ajuda** (`/help`).
- Em caso de erro recorrente, registre:
  - qual página/fluxo você estava usando
  - prints do erro
  - data/hora aproximada

---

Este guia é uma base. Se você quiser, eu também posso:

- transformar as seções acima em artigos dentro da **Central de Ajuda** (conteúdo “in-app”)
- adaptar o manual para o posicionamento do produto (marketing) e para o plano atual de preços/add-ons
