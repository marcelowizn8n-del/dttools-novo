import { useMemo, useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useQueries, useMutation } from "@tanstack/react-query";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Map,
  User,
  Smile,
  Meh,
  Frown,
  Activity,
  Sparkles,
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import EditJourneyDialog from "@/components/journey/EditJourneyDialog";
import EditJourneyStageDialog from "@/components/journey/EditJourneyStageDialog";
import type { Journey, InsertJourney } from "@shared/schema";

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
  const { toast } = useToast();
  const params = useParams();
  const projectId = params.id;

  const {
    data: journeys,
    isLoading: isJourneysLoading,
  } = useQuery<Journey[] | null>({
    queryKey: ["/api/projects", projectId, "journeys"],
    enabled: !!projectId,
  });

  const journeyList = journeys || [];
  const mainJourney = journeyList[0];

  const {
    data: stages,
    isLoading: isStagesLoading,
  } = useQuery<JourneyStage[] | null>({
    queryKey: ["/api/journeys", mainJourney?.id ?? "", "stages"],
    enabled: !!mainJourney?.id,
  });

  const stageList = stages || [];

  const touchpointQueries = useQueries({
    queries: stageList.map((stage) => ({
      queryKey: ["/api/journey-stages", stage.id, "touchpoints"],
      enabled: !!stage.id,
    })),
  });

  const isTouchpointsLoading = touchpointQueries.some((q) => q.isLoading);

  const touchpointsByStage = useMemo(() => {
    const map: Record<string, Touchpoint[]> = {};
    stageList.forEach((stage, index) => {
      const query = touchpointQueries[index];
      const data = (query?.data as Touchpoint[] | null | undefined) || [];
      map[stage.id] = data;
    });
    return map;
  }, [stageList, touchpointQueries]);

  const isLoading =
    isJourneysLoading || (mainJourney && isStagesLoading) || isTouchpointsLoading;

  const sortedStages = [...stageList].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  const [aiSuggestion, setAiSuggestion] = useState<
    | {
        journey?: Partial<InsertJourney>;
        stages?: Array<{ title?: string; description?: string }>;
      }
    | null
  >(null);

  const personaLabel =
    mainJourney?.persona || aiSuggestion?.journey?.persona || "Persona principal";
  const primaryGoal =
    mainJourney?.primaryGoal || aiSuggestion?.journey?.primaryGoal;

  const aiGenerateMutation = useMutation({
    mutationFn: async () => {
      if (!projectId) return null;
      const res = await apiRequest(
        "POST",
        `/api/projects/${projectId}/journeys/ai-generate`,
        {
          language: "pt-BR",
        },
      );
      return (await res.json()) as {
        journey?: {
          name?: string;
          persona?: string;
          primaryGoal?: string;
          description?: string;
        };
        stages?: Array<{ title?: string; description?: string }>;
      };
    },
    onSuccess: async (data) => {
      if (data?.journey) {
        setAiSuggestion({
          journey: {
            name: data.journey.name,
            persona: data.journey.persona,
            primaryGoal: data.journey.primaryGoal,
            description: data.journey.description,
          },
          stages: data.stages,
        });
        toast({
          title: "Sugestão de jornada gerada",
          description:
            "Revise e ajuste a jornada sugerida pela IA antes de salvar.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Não foi possível gerar a jornada",
          description:
            "A IA não retornou uma sugestão válida de jornada. Tente novamente em alguns instantes.",
        });
      }

      await queryClient.invalidateQueries({
        queryKey: ["/api/projects", projectId, "journeys"],
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro ao gerar jornada com IA",
        description:
          "Não foi possível gerar a jornada automaticamente. Tente novamente mais tarde.",
      });
    },
  });

  const acceptAiSuggestionMutation = useMutation({
    mutationFn: async () => {
      if (!projectId || !aiSuggestion?.journey) return null;
      const payload: Partial<InsertJourney> = {
        name: aiSuggestion.journey.name,
        persona: aiSuggestion.journey.persona,
        primaryGoal: aiSuggestion.journey.primaryGoal,
        description: aiSuggestion.journey.description,
      };
      const res = await apiRequest(
        "POST",
        `/api/projects/${projectId}/journeys`,
        payload,
      );
      const createdJourney = (await res.json()) as Journey;

      if (aiSuggestion.stages && aiSuggestion.stages.length > 0) {
        await Promise.all(
          aiSuggestion.stages.map((stage, index) =>
            apiRequest("POST", `/api/journeys/${createdJourney.id}/stages`, {
              title: stage.title || `Etapa ${index + 1}`,
              description: stage.description,
              order: index,
            }),
          ),
        );
      }

      return createdJourney;
    },
    onSuccess: async () => {
      setAiSuggestion(null);
      await queryClient.invalidateQueries({
        queryKey: ["/api/projects", projectId, "journeys"],
      });
      toast({
        title: "Jornada criada a partir da IA",
        description: "Você pode editar a jornada a qualquer momento.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro ao criar jornada sugerida",
        description:
          "Não foi possível salvar a jornada sugerida. Tente novamente.",
      });
    },
  });

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
              {mainJourney
                ? mainJourney.name
                : aiSuggestion?.journey?.name || "Nenhuma jornada cadastrada"}
            </CardTitle>
            <CardDescription>
              {mainJourney ? (
                primaryGoal ||
                "Defina o objetivo principal desta jornada para orientar o time."
              ) : aiSuggestion?.journey?.primaryGoal ? (
                aiSuggestion.journey.primaryGoal
              ) : (
                "Crie uma jornada para mapear etapas e pontos de contato deste projeto."
              )}
            </CardDescription>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            {mainJourney && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>
                  Persona foco:{" "}
                  <span className="font-medium text-foreground">
                    {personaLabel}
                  </span>
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[11px]">
                {mainJourney
                  ? "MVP • Dados reais"
                  : "MVP • Nenhuma jornada ainda"}
              </Badge>
              {projectId && mainJourney && (
                <EditJourneyDialog
                  projectId={projectId}
                  journey={mainJourney ?? null}
                />
              )}
              {projectId && !mainJourney && !aiSuggestion && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => aiGenerateMutation.mutate()}
                  disabled={aiGenerateMutation.isPending}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {aiGenerateMutation.isPending
                    ? "Gerando com IA..."
                    : "Gerar jornada com IA"}
                </Button>
              )}
              {projectId && !mainJourney && aiSuggestion && (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => acceptAiSuggestionMutation.mutate()}
                    disabled={acceptAiSuggestionMutation.isPending}
                  >
                    {acceptAiSuggestionMutation.isPending
                      ? "Salvando..."
                      : "Salvar sugestão de jornada"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAiSuggestion(null)}
                    disabled={acceptAiSuggestionMutation.isPending}
                  >
                    Descartar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {!isLoading && mainJourney && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Etapas da jornada</p>
          <EditJourneyStageDialog journeyId={mainJourney.id} />
        </div>
      )}

      {isLoading && (
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 md:mx-0 md:px-0">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[260px] max-w-sm flex-1">
              <Card className="h-full flex flex-col bg-card/80 border border-border/70">
                <CardHeader className="pb-3">
                  <div className="h-4 w-32 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-3 w-48 bg-muted rounded animate-pulse" />
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-3">
                  <div className="h-20 w-full bg-muted rounded animate-pulse" />
                  <div className="h-8 w-full bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !mainJourney && (
        <Card className="border-dashed border-muted-foreground/40 bg-muted/20">
          <CardContent className="py-4 text-xs text-muted-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>
              Ainda não há jornadas cadastradas para este projeto. Você pode
              gerar uma jornada com IA ou criar manualmente.
            </span>
          </CardContent>
        </Card>
      )}

      {!isLoading && mainJourney && (
        <>
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
                          {stage.description && (
                            <CardDescription className="text-xs mt-1">
                              {stage.description}
                            </CardDescription>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge
                            variant="outline"
                            className="text-[10px] uppercase tracking-wide"
                          >
                            Etapa {(stage.order ?? 0) + 1}
                          </Badge>
                          <EditJourneyStageDialog
                            journeyId={mainJourney.id}
                            stage={stage as any}
                            variant="icon"
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-3">
                      {touchpoints.length === 0 ? (
                        <p className="text-xs text-muted-foreground">
                          Nenhum touchpoint mapeado ainda nesta etapa.
                        </p>
                      ) : (
                        touchpoints.map((tp) => {
                          const emotion = getEmotionMeta(tp.emotionScore ?? 3);

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
                                  {tp.channel && (
                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                      Canal: {tp.channel}
                                    </p>
                                  )}
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
                                {tp.userGoal && (
                                  <p className="text-xs">
                                    <span className="font-medium text-muted-foreground">
                                      Objetivo:
                                    </span>{" "}
                                    {tp.userGoal}
                                  </p>
                                )}
                                {tp.userAction && (
                                  <p className="text-xs">
                                    <span className="font-medium text-muted-foreground">
                                      Ação:
                                    </span>{" "}
                                    {tp.userAction}
                                  </p>
                                )}
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
                Esta visualização está usando dados reais da sua jornada. Em
                breve você poderá criar e editar touchpoints diretamente aqui.
              </span>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
