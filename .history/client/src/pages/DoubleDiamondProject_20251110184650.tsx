import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Sparkles, Loader2, CheckCircle2, Circle, Download } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/contexts/LanguageContext";

interface DoubleDiamondProject {
  id: string;
  name: string;
  description?: string;
  currentPhase: string;
  completionPercentage: number;
  discoverStatus: string;
  defineStatus: string;
  developStatus: string;
  deliverStatus: string;
  discoverPainPoints?: any;
  discoverInsights?: any;
  discoverUserNeeds?: any;
  discoverEmpathyMap?: any;
  definePovStatements?: any;
  defineHmwQuestions?: any;
  defineSelectedPov?: string;
  defineSelectedHmw?: string;
  developIdeas?: any;
  developCrossPollinatedIdeas?: any;
  developSelectedIdeas?: any;
  deliverMvpConcept?: any;
  deliverLogoSuggestions?: any;
  deliverLandingPage?: any;
  deliverSocialMediaLines?: any;
  deliverTestPlan?: any;
  dfvDesirabilityScore?: number;
  dfvFeasibilityScore?: number;
  dfvViabilityScore?: number;
  dfvAnalysis?: any;
  dfvFeedback?: string;
}

export default function DoubleDiamondProject() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const { language } = useLanguage();

  // Fetch project
  const { data: project, isLoading, isError, error } = useQuery<DoubleDiamondProject>({
    queryKey: ["/api/double-diamond", id],
    enabled: !!id
  });

  // Set initial active tab - always start with "discover" unless explicitly navigating
  if (project && activeTab === null) {
    // Force to "discover" if project is new or if discover phase is not completed
    if (project.discoverStatus !== "completed") {
      setActiveTab("discover");
    } else {
      // Otherwise, go to the first incomplete phase
      if (project.defineStatus !== "completed") {
        setActiveTab("define");
      } else if (project.developStatus !== "completed") {
        setActiveTab("develop");
      } else if (project.deliverStatus !== "completed") {
        setActiveTab("deliver");
      } else {
        setActiveTab("dfv");
      }
    }
  }

  // Generate Discover Phase
  const generateDiscoverMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/double-diamond/${id}/generate/discover`, { language });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/double-diamond", id] });
      toast({
        title: "✨ Fase Discover gerada!",
        description: "Pain points, insights e empathy map criados com sucesso."
      });
      setActiveTab("define");
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao gerar Discover",
        description: error.message || "Tente novamente",
        variant: "destructive"
      });
    }
  });

  // Generate Define Phase
  const generateDefineMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/double-diamond/${id}/generate/define`, { language });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/double-diamond", id] });
      toast({
        title: "✨ Fase Define gerada!",
        description: "POV Statements e HMW Questions criados com sucesso."
      });
      setActiveTab("develop");
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao gerar Define",
        description: error.message || "Tente novamente",
        variant: "destructive"
      });
    }
  });

  // Generate Develop Phase
  const generateDevelopMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/double-diamond/${id}/generate/develop`, { language });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/double-diamond", id] });
      toast({
        title: "✨ Fase Develop gerada!",
        description: "Ideias e soluções criativas geradas com sucesso."
      });
      setActiveTab("deliver");
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao gerar Develop",
        description: error.message || "Tente novamente",
        variant: "destructive"
      });
    }
  });

  // Generate Deliver Phase
  const generateDeliverMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/double-diamond/${id}/generate/deliver`, { language });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/double-diamond", id] });
      toast({
        title: "✨ Fase Deliver gerada!",
        description: "MVP, logo, landing page e plano de testes criados!"
      });
      setActiveTab("dfv");
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao gerar Deliver",
        description: error.message || "Tente novamente",
        variant: "destructive"
      });
    }
  });

  // Generate DFV Analysis
  const generateDFVMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/double-diamond/${id}/generate/dfv`, { language });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/double-diamond", id] });
      toast({
        title: "✨ Análise DFV concluída!",
        description: "Desirability, Feasibility e Viability analisados."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao gerar análise DFV",
        description: error.message || "Tente novamente",
        variant: "destructive"
      });
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Erro ao carregar projeto</CardTitle>
            <CardDescription>
              {(error as any)?.message || "Ocorreu um erro ao carregar o projeto. Tente novamente."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/double-diamond", id] })}>
              Tentar Novamente
            </Button>
            <Button variant="outline" onClick={() => setLocation("/double-diamond")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Projeto não encontrado</CardTitle>
            <CardDescription>O projeto Double Diamond que você procura não existe.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/double-diamond")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getPhaseIcon = (status: string) => {
    if (status === "completed") return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (status === "in_progress") return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
    return <Circle className="h-5 w-5 text-gray-400" />;
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => setLocation("/double-diamond")} className="mb-4" data-testid="button-back">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Projetos
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2" data-testid="text-project-name">{project.name}</h1>
            {project.description && (
              <p className="text-muted-foreground mb-4">{project.description}</p>
            )}

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Progresso Geral</span>
                <span className="text-muted-foreground">{project.completionPercentage}%</span>
              </div>
              <Progress value={project.completionPercentage} className="h-2" />
            </div>
          </div>

          <div className="ml-6 flex flex-col gap-2">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Fase Atual: {project.currentPhase === "discover" ? "Descobrir" : 
                          project.currentPhase === "define" ? "Definir" :
                          project.currentPhase === "develop" ? "Desenvolver" : 
                          project.currentPhase === "deliver" ? "Entregar" : "Análise DFV"}
            </Badge>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  window.open(`/api/double-diamond/${id}/export/pdf`, '_blank');
                  toast({
                    title: "📄 Gerando PDF",
                    description: "O download começará em instantes."
                  });
                }}
                data-testid="button-export-pdf"
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
              {activeTab && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (activeTab === "discover") {
                      generateDiscoverMutation.mutate();
                    } else if (activeTab === "define") {
                      generateDefineMutation.mutate();
                    } else if (activeTab === "develop") {
                      generateDevelopMutation.mutate();
                    } else if (activeTab === "deliver") {
                      generateDeliverMutation.mutate();
                    } else if (activeTab === "dfv") {
                      generateDFVMutation.mutate();
                    }
                  }}
                  disabled={
                    (activeTab === "discover" && generateDiscoverMutation.isPending) ||
                    (activeTab === "define" && generateDefineMutation.isPending) ||
                    (activeTab === "develop" && generateDevelopMutation.isPending) ||
                    (activeTab === "deliver" && generateDeliverMutation.isPending) ||
                    (activeTab === "dfv" && generateDFVMutation.isPending)
                  }
                  data-testid={`button-recreate-${activeTab}`}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Recriar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Phase Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className={activeTab === "discover" ? "border-blue-500" : ""}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">1. Descobrir</CardTitle>
              {getPhaseIcon(project.discoverStatus)}
            </div>
          </CardHeader>
        </Card>

        <Card className={activeTab === "define" ? "border-blue-500" : ""}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">2. Definir</CardTitle>
              {getPhaseIcon(project.defineStatus)}
            </div>
          </CardHeader>
        </Card>

        <Card className={activeTab === "develop" ? "border-blue-500" : ""}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">3. Desenvolver</CardTitle>
              {getPhaseIcon(project.developStatus)}
            </div>
          </CardHeader>
        </Card>

        <Card className={activeTab === "deliver" ? "border-blue-500" : ""}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">4. Entregar</CardTitle>
              {getPhaseIcon(project.deliverStatus)}
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab || "discover"} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="discover" data-testid="tab-discover">Descobrir</TabsTrigger>
          <TabsTrigger value="define" data-testid="tab-define">Definir</TabsTrigger>
          <TabsTrigger value="develop" data-testid="tab-develop">Desenvolver</TabsTrigger>
          <TabsTrigger value="deliver" data-testid="tab-deliver">Entregar</TabsTrigger>
          <TabsTrigger value="dfv" data-testid="tab-dfv">Análise DFV</TabsTrigger>
        </TabsList>

        {/* DISCOVER TAB */}
        <TabsContent value="discover">
          <Card>
            <CardHeader>
              <CardTitle>Fase 1: Discover (Divergência)</CardTitle>
              <CardDescription>
                Explore amplamente o problema, identifique pain points e gere insights profundos sobre o usuário
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.discoverStatus === "pending" ? (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                  <h3 className="text-lg font-semibold mb-2">Pronto para descobrir!</h3>
                  <p className="text-muted-foreground mb-6">
                    A IA irá gerar automaticamente pain points, insights, user needs e um empathy map completo
                  </p>
                  <Button 
                    onClick={() => generateDiscoverMutation.mutate()}
                    disabled={generateDiscoverMutation.isPending}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-600"
                    data-testid="button-generate-discover"
                  >
                    {generateDiscoverMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Gerando com IA...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Gerar Fase Discover com IA
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Pain Points */}
                  {project.discoverPainPoints && (
                    <div>
                      <h4 className="font-semibold mb-3">Pain Points Identificados</h4>
                      <div className="grid gap-2">
                        {(project.discoverPainPoints as any[]).map((item: any, idx: number) => (
                          <div key={idx} className="p-3 border rounded-lg bg-red-50 dark:bg-red-950/20">
                            <div className="flex items-start justify-between">
                              <p className="flex-1">{item.text}</p>
                              <Badge variant="outline" className="ml-2">{item.category}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Insights */}
                  {project.discoverInsights && (
                    <div>
                      <h4 className="font-semibold mb-3">Insights Gerados</h4>
                      <div className="grid gap-2">
                        {(project.discoverInsights as any[]).map((item: any, idx: number) => (
                          <div key={idx} className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                            <p>{item.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* User Needs */}
                  {project.discoverUserNeeds && (
                    <div>
                      <h4 className="font-semibold mb-3">Necessidades do Usuário</h4>
                      <div className="grid gap-2">
                        {(project.discoverUserNeeds as any[]).map((item: any, idx: number) => (
                          <div key={idx} className="p-3 border rounded-lg bg-green-50 dark:bg-green-950/20">
                            <p>{item.need}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* DEFINE TAB */}
        <TabsContent value="define">
          <Card>
            <CardHeader>
              <CardTitle>Fase 2: Define (Convergência)</CardTitle>
              <CardDescription>
                Sintetize os insights em POV Statements e transforme em How Might We questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.defineStatus === "pending" ? (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                  <h3 className="text-lg font-semibold mb-2">Defina o problema</h3>
                  <p className="text-muted-foreground mb-6">
                    A IA criará POV Statements e How Might We questions baseados nos insights da fase Discover
                  </p>
                  <Button 
                    onClick={() => generateDefineMutation.mutate()}
                    disabled={generateDefineMutation.isPending || project.discoverStatus !== "completed"}
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-600"
                    data-testid="button-generate-define"
                  >
                    {generateDefineMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Gerando com IA...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Gerar Fase Define com IA
                      </>
                    )}
                  </Button>
                  {project.discoverStatus !== "completed" && (
                    <p className="text-sm text-muted-foreground mt-4">
                      Complete a fase Discover primeiro
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* POV Statements */}
                  {project.definePovStatements && (
                    <div>
                      <h4 className="font-semibold mb-3">POV Statements</h4>
                      <div className="grid gap-3">
                        {(project.definePovStatements as any[]).map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border rounded-lg hover:border-purple-500 cursor-pointer transition-colors">
                            <p className="font-medium">{item.user} precisa {item.need}</p>
                            <p className="text-sm text-muted-foreground mt-1">Insight: {item.insight}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* HMW Questions */}
                  {project.defineHmwQuestions && (
                    <div>
                      <h4 className="font-semibold mb-3">How Might We Questions</h4>
                      <div className="grid gap-2">
                        {(project.defineHmwQuestions as any[]).map((item: any, idx: number) => (
                          <div key={idx} className="p-3 border rounded-lg bg-purple-50 dark:bg-purple-950/20">
                            <p>{item.question}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* DEVELOP TAB */}
        <TabsContent value="develop">
          <Card>
            <CardHeader>
              <CardTitle>Fase 3: Develop (Divergência)</CardTitle>
              <CardDescription>
                Gere múltiplas ideias criativas e soluções inovadoras
              </CardDescription>
            </CardHeader>
            <CardContent>
              {project.developStatus === "pending" ? (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-orange-500" />
                  <h3 className="text-lg font-semibold mb-2">Hora de idear!</h3>
                  <p className="text-muted-foreground mb-6">
                    A IA gerará 20+ ideias criativas e soluções cross-pollinadas
                  </p>
                  <Button 
                    onClick={() => generateDevelopMutation.mutate()}
                    disabled={generateDevelopMutation.isPending || project.defineStatus !== "completed"}
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-red-600"
                    data-testid="button-generate-develop"
                  >
                    {generateDevelopMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Gerando com IA...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Gerar Fase Develop com IA
                      </>
                    )}
                  </Button>
                  {project.defineStatus !== "completed" && (
                    <p className="text-sm text-muted-foreground mt-4">
                      Complete a fase Define primeiro
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {project.developIdeas && (
                    <div>
                      <h4 className="font-semibold mb-3">Ideias Geradas</h4>
                      <div className="grid gap-3">
                        {(project.developIdeas as any[]).map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border rounded-lg">
                            <h5 className="font-medium mb-1">{item.title}</h5>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline">{item.category}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* DELIVER TAB */}
        <TabsContent value="deliver">
          <Card>
            <CardHeader>
              <CardTitle>Fase 4: Deliver (Convergência)</CardTitle>
              <CardDescription>
                Transforme ideias em MVP concreto com logo, landing page e plano de testes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {project.deliverStatus === "pending" ? (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <h3 className="text-lg font-semibold mb-2">Entregue o MVP!</h3>
                  <p className="text-muted-foreground mb-6">
                    A IA criará o conceito completo do MVP, sugestões de logo, landing page e plano de testes
                  </p>
                  <Button 
                    onClick={() => generateDeliverMutation.mutate()}
                    disabled={generateDeliverMutation.isPending || project.developStatus !== "completed"}
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-teal-600"
                    data-testid="button-generate-deliver"
                  >
                    {generateDeliverMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Gerando com IA...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Gerar Fase Deliver com IA
                      </>
                    )}
                  </Button>
                  {project.developStatus !== "completed" && (
                    <p className="text-sm text-muted-foreground mt-4">
                      Complete a fase Develop primeiro
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* MVP Concept */}
                  {project.deliverMvpConcept && (
                    <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                      <h4 className="font-semibold mb-3 text-lg">Conceito do MVP</h4>
                      {(() => {
                        const mvp = project.deliverMvpConcept as any;
                        return (
                          <div className="space-y-3">
                            {mvp.name && (
                              <div>
                                <span className="font-semibold">Nome:</span> {mvp.name}
                              </div>
                            )}
                            {mvp.tagline && (
                              <div>
                                <span className="font-semibold">Tagline:</span> {mvp.tagline}
                              </div>
                            )}
                            {mvp.valueProposition && (
                              <div>
                                <span className="font-semibold">Proposta de Valor:</span>
                                <p className="mt-1 text-sm">{mvp.valueProposition}</p>
                              </div>
                            )}
                            {mvp.coreFeatures && Array.isArray(mvp.coreFeatures) && mvp.coreFeatures.length > 0 && (
                              <div>
                                <span className="font-semibold">Recursos Principais:</span>
                                <ul className="mt-1 list-disc list-inside space-y-1">
                                  {mvp.coreFeatures.map((feature: string, idx: number) => (
                                    <li key={idx} className="text-sm">{feature}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Logo Suggestions */}
                  {project.deliverLogoSuggestions && Array.isArray(project.deliverLogoSuggestions) && (project.deliverLogoSuggestions as any[]).length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 text-lg">Sugestões de Logo</h4>
                      <div className="grid gap-4">
                        {(project.deliverLogoSuggestions as any[]).map((logo: any, idx: number) => (
                          <div key={idx} className="p-4 border rounded-lg">
                            <div className="font-medium mb-2">Opção {idx + 1}</div>
                            {logo.description && <p className="text-sm mb-2">{logo.description}</p>}
                            <div className="flex gap-4 text-sm">
                              {logo.style && <span><span className="font-semibold">Estilo:</span> {logo.style}</span>}
                              {logo.colors && Array.isArray(logo.colors) && (
                                <span><span className="font-semibold">Cores:</span> {logo.colors.join(", ")}</span>
                              )}
                            </div>
                            {logo.symbolism && (
                              <p className="text-sm mt-2 text-muted-foreground">{logo.symbolism}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Landing Page */}
                  {project.deliverLandingPage && (
                    <div>
                      <h4 className="font-semibold mb-3 text-lg">Landing Page</h4>
                      {(() => {
                        const landing = project.deliverLandingPage as any;
                        return (
                          <div className="space-y-4">
                            {landing.headline && (
                              <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                                <div className="font-semibold mb-1">Headline:</div>
                                <div className="text-lg">{landing.headline}</div>
                              </div>
                            )}
                            {landing.subheadline && (
                              <div className="p-4 border rounded-lg">
                                <div className="font-semibold mb-1">Subheadline:</div>
                                <div>{landing.subheadline}</div>
                              </div>
                            )}
                            {landing.sections && Array.isArray(landing.sections) && landing.sections.length > 0 && (
                              <div className="space-y-3">
                                {landing.sections.map((section: any, idx: number) => (
                                  <div key={idx} className="p-4 border rounded-lg">
                                    <div className="font-semibold mb-2">{section.title}</div>
                                    <p className="text-sm">{section.content}</p>
                                    {section.cta && (
                                      <div className="mt-2">
                                        <span className="text-sm font-semibold">CTA:</span> {section.cta}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            {landing.finalCta && (
                              <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                                <div className="font-semibold mb-1">Call to Action Final:</div>
                                <div>{landing.finalCta}</div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Social Media Lines */}
                  {project.deliverSocialMediaLines && (
                    <div>
                      <h4 className="font-semibold mb-3 text-lg">Linhas para Redes Sociais</h4>
                      {(() => {
                        const social = project.deliverSocialMediaLines as any;
                        return (
                          <div className="grid gap-4 md:grid-cols-3">
                            {social.twitter && Array.isArray(social.twitter) && social.twitter.length > 0 && (
                              <div className="p-4 border rounded-lg">
                                <div className="font-semibold mb-2">Twitter</div>
                                <ul className="space-y-2 text-sm">
                                  {social.twitter.map((line: string, idx: number) => (
                                    <li key={idx}>• {line}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {social.linkedin && Array.isArray(social.linkedin) && social.linkedin.length > 0 && (
                              <div className="p-4 border rounded-lg">
                                <div className="font-semibold mb-2">LinkedIn</div>
                                <ul className="space-y-2 text-sm">
                                  {social.linkedin.map((line: string, idx: number) => (
                                    <li key={idx}>• {line}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {social.instagram && Array.isArray(social.instagram) && social.instagram.length > 0 && (
                              <div className="p-4 border rounded-lg">
                                <div className="font-semibold mb-2">Instagram</div>
                                <ul className="space-y-2 text-sm">
                                  {social.instagram.map((line: string, idx: number) => (
                                    <li key={idx}>• {line}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Test Plan */}
                  {project.deliverTestPlan && (
                    <div>
                      <h4 className="font-semibold mb-3 text-lg">Plano de Testes</h4>
                      {(() => {
                        const plan = project.deliverTestPlan as any;
                        return (
                          <div className="space-y-3">
                            {plan.objectives && Array.isArray(plan.objectives) && plan.objectives.length > 0 && (
                              <div className="p-4 border rounded-lg">
                                <div className="font-semibold mb-2">Objetivos:</div>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  {plan.objectives.map((obj: string, idx: number) => (
                                    <li key={idx}>{obj}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {plan.targetUsers && (
                              <div className="p-4 border rounded-lg">
                                <div className="font-semibold mb-1">Usuários-Alvo:</div>
                                <div className="text-sm">{plan.targetUsers}</div>
                              </div>
                            )}
                            {plan.metrics && Array.isArray(plan.metrics) && plan.metrics.length > 0 && (
                              <div className="p-4 border rounded-lg">
                                <div className="font-semibold mb-2">Métricas:</div>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  {plan.metrics.map((metric: string, idx: number) => (
                                    <li key={idx}>{metric}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {plan.testMethods && Array.isArray(plan.testMethods) && plan.testMethods.length > 0 && (
                              <div className="p-4 border rounded-lg">
                                <div className="font-semibold mb-2">Métodos de Teste:</div>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  {plan.testMethods.map((method: string, idx: number) => (
                                    <li key={idx}>{method}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* DFV ANALYSIS TAB */}
        <TabsContent value="dfv">
          <Card>
            <CardHeader>
              <CardTitle>Análise DFV (Desirability, Feasibility, Viability)</CardTitle>
              <CardDescription>
                Avalie seu projeto nas três dimensões críticas de sucesso
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!project.dfvDesirabilityScore ? (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-indigo-500" />
                  <h3 className="text-lg font-semibold mb-2">Análise Estratégica</h3>
                  <p className="text-muted-foreground mb-6">
                    A IA analisará seu projeto em Desejabilidade, Viabilidade e Exequibilidade
                  </p>
                  <Button 
                    onClick={() => generateDFVMutation.mutate()}
                    disabled={generateDFVMutation.isPending || project.deliverStatus !== "completed"}
                    size="lg"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600"
                    data-testid="button-generate-dfv"
                  >
                    {generateDFVMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analisando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Gerar Análise DFV
                      </>
                    )}
                  </Button>
                  {project.deliverStatus !== "completed" && (
                    <p className="text-sm text-muted-foreground mt-4">
                      Complete a fase Deliver primeiro
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Scores */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Desirability</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-blue-600">{project.dfvDesirabilityScore}/100</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Feasibility</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-green-600">{project.dfvFeasibilityScore}/100</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Viability</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-purple-600">{project.dfvViabilityScore}/100</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Análise Detalhada */}
                  {project.dfvAnalysis && (
                    <div className="space-y-4">
                      {(() => {
                        const dfvData = project.dfvAnalysis as any;
                        
                        return (
                          <>
                            {/* Desirability Analysis */}
                            {dfvData.desirability && (
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Análise de Desirability (Desejabilidade)</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  {dfvData.desirability.strengths && Array.isArray(dfvData.desirability.strengths) && dfvData.desirability.strengths.length > 0 && (
                                    <div>
                                      <h5 className="font-semibold mb-2 text-green-700 dark:text-green-400">Pontos Fortes:</h5>
                                      <ul className="list-disc list-inside space-y-1 text-sm">
                                        {dfvData.desirability.strengths.map((strength: string, idx: number) => (
                                          <li key={idx}>{strength}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {dfvData.desirability.concerns && Array.isArray(dfvData.desirability.concerns) && dfvData.desirability.concerns.length > 0 && (
                                    <div>
                                      <h5 className="font-semibold mb-2 text-orange-700 dark:text-orange-400">Preocupações:</h5>
                                      <ul className="list-disc list-inside space-y-1 text-sm">
                                        {dfvData.desirability.concerns.map((concern: string, idx: number) => (
                                          <li key={idx}>{concern}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {dfvData.desirability.reasoning && (
                                    <div>
                                      <h5 className="font-semibold mb-2">Raciocínio:</h5>
                                      <p className="text-sm text-muted-foreground">{dfvData.desirability.reasoning}</p>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            )}

                            {/* Feasibility Analysis */}
                            {dfvData.feasibility && (
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Análise de Feasibility (Viabilidade Técnica)</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  {dfvData.feasibility.strengths && Array.isArray(dfvData.feasibility.strengths) && dfvData.feasibility.strengths.length > 0 && (
                                    <div>
                                      <h5 className="font-semibold mb-2 text-green-700 dark:text-green-400">Pontos Fortes:</h5>
                                      <ul className="list-disc list-inside space-y-1 text-sm">
                                        {dfvData.feasibility.strengths.map((strength: string, idx: number) => (
                                          <li key={idx}>{strength}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {dfvData.feasibility.concerns && Array.isArray(dfvData.feasibility.concerns) && dfvData.feasibility.concerns.length > 0 && (
                                    <div>
                                      <h5 className="font-semibold mb-2 text-orange-700 dark:text-orange-400">Preocupações:</h5>
                                      <ul className="list-disc list-inside space-y-1 text-sm">
                                        {dfvData.feasibility.concerns.map((concern: string, idx: number) => (
                                          <li key={idx}>{concern}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {dfvData.feasibility.reasoning && (
                                    <div>
                                      <h5 className="font-semibold mb-2">Raciocínio:</h5>
                                      <p className="text-sm text-muted-foreground">{dfvData.feasibility.reasoning}</p>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            )}

                            {/* Viability Analysis */}
                            {dfvData.viability && (
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Análise de Viability (Viabilidade de Negócio)</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  {dfvData.viability.strengths && Array.isArray(dfvData.viability.strengths) && dfvData.viability.strengths.length > 0 && (
                                    <div>
                                      <h5 className="font-semibold mb-2 text-green-700 dark:text-green-400">Pontos Fortes:</h5>
                                      <ul className="list-disc list-inside space-y-1 text-sm">
                                        {dfvData.viability.strengths.map((strength: string, idx: number) => (
                                          <li key={idx}>{strength}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {dfvData.viability.concerns && Array.isArray(dfvData.viability.concerns) && dfvData.viability.concerns.length > 0 && (
                                    <div>
                                      <h5 className="font-semibold mb-2 text-orange-700 dark:text-orange-400">Preocupações:</h5>
                                      <ul className="list-disc list-inside space-y-1 text-sm">
                                        {dfvData.viability.concerns.map((concern: string, idx: number) => (
                                          <li key={idx}>{concern}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {dfvData.viability.reasoning && (
                                    <div>
                                      <h5 className="font-semibold mb-2">Raciocínio:</h5>
                                      <p className="text-sm text-muted-foreground">{dfvData.viability.reasoning}</p>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}

                  {/* Overall Assessment */}
                  {project.dfvFeedback && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Avaliação Geral</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm whitespace-pre-wrap">{project.dfvFeedback}</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Recommendations */}
                  {project.dfvAnalysis && (project.dfvAnalysis as any).recommendations && Array.isArray((project.dfvAnalysis as any).recommendations) && (project.dfvAnalysis as any).recommendations.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Recomendações</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                          {(project.dfvAnalysis as any).recommendations.map((rec: string, idx: number) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Next Steps */}
                  {project.dfvAnalysis && (project.dfvAnalysis as any).nextSteps && Array.isArray((project.dfvAnalysis as any).nextSteps) && (project.dfvAnalysis as any).nextSteps.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Próximos Passos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          {(project.dfvAnalysis as any).nextSteps.map((step: string, idx: number) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ol>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
