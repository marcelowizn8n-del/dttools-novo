import { useMemo } from "react";
import { useParams, Link } from "wouter";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Map, User, Smile, Meh, Frown, Activity } from "lucide-react";

interface JourneyStage {
  id: string;
  title: string;
  description: string;
  order: number;
}

interface Touchpoint {
  id: string;
  stageId: string;
  title: string;
  userGoal: string;
  userAction: string;
  channel: string;
  emotionScore: number; // 1-5
  painPoints?: string;
  opportunities?: string;
}

const mockStages: JourneyStage[] = [
  {
    id: "discover",
    title: "Descoberta",
    description: "Como o usuário conhece o produto e identifica a necessidade.",
    order: 0,
  },
  {
    id: "consider",
    title: "Consideração",
    description: "Avaliação de opções e entendimento de valor.",
    order: 1,
  },
  {
    id: "onboarding",
    title: "Onboarding",
    description: "Primeiros passos dentro da plataforma.",
    order: 2,
  },
  {
    id: "use",
    title: "Uso recorrente",
    description: "Rotina de uso e entrega de valor contínuo.",
    order: 3,
  },
  {
    id: "advocacy",
    title: "Defesa da marca",
    description: "Quando o usuário recomenda e influencia outras pessoas.",
    order: 4,
  },
];

const mockTouchpoints: Touchpoint[] = [
  {
    id: "tp1",
    stageId: "discover",
    title: "Pesquisa no Google",
    userGoal: "Encontrar uma ferramenta para organizar projetos de inovação.",
    userAction: "Busca termos como 'design thinking tools' e compara resultados.",
    channel: "Web - Busca orgânica",
    emotionScore: 2,
    painPoints: "Resultados genéricos, difícil entender diferenças entre soluções.",
    opportunities: "Landing page clara sobre as 5 fases e casos de uso reais.",
  },
  {
    id: "tp2",
    stageId: "discover",
    title: "Post em LinkedIn",
    userGoal: "Ver exemplos práticos de aplicação da ferramenta.",
    userAction: "Clica em um post com vídeo curto mostrando a jornada no DTTools.",
    channel: "Redes sociais - LinkedIn",
    emotionScore: 4,
    opportunities: "Refinar narrativa visual da jornada, destacar benefícios rápidos.",
  },
  {
    id: "tp3",
    stageId: "consider",
    title: "Página de preço",
    userGoal: "Entender planos, limitações e se cabe no orçamento.",
    userAction: "Compara planos Free e Pro, lê seções de perguntas frequentes.",
    channel: "Web - Página de pricing",
    emotionScore: 3,
    painPoints: "Dúvida sobre limites de projetos e colaboração em equipe.",
    opportunities: "Adicionar exemplos de times reais e limites claros por plano.",
  },
  {
    id: "tp4",
    stageId: "onboarding",
    title: "Criação do primeiro projeto",
    userGoal: "Configurar rapidamente um projeto piloto para testar com o time.",
    userAction: "Usa o fluxo guiado para criar projeto e convida 2 pessoas.",
    channel: "Produto - App Web",
    emotionScore: 4,
    opportunities: "Sugestões inteligentes de templates de jornada e ferramentas.",
  },
  {
    id: "tp5",
    stageId: "use",
    title: "Oficina com o time",
    userGoal: "Conduzir sessão de design thinking sem fricção.",
    userAction: "Projeta o dashboard em TV e usa as ferramentas em tempo real.",
    channel: "Produto + Sessão presencial / remota",
    emotionScore: 5,
    opportunities: "Modo facilitador com timers, anotações rápidas e export fácil.",
  },
  {
    id: "tp6",
    stageId: "advocacy",
    title: "Compartilhar resultados",
    userGoal: "Mostrar impacto da jornada para liderança e stakeholders.",
    userAction: "Exporta materiais e compartilha link do projeto/jornada.",
    channel: "Produto - Exports",
    emotionScore: 4,
    opportunities: "Relatórios prontos para apresentação e templates de storytelling.",
  },
];

