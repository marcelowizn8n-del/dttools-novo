import { useState } from "react";
import { Link } from "wouter";
import { 
  ArrowRight, 
  Users, 
  Target, 
  Lightbulb, 
  Wrench, 
  TestTube, 
  Star, 
  CheckCircle, 
  Zap, 
  FileText, 
  TrendingUp, 
  Clock, 
  Bot, 
  BookOpen,
  Award,
  Download,
  Sparkles,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const dttoolsIcon = "/logo-icon.png";

const phases = [
  {
    id: 1,
    icon: Users,
    name: "Empatizar",
    nameEn: "Empathize",
    nameDe: "Empathize",
    nameFr: "Empathiser",
    nameZh: "同理",
    nameEs: "Empatizar",
    description: "Compreenda profundamente seus usuários através de personas, entrevistas e mapas de empatia estruturados.",
    descriptionEn: "Deeply understand your users through structured personas, interviews and empathy maps.",
    descriptionDe: "Verstehe deine Nutzer tiefgehend durch strukturierte Personas, Interviews und Empathy Maps.",
    descriptionFr: "Comprenez en profondeur vos utilisateurs grâce à des personas, des entretiens et des cartes d’empathie structurées.",
    descriptionZh: "通过人物角色、访谈和同理心地图等结构化工具，深入理解你的用户。",
    descriptionEs: "Comprende profundamente a tus usuarios mediante personas, entrevistas y mapas de empatía estructurados.",
    bgColor: "#FFF5F5", 
    borderColor: "#E53E3E",
    iconColor: "#C53030",
    tools: ["Personas", "Entrevistas", "Mapas de Empatia", "Observações"]
  },
  {
    id: 2,
    icon: Target,
    name: "Definir",
    nameEn: "Define", 
    nameDe: "Define",
    nameFr: "Définir",
    nameZh: "定义",
    nameEs: "Definir",
    description: "Defina claramente problemas com declarações POV e perguntas 'Como Poderíamos...' focadas.",
    descriptionEn: "Clearly define problems with POV statements and focused 'How Might We...' questions.",
    descriptionDe: "Definiere Probleme klar mit POV-Statements und fokussierten 'How Might We...'-Fragen.",
    descriptionFr: "Définissez clairement les problèmes avec des énoncés POV et des questions « How Might We » ciblées.",
    descriptionZh: "通过 POV 陈述和聚焦的“我们如何才能”问题，清晰定义真正要解决的挑战。",
    descriptionEs: "Define con claridad los problemas con declaraciones POV y preguntas «¿Cómo podríamos...? » enfocadas.",
    bgColor: "#FFFAF0", 
    borderColor: "#DD6B20",
    iconColor: "#C05621",
    tools: ["Declarações POV", "Perguntas HMW", "Problem Statements", "Insights"]
  },
  {
    id: 3,
    icon: Lightbulb,
    name: "Idear", 
    nameEn: "Ideate",
    nameDe: "Ideate",
    nameFr: "Idéation",
    nameZh: "发想",
    nameEs: "Idear",
    description: "Gere centenas de ideias criativas com brainstorming estruturado e ferramentas de ideação.",
    descriptionEn: "Generate hundreds of creative ideas with structured brainstorming and ideation tools.",
    descriptionDe: "Erzeuge viele kreative Ideen mit strukturiertem Brainstorming und Ideation-Tools.",
    descriptionFr: "Générez des dizaines d’idées créatives avec des sessions de brainstorming structurées et des outils d’idéation.",
    descriptionZh: "借助结构化头脑风暴和创意工具，生成数百个具有突破性的解决方案想法。",
    descriptionEs: "Genera cientos de ideas creativas con sesiones de lluvia de ideas estructuradas y herramientas de ideación.",
    bgColor: "#FFFBEB", 
    borderColor: "#D69E2E",
    iconColor: "#B7791F",
    tools: ["Brainstorming", "Crazy 8s", "Ideação Guiada", "Seleção de Ideias"]
  },
  {
    id: 4,
    icon: Wrench,
    name: "Prototipar",
    nameEn: "Prototype",
    nameDe: "Prototype",
    nameFr: "Prototyper",
    nameZh: "原型",
    nameEs: "Prototipar",
    description: "Construa protótipos rápidos e baratos para testar suas melhores ideias de forma iterativa.",
    descriptionEn: "Build quick and inexpensive prototypes to test your best ideas iteratively.",
    descriptionDe: "Baue schnelle, kostengünstige Prototypen, um deine besten Ideen iterativ zu testen.",
    descriptionFr: "Construisez des prototypes rapides et peu coûteux pour tester vos meilleures idées de façon itérative.",
    descriptionZh: "快速、低成本地构建原型，用真实用户持续验证你最有潜力的创意。",
    descriptionEs: "Construye prototipos rápidos y económicos para probar tus mejores ideas de forma iterativa.",
    bgColor: "#EBF8FF", 
    borderColor: "#3182CE",
    iconColor: "#2C5282",
    tools: ["Wireframes", "Storyboards", "Protótipos Papel", "MVPs"]
  },
  {
    id: 5,
    icon: TestTube,
    name: "Testar",
    nameEn: "Test",
    nameDe: "Test",
    nameFr: "Tester",
    nameZh: "测试",
    nameEs: "Probar",
    description: "Teste com usuários reais e colete feedback valioso para iteração contínua.",
    descriptionEn: "Test with real users and collect valuable feedback for continuous iteration.",
    descriptionDe: "Teste mit echten Nutzern und sammle wertvolles Feedback für kontinuierliche Iteration.",
    descriptionFr: "Testez avec de vrais utilisateurs et recueillez des retours précieux pour itérer en continu.",
    descriptionZh: "与真实用户一起测试解决方案，并收集可操作的反馈以持续迭代。",
    descriptionEs: "Prueba con usuarios reales y recoge feedback valioso para una iteración continua.",
    bgColor: "#F0FFF4", 
    borderColor: "#38A169",
    iconColor: "#2F855A",
    tools: ["Testes de Usabilidade", "A/B Testing", "Feedback Forms", "Métricas"]
  }
];

const competitiveAdvantages = [
  {
    icon: FileText,
    title: "PDF Profissional com Logo DTTools",
    titleEn: "Professional PDF with DTTools Logo",
    titleDe: "Professionelles PDF mit DTTools-Logo",
    titleFr: "PDF professionnel avec logo DTTools",
    titleZh: "带 DTTools 标志的专业 PDF 导出",
    titleEs: "PDF profesional con logo de DTTools",
    description: "Exporte seus projetos completos em PDF com design profissional e logo DTTools para apresentações executivas.",
    descriptionEn: "Export your complete projects in PDF with professional design and DTTools logo for executive presentations.",
    descriptionDe: "Exportiere deine vollständigen Projekte als PDF mit professionellem Design und DTTools-Logo für Executive-Präsentationen.",
    descriptionFr: "Exportez vos projets complets en PDF avec un design professionnel et le logo DTTools pour vos présentations de direction.",
    descriptionZh: "将完整项目一键导出为专业设计的 PDF，并自动添加 DTTools 品牌标识，适合高层汇报和客户演示。",
    descriptionEs: "Exporta tus proyectos completos en PDF con diseño profesional y el logo de DTTools para presentaciones executivas.",
    highlight: true
  },
  {
    icon: Bot,
    title: "IA Integrada para Análises Avançadas", 
    titleEn: "Integrated AI for Advanced Analytics",
    titleDe: "Integrierte KI für erweiterte Analysen",
    titleFr: "IA intégrée pour des analyses avancées",
    titleZh: "集成式 AI 高级分析",
    titleEs: "IA integrada para análisis avanzados",
    description: "Chat IA especializado em Design Thinking para insights personalizados e sugestões em cada fase.",
    descriptionEn: "AI chat specialized in Design Thinking for personalized insights and suggestions in each phase.",
    descriptionDe: "KI-Chat, spezialisiert auf Design Thinking, für personalisierte Insights und Vorschläge in jeder Phase.",
    descriptionFr: "Un chat IA spécialisé en Design Thinking pour vous donner des insights personnalisés et des prochaines étapes à chaque phase.",
    descriptionZh: "内置专注于设计思维的 AI 聊天，为每个阶段提供个性化洞察和下一步建议。",
    descriptionEs: "Chat de IA especializado en Design Thinking para insights personalizados y sugerencias en cada fase."
  },
  {
    icon: Zap,
    title: "Colaboração em Tempo Real",
    titleEn: "Real-time Collaboration", 
    titleDe: "Zusammenarbeit in Echtzeit",
    titleFr: "Collaboration en temps réel",
    titleZh: "实时协作",
    titleEs: "Colaboración en tiempo real",
    description: "Trabalhe simultaneamente com sua equipe em projetos complexos com sincronização instantânea.",
    descriptionEn: "Work simultaneously with your team on complex projects with instant synchronization.",
    descriptionDe: "Arbeite gleichzeitig mit deinem Team an komplexen Projekten – mit sofortiger Synchronisierung.",
    descriptionFr: "Collaborez avec votre équipe en temps réel sur des projets complexes avec une synchronisation instantanée.",
    descriptionZh: "与你的团队同时在线协作处理复杂项目，所有更改实时同步。",
    descriptionEs: "Trabaja simultáneamente con tu equipo en proyectos complejos con sincronización instantánea."
  },
  {
    icon: Award,
    title: "Progresso Gamificado",
    titleEn: "Gamified Progress",
    titleDe: "Gamifizierter Fortschritt",
    titleFr: "Progression gamifiée",
    titleZh: "游戏化进度激励",
    titleEs: "Progreso gamificado",
    description: "Acompanhe progresso com métricas visuais, badges e sistema de pontuação motivacional.",
    descriptionEn: "Track progress with visual metrics, badges and motivational scoring system.",
    descriptionDe: "Verfolge den Fortschritt mit visuellen Metriken, Badges und einem motivierenden Punktesystem.",
    descriptionFr: "Suivez la progression avec des métriques visuelles, des badges et un système de points motivant pour votre équipe.",
    descriptionZh: "通过可视化指标、徽章和积分系统跟踪项目进度，让团队保持高动力。",
    descriptionEs: "Acompaña el progreso con métricas visuales, insignias y un sistema de puntuación motivador."
  },
  {
    icon: BookOpen,
    title: "Biblioteca de Artigos Especializados",
    titleEn: "Specialized Article Library",
    titleDe: "Bibliothek mit spezialisierten Artikeln",
    titleFr: "Bibliothèque d’articles spécialisés",
    titleZh: "专业文章与模板库",
    titleEs: "Biblioteca de artículos especializados",
    description: "Acesso a centenas de artigos, templates e melhores práticas de Design Thinking.",
    descriptionEn: "Access to hundreds of articles, templates and Design Thinking best practices.",
    descriptionDe: "Zugriff auf hunderte Artikel, Templates und Best Practices für Design Thinking.",
    descriptionFr: "Accédez à des centaines d’articles, de modèles et de meilleures pratiques en Design Thinking.",
    descriptionZh: "访问数百篇精选文章、模板和设计思维最佳实践，随时学习与复用。",
    descriptionEs: "Acceso a cientos de artículos, plantillas y mejores prácticas de Design Thinking."
  },
  {
    icon: TrendingUp,
    title: "Ferramentas Guiadas e Profissionais",
    titleEn: "Guided Professional Tools",
    titleDe: "Geführte, professionelle Tools",
    titleFr: "Outils guidés et professionnels",
    titleZh: "专业级引导式工具",
    titleEs: "Herramientas guiadas y profesionales",
    description: "Ferramentas especializadas para cada fase com orientações passo-a-passo para resultados consistentes.",
    descriptionEn: "Specialized tools for each phase with step-by-step guidance for consistent results.",
    descriptionDe: "Spezialisierte Tools für jede Phase – mit Schritt-für-Schritt-Anleitung für konsistente Ergebnisse.",
    descriptionFr: "Des outils spécialisés pour chaque phase avec un guidage pas à pas pour des résultats cohérents.",
    descriptionZh: "为每个阶段提供专门工具与分步指引，帮助你持续交付高质量成果。",
    descriptionEs: "Herramientas especializadas para cada fase con guías paso a paso para resultados consistentes."
  }
];

const benefits = [
  {
    icon: CheckCircle,
    title: "Processo Estruturado vs Métodos Ad-Hoc",
    titleEn: "Structured Process vs Ad-Hoc Methods",
    titleDe: "Strukturierter Prozess vs. Ad-hoc-Methoden",
    titleFr: "Processus structuré vs méthodes ad-hoc",
    titleZh: "结构化流程 vs 临时拼凑",
    titleEs: "Proceso estructurado vs métodos ad-hoc",
    description: "Methodology comprovada vs tentativa e erro sem direção",
    descriptionEn: "Proven methodology vs trial and error without direction",
    descriptionDe: "Bewährte Methodik statt Versuch-und-Irrtum ohne klare Richtung.",
    descriptionFr: "Une méthodologie éprouvée au lieu de l’essai-erreur sans direction claire.",
    descriptionZh: "通过结构化流程，避免盲目尝试和错误，确保项目高效推进。",
    descriptionEs: "Metodología probada frente a prueba y error sin dirección."
  },
  {
    icon: Clock,
    title: "40% Mais Rápido",
    titleEn: "40% Faster",
    titleDe: "40% schneller",
    titleFr: "40 % plus rapide",
    titleZh: "效率提升 40%",
    titleEs: "40% más rápido",
    description: "Reduza tempo de desenvolvimento com ferramentas otimizadas",
    descriptionEn: "Reduce development time with optimized tools",
    descriptionDe: "Reduziere die Entwicklungszeit mit optimierten Tools.",
    descriptionFr: "Réduisez le temps de développement grâce à des outils optimisés.",
    descriptionZh: "通过优化工具，缩短开发时间，提高工作效率。",
    descriptionEs: "Reduce el tiempo de desarrollo con herramientas optimizadas."
  },
  {
    icon: Users,
    title: "Melhor Colaboração",
    titleEn: "Better Collaboration", 
    titleDe: "Bessere Zusammenarbeit",
    titleFr: "Meilleure collaboration",
    titleZh: "更强的团队协作",
    titleEs: "Mejor colaboración",
    description: "Equipes alinhadas com visibilidade completa do projeto",
    descriptionEn: "Aligned teams with complete project visibility",
    descriptionDe: "Abgestimmte Teams mit vollständiger Transparenz über das Projekt.",
    descriptionFr: "Des équipes alignées avec une visibilité complète sur le projet.",
    descriptionZh: "通过实时协作和可视化项目管理，提高团队协作效率。",
    descriptionEs: "Equipos alineados con visibilidad completa del proyecto."
  }
];

const testimonials = [
  {
    name: "Maria Fernanda Silva",
    role: "Head of Innovation",
    company: "TechCorp Brasil",
    content: "DTTools revolucionou nossa abordagem de inovação. Com o sistema de projetos estruturado, conseguimos reduzir em 40% o tempo de desenvolvimento de novas soluções. Os PDFs com logo DTTools impressionam nossos stakeholders.",
    contentEn: "DTTools revolutionized our innovation approach. With the structured project system, we managed to reduce new solution development time by 40%. The PDFs with DTTools logo impress our stakeholders.",
    contentDe: "DTTools hat unseren Innovationsansatz revolutioniert. Mit dem strukturierten Projektsystem konnten wir die Entwicklungszeit für neue Lösungen um 40% reduzieren. Die PDFs mit DTTools-Logo beeindrucken unsere Stakeholder.",
    contentFr: "DTTools a révolutionné notre approche de l’innovation. Grâce au système de projets structuré, nous avons réduit de 40 % le temps de développement de nouvelles solutions. Les PDF avec le logo DTTools impressionnent nos parties prenantes.",
    contentZh: "DTTools 彻底改变了我们的创新流程。借助结构化的项目系统，我们将新方案的开发时间缩短了约 40%，带有 DTTools 品牌标识的专业 PDF 也深受利益相关方认可。",
    contentEs: "DTTools revolucionó nuestro enfoque de innovación. Con el sistema de proyectos estructurado, conseguimos reducir en un 40 % el tiempo de desarrollo de nuevas soluciones. Los PDF con el logo de DTTools impresionan a nuestros stakeholders.",
    avatar: "MF"
  },
  {
    name: "Roberto Santos", 
    role: "Product Manager",
    company: "InovaTech",
    content: "A integração com IA é um diferencial imenso. O chat especializado me ajuda a tomar decisões melhores em cada fase do Design Thinking. Nunca vi uma ferramenta tão completa.",
    contentEn: "The AI integration is a huge differentiator. The specialized chat helps me make better decisions in each Design Thinking phase. I've never seen such a complete tool.",
    contentDe: "Die KI-Integration ist ein riesiger Vorteil. Der spezialisierte Chat hilft mir, in jeder Design-Thinking-Phase bessere Entscheidungen zu treffen. Ich habe noch nie ein so vollständiges Tool gesehen.",
    contentFr: "L’intégration de l’IA est un énorme différenciateur. Le chat spécialisé m’aide à prendre de meilleures décisions à chaque phase du Design Thinking. Je n’ai jamais vu un outil aussi complet.",
    contentZh: "与 AI 的深度集成让我们的工作方式焕然一新。专注设计思维的聊天助手在每个阶段都给出更好的决策建议，这是我用过最完整的一款工具。",
    contentEs: "La integración con IA es un diferencial enorme. El chat especializado me ayuda a tomar mejores decisiones en cada fase del Design Thinking. Nunca había visto una herramienta tan completa.",
    avatar: "RS"
  },
  {
    name: "Ana Carolina Costa",
    role: "Design Lead", 
    company: "Creative Agency",
    content: "Nossos clientes ficaram impressionados com a qualidade dos projetos que entregamos usando DTTools. O progresso gamificado motiva toda a equipe e os resultados são excepcionais.",
    contentEn: "Our clients were impressed with the quality of projects we deliver using DTTools. The gamified progress motivates the entire team and results are exceptional.",
    contentDe: "Unsere Kunden waren beeindruckt von der Qualität der Projekte, die wir mit DTTools liefern. Der gamifizierte Fortschritt motiviert das gesamte Team – und die Ergebnisse sind außergewöhnlich.",
    contentFr: "Nos clients sont impressionnés par la qualité des projets que nous livrons avec DTTools. La progression gamifiée motive toute l’équipe et les résultats sont exceptionnels.",
    contentZh: "使用 DTTools 之后，我们交付的项目质量令客户印象深刻。游戏化进度激励让整个团队始终保持热情，结果非常出色。",
    contentEs: "Nuestros clientes quedaron impresionados con la calidad de los proyectos que entregamos usando DTTools. El progreso gamificado motiva a todo el equipo y los resultados son excepcionales.",
    avatar: "AC"
  }
];

export default function ProjectsMarketingPage() {
  const { t, language } = useLanguage();
  const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);
  const { theme } = useTheme();
  const isDarkTheme =
    theme === "dark" ||
    (typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark"));
  const isChinese = language === 'zh';
  const isFrench = language === 'fr';
  const isSpanish = language === 'es';
  const isGerman = language === 'de';
  const isEnglish = language === 'en' || language === 'de';

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section
        className={
          "relative bg-gradient-to-br overflow-hidden " +
          (isDarkTheme
            ? "from-slate-950 via-slate-900 to-slate-950"
            : "from-blue-50 via-indigo-50 to-purple-50")
        }
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative container mx-auto px-6 py-20 lg:py-32">
          <div className="text-center max-w-5xl mx-auto">
            {/* DTTools Icon */}
            <div className="mb-6">
              <img 
                src={dttoolsIcon} 
                alt="DTTools" 
                className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 mx-auto mb-4 object-contain drop-shadow-lg"
                data-testid="dttools-icon-projects"
              />
            </div>

            <Badge
              className={
                "mb-4 " +
                (isDarkTheme
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-200")
              }
              data-testid="badge-projects-hero"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              {isChinese
                ? "设计思维项目"
                : isFrench
                  ? "Projets de Design Thinking"
                  : isGerman
                    ? "Design-Thinking-Projekte"
                  : isEnglish
                    ? "Design Thinking Projects"
                    : isSpanish
                      ? "Proyectos de Design Thinking"
                      : "Projetos de Design Thinking"}
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              {isChinese
                ? "将复杂问题转化为颠覆性解决方案"
                : isFrench
                  ? "Transformez des problèmes complexes en solutions révolutionnaires"
                  : isGerman
                    ? "Verwandle komplexe Probleme in bahnbrechende Lösungen"
                  : isEnglish 
                    ? "Transform Complex Problems into Revolutionary Solutions" 
                    : isSpanish
                      ? "Transforma Problemas Complejos en Soluciones Revolucionarias"
                      : "Transforme Problemas Complexos em Soluções Revolucionárias"}
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              {isChinese
                ? "最完整的设计思维项目平台，提供引导式工具、实时协作，以及带有 DTTools 品牌标识的专业 PDF 导出。"
                : isFrench
                  ? "La plateforme la plus complète pour vos projets de Design Thinking, avec des outils guidés, de la collaboration en temps réel et des exports PDF professionnels avec le logo DTTools."
                  : isGerman
                    ? "Die umfassendste Plattform für Design-Thinking-Projekte mit geführten Tools, Echtzeit-Zusammenarbeit und professionellen PDF-Exports mit DTTools Branding."
                  : isEnglish
                    ? "The most complete platform for Design Thinking projects with guided tools, real-time collaboration, and professional PDF exports with DTTools branding."
                    : isSpanish
                      ? "La plataforma más completa para proyectos de Design Thinking, con herramientas guiadas, colaboración en tiempo real y exportación profesional en PDF con el logo de DTTools."
                      : "A plataforma mais completa para projetos de Design Thinking com ferramentas guiadas, colaboração em tempo real e exportação profissional em PDF com logo DTTools."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/signup">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6" data-testid="button-start-free-projects">
                  {isChinese
                    ? "免费开始使用"
                    : isFrench
                      ? "Commencer gratuitement"
                      : isGerman
                        ? "Kostenlos starten"
                      : isEnglish
                        ? "Start for Free"
                        : isSpanish
                          ? "Comenzar Gratis"
                          : "Começar Grátis"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant={isDarkTheme ? "outline" : "outline"}
                  size="lg"
                  className={
                    "text-lg px-8 py-6 " +
                    (isDarkTheme
                      ? "border border-white/30 text-white/90 hover:bg-white/10"
                      : "border-blue-600 text-blue-700 hover:bg-blue-50")
                  }
                  data-testid="button-view-plans-projects"
                >
                  {isChinese
                    ? "查看方案"
                    : isFrench
                      ? "Voir les formules"
                      : isGerman
                        ? "Pläne ansehen"
                      : isEnglish
                        ? "View Plans"
                        : isSpanish
                          ? "Ver Planes"
                          : "Ver Planos"}
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              {isChinese
                ? "✨ 无需信用卡 • 7 天免费试用"
                : isFrench
                  ? "✨ Sans carte bancaire • Essai gratuit de 7 jours"
                  : isGerman
                    ? "✨ Keine Kreditkarte erforderlich • 7 Tage kostenlos testen"
                  : isEnglish
                    ? "✨ No credit card required • 7-day free trial"
                    : isSpanish
                      ? "✨ Sin tarjeta de crédito • 7 días gratis"
                      : "✨ Sem cartão de crédito • 7 dias grátis"}
            </p>
          </div>
        </div>
      </section>

      {/* How It Works - 5 Phases */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {isChinese
                ? "设计思维项目如何运作"
                : isFrench
                  ? "Comment fonctionnent les projets de Design Thinking"
                  : isGerman
                    ? "Wie Design-Thinking-Projekte funktionieren"
                  : isEnglish
                    ? "How Design Thinking Projects Work"
                    : isSpanish
                      ? "Cómo Funcionan los Proyectos de Design Thinking"
                      : "Como Funcionam os Projetos de Design Thinking"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {isChinese 
                ? "遵循全球顶尖创新企业采用的 5 个阶段方法论。每个阶段都配有专门工具和引导式流程，确保结果一致且可复用。"
                : isFrench
                  ? "Suivez une méthodologie éprouvée en 5 phases, utilisée par les entreprises les plus innovantes du monde. Chaque phase dispose d’outils spécialisés et de flux guidés pour des résultats cohérents."
                  : isGerman
                    ? "Folge einer bewährten 5‑Phasen‑Methodik, die von den innovativsten Unternehmen der Welt genutzt wird. Jede Phase hat spezialisierte Tools und geführte Workflows für konsistente Ergebnisse."
                  : isEnglish 
                    ? "Follow a proven 5-phase methodology used by the world's most innovative companies. Each phase has specialized tools and guided workflows for consistent results."
                    : isSpanish
                      ? "Sigue una metodología probada de 5 fases, utilizada por las empresas más innovadoras del mundo. Cada fase tiene herramientas especializadas y flujos guiados para resultados consistentes."
                      : "Siga uma metodologia comprovada de 5 fases usada pelas empresas mais inovadoras do mundo. Cada fase possui ferramentas especializadas e fluxos guiados para resultados consistentes."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              const isHovered = hoveredPhase === phase.id;
              
              return (
                <Card 
                  key={phase.id}
                  className={
                    "relative transition-all duration-300 cursor-pointer border-2 hover:shadow-xl hover:scale-105 " +
                    (isDarkTheme ? "bg-card border-border" : "")
                  }
                  style={{
                    backgroundColor: isDarkTheme ? undefined : phase.bgColor,
                    borderColor: isHovered ? phase.borderColor : (isDarkTheme ? undefined : '#e5e7eb')
                  }}
                  onMouseEnter={() => setHoveredPhase(phase.id)}
                  onMouseLeave={() => setHoveredPhase(null)}
                  data-testid={`card-phase-marketing-${phase.id}`}
                >
                  <CardHeader className="text-center pb-3">
                    <div 
                      className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-all duration-300"
                      style={{
                        backgroundColor: isHovered
                          ? phase.borderColor
                          : (isDarkTheme ? 'hsl(var(--muted))' : 'white'),
                        color: isHovered ? 'white' : phase.iconColor,
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                      }}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <CardTitle className="text-lg font-semibold mb-2">
                      {index + 1}. {isChinese ? phase.nameZh : isFrench ? phase.nameFr : isGerman ? phase.nameDe : isEnglish ? phase.nameEn : isSpanish ? phase.nameEs : phase.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm text-foreground/80 leading-relaxed mb-3">
                      {isChinese ? phase.descriptionZh : isFrench ? phase.descriptionFr : isGerman ? phase.descriptionDe : isEnglish ? phase.descriptionEn : isSpanish ? phase.descriptionEs : phase.description}
                    </CardDescription>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        {isChinese
                          ? "工具："
                          : isFrench
                            ? "Outils :"
                            : isGerman
                              ? "Tools:"
                            : isEnglish
                              ? "Tools:"
                              : isSpanish
                                ? "Herramientas:"
                                : "Ferramentas:"}
                      </p>
                      {phase.tools.slice(0, 2).map((tool, i) => (
                        <div key={i} className="text-xs text-muted-foreground flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                          {tool}
                        </div>
                      ))}
                      <p className="text-xs text-muted-foreground">
                        {isChinese
                          ? `+${phase.tools.length - 2} 个更多`
                          : isFrench
                            ? `+${phase.tools.length - 2} de plus`
                            : isGerman
                              ? `+${phase.tools.length - 2} mehr`
                            : isEnglish
                              ? `+${phase.tools.length - 2} more`
                              : isSpanish
                                ? `+${phase.tools.length - 2} más`
                                : `+${phase.tools.length - 2} mais`}
                      </p>
                    </div>
                  </CardContent>
                  
                  {index < phases.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Benchmarking CTA */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <div className="max-w-3xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  {isChinese
                    ? "衡量你的设计思维成熟度"
                    : isFrench
                      ? "Mesurez la maturité de votre Design Thinking"
                      : isGerman
                        ? "Miss deine Design-Thinking-Reife"
                      : isEnglish
                        ? "Measure Your Design Thinking Maturity"
                        : isSpanish
                          ? "Mide tu Madurez en Design Thinking"
                          : "Meça sua Maturidade em Design Thinking"}
                </h3>
                <p className="text-lg opacity-90 mb-6">
                  {isChinese 
                    ? "将你的团队表现与行业基准进行对比，利用高级分析识别需要提升的关键点。"
                    : isFrench
                      ? "Comparez la performance de votre équipe aux références du marché et identifiez les axes d’amélioration grâce à nos analyses avancées."
                      : isGerman
                        ? "Vergleiche die Performance deines Teams mit Branchen-Benchmarks und identifiziere Verbesserungsbereiche mit unseren erweiterten Analysen."
                      : isEnglish 
                        ? "Compare your team's performance with industry benchmarks and identify areas for improvement with our advanced analytics."
                        : isSpanish
                          ? "Compara el desempeño de tu equipo con los referentes del mercado e identifica áreas de mejora con nuestras analíticas avanzadas."
                          : "Compare o desempenho da sua equipe com benchmarks da indústria e identifique áreas de melhoria com nossa análise avançada."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Advantages */}
      <section className={"py-20 " + (isDarkTheme ? "bg-background" : "bg-gray-50")}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {isChinese
                ? "为什么选择 DTTools"
                : isFrench
                  ? "Pourquoi DTTools est différent"
                  : isGerman
                    ? "Warum DTTools anders ist"
                  : isEnglish
                    ? "Why DTTools is Different"
                    : isSpanish
                      ? "Por qué DTTools es Diferente"
                      : "Por que DTTools é Diferente"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {isChinese 
                ? "一系列高级功能，让你远远领先于传统设计思维工具和常规协作平台。"
                : isFrench
                  ? "Des fonctionnalités avancées qui nous distinguent des méthodes traditionnelles de Design Thinking et des autres plateformes."
                  : isGerman
                    ? "Erweiterte Funktionen, die uns von traditionellen Design-Thinking-Methoden und anderen Plattformen abheben."
                  : isEnglish 
                    ? "Advanced features that set us apart from traditional Design Thinking methods and other platforms."
                    : isSpanish
                      ? "Funcionalidades avanzadas que nos diferencian de los métodos tradicionales de Design Thinking y de otras plataformas."
                      : "Recursos avançados que nos diferenciam dos métodos tradicionais de Design Thinking e outras plataformas."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {competitiveAdvantages.map((advantage, index) => {
              const Icon = advantage.icon;
              
              return (
                <Card 
                  key={index} 
                  className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                    advantage.highlight
                      ? (isDarkTheme ? 'ring-2 ring-blue-500 bg-blue-950/30' : 'ring-2 ring-blue-500 bg-blue-50')
                      : 'hover:scale-105'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <div 
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          advantage.highlight 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      {advantage.highlight && (
                        <Badge className="bg-blue-600 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          {isChinese
                            ? "推荐"
                            : isFrench
                              ? "En vedette"
                              : isGerman
                                ? "Highlight"
                              : isEnglish
                                ? "Featured"
                                : "Destaque"}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl font-semibold">
                      {isChinese
                        ? advantage.titleZh
                        : isFrench
                          ? advantage.titleFr
                          : isGerman
                            ? advantage.titleDe
                            : isEnglish
                              ? advantage.titleEn
                              : isSpanish
                                ? advantage.titleEs
                                : advantage.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {isChinese
                        ? advantage.descriptionZh
                        : isFrench
                          ? advantage.descriptionFr
                          : isGerman
                            ? advantage.descriptionDe
                            : isEnglish
                              ? advantage.descriptionEn
                              : isSpanish
                                ? advantage.descriptionEs
                                : advantage.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Comparison */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {isChinese
                ? "结构化平台 vs 传统方法"
                : isFrench
                  ? "Plateforme structurée vs méthodes traditionnelles"
                  : isGerman
                    ? "Strukturierte Plattform vs. traditionelle Methoden"
                  : isEnglish
                    ? "Structured Platform vs Traditional Methods"
                    : isSpanish
                      ? "Plataforma Estructurada vs Métodos Tradicionales"
                      : "Plataforma Estruturada vs Métodos Tradicionais"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {isChinese 
                ? "使用专业的设计思维平台，你可以清晰量化每一次迭代带来的真实影响。"
                : isFrench
                  ? "Voyez l’impact mesurable lorsque vous utilisez une plateforme professionnelle de Design Thinking."
                  : isGerman
                    ? "Erlebe den messbaren Unterschied, wenn du eine professionelle Design-Thinking-Plattform nutzt."
                  : isEnglish 
                    ? "See the measurable difference when you use a professional Design Thinking platform."
                    : isSpanish
                      ? "Ve la diferencia medible cuando utilizas una plataforma profesional de Design Thinking."
                      : "Veja a diferença mensurável quando você usa uma plataforma profissional de Design Thinking."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              
              return (
                <Card key={index} className="text-center border-0 shadow-lg">
                  <CardHeader>
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-950/40 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-8 h-8 text-green-600" />
                    </div>
                    <CardTitle className="text-xl font-semibold">
                      {isChinese
                        ? benefit.titleZh
                        : isFrench
                          ? benefit.titleFr
                          : isGerman
                            ? benefit.titleDe
                            : isEnglish
                              ? benefit.titleEn
                              : isSpanish
                                ? benefit.titleEs
                                : benefit.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {isChinese
                        ? benefit.descriptionZh
                        : isFrench
                          ? benefit.descriptionFr
                          : isGerman
                            ? benefit.descriptionDe
                            : isEnglish
                              ? benefit.descriptionEn
                              : isSpanish
                                ? benefit.descriptionEs
                                : benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {isChinese
                ? "深受创新领袖信赖"
                : isFrench
                  ? "Plébiscité par les leaders de l’innovation"
                  : isGerman
                    ? "Vertrauen von Innovationsführern"
                  : isEnglish
                    ? "Trusted by Innovation Leaders"
                    : isSpanish
                      ? "Confiado por Líderes de Innovación"
                      : "Confiado por Líderes de Inovação"}
            </h2>
            <div className="flex justify-center items-center gap-2 mb-8">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-blue-100 font-medium">
                {isChinese
                  ? "4.9/5，超过 2,500 名用户好评"
                  : isFrench
                    ? "4,9/5, plus de 2 500 utilisateurs"
                    : isGerman
                      ? "4,9/5 von über 2.500 Nutzern"
                    : isEnglish
                      ? "4.9/5 from 2,500+ users"
                      : isSpanish
                        ? "4,9/5 de más de 2.500 usuarios"
                        : "4.9/5 de mais de 2.500 usuários"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className={
                  "border-0 shadow-xl backdrop-blur-sm " +
                  (isDarkTheme ? "bg-card/90" : "bg-white/95")
                }
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-foreground/80 italic mb-4 leading-relaxed">
                    "{isChinese
                      ? testimonial.contentZh
                      : isFrench
                        ? testimonial.contentFr
                        : isGerman
                          ? testimonial.contentDe
                        : isEnglish
                          ? testimonial.contentEn
                          : isSpanish
                            ? testimonial.contentEs
                            : testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {testimonial.avatar}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      <div className="text-sm text-blue-600 font-medium">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className={"py-20 " + (isDarkTheme ? "bg-background" : "bg-gray-50")}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {isChinese
              ? "从今天起开启你的设计思维之旅"
              : isFrench
                ? "Commencez votre parcours Design Thinking dès aujourd’hui"
                : isGerman
                  ? "Starte noch heute deine Design-Thinking-Reise"
                : isEnglish
                  ? "Start Your Design Thinking Journey Today"
                  : isSpanish
                    ? "Comienza hoy tu Viaje de Design Thinking"
                    : "Comece sua Jornada de Design Thinking Hoje"}
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            {isChinese 
              ? "加入来自全球的创新者行列，借助 DTTools 结构化的设计思维项目，持续创造突破性解决方案。"
              : isFrench
                ? "Rejoignez des milliers d’innovateurs qui utilisent DTTools pour créer des solutions de rupture avec des projets de Design Thinking structurés."
                : isGerman
                  ? "Schließe dich tausenden Innovatoren an, die mit DTTools strukturierte Design-Thinking-Projekte nutzen, um bahnbrechende Lösungen zu entwickeln."
                : isEnglish 
                  ? "Join thousands of innovators using DTTools to create breakthrough solutions with structured Design Thinking projects."
                  : isSpanish
                    ? "Únete a miles de innovadores que usan DTTools para crear soluciones revolucionarias con proyectos de Design Thinking estructurados."
                    : "Junte-se a milhares de inovadores usando DTTools para criar soluções revolucionárias com projetos estruturados de Design Thinking."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6" data-testid="button-start-trial-cta">
                {isChinese
                  ? "开始 7 天免费试用"
                  : isFrench
                    ? "Commencer l’essai gratuit de 7 jours"
                    : isGerman
                      ? "7 Tage kostenlos testen"
                    : isEnglish
                      ? "Start 7-Day Free Trial"
                      : isSpanish
                        ? "Comenzar Prueba Gratis de 7 Días"
                        : "Começar Teste Grátis de 7 Dias"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant={isDarkTheme ? "outline" : "outline"}
                size="lg"
                className={
                  "text-lg px-8 py-6 " +
                  (isDarkTheme
                    ? "border border-white/30 text-foreground hover:bg-white/10"
                    : "border-blue-600 text-blue-700 hover:bg-blue-50")
                }
                data-testid="button-see-plans-cta"
              >
                {isChinese
                  ? "查看所有方案与价格"
                  : isFrench
                    ? "Voir tous les plans et tarifs"
                    : isGerman
                      ? "Alle Pläne & Preise ansehen"
                    : isEnglish
                      ? "See All Plans & Pricing"
                      : isSpanish
                        ? "Ver Todos los Planes y Precios"
                        : "Ver Todos os Planos e Preços"}
              </Button>
            </Link>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {isChinese
                ? "✨ 无需信用卡 • 随时可以取消"
                : isFrench
                  ? "✨ Sans carte bancaire • Annulez à tout moment"
                  : isGerman
                    ? "✨ Keine Kreditkarte erforderlich • Jederzeit kündbar"
                  : isEnglish
                    ? "✨ No credit card required • Cancel anytime"
                    : isSpanish
                      ? "✨ Sin tarjeta de crédito • Cancela cuando quieras"
                      : "✨ Sem cartão de crédito • Cancele a qualquer momento"}
            </p>
            <p className="text-sm text-blue-600 font-medium">
              {isChinese
                ? "🎁 几分钟内即可开始创建专业级设计思维项目"
                : isFrench
                  ? "🎁 Commencez à créer des projets de Design Thinking professionnels en quelques minutes"
                  : isGerman
                    ? "🎁 Starte in wenigen Minuten mit professionellen Design-Thinking-Projekten"
                  : isEnglish
                    ? "🎁 Start creating professional Design Thinking projects in minutes"
                    : isSpanish
                      ? "🎁 Empieza a crear proyectos profesionales de Design Thinking en minutos"
                      : "🎁 Comece a criar projetos profissionais de Design Thinking em minutos"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}