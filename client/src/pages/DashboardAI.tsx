import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, Users, Target, Lightbulb, Globe, Share2, DollarSign, ArrowLeft, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateAIMVPPDF } from "@/lib/reportGenerator";
import type { Project, Persona, PovStatement, Idea, AiGeneratedAsset } from "@shared/schema";

export default function DashboardAI() {
  const { projectId } = useParams();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  // Fetch project data
  const { data: project, isLoading: projectLoading } = useQuery<Project>({
    queryKey: ["/api/projects", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
    enabled: !!projectId,
  });

  // Fetch personas
  const { data: personas = [], isLoading: personasLoading } = useQuery<Persona[]>({
    queryKey: ["/api/projects", projectId, "personas"],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}/personas`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch personas");
      return response.json();
    },
    enabled: !!projectId,
  });

  // Fetch POV statements
  const { data: povStatements = [], isLoading: povLoading } = useQuery<PovStatement[]>({
    queryKey: ["/api/projects", projectId, "pov-statements"],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}/pov-statements`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch POV statements");
      return response.json();
    },
    enabled: !!projectId,
  });

  // Fetch ideas
  const { data: ideas = [], isLoading: ideasLoading } = useQuery<Idea[]>({
    queryKey: ["/api/projects", projectId, "ideas"],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}/ideas`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch ideas");
      return response.json();
    },
    enabled: !!projectId,
  });

  // Fetch AI-generated assets
  const { data: aiAssets = [], isLoading: assetsLoading } = useQuery<AiGeneratedAsset[]>({
    queryKey: ["/api/projects", projectId, "ai-assets"],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}/ai-assets`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch AI assets");
      return response.json();
    },
    enabled: !!projectId,
  });

  const isLoading = projectLoading || personasLoading || povLoading || ideasLoading || assetsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Carregando seu projeto...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Projeto não encontrado</h2>
          <Link href="/projects">
            <Button>Voltar para Projetos</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Parse AI assets
  const logoAsset = aiAssets.find(a => a.assetType === "logo");
  const landingPageAsset = aiAssets.find(a => a.assetType === "landing_page");
  const socialMediaAsset = aiAssets.find(a => a.assetType === "social_media");
  const businessModelAsset = aiAssets.find(a => a.assetType === "business_model");

  const logo = logoAsset ? JSON.parse(logoAsset.content as string) : null;
  const landingPage = landingPageAsset ? JSON.parse(landingPageAsset.content as string) : null;
  const socialMedia = socialMediaAsset ? JSON.parse(socialMediaAsset.content as string) : [];
  const businessModel = businessModelAsset ? JSON.parse(businessModelAsset.content as string) : null;

  const handleExport = async () => {
    if (!project) return;

    try {
      setIsExporting(true);

      const pdfUrl = await generateAIMVPPDF({
        project,
        personas,
        povStatements,
        ideas,
        aiAssets,
      });

      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `mvp-${project.name.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(pdfUrl);

      toast({
        title: "MVP Exportado!",
        description: "O PDF do seu MVP foi baixado com sucesso.",
      });
    } catch (error) {
      console.error('Error exporting MVP:', error);
      toast({
        title: "Erro ao exportar",
        description: "Não foi possível gerar o PDF. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/projects">
            <Button variant="ghost" className="mb-4" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Projetos
            </Button>
          </Link>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {logo?.url && (
                <img src={logo.url} alt={project.name} className="w-24 h-24 rounded-lg shadow-lg" />
              )}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-4xl font-bold">{project.name}</h1>
                  <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Gerado por IA
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg">{project.description}</p>
              </div>
            </div>
            <Button
              className="bg-gradient-to-r from-purple-600 to-blue-600"
              data-testid="button-download"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" data-testid="tab-overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="personas" data-testid="tab-personas">
              <Users className="h-4 w-4 mr-2" />
              Personas
            </TabsTrigger>
            <TabsTrigger value="pov" data-testid="tab-pov">
              <Target className="h-4 w-4 mr-2" />
              POV
            </TabsTrigger>
            <TabsTrigger value="ideas" data-testid="tab-ideas">
              <Lightbulb className="h-4 w-4 mr-2" />
              Ideias
            </TabsTrigger>
            <TabsTrigger value="landing" data-testid="tab-landing">
              <Globe className="h-4 w-4 mr-2" />
              Landing
            </TabsTrigger>
            <TabsTrigger value="business" data-testid="tab-business">
              <DollarSign className="h-4 w-4 mr-2" />
              Modelo
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card data-testid="card-problem">
                <CardHeader>
                  <CardTitle>Problema Original</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">{project.userProblemDescription}</p>
                </CardContent>
              </Card>

              <Card data-testid="card-inspiration">
                <CardHeader>
                  <CardTitle>Inspiração</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-lg">{project.businessModelBase as string}</p>
                  <Badge className="mt-2">Case de Sucesso</Badge>
                </CardContent>
              </Card>

              <Card data-testid="card-stats">
                <CardHeader>
                  <CardTitle>Estatísticas do Projeto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Personas criadas:</span>
                    <span className="font-semibold">{personas.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Declarações POV:</span>
                    <span className="font-semibold">{povStatements.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ideias geradas:</span>
                    <span className="font-semibold">{ideas.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Assets gerados:</span>
                    <span className="font-semibold">{aiAssets.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-social">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Estratégia de Redes Sociais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Array.isArray(socialMedia) && socialMedia.length > 0 ? (
                    <div className="space-y-2">
                      {(socialMedia as any[]).map((platform: any, idx: number) => (
                        <Badge key={idx} variant="outline" className="mr-2">
                          {platform.platform}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Nenhuma estratégia disponível</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Personas Tab */}
          <TabsContent value="personas" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personas.map((persona) => (
                <Card key={persona.id} data-testid={`card-persona-${persona.id}`}>
                  <CardHeader>
                    <CardTitle>{persona.name}</CardTitle>
                    <CardDescription>{persona.age} anos • {persona.occupation}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-1">Bio:</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{persona.bio}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Objetivos:</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{persona.goals as string}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Frustrações:</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{persona.frustrations as string}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* POV Tab */}
          <TabsContent value="pov" className="mt-6">
            <div className="space-y-4">
              {povStatements.map((pov) => (
                <Card key={pov.id} data-testid={`card-pov-${pov.id}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Target className="h-6 w-6 text-purple-600 mt-1" />
                      <div>
                        <p className="text-lg">
                          <span className="font-semibold">{pov.user}</span> precisa de{" "}
                          <span className="font-semibold text-purple-600">{pov.need}</span> porque{" "}
                          <span className="italic">{pov.insight}</span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Ideas Tab */}
          <TabsContent value="ideas" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ideas.map((idea) => (
                <Card key={idea.id} data-testid={`card-idea-${idea.id}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {idea.title}
                      <Badge>{idea.category}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300">{idea.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Landing Page Tab */}
          <TabsContent value="landing" className="mt-6">
            {landingPage ? (
              <div className="space-y-6">
                <Card data-testid="card-landing-hero">
                  <CardHeader>
                    <CardTitle>Hero Section</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h2 className="text-3xl font-bold mb-2">{landingPage.headline}</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">{landingPage.subheadline}</p>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                      {landingPage.ctaText}
                    </Button>
                  </CardContent>
                </Card>

                <Card data-testid="card-landing-value">
                  <CardHeader>
                    <CardTitle>Proposta de Valor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300">{landingPage.valueProposition}</p>
                  </CardContent>
                </Card>

                <Card data-testid="card-landing-features">
                  <CardHeader>
                    <CardTitle>Features Principais</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {Array.isArray(landingPage.features) && landingPage.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-purple-600 mt-1">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  Nenhum conteúdo de landing page disponível
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Business Model Tab */}
          <TabsContent value="business" className="mt-6">
            {businessModel ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card data-testid="card-revenue">
                  <CardHeader>
                    <CardTitle>Fontes de Receita</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {businessModel.revenueStreams?.map((stream: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <DollarSign className="h-4 w-4 text-green-600 mt-1" />
                          <span>{stream}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card data-testid="card-costs">
                  <CardHeader>
                    <CardTitle>Estrutura de Custos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {businessModel.costStructure?.map((cost: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>{cost}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card data-testid="card-resources">
                  <CardHeader>
                    <CardTitle>Recursos Chave</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {businessModel.keyResources?.map((resource: string, idx: number) => (
                        <li key={idx}>• {resource}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card data-testid="card-activities">
                  <CardHeader>
                    <CardTitle>Atividades Chave</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {businessModel.keyActivities?.map((activity: string, idx: number) => (
                        <li key={idx}>• {activity}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  Nenhum modelo de negócio disponível
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