function getEmotionMeta(score: number) {
  const clamped = Math.min(5, Math.max(1, score));

  if (clamped <= 2) {
    return {
      label: "Muito negativo",
      badgeClass:
        "bg-red-900/50 text-red-50 border border-red-500/40",
      icon: <Frown className="w-3 h-3" />,
    };
  }

  if (clamped === 3) {
    return {
      label: "Neutro",
      badgeClass:
        "bg-slate-800/60 text-slate-100 border border-slate-600/60",
      icon: <Meh className="w-3 h-3" />,
    };
  }

  if (clamped === 4) {
    return {
      label: "Positivo",
      badgeClass:
        "bg-emerald-900/40 text-emerald-100 border border-emerald-500/50",
      icon: <Smile className="w-3 h-3" />,
    };
  }

  return {
    label: "Muito positivo",
    badgeClass:
      "bg-emerald-900/70 text-emerald-50 border border-emerald-400/70",
    icon: <Smile className="w-3 h-3" />,
  };
}

export default function ProjectJourneyPage() {
  const params = useParams();
  const projectId = params.id;

  const touchpointsByStage = useMemo(() => {
    const map: Record<string, Touchpoint[]> = {};
    for (const tp of mockTouchpoints) {
      if (!map[tp.stageId]) {
        map[tp.stageId] = [];
      }
      map[tp.stageId].push(tp);
    }
    return map;
  }, []);

  const sortedStages = [...mockStages].sort((a, b) => a.order - b.order);

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href={projectId ? `/projects/${projectId}` : "/projects"}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
            Mapa da Jornada do Usuário
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visualize as principais etapas e pontos de contato da experiência
            deste projeto.
          </p>
        </div>
        {projectId && (
          <Badge variant="outline" className="text-xs whitespace-nowrap">
            Projeto #{projectId}
          </Badge>
        )}
      </div>

      <Card className="bg-card/70 backdrop-blur-sm border border-border/70">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Map className="w-5 h-5 text-blue-500" />
              Jornada principal (MVP)
            </CardTitle>
            <CardDescription>
              Esta é uma jornada de exemplo para validar o fluxo visual. Em
              breve você poderá personalizar etapas e touchpoints usando dados
              reais do projeto.
            </CardDescription>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>
                Persona foco:{" "}
                <span className="font-medium text-foreground">
                  Product Manager digital
                </span>
              </span>
            </div>
            <Badge variant="secondary" className="text-[11px]">
              MVP • Dados de exemplo
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 md:mx-0 md:px-0">
        {sortedStages.map((stage) => {
          const touchpoints = touchpointsByStage[stage.id] || [];

          return (
            <div key={stage.id} className="min-w-[260px] max-w-sm flex-1">
              <Card className="h-full flex flex-col bg-card/80 border border-border/70">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base font-semibold text-foreground">
                        {stage.title}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {stage.description}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] uppercase tracking-wide"
                    >
                      Etapa {stage.order + 1}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-3">
                  {touchpoints.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      Nenhum touchpoint mapeado ainda nesta etapa.
                    </p>
                  ) : (
                    touchpoints.map((tp) => {
                      const emotion = getEmotionMeta(tp.emotionScore);

                      return (
                        <div
                          key={tp.id}
                          className="rounded-lg border border-border/60 bg-background/70 p-3 space-y-2 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="text-sm font-semibold text-foreground">
                                {tp.title}
                              </h3>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                Canal: {tp.channel}
                              </p>
                            </div>
                            <div
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${emotion.badgeClass}`}
                            >
                              {emotion.icon}
                              <span className="text-[10px] font-medium">
                                {emotion.label}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs">
                              <span className="font-medium text-muted-foreground">
                                Objetivo:
                              </span>{" "}
                              {tp.userGoal}
                            </p>
                            <p className="text-xs">
                              <span className="font-medium text-muted-foreground">
                                Ação:
                              </span>{" "}
                              {tp.userAction}
                            </p>
                            {tp.painPoints && (
                              <p className="text-xs">
                                <span className="font-medium text-red-400">
                                  Dores:
                                </span>{" "}
                                {tp.painPoints}
                              </p>
                            )}
                            {tp.opportunities && (
                              <p className="text-xs">
                                <span className="font-medium text-emerald-400">
                                  Oportunidades:
                                </span>{" "}
                                {tp.opportunities}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-1 w-full border-dashed text-xs"
                    disabled
                  >
                    <Activity className="w-3 h-3 mr-1" />
                    Em breve: adicionar touchpoint
                  </Button>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      <Card className="border-dashed border-muted-foreground/40 bg-muted/20">
        <CardContent className="py-4 text-xs text-muted-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            Esta visualização usa dados de exemplo para validação de UX. Na
            próxima etapa, vamos conectar cada etapa e touchpoint aos dados reais
            do projeto.
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
