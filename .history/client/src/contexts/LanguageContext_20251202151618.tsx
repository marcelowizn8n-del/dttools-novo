import { createContext, useContext, useState, useEffect } from "react";

export type Language = "pt-BR" | "en" | "es" | "fr" | "de" | "zh";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  convertPrice: (originalPriceInCents: number) => { price: number; symbol: string; formattedPrice: string };
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Locale mapping for Intl.NumberFormat
const LOCALE_MAP = {
  "pt-BR": "pt-BR",
  "en": "en-US",
  "es": "es-ES", 
  "fr": "fr-FR",
  "de": "de-DE",
  "zh": "zh-CN",
};

// Currency codes for each locale
const CURRENCY_CODES = {
  "pt-BR": "BRL",
  "en": "USD",
  "es": "USD",
  "fr": "EUR",
  "de": "EUR",
  "zh": "CNY",
};

// Translation dictionaries
const translations = {
  "pt-BR": {
    // Navigation
    "nav.projects": "Projetos",
    "nav.library": "Biblioteca",
    "nav.addons": "Ferramentas adicionais",
    "nav.pricing": "Planos",
    "nav.admin": "Admin",
    "nav.logout": "Sair",
    "nav.login": "Entrar",
    
    // Dashboard
    "dashboard.start.project": "Iniciar Projeto Completo",
    "dashboard.explore.phases": "Explorar Fases",
    "dashboard.hero.title": "Design Thinking Tools",
    "dashboard.hero.subtitle": "Uma plataforma interativa e abrangente para guiar designers, equipes de inovação e profissionais criativos pelas etapas do Design Thinking.",
    "dashboard.your.progress": "Seu Progresso",
    "dashboard.beginner": "Iniciante",
    "dashboard.points": "Pontos",
    "dashboard.badges": "Badges", 
    "dashboard.phases": "Fases",
    "dashboard.session": "Sessão",
    "dashboard.progress.by.phase": "Progresso por Fase",
    "dashboard.recent.activity": "Atividade Recente",
    "dashboard.no.activity": "Nenhuma atividade recente. Comece explorando as fases!",
    "dashboard.next.steps": "Próximos Passos Sugeridos",
    "dashboard.5.phases.title": "As 5 Fases do Design Thinking",
    "dashboard.5.phases.subtitle": "Explore cada fase do processo e desenvolva soluções centradas no usuário.",
    "dashboard.why.platform": "Por que usar nossa plataforma?",
    "dashboard.ready.start": "Pronto para começar sua jornada?",
    "dashboard.ready.subtitle": "Transforme problemas complexos em soluções inovadoras com o Design Thinking.",
    "dashboard.start.now": "Começar Agora",
    "dashboard.welcome.title": "Bem-vindo, {name}",
    "dashboard.welcome.title.generic": "Bem-vindo",
    "dashboard.welcome.intro": "O DTTools é sua plataforma de Design Thinking assistida por IA. Vamos te guiar passo a passo na criação de soluções inovadoras para seus problemas de negócio.",
    "dashboard.welcome.section.what.title": "O que você vai fazer:",
    "dashboard.welcome.section.what.text": "Criar projetos de Design Thinking completos, seguindo as 5 fases do processo (Empatizar, Definir, Idear, Prototipar, Testar)",
    "dashboard.welcome.section.how.title": "Como a IA te ajuda:",
    "dashboard.welcome.section.how.text": "Em cada etapa, você receberá orientações, exemplos práticos e insights gerados por IA para facilitar seu trabalho",
    "dashboard.welcome.section.gain.title": "O que você vai ganhar:",
    "dashboard.welcome.section.gain.text": "Soluções validadas, insights sobre seus usuários, ideias priorizadas e protótipos testáveis – tudo organizado e documentado",
    "dashboard.welcome.tip": "Não sabe por onde começar? Use nossa ferramenta de Geração Automática de MVP acima. Em 5-10 minutos, a IA cria um projeto completo para você explorar e aprender!",
    "dashboard.welcome.dismiss": "Entendi, não mostrar novamente",
    
    // Phases
    "phases.empathize": "Empatizar",
    "phases.define": "Definir", 
    "phases.ideate": "Idear",
    "phases.prototype": "Prototipar",
    "phases.test": "Testar",
    "phases.empathize.desc": "Compreenda profundamente seus usuários",
    "phases.define.desc": "Sintetize informações e identifique problemas",
    "phases.ideate.desc": "Gere soluções criativas e inovadoras",
    "phases.prototype.desc": "Torne suas ideias tangíveis",
    "phases.test.desc": "Valide soluções com usuários reais",
    
    // Benefits
    "benefits.human.centered": "Centrado no Ser Humano",
    "benefits.human.centered.desc": "Coloque as necessidades e experiências dos usuários no centro do processo de design.",
    "benefits.iterative.process": "Processo Iterativo",
    "benefits.iterative.process.desc": "Refine suas soluções através de ciclos contínuos de teste e aprendizado.",
    "benefits.collaborative": "Colaborativo",
    "benefits.collaborative.desc": "Trabalhe em equipe e combine diferentes perspectivas para soluções mais ricas.",
    
    // Next Steps
    "next.step.1": "Comece pela fase Empatizar para entender seus usuários", 
    "next.step.2": "Explore as ferramentas adicionais no menu Ferramentas",
    "next.step.3": "Complete mais ações para conquistar novos badges",

    // Add-ons
    "addons.header.title": "Ferramentas adicionais",
    "addons.header.subtitle": "Veja quais add-ons estão ativos na sua conta e como eles ampliam os recursos do seu plano.",
    "addons.currentPlan.title": "Seu plano atual",
    "addons.currentPlan.loading": "Carregando informações do plano...",
    "addons.currentPlan.freeSuffix": "(Gratuito)",
    "addons.status.active": "Ativo",
    "addons.status.inactive": "Não ativo",
    "addons.button.activate": "Ativar via Stripe",
    "addons.button.cancel": "Cancelar add-on",
    "addons.button.canceling": "Cancelando...",
    "addons.toast.checkout.error.title": "Erro ao iniciar checkout",
    "addons.toast.checkout.error.description": "Tente novamente em alguns instantes.",
    "addons.toast.checkout.missingConfig.title": "Não foi possível iniciar o checkout",
    "addons.toast.checkout.missingConfig.description": "Verifique a configuração de pagamento do add-on.",
    "addons.toast.cancel.success.title": "Cancelamento solicitado",
    "addons.toast.cancel.success.description.default": "O add-on será cancelado ao final do período atual de cobrança.",
    "addons.toast.cancel.error.title": "Erro ao cancelar add-on",
    "addons.toast.cancel.error.description": "Tente novamente em alguns instantes.",

    "addons.item.doubleDiamondPro.title": "Double Diamond Pro",
    "addons.item.doubleDiamondPro.description": "Projetos Double Diamond ilimitados e exportações liberadas para o sistema principal.",
    "addons.item.exportPro.title": "Export Pro",
    "addons.item.exportPro.description": "Libera exportação em PDF, PNG e CSV para seus projetos.",
    "addons.item.aiTurbo.title": "IA Turbo",
    "addons.item.aiTurbo.description": "+300 mensagens de IA por mês, além do limite do seu plano.",
    "addons.item.collabAdvanced.title": "Colaboração Avançada",
    "addons.item.collabAdvanced.description": "Colaboração em tempo real, comentários, feedbacks e workspace compartilhado.",
    "addons.item.libraryPremium.title": "Biblioteca Premium",
    "addons.item.libraryPremium.description": "Acesso completo à biblioteca de artigos, vídeos e materiais premium.",
    
    // Landing Page
    "landing.future": "🚀 O Futuro do Design Thinking",
    "landing.hero.title": "Transforme Ideias em Soluções Revolucionárias",
    "landing.hero.subtitle": "A plataforma mais completa para Design Thinking com ferramentas guiadas, colaboração em tempo real e alcance global em 4 idiomas.",
    "landing.start.free": "Começar Grátis",
    "landing.view.plans": "Ver Planos",
    "landing.trial.info": "✨ Sem cartão de crédito • 7 dias grátis",
    "landing.5.phases.title": "As 5 Fases do Design Thinking",
    "landing.5.phases.subtitle": "Siga uma metodologia comprovada usada pelas empresas mais inovadoras do mundo",
    "landing.everything.title": "Tudo que Você Precisa para Inovar",
    "landing.everything.subtitle": "Ferramentas poderosas projetadas para acelerar seu processo de Design Thinking",
    "landing.trusted.title": "Confiado por Líderes de Inovação",
    "landing.rating": "4.9/5 de mais de 2.500 usuários",
    "landing.testimonial.1": "DTTools transformou completamente como inovamos. Conseguimos reduzir o tempo de desenvolvimento em 40%.",
    "landing.testimonial.2": "A plataforma de Design Thinking mais completa que já usei. Intuitiva e poderosa.",
    "landing.testimonial.3": "Nossos clientes ficaram impressionados com a qualidade dos insights que conseguimos gerar.",
    "landing.ready.title": "Pronto para Transformar seu Processo de Inovação?",
    "landing.ready.subtitle": "Junte-se a milhares de inovadores usando DTTools para criar soluções revolucionárias",
    "landing.start.trial": "Começar Teste Grátis",
    "landing.explore.library": "Explorar Biblioteca",
    
    // Landing - AI MVP Generator
    "landing.mvp.badge": "NOVO",
    "landing.mvp.title": "Gere seu MVP Completo com IA",
    "landing.mvp.subtitle": "Em 5-10 minutos, nossa IA cria um projeto completo de negócio para você: logo profissional, personas, landing page, estratégia de redes sociais, modelo de negócio e muito mais!",
    "landing.mvp.button": "Criar Meu MVP Agora",
    "landing.mvp.feature.logo": "Logo Profissional",
    "landing.mvp.feature.personas": "Personas de Usuários",
    "landing.mvp.feature.landing": "Landing Page",
    "landing.mvp.feature.social": "Estratégia de Redes Sociais",
    "landing.mvp.feature.bmc": "Business Model Canvas",

    // Landing - Double Diamond + AI
    "landing.dd.badge": "FRAMEWORK AVANÇADO",
    "landing.dd.title": "Double Diamond + IA",
    "landing.dd.subtitle": "O framework mais completo para inovação: combina descoberta de problemas e desenvolvimento de soluções com automação total de IA.",
    "landing.dd.button": "Começar Grátis",
    "landing.dd.mini.title": "MVP Completo em Minutos",
    "landing.dd.mini.subtitle": "IA gera declarações POV, definição de problemas, ideias criativas com análise DFV automática e protótipos completos.",
    "landing.dd.feature.pov": "Declarações POV",
    "landing.dd.feature.problem": "Definição Problema",
    "landing.dd.feature.aiIdeas": "Ideias com IA",
    "landing.dd.feature.dfv": "Análise DFV",
    "landing.dd.feature.prototypes": "Protótipos Auto",

    // Landing - Double Diamond Details
    "landing.dd.discovery.title": "Diamante da Descoberta",
    "landing.dd.discovery.text": "Explore o espaço do problema profundamente antes de pular para soluções.",
    "landing.dd.discovery.item1": "Pesquisa de usuários",
    "landing.dd.discovery.item2": "Definição do problema",
    "landing.dd.delivery.title": "Diamante da Entrega",
    "landing.dd.delivery.text": "Crie, teste e refine soluções iterativamente.",
    "landing.dd.delivery.item1": "Ideação & DFV",
    "landing.dd.delivery.item2": "Prototipagem & Testes",
    "landing.dd.footer": "🎯 Perfeito para startups, times de inovação e gerentes de produto",

    // Landing - DVF Benchmarking
    "landing.dvf.badge": "DIFERENCIAL COMPETITIVO",
    "landing.dvf.title": "Sistema DVF de Benchmarking",
    "landing.dvf.subtitle": "A única plataforma com sistema DVF (Desejabilidade, Viabilidade, Exequibilidade) integrado para avaliação estratégica de ideias e benchmarking competitivo com padrões da indústria.",
    "landing.dvf.d.title": "Desejabilidade",
    "landing.dvf.d.text": "As pessoas realmente querem esta solução? Validação do usuário e análise de demanda do mercado.",
    "landing.dvf.v.title": "Viabilidade",
    "landing.dvf.v.text": "Isto é um negócio sustentável? Análise financeira e validação do modelo de negócio.",
    "landing.dvf.f.title": "Exequibilidade",
    "landing.dvf.f.text": "Conseguimos realmente construir isto? Capacidades técnicas e avaliação de recursos.",
    "landing.dvf.card.title": "Benchmarking Inteligente",
    "landing.dvf.card.desirability": "Desejabilidade",
    "landing.dvf.card.viability": "Viabilidade",
    "landing.dvf.card.feasibility": "Exequibilidade",
    "landing.dvf.card.overall": "Pontuação Geral",
    "landing.dvf.card.aboveAverage": "✓ Acima da Média da Indústria",
    "landing.dvf.cta.button": "Experimente o Benchmarking",
    "landing.dvf.cta.subtitle": "Não precisa se registrar • Análise estratégica instantânea",
    "landing.dvf.footer": "🎯 Perfeito para startups, times de inovação e gerentes de produto",

    // Landing - Features Grid
    "landing.features.process.title": "Processo Guiado",
    "landing.features.process.desc": "Siga um processo estruturado através das 5 fases do Design Thinking",
    "landing.features.collab.title": "Colaboração em Tempo Real",
    "landing.features.collab.desc": "Trabalhe com sua equipe simultaneamente em projetos complexos",
    "landing.features.library.title": "Biblioteca de Conhecimento",
    "landing.features.library.desc": "Acesse centenas de artigos, templates e melhores práticas",
    "landing.features.metrics.title": "Métricas e Progresso",
    "landing.features.metrics.desc": "Acompanhe o progresso dos projetos com dashboards detalhados",
    "landing.features.multilang.title": "Suporte Multi-idioma",
    "landing.features.multilang.desc": "Interface disponível em português, inglês, espanhol, francês e mais idiomas",
    "landing.features.export.title": "Exportação Profissional",
    "landing.features.export.desc": "Exporte seus projetos em PDF, PNG e CSV para apresentações",
    "landing.features.kanban.title": "Sistema Kanban Integrado",
    "landing.features.kanban.desc": "Gerencie suas ideias e atividades com boards Kanban visual e intuitivo",

    // Pricing Page
    "pricing.title": "Escolha o Plano Ideal para Você",
    "pricing.subtitle": "Transforme suas ideias em soluções inovadoras com as ferramentas mais avançadas de Design Thinking. Comece grátis e evolua conforme suas necessidades.",
    "pricing.monthly": "Mensal",
    "pricing.yearly": "Anual",
    "pricing.save": "Economize até 10%",
    "pricing.popular": "Mais Popular",
    "pricing.teams": "Equipes",
    "pricing.enterprise": "Corporativo",
    "pricing.comparison": "Comparação Detalhada",
    "pricing.comparison.subtitle": "Veja todas as funcionalidades de cada plano",
    
    // Plan Names
    "plan.free": "Gratuito",
    "plan.basic": "Básico",
    "plan.premium": "Premium",
    "plan.pro": "Pro",
    "plan.team": "Team",
    "plan.enterprise": "Enterprise",
    
    // Plan Descriptions
    "plan.free.desc": "Perfeito para começar sua jornada de Design Thinking",
    "plan.basic.desc": "Ideal para testar a geração automática de MVPs com IA",
    "plan.premium.desc": "Para equipes que precisam gerar múltiplos MVPs com IA",
    "plan.pro.desc": "Ideal para profissionais e freelancers que querem mais poder",
    "plan.team.desc": "Para equipes que colaboram em projetos complexos",
    "plan.enterprise.desc": "Solução completa para grandes organizações",
    
    // Buttons
    "btn.start.free": "Começar Grátis",
    "btn.start.trial": "Começar Teste Grátis",
    "btn.contact.sales": "Falar com Vendas",
    "btn.processing": "Processando...",
    
    // Features
    "feature.projects": "Projetos simultâneos",
    "feature.personas": "Personas por projeto", 
    "feature.ai.chat": "Chat IA por mês",
    "feature.team.users": "Usuários na equipe",
    "feature.collaboration": "Colaboração em tempo real",
    "feature.sso": "SSO (Single Sign-On)",
    "feature.support": "Suporte 24/7",
    "feature.unlimited": "Ilimitado",
    
    // Currency
    "currency.symbol": "R$",
    "currency.month": "/mês",
    "currency.year": "/ano",
    "currency.save": "Economize {percent}% anualmente",
    
    // Trial info
    "trial.info": "7 dias grátis • Sem cartão de crédito",
    
    // Loading states
    "loading.plans": "Carregando planos...",
    
    // Additional features
    "pricing.additional.features": "funcionalidades adicionais",
    
    // FAQ
    "faq.title": "Perguntas Frequentes",
    "faq.q1": "Posso cancelar minha assinatura a qualquer momento?",
    "faq.a1": "Sim! Você pode cancelar sua assinatura a qualquer momento. Ao cancelar, você continuará tendo acesso aos recursos até o final do período de billing atual.",
    "faq.q2": "Como funciona o período de teste grátis?",
    "faq.a2": "O teste grátis de 7 dias dá acesso completo a todas as funcionalidades do plano escolhido. Não é necessário cartão de crédito para começar.",
    "faq.q3": "Posso fazer upgrade ou downgrade do meu plano?",
    "faq.a3": "Claro! Você pode alterar seu plano a qualquer momento. As mudanças são aplicadas imediatamente e o valor é ajustado proporcionalmente.",
    
    // Toast messages
    "toast.plan.activated": "Plano ativado!",
    "toast.plan.activated.desc": "Seu plano gratuito foi ativado com sucesso.",
    "toast.error": "Erro",
    "toast.error.desc": "Erro ao processar a assinatura. Tente novamente.",
    
    // Feature table
    "feature.title": "Funcionalidade",
    
    // Free pricing
    "pricing.free": "Grátis",
    
    // Plan Feature Keys (localized)
    "feature.projects.limit": "{count} projetos simultâneos",
    "feature.personas.limit": "{count} personas por projeto",
    "feature.ai.chat.limit": "{count} consultas IA por mês",
    "feature.team.users.limit": "{count} usuários na equipe",
    "feature.export.formats": "Exportação em {formats}",
    "feature.basic.tools": "Ferramentas básicas de Design Thinking",
    "feature.advanced.tools": "Ferramentas avançadas e templates",
    "feature.priority.support": "Suporte prioritário",
    "feature.onboarding": "Onboarding personalizado",
    "feature.custom.integrations": "Integrações customizadas",
    "feature.dedicated.manager": "Gerente de conta dedicado",
    "feature.all.phases": "Todas as 5 fases do Design Thinking",
    "feature.unlimited.projects": "Projetos ilimitados",
    "feature.unlimited.personas": "Personas ilimitadas",
    "feature.unlimited.ai.chat": "Consultas IA ilimitadas",
    
    // Library Page
    "library.title": "Biblioteca Design Thinking",
    "library.subtitle": "Explore artigos, guias e recursos para dominar a metodologia de Design Thinking",
    "library.search.placeholder": "Pesquisar artigos...",
    "library.read.article": "Ler artigo",
    "library.all": "Todos",
    "library.all.desc": "Todos os artigos",
    "library.category.empathize": "Empatizar",
    "library.category.empathize.desc": "Compreender usuários",
    "library.category.define": "Definir",
    "library.category.define.desc": "Definir problemas",
    "library.category.ideate": "Idear",
    "library.category.ideate.desc": "Gerar soluções",
    "library.category.prototype": "Prototipar",
    "library.category.prototype.desc": "Construir protótipos",
    "library.category.test": "Testar",
    "library.category.test.desc": "Validar soluções",
    "library.no.articles": "Nenhum artigo encontrado",
    "library.no.match": "Não encontramos artigos que correspondam à sua pesquisa \"{term}\".",
    "library.no.articles.category": "Não há artigos disponíveis nesta categoria no momento.",
    "library.clear.search": "Limpar pesquisa",

    // Phase 2 - Define / Guiding Criteria
    "phase2.header.title": "Fase 2: Definir",
    "phase2.header.subtitle": "Sintetize as descobertas em pontos de vista e oportunidades de design",
    "phase2.tab.pov": "POV Statements",
    "phase2.tab.hmw": "How Might We",
    "phase2.tab.guidingCriteria": "Critérios norteadores",

    "guidingCriteria.header.title": "Critérios norteadores",
    "guidingCriteria.header.subtitle": "Defina os princípios que irão orientar decisões ao longo do projeto.",
    "guidingCriteria.header.helper": "Use estes critérios como \"filtros\" para avaliar ideias, protótipos e decisões ao longo do projeto.",

    "guidingCriteria.empty.title": "Nenhum critério norteador",
    "guidingCriteria.empty.description": "Comece definindo critérios que não podem ser ignorados ao longo deste projeto.",

    "guidingCriteria.dialog.create.button": "Novo critério norteador",
    "guidingCriteria.dialog.create.button.loading": "Criando...",
    "guidingCriteria.dialog.edit.button.save": "Salvar alterações",
    "guidingCriteria.dialog.edit.button.saving": "Salvando...",

    "guidingCriteria.dialog.create.title": "Criar critério norteador",
    "guidingCriteria.dialog.create.description": "Registre os princípios que irão guiar decisões ao longo do projeto, garantindo alinhamento com os insights da Imersão.",
    "guidingCriteria.dialog.edit.title": "Editar critério norteador",
    "guidingCriteria.dialog.edit.description": "Atualize este critério para refletir melhor os aprendizados do projeto.",

    "guidingCriteria.common.cancel": "Cancelar",

    "guidingCriteria.form.title.label": "Título do critério",
    "guidingCriteria.form.title.placeholder": "Ex: Foco total na experiência mobile-first",
    "guidingCriteria.form.title.tooltip.title": "Critério norteador",
    "guidingCriteria.form.title.tooltip.content": "Defina uma frase curta que resuma o princípio que deve ser respeitado em todo o projeto.",
    "guidingCriteria.form.title.tooltip.example1": "Sempre priorizar a segurança do usuário final",
    "guidingCriteria.form.title.tooltip.example2": "Garantir acessibilidade para pessoas com baixa visão",
    "guidingCriteria.form.title.tooltip.example3": "Evitar sobrecarga cognitiva em fluxos críticos",

    "guidingCriteria.form.description.label": "Descrição detalhada",
    "guidingCriteria.form.description.placeholder": "Explique a origem desse critério, conectando-o com insights da fase de Imersão.",

    "guidingCriteria.form.category.label": "Categoria",
    "guidingCriteria.form.category.placeholder": "Ex: Usuário, Negócio, Técnico, Regulatória",

    "guidingCriteria.form.importance.label": "Importância",
    "guidingCriteria.form.importance.low": "Baixa",
    "guidingCriteria.form.importance.medium": "Média",
    "guidingCriteria.form.importance.high": "Alta",

    "guidingCriteria.form.tags.label": "Tags (separadas por vírgula)",
    "guidingCriteria.form.tags.placeholder": "Ex: jornada do usuário, acessibilidade, compliance",

    "guidingCriteria.toast.delete.success.title": "Critério excluído",
    "guidingCriteria.toast.delete.success.description": "O critério norteador foi removido com sucesso.",
    "guidingCriteria.toast.delete.error.title": "Erro",
    "guidingCriteria.toast.delete.error.description": "Não foi possível excluir o critério norteador.",

    "guidingCriteria.toast.create.success.title": "Critério criado!",
    "guidingCriteria.toast.create.success.description": "Seu critério norteador foi criado com sucesso.",
    "guidingCriteria.toast.create.error.title": "Erro",
    "guidingCriteria.toast.create.error.description": "Não foi possível criar o critério norteador.",

    "guidingCriteria.toast.update.success.title": "Critério atualizado!",
    "guidingCriteria.toast.update.success.description": "As alterações foram salvas com sucesso.",
    "guidingCriteria.toast.update.error.title": "Erro",
    "guidingCriteria.toast.update.error.description": "Não foi possível atualizar o critério norteador.",

    "guidingCriteria.importance.badge.low": "Baixa importância",
    "guidingCriteria.importance.badge.medium": "Importância média",
    "guidingCriteria.importance.badge.high": "Alta importância",
  },
  
  "en": {
    // Navigation
    "nav.projects": "Projects",
    "nav.library": "Library", 
    "nav.addons": "Additional tools",
    "nav.pricing": "Pricing",
    "nav.admin": "Admin",
    "nav.logout": "Logout",
    "nav.login": "Login",
    
    // Dashboard
    "dashboard.start.project": "Start Complete Project",
    "dashboard.explore.phases": "Explore Phases",
    "dashboard.hero.title": "Design Thinking Tools",
    "dashboard.hero.subtitle": "An interactive and comprehensive platform to guide designers, innovation teams and creative professionals through the Design Thinking stages.",
    "dashboard.your.progress": "Your Progress",
    "dashboard.beginner": "Beginner",
    "dashboard.points": "Points",
    "dashboard.badges": "Badges",
    "dashboard.phases": "Phases", 
    "dashboard.session": "Session",
    "dashboard.progress.by.phase": "Progress by Phase",
    "dashboard.recent.activity": "Recent Activity",
    "dashboard.no.activity": "No recent activity. Start exploring the phases!",
    "dashboard.next.steps": "Suggested Next Steps",
    "dashboard.5.phases.title": "The 5 Phases of Design Thinking",
    "dashboard.5.phases.subtitle": "Explore each phase of the process and develop user-centered solutions.",
    "dashboard.why.platform": "Why use our platform?",
    "dashboard.ready.start": "Ready to start your journey?",
    "dashboard.ready.subtitle": "Transform complex problems into innovative solutions with Design Thinking.",
    "dashboard.start.now": "Start Now",
    "dashboard.welcome.title": "Welcome, {name}",
    "dashboard.welcome.title.generic": "Welcome",
    "dashboard.welcome.intro": "DTTools is your AI-assisted Design Thinking platform. We guide you step by step in creating innovative solutions to your business problems.",
    "dashboard.welcome.section.what.title": "What you will do:",
    "dashboard.welcome.section.what.text": "Create complete Design Thinking projects following the 5 stages of the process (Empathize, Define, Ideate, Prototype, Test).",
    "dashboard.welcome.section.how.title": "How AI helps you:",
    "dashboard.welcome.section.how.text": "At each stage, you receive guidance, practical examples and AI-generated insights to make your work easier.",
    "dashboard.welcome.section.gain.title": "What you will gain:",
    "dashboard.welcome.section.gain.text": "Validated solutions, insights about your users, prioritized ideas and testable prototypes – all organized and documented.",
    "dashboard.welcome.tip": "Not sure where to start? Use our Automatic MVP Generation tool above. In 5–10 minutes, AI creates a complete project for you to explore and learn from!",
    "dashboard.welcome.dismiss": "Got it, don't show again",
    
    // Phases
    "phases.empathize": "Empathize",
    "phases.define": "Define",
    "phases.ideate": "Ideate", 
    "phases.prototype": "Prototype",
    "phases.test": "Test",
    "phases.empathize.desc": "Deeply understand your users",
    "phases.define.desc": "Synthesize information and identify problems",
    "phases.ideate.desc": "Generate creative and innovative solutions",
    "phases.prototype.desc": "Make your ideas tangible",
    "phases.test.desc": "Validate solutions with real users",
    
    // Benefits
    "benefits.human.centered": "Human-Centered",
    "benefits.human.centered.desc": "Put user needs and experiences at the center of the design process.",
    "benefits.iterative.process": "Iterative Process",
    "benefits.iterative.process.desc": "Refine your solutions through continuous cycles of testing and learning.",
    "benefits.collaborative": "Collaborative",
    "benefits.collaborative.desc": "Work as a team and combine different perspectives for richer solutions.",
    
    // Next Steps
    "next.step.1": "Start with the Empathize phase to understand your users",
    "next.step.2": "Explore additional tools in the Tools menu", 
    "next.step.3": "Complete more actions to earn new badges",

    // Add-ons
    "addons.header.title": "Additional tools",
    "addons.header.subtitle": "See which add-ons are active on your account and how they extend your plan.",
    "addons.currentPlan.title": "Your current plan",
    "addons.currentPlan.loading": "Loading plan information...",
    "addons.currentPlan.freeSuffix": "(Free)",
    "addons.status.active": "Active",
    "addons.status.inactive": "Not active",
    "addons.button.activate": "Activate with Stripe",
    "addons.button.cancel": "Cancel add-on",
    "addons.button.canceling": "Cancelling...",
    "addons.toast.checkout.error.title": "Error starting checkout",
    "addons.toast.checkout.error.description": "Please try again in a few moments.",
    "addons.toast.checkout.missingConfig.title": "Could not start checkout",
    "addons.toast.checkout.missingConfig.description": "Please check the add-on payment configuration.",
    "addons.toast.cancel.success.title": "Cancellation requested",
    "addons.toast.cancel.success.description.default": "The add-on will be cancelled at the end of the current billing period.",
    "addons.toast.cancel.error.title": "Error cancelling add-on",
    "addons.toast.cancel.error.description": "Please try again in a few moments.",

    "addons.item.doubleDiamondPro.title": "Double Diamond Pro",
    "addons.item.doubleDiamondPro.description": "Unlimited Double Diamond projects and exports unlocked for the main system.",
    "addons.item.exportPro.title": "Export Pro",
    "addons.item.exportPro.description": "Unlock PDF, PNG and CSV export for your projects.",
    "addons.item.aiTurbo.title": "AI Turbo",
    "addons.item.aiTurbo.description": "+300 AI messages per month, in addition to your plan limit.",
    "addons.item.collabAdvanced.title": "Advanced Collaboration",
    "addons.item.collabAdvanced.description": "Real-time collaboration, comments, feedback and shared workspace.",
    "addons.item.libraryPremium.title": "Premium Library",
    "addons.item.libraryPremium.description": "Full access to the library of articles, videos and premium materials.",
    
    // Landing Page
    "landing.future": "🚀 The Future of Design Thinking",
    "landing.hero.title": "Transform Ideas into Revolutionary Solutions",
    "landing.hero.subtitle": "The most complete platform for Design Thinking with guided tools, real-time collaboration, and global reach in 4 languages.",
    "landing.start.free": "Start for Free",
    "landing.view.plans": "View Plans",
    "landing.trial.info": "✨ No credit card required • 7-day free trial",
    "landing.5.phases.title": "The 5 Phases of Design Thinking",
    "landing.5.phases.subtitle": "Follow a proven methodology used by the world's most innovative companies",
    "landing.everything.title": "Everything You Need to Innovate",
    "landing.everything.subtitle": "Powerful tools designed to accelerate your Design Thinking process",
    "landing.trusted.title": "Trusted by Innovation Leaders",
    "landing.rating": "4.9/5 from 2,500+ users",
    "landing.testimonial.1": "DTTools completely transformed how we innovate. We managed to reduce development time by 40%.",
    "landing.testimonial.2": "The most complete Design Thinking platform I've ever used. Intuitive and powerful.",
    "landing.testimonial.3": "Our clients were impressed with the quality of insights we were able to generate.",
    "landing.ready.title": "Ready to Transform Your Innovation Process?",
    "landing.ready.subtitle": "Join thousands of innovators using DTTools to create breakthrough solutions",
    "landing.start.trial": "Start Free Trial",
    "landing.explore.library": "Explore Library",

    // Landing - AI MVP Generator
    "landing.mvp.badge": "NEW",
    "landing.mvp.title": "Generate Complete MVP with AI",
    "landing.mvp.subtitle": "In 5-10 minutes, our AI creates a complete business project for you: professional logo, personas, landing page, social media strategy, business model and much more!",
    "landing.mvp.button": "Create My MVP Now",
    "landing.mvp.feature.logo": "Professional Logo",
    "landing.mvp.feature.personas": "User Personas",
    "landing.mvp.feature.landing": "Landing Page",
    "landing.mvp.feature.social": "Social Media Strategy",
    "landing.mvp.feature.bmc": "Business Model Canvas",

    // Landing - Double Diamond + AI
    "landing.dd.badge": "ADVANCED FRAMEWORK",
    "landing.dd.title": "Double Diamond + AI",
    "landing.dd.subtitle": "The most complete framework for innovation: combines problem discovery and solution development with full AI automation.",
    "landing.dd.button": "Start Free",
    "landing.dd.mini.title": "Complete MVP in Minutes",
    "landing.dd.mini.subtitle": "AI generates POV statements, problem definitions, creative ideas with automatic DFV analysis, and complete prototypes.",
    "landing.dd.feature.pov": "POV Statements",
    "landing.dd.feature.problem": "Problem Definition",
    "landing.dd.feature.aiIdeas": "AI Ideas",
    "landing.dd.feature.dfv": "DFV Analysis",
    "landing.dd.feature.prototypes": "Auto Prototypes",

    // Landing - Double Diamond Details
    "landing.dd.discovery.title": "Discovery Diamond",
    "landing.dd.discovery.text": "Explore the problem space deeply before jumping to solutions.",
    "landing.dd.discovery.item1": "User research",
    "landing.dd.discovery.item2": "Problem definition",
    "landing.dd.delivery.title": "Delivery Diamond",
    "landing.dd.delivery.text": "Create, test and refine solutions iteratively.",
    "landing.dd.delivery.item1": "Ideation & DFV",
    "landing.dd.delivery.item2": "Prototyping & Testing",
    "landing.dd.footer": "🎯 Perfect for startups, innovation teams, and product managers",

    // Landing - DVF Benchmarking
    "landing.dvf.badge": "COMPETITIVE ADVANTAGE",
    "landing.dvf.title": "DVF Benchmarking System",
    "landing.dvf.subtitle": "The only platform with an integrated DVF (Desirability, Viability, Feasibility) system for strategic idea evaluation and competitive benchmarking against industry standards.",
    "landing.dvf.d.title": "Desirability",
    "landing.dvf.d.text": "Do people really want this solution? User validation and market demand analysis.",
    "landing.dvf.v.title": "Viability",
    "landing.dvf.v.text": "Is this a sustainable business? Financial analysis and business model validation.",
    "landing.dvf.f.title": "Feasibility",
    "landing.dvf.f.text": "Can we actually build this? Technical capabilities and resource assessment.",
    "landing.dvf.card.title": "Smart Benchmarking",
    "landing.dvf.card.desirability": "Desirability",
    "landing.dvf.card.viability": "Viability",
    "landing.dvf.card.feasibility": "Feasibility",
    "landing.dvf.card.overall": "Overall Score",
    "landing.dvf.card.aboveAverage": "✓ Above Industry Average",
    "landing.dvf.cta.button": "Try Benchmarking Tool",
    "landing.dvf.cta.subtitle": "No registration required • Instant strategic analysis",
    "landing.dvf.footer": "🎯 Perfect for startups, innovation teams, and product managers",

    // Landing - Features Grid
    "landing.features.process.title": "Guided Process",
    "landing.features.process.desc": "Follow a structured process through the 5 phases of Design Thinking",
    "landing.features.collab.title": "Real-time Collaboration",
    "landing.features.collab.desc": "Work with your team simultaneously on complex projects",
    "landing.features.library.title": "Knowledge Library",
    "landing.features.library.desc": "Access hundreds of articles, templates and best practices",
    "landing.features.metrics.title": "Metrics & Progress",
    "landing.features.metrics.desc": "Track project progress with detailed dashboards",
    "landing.features.multilang.title": "Multi-language Support",
    "landing.features.multilang.desc": "Interface available in Portuguese, English, Spanish, French and more languages",
    "landing.features.export.title": "Professional Export",
    "landing.features.export.desc": "Export your projects in PDF, PNG and CSV for presentations",
    "landing.features.kanban.title": "Integrated Kanban System",
    "landing.features.kanban.desc": "Manage your ideas and activities with visual and intuitive Kanban boards",
    // Pricing Page
    "pricing.title": "Choose the Perfect Plan for You",
    "pricing.subtitle": "Transform your ideas into innovative solutions with the most advanced Design Thinking tools. Start free and evolve as your needs grow.",
    "pricing.monthly": "Monthly",
    "pricing.yearly": "Yearly",
    "pricing.save": "Save up to 10%",
    "pricing.popular": "Most Popular",
    "pricing.teams": "Teams",
    "pricing.enterprise": "Enterprise",
    "pricing.comparison": "Detailed Comparison",
    "pricing.comparison.subtitle": "See all features of each plan",
    
    // Plan Names
    "plan.free": "Free",
    "plan.basic": "Basic",
    "plan.premium": "Premium",
    "plan.pro": "Pro",
    "plan.team": "Team",
    "plan.enterprise": "Enterprise",
    
    // Plan Descriptions
    "plan.free.desc": "Perfect to start your Design Thinking journey",
    "plan.basic.desc": "Ideal for testing AI-powered MVP generation",
    "plan.premium.desc": "For teams that need to generate multiple MVPs with AI",
    "plan.pro.desc": "Ideal for professionals and freelancers who want more power",
    "plan.team.desc": "For teams collaborating on complex projects",
    "plan.enterprise.desc": "Complete solution for large organizations",
    
    // Buttons
    "btn.start.free": "Start Free",
    "btn.start.trial": "Start Free Trial",
    "btn.contact.sales": "Contact Sales",
    "btn.processing": "Processing...",
    
    // Features
    "feature.projects": "Simultaneous projects",
    "feature.personas": "Personas per project",
    "feature.ai.chat": "AI Chat per month",
    "feature.team.users": "Team users",
    "feature.collaboration": "Real-time collaboration",
    "feature.sso": "SSO (Single Sign-On)",
    "feature.support": "24/7 Support",
    "feature.unlimited": "Unlimited",
    
    // Currency
    "currency.symbol": "$",
    "currency.month": "/month",
    "currency.year": "/year",
    "currency.save": "Save {percent}% annually",
    
    // Trial info
    "trial.info": "7 days free • No credit card required",
    
    // Loading states
    "loading.plans": "Loading plans...",
    
    // Additional features
    "pricing.additional.features": "additional features",
    
    // FAQ
    "faq.title": "Frequently Asked Questions",
    "faq.q1": "Can I cancel my subscription at any time?",
    "faq.a1": "Yes! You can cancel your subscription at any time. When you cancel, you'll continue to have access to features until the end of your current billing period.",
    "faq.q2": "How does the free trial work?",
    "faq.a2": "The 7-day free trial gives you full access to all features of the chosen plan. No credit card is required to start.",
    "faq.q3": "Can I upgrade or downgrade my plan?",
    "faq.a3": "Absolutely! You can change your plan at any time. Changes are applied immediately and the price is adjusted proportionally.",
    
    // Toast messages
    "toast.plan.activated": "Plan Activated!",
    "toast.plan.activated.desc": "Your free plan has been successfully activated.",
    "toast.error": "Error",
    "toast.error.desc": "Error processing subscription. Please try again.",
    
    // Feature table
    "feature.title": "Feature",
    
    // Free pricing
    "pricing.free": "Free",
    
    // Plan Feature Keys (localized)
    "feature.projects.limit": "{count} simultaneous projects",
    "feature.personas.limit": "{count} personas per project",
    "feature.ai.chat.limit": "{count} AI queries per month",
    "feature.team.users.limit": "{count} team users",
    "feature.export.formats": "Export in {formats}",
    "feature.basic.tools": "Basic Design Thinking tools",
    "feature.advanced.tools": "Advanced tools and templates",
    "feature.priority.support": "Priority support",
    "feature.onboarding": "Personalized onboarding",
    "feature.custom.integrations": "Custom integrations",
    "feature.dedicated.manager": "Dedicated account manager",
    "feature.all.phases": "All 5 Design Thinking phases",
    "feature.unlimited.projects": "Unlimited projects",
    "feature.unlimited.personas": "Unlimited personas",
    "feature.unlimited.ai.chat": "Unlimited AI queries",
    
    // Library Page
    "library.title": "Design Thinking Library",
    "library.subtitle": "Explore articles, guides and resources to master the Design Thinking methodology",
    "library.search.placeholder": "Search articles...",
    "library.read.article": "Read article",
    "library.all": "All",
    "library.all.desc": "All articles",
    "library.category.empathize": "Empathize",
    "library.category.empathize.desc": "Understand users",
    "library.category.define": "Define",
    "library.category.define.desc": "Define problems",
    "library.category.ideate": "Ideate",
    "library.category.ideate.desc": "Generate solutions",
    "library.category.prototype": "Prototype",
    "library.category.prototype.desc": "Build prototypes",
    "library.category.test": "Test",
    "library.category.test.desc": "Validate solutions",
    "library.no.articles": "No articles found",
    "library.no.match": "We couldn't find articles matching your search \"{term}\".",
    "library.no.articles.category": "There are no articles available in this category at the moment.",
    "library.clear.search": "Clear search",

    // Phase 2 - Define / Guiding Criteria
    "phase2.header.title": "Phase 2: Define",
    "phase2.header.subtitle": "Synthesize findings into points of view and design opportunities",
    "phase2.tab.pov": "POV Statements",
    "phase2.tab.hmw": "How Might We",
    "phase2.tab.guidingCriteria": "Guiding Criteria",

    "guidingCriteria.header.title": "Guiding Criteria",
    "guidingCriteria.header.subtitle": "Define the principles that will guide decisions throughout the project.",
    "guidingCriteria.header.helper": "Use these criteria as filters to evaluate ideas, prototypes and decisions along the project.",

    "guidingCriteria.empty.title": "No guiding criteria",
    "guidingCriteria.empty.description": "Start by defining criteria that cannot be ignored in this project.",

    "guidingCriteria.dialog.create.button": "New guiding criterion",
    "guidingCriteria.dialog.create.button.loading": "Creating...",
    "guidingCriteria.dialog.edit.button.save": "Save changes",
    "guidingCriteria.dialog.edit.button.saving": "Saving...",

    "guidingCriteria.dialog.create.title": "Create guiding criterion",
    "guidingCriteria.dialog.create.description": "Record the principles that will guide decisions throughout the project, ensuring alignment with the Discover/Empathize insights.",
    "guidingCriteria.dialog.edit.title": "Edit guiding criterion",
    "guidingCriteria.dialog.edit.description": "Update this criterion to better reflect the learnings of the project.",

    "guidingCriteria.common.cancel": "Cancel",

    "guidingCriteria.form.title.label": "Criterion title",
    "guidingCriteria.form.title.placeholder": "E.g.: Strong focus on mobile-first experience",
    "guidingCriteria.form.title.tooltip.title": "Guiding criterion",
    "guidingCriteria.form.title.tooltip.content": "Define a short sentence that summarizes the principle that must be respected throughout the project.",
    "guidingCriteria.form.title.tooltip.example1": "Always prioritize end-user safety",
    "guidingCriteria.form.title.tooltip.example2": "Ensure accessibility for people with low vision",
    "guidingCriteria.form.title.tooltip.example3": "Avoid cognitive overload in critical flows",

    "guidingCriteria.form.description.label": "Detailed description",
    "guidingCriteria.form.description.placeholder": "Explain where this criterion comes from, connecting it to insights from the Discover phase.",

    "guidingCriteria.form.category.label": "Category",
    "guidingCriteria.form.category.placeholder": "E.g.: User, Business, Technical, Regulatory",

    "guidingCriteria.form.importance.label": "Importance",
    "guidingCriteria.form.importance.low": "Low",
    "guidingCriteria.form.importance.medium": "Medium",
    "guidingCriteria.form.importance.high": "High",

    "guidingCriteria.form.tags.label": "Tags (comma-separated)",
    "guidingCriteria.form.tags.placeholder": "E.g.: user journey, accessibility, compliance",

    "guidingCriteria.toast.delete.success.title": "Criterion deleted",
    "guidingCriteria.toast.delete.success.description": "The guiding criterion was removed successfully.",
    "guidingCriteria.toast.delete.error.title": "Error",
    "guidingCriteria.toast.delete.error.description": "We couldn't delete the guiding criterion.",

    "guidingCriteria.toast.create.success.title": "Criterion created!",
    "guidingCriteria.toast.create.success.description": "Your guiding criterion was created successfully.",
    "guidingCriteria.toast.create.error.title": "Error",
    "guidingCriteria.toast.create.error.description": "We couldn't create the guiding criterion.",

    "guidingCriteria.toast.update.success.title": "Criterion updated!",
    "guidingCriteria.toast.update.success.description": "The changes were saved successfully.",
    "guidingCriteria.toast.update.error.title": "Error",
    "guidingCriteria.toast.update.error.description": "We couldn't update the guiding criterion.",

    "guidingCriteria.importance.badge.low": "Low importance",
    "guidingCriteria.importance.badge.medium": "Medium importance",
    "guidingCriteria.importance.badge.high": "High importance",
  },
  
  "es": {
    // Navigation
    "nav.projects": "Proyectos",
    "nav.library": "Biblioteca",
    "nav.addons": "Herramientas adicionales",
    "nav.pricing": "Precios",
    "nav.admin": "Admin",
    "nav.logout": "Salir",
    "nav.login": "Iniciar sesión",
    
    // Dashboard
    "dashboard.start.project": "Iniciar Proyecto Completo",
    "dashboard.explore.phases": "Explorar Fases",

    // Add-ons
    "addons.header.title": "Herramientas adicionales",
    "addons.header.subtitle": "Ve qué add-ons están activos en tu cuenta y cómo amplían los recursos de tu plan.",
    "addons.currentPlan.title": "Tu plan actual",
    "addons.currentPlan.loading": "Cargando información del plan...",
    "addons.currentPlan.freeSuffix": "(Gratuito)",
    "addons.status.active": "Activo",
    "addons.status.inactive": "No activo",
    "addons.button.activate": "Activar con Stripe",
    "addons.button.cancel": "Cancelar add-on",
    "addons.button.canceling": "Cancelando...",
    "addons.toast.checkout.error.title": "Error al iniciar checkout",
    "addons.toast.checkout.error.description": "Inténtalo de nuevo en unos instantes.",
    "addons.toast.checkout.missingConfig.title": "No fue posible iniciar el checkout",
    "addons.toast.checkout.missingConfig.description": "Verifica la configuración de pago del add-on.",
    "addons.toast.cancel.success.title": "Cancelación solicitada",
    "addons.toast.cancel.success.description.default": "El add-on se cancelará al final del período de facturación actual.",
    "addons.toast.cancel.error.title": "Error al cancelar el add-on",
    "addons.toast.cancel.error.description": "Inténtalo de nuevo en unos instantes.",

    "addons.item.doubleDiamondPro.title": "Double Diamond Pro",
    "addons.item.doubleDiamondPro.description": "Proyectos Double Diamond ilimitados y exportaciones liberadas para el sistema principal.",
    "addons.item.exportPro.title": "Export Pro",
    "addons.item.exportPro.description": "Habilita exportación en PDF, PNG y CSV para tus proyectos.",
    "addons.item.aiTurbo.title": "IA Turbo",
    "addons.item.aiTurbo.description": "+300 mensajes de IA por mes, además del límite de tu plan.",
    "addons.item.collabAdvanced.title": "Colaboración Avanzada",
    "addons.item.collabAdvanced.description": "Colaboración en tiempo real, comentarios, feedbacks y espacio de trabajo compartido.",
    "addons.item.libraryPremium.title": "Biblioteca Premium",
    "addons.item.libraryPremium.description": "Acceso completo a la biblioteca de artículos, videos y materiales premium.",
    
    // Pricing Page
    "pricing.title": "Elige el Plan Perfecto para Ti",
    "pricing.subtitle": "Transforma tus ideas en soluciones innovadoras con las herramientas más avanzadas de Design Thinking. Comienza gratis y evoluciona según tus necesidades.",
    "pricing.monthly": "Mensual",
    "pricing.yearly": "Anual",
    "pricing.save": "Ahorra hasta 10%",
    "pricing.popular": "Más Popular",
    "pricing.teams": "Equipos",
    "pricing.enterprise": "Empresarial",
    "pricing.comparison": "Comparación Detallada",
    "pricing.comparison.subtitle": "Ve todas las funcionalidades de cada plan",
    
    // Plan Names
    "plan.free": "Gratis",
    "plan.basic": "Básico",
    "plan.premium": "Premium",
    "plan.pro": "Pro",
    "plan.team": "Team",
    "plan.enterprise": "Enterprise",
    
    // Plan Descriptions
    "plan.free.desc": "Perfecto para comenzar tu viaje de Design Thinking",
    "plan.basic.desc": "Ideal para probar la generación automática de MVPs con IA",
    "plan.premium.desc": "Para equipos que necesitan generar múltiples MVPs con IA",
    "plan.pro.desc": "Ideal para profesionales y freelancers que quieren más poder",
    "plan.team.desc": "Para equipos que colaboran en proyectos complejos",
    "plan.enterprise.desc": "Solución completa para grandes organizaciones",
    
    // Buttons
    "btn.start.free": "Comenzar Gratis",
    "btn.start.trial": "Comenzar Prueba Gratis",
    "btn.contact.sales": "Contactar Ventas",
    "btn.processing": "Procesando...",
    
    // Features
    "feature.projects": "Proyectos simultáneos",
    "feature.personas": "Personas por proyecto",
    "feature.ai.chat": "Chat IA por mes",
    "feature.team.users": "Usuarios del equipo",
    "feature.collaboration": "Colaboración en tiempo real",
    "feature.sso": "SSO (Single Sign-On)",
    "feature.support": "Soporte 24/7",
    "feature.unlimited": "Ilimitado",
    
    // Currency
    "currency.symbol": "$",
    "currency.month": "/mes",
    "currency.year": "/año",
    "currency.save": "Ahorra {percent}% anualmente",
    
    // Trial info
    "trial.info": "7 días gratis • Sin tarjeta de crédito",
    
    // Loading states
    "loading.plans": "Cargando planes...",
    
    // Additional features
    "pricing.additional.features": "funcionalidades adicionales",
    
    // FAQ
    "faq.title": "Preguntas Frecuentes",
    "faq.q1": "¿Puedo cancelar mi suscripción en cualquier momento?",
    "faq.a1": "¡Sí! Puedes cancelar tu suscripción en cualquier momento. Al cancelar, continuarás teniendo acceso a los recursos hasta el final del período de facturación actual.",
    "faq.q2": "¿Cómo funciona el período de prueba gratuito?",
    "faq.a2": "La prueba gratuita de 7 días te da acceso completo a todas las funcionalidades del plan elegido. No se requiere tarjeta de crédito para comenzar.",
    "faq.q3": "¿Puedo hacer upgrade o downgrade de mi plan?",
    "faq.a3": "¡Por supuesto! Puedes cambiar tu plan en cualquier momento. Los cambios se aplican inmediatamente y el valor se ajusta proporcionalmente.",
    
    // Toast messages
    "toast.plan.activated": "¡Plan Activado!",
    "toast.plan.activated.desc": "Tu plan gratuito ha sido activado exitosamente.",
    "toast.error": "Error",
    "toast.error.desc": "Error al procesar la suscripción. Inténtalo de nuevo.",
    
    // Feature table
    "feature.title": "Funcionalidad",
    
    // Free pricing
    "pricing.free": "Gratis",
    
    // Plan Feature Keys (localized) 
    "feature.projects.limit": "{count} proyectos simultáneos",
    "feature.personas.limit": "{count} personas por proyecto",
    "feature.ai.chat.limit": "{count} consultas IA por mes", 
    "feature.team.users.limit": "{count} usuarios del equipo",
    "feature.export.formats": "Exportación en {formats}",
    "feature.basic.tools": "Herramientas básicas de Design Thinking",
    "feature.advanced.tools": "Herramientas avanzadas y plantillas",
    "feature.priority.support": "Soporte prioritario",
    "feature.onboarding": "Onboarding personalizado",
    "feature.custom.integrations": "Integraciones personalizadas",
    "feature.dedicated.manager": "Gerente de cuenta dedicado",
    "feature.all.phases": "Todas las 5 fases del Design Thinking",
    "feature.unlimited.projects": "Proyectos ilimitados",
    "feature.unlimited.personas": "Personas ilimitadas",
    "feature.unlimited.ai.chat": "Consultas IA ilimitadas",
    
    // Library Page
    "library.title": "Biblioteca Design Thinking",
    "library.subtitle": "Explora artículos, guías y recursos para dominar la metodología de Design Thinking",
    "library.search.placeholder": "Buscar artículos...",
    "library.read.article": "Leer artículo",
    "library.all": "Todos",
    "library.all.desc": "Todos los artículos",
    "library.category.empathize": "Empatizar",
    "library.category.empathize.desc": "Comprender usuarios",
    "library.category.define": "Definir",
    "library.category.define.desc": "Definir problemas",
    "library.category.ideate": "Idear",
    "library.category.ideate.desc": "Generar soluciones",
    "library.category.prototype": "Prototipar",
    "library.category.prototype.desc": "Construir prototipos",
    "library.category.test": "Probar",
    "library.category.test.desc": "Validar soluciones",
    "library.no.articles": "No se encontraron artículos",
    "library.no.match": "No encontramos artículos que coincidan con tu búsqueda \"{term}\".",
    "library.no.articles.category": "No hay artículos disponibles en esta categoría en este momento.",
    "library.clear.search": "Limpiar búsqueda",

    // Fase 2 - Definir / Criterios orientadores
    "phase2.header.title": "Fase 2: Definir",
    "phase2.header.subtitle": "Sintetiza los hallazgos en puntos de vista y oportunidades de diseño",
    "phase2.tab.pov": "POV Statements",
    "phase2.tab.hmw": "How Might We",
    "phase2.tab.guidingCriteria": "Criterios orientadores",

    "guidingCriteria.header.title": "Criterios orientadores",
    "guidingCriteria.header.subtitle": "Define los principios que guiarán las decisiones a lo largo del proyecto.",
    "guidingCriteria.header.helper": "Usa estos criterios como filtros para evaluar ideas, prototipos y decisiones durante el proyecto.",

    "guidingCriteria.empty.title": "Sin criterios orientadores",
    "guidingCriteria.empty.description": "Comienza definiendo criterios que no pueden ignorarse en este proyecto.",

    "guidingCriteria.dialog.create.button": "Nuevo criterio orientador",
    "guidingCriteria.dialog.create.button.loading": "Creando...",
    "guidingCriteria.dialog.edit.button.save": "Guardar cambios",
    "guidingCriteria.dialog.edit.button.saving": "Guardando...",

    "guidingCriteria.dialog.create.title": "Crear criterio orientador",
    "guidingCriteria.dialog.create.description": "Registra los principios que guiarán las decisiones del proyecto, asegurando alineación con los insights de la fase de Descubrimiento.",
    "guidingCriteria.dialog.edit.title": "Editar criterio orientador",
    "guidingCriteria.dialog.edit.description": "Actualiza este criterio para reflejar mejor los aprendizajes del proyecto.",

    "guidingCriteria.common.cancel": "Cancelar",

    "guidingCriteria.form.title.label": "Título del criterio",
    "guidingCriteria.form.title.placeholder": "Ej.: Foco total en la experiencia mobile-first",
    "guidingCriteria.form.title.tooltip.title": "Criterio orientador",
    "guidingCriteria.form.title.tooltip.content": "Define una frase corta que resuma el principio que debe respetarse en todo el proyecto.",
    "guidingCriteria.form.title.tooltip.example1": "Priorizar siempre la seguridad del usuario final",
    "guidingCriteria.form.title.tooltip.example2": "Garantizar accesibilidad para personas con baja visión",
    "guidingCriteria.form.title.tooltip.example3": "Evitar sobrecarga cognitiva en flujos críticos",

    "guidingCriteria.form.description.label": "Descripción detallada",
    "guidingCriteria.form.description.placeholder": "Explica el origen de este criterio, conectándolo con insights de la fase de Descubrimiento.",

    "guidingCriteria.form.category.label": "Categoría",
    "guidingCriteria.form.category.placeholder": "Ej.: Usuario, Negocio, Técnico, Regulatorio",

    "guidingCriteria.form.importance.label": "Importancia",
    "guidingCriteria.form.importance.low": "Baja",
    "guidingCriteria.form.importance.medium": "Media",
    "guidingCriteria.form.importance.high": "Alta",

    "guidingCriteria.form.tags.label": "Tags (separadas por coma)",
    "guidingCriteria.form.tags.placeholder": "Ej.: journey del usuario, accesibilidad, compliance",

    "guidingCriteria.toast.delete.success.title": "Criterio eliminado",
    "guidingCriteria.toast.delete.success.description": "El criterio orientador se eliminó correctamente.",
    "guidingCriteria.toast.delete.error.title": "Error",
    "guidingCriteria.toast.delete.error.description": "No fue posible eliminar el criterio orientador.",

    "guidingCriteria.toast.create.success.title": "¡Criterio creado!",
    "guidingCriteria.toast.create.success.description": "Tu criterio orientador se creó correctamente.",
    "guidingCriteria.toast.create.error.title": "Error",
    "guidingCriteria.toast.create.error.description": "No fue posible crear el criterio orientador.",

    "guidingCriteria.toast.update.success.title": "Criterio actualizado",
    "guidingCriteria.toast.update.success.description": "Los cambios se guardaron correctamente.",
    "guidingCriteria.toast.update.error.title": "Error",
    "guidingCriteria.toast.update.error.description": "No fue posible actualizar el criterio orientador.",

    "guidingCriteria.importance.badge.low": "Importancia baja",
    "guidingCriteria.importance.badge.medium": "Importancia media",
    "guidingCriteria.importance.badge.high": "Importancia alta",
  },
  
  "fr": {
    // Navigation
    "nav.projects": "Projets",
    "nav.library": "Bibliothèque",
    "nav.addons": "Outils supplémentaires",
    "nav.pricing": "Tarifs",
    "nav.admin": "Admin",
    "nav.logout": "Se déconnecter",
    "nav.login": "Se connecter",
    
    // Dashboard
    "dashboard.start.project": "Démarrer Projet Complet",
    "dashboard.explore.phases": "Explorer les Phases",
    
    // Add-ons
    "addons.header.title": "Outils supplémentaires",
    "addons.header.subtitle": "Voyez quels add-ons sont actifs sur votre compte et comment ils étendent les fonctionnalités de votre plan.",
    "addons.currentPlan.title": "Votre plan actuel",
    "addons.currentPlan.loading": "Chargement des informations du plan...",
    "addons.currentPlan.freeSuffix": "(Gratuit)",
    "addons.status.active": "Actif",
    "addons.status.inactive": "Non actif",
    "addons.button.activate": "Activer avec Stripe",
    "addons.button.cancel": "Annuler l'add-on",
    "addons.button.canceling": "Annulation...",
    "addons.toast.checkout.error.title": "Erreur lors du démarrage du checkout",
    "addons.toast.checkout.error.description": "Veuillez réessayer dans quelques instants.",
    "addons.toast.checkout.missingConfig.title": "Impossible de démarrer le checkout",
    "addons.toast.checkout.missingConfig.description": "Vérifiez la configuration de paiement de l'add-on.",
    "addons.toast.cancel.success.title": "Annulation demandée",
    "addons.toast.cancel.success.description.default": "L'add-on sera annulé à la fin de la période de facturation en cours.",
    "addons.toast.cancel.error.title": "Erreur lors de l'annulation de l'add-on",
    "addons.toast.cancel.error.description": "Veuillez réessayer dans quelques instants.",

    "addons.item.doubleDiamondPro.title": "Double Diamond Pro",
    "addons.item.doubleDiamondPro.description": "Projets Double Diamond illimités et exports débloqués pour le système principal.",
    "addons.item.exportPro.title": "Export Pro",
    "addons.item.exportPro.description": "Activez l'export en PDF, PNG et CSV pour vos projets.",
    "addons.item.aiTurbo.title": "IA Turbo",
    "addons.item.aiTurbo.description": "+300 messages IA par mois, en plus de la limite de votre plan.",
    "addons.item.collabAdvanced.title": "Collaboration Avancée",
    "addons.item.collabAdvanced.description": "Collaboration en temps réel, commentaires, feedbacks et espace de travail partagé.",
    "addons.item.libraryPremium.title": "Bibliothèque Premium",
    "addons.item.libraryPremium.description": "Accès complet à la bibliothèque d'articles, de vidéos et de contenus premium.",

    // Pricing Page
    "pricing.title": "Choisissez le Plan Parfait pour Vous",
    "pricing.subtitle": "Transformez vos idées en solutions innovantes avec les outils de Design Thinking les plus avancés. Commencez gratuitement et évoluez selon vos besoins.",
    "pricing.monthly": "Mensuel",
    "pricing.yearly": "Annuel",
    "pricing.save": "Économisez jusqu'à 10%",
    "pricing.popular": "Le Plus Populaire",
    "pricing.teams": "Équipes",
    "pricing.enterprise": "Entreprise",
    "pricing.comparison": "Comparaison Détaillée",
    "pricing.comparison.subtitle": "Voir toutes les fonctionnalités de chaque plan",
    
    // Plan Names
    "plan.free": "Gratuit",
    "plan.basic": "Basic",
    "plan.premium": "Premium",
    "plan.pro": "Pro",
    "plan.team": "Team",
    "plan.enterprise": "Enterprise",
    
    // Plan Descriptions
    "plan.free.desc": "Parfait pour commencer votre parcours Design Thinking",
    "plan.basic.desc": "Idéal pour tester la génération automatique de MVP avec IA",
    "plan.premium.desc": "Pour les équipes qui ont besoin de générer plusieurs MVP avec IA",
    "plan.pro.desc": "Idéal pour les professionnels et freelances qui veulent plus de puissance",
    "plan.team.desc": "Pour les équipes collaborant sur des projets complexes",
    "plan.enterprise.desc": "Solution complète pour les grandes organisations",
    
    // Buttons
    "btn.start.free": "Commencer Gratuitement",
    "btn.start.trial": "Commencer l'Essai Gratuit",
    "btn.contact.sales": "Contacter les Ventes",
    "btn.processing": "En cours...",
    
    // Features
    "feature.projects": "Projets simultanés",
    "feature.personas": "Personas par projet",
    "feature.ai.chat": "Chat IA par mois",
    "feature.team.users": "Utilisateurs d'équipe",
    "feature.collaboration": "Collaboration en temps réel",
    "feature.sso": "SSO (Single Sign-On)",
    "feature.support": "Support 24/7",
    "feature.unlimited": "Illimité",
    
    // Currency
    "currency.symbol": "€",
    "currency.month": "/mois",
    "currency.year": "/an",
    "currency.save": "Économisez {percent}% annuellement",
    
    // Trial info
    "trial.info": "7 jours gratuits • Pas de carte de crédit requise",
    
    // Loading states
    "loading.plans": "Chargement des plans...",
    
    // Additional features
    "pricing.additional.features": "fonctionnalités supplémentaires",
    
    // FAQ
    "faq.title": "Questions Fréquemment Posées",
    "faq.q1": "Puis-je annuler mon abonnement à tout moment?",
    "faq.a1": "Oui! Vous pouvez annuler votre abonnement à tout moment. Lors de l'annulation, vous continuerez à avoir accès aux fonctionnalités jusqu'à la fin de votre période de facturation actuelle.",
    "faq.q2": "Comment fonctionne la période d'essai gratuite?",
    "faq.a2": "L'essai gratuit de 7 jours vous donne un accès complet à toutes les fonctionnalités du plan choisi. Aucune carte de crédit n'est requise pour commencer.",
    "faq.q3": "Puis-je faire un upgrade ou downgrade de mon plan?",
    "faq.a3": "Absolument! Vous pouvez changer votre plan à tout moment. Les changements sont appliqués immédiatement et le prix est ajusté proportionnellement.",
    
    // Toast messages
    "toast.plan.activated": "Plan Activé!",
    "toast.plan.activated.desc": "Votre plan gratuit a été activé avec succès.",
    "toast.error": "Erreur",
    "toast.error.desc": "Erreur lors du traitement de l'abonnement. Veuillez réessayer.",
    
    // Feature table
    "feature.title": "Fonctionnalité",
    
    // Free pricing
    "pricing.free": "Gratuit",
    
    // Plan Feature Keys (localized)
    "feature.projects.limit": "{count} projets simultanés",
    "feature.personas.limit": "{count} personas par projet",
    "feature.ai.chat.limit": "{count} requêtes IA par mois",
    "feature.team.users.limit": "{count} utilisateurs d'équipe",
    "feature.export.formats": "Export en {formats}",
    "feature.basic.tools": "Outils de base Design Thinking",
    "feature.advanced.tools": "Outils avancés et modèles",
    "feature.priority.support": "Support prioritaire",
    "feature.onboarding": "Onboarding personnalisé",
    "feature.custom.integrations": "Intégrations personnalisées",
    "feature.dedicated.manager": "Gestionnaire de compte dédié",
    "feature.all.phases": "Toutes les 5 phases du Design Thinking",
    "feature.unlimited.projects": "Projets illimités",
    "feature.unlimited.personas": "Personas illimitées",
    "feature.unlimited.ai.chat": "Requêtes IA illimitées",
    
    // Library Page
    "library.title": "Bibliothèque Design Thinking",
    "library.subtitle": "Explorez des articles, des guides et des ressources pour maîtriser la méthodologie Design Thinking",
    "library.search.placeholder": "Rechercher des articles...",
    "library.read.article": "Lire l'article",
    "library.all": "Tous",
    "library.all.desc": "Tous les articles",
    "library.no.articles": "No se encontraron artículos",
    "library.no.match": "No encontramos artículos que coincidan con tu búsqueda \"{term}\".",
    "library.no.articles.category": "No hay artículos disponibles en esta categoría en este momento.",
    "library.clear.search": "Limpiar búsqueda",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // Detect browser language
    const saved = localStorage.getItem("dttools-language");
    if (saved && Object.keys(translations).includes(saved)) {
      return saved as Language;
    }
    
    const browserLang = navigator.language;
    if (browserLang.startsWith("pt")) return "pt-BR";
    if (browserLang.startsWith("es")) return "es";
    if (browserLang.startsWith("fr")) return "fr";
    if (browserLang.startsWith("de")) return "de";
    if (browserLang.startsWith("zh")) return "zh";
    if (browserLang.startsWith("en")) return "en";
    return "pt-BR"; // Português como padrão para usuários brasileiros
  });

  useEffect(() => {
    localStorage.setItem("dttools-language", language);
  }, [language]);

  const t = (key: string, params?: Record<string, string>): string => {
    // Safely get translations for the current language, falling back to English
    const langTranslations = (translations as any)[language] || (translations as any)["en"];
    let translation = (langTranslations as any)[key] || (translations["en"] as any)[key] || key;

    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{${param}}`, value);
      });
    }
    
    return translation;
  };

  const convertPrice = (originalPriceInCents: number) => {
    // Currency conversion rates based on language/region
    const conversionConfig: Record<Language, { rate: number }> = {
      "pt-BR": { rate: 1 },   // Base currency (BRL)
      "en": { rate: 0.31 },   // ~3.2x cheaper in USD
      "es": { rate: 0.28 },   // ~3.6x cheaper in USD
      "fr": { rate: 0.26 },   // ~3.8x cheaper in EUR
      "de": { rate: 0.26 },   // Align with EUR region for now
      "zh": { rate: 0.31 },   // Align with USD-based pricing for now
    };

    const config = conversionConfig[language];
    const convertedPriceInCents = Math.round(originalPriceInCents * config.rate);
    const price = convertedPriceInCents / 100; // Convert cents to currency units
    
    // Handle free pricing
    if (price === 0) {
      return {
        price: 0,
        symbol: CURRENCY_CODES[language],
        formattedPrice: t("pricing.free")
      };
    }
    
    // Use Intl.NumberFormat for proper currency formatting
    const locale = LOCALE_MAP[language];
    const currencyCode = CURRENCY_CODES[language];
    
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    
    const formattedPrice = formatter.format(price);
    
    return {
      price: convertedPriceInCents,
      symbol: currencyCode,
      formattedPrice: formattedPrice
    };
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, convertPrice }}>
      {children}
    </LanguageContext.Provider>
  );
}