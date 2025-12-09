import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Users, Target, Lightbulb, Wrench, TestTube, Calendar, BarChart3, Brain, Columns3, Edit2, FileText, Loader2, Filter, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import type { Project, DvfAssessment, GuidingCriterion } from "@shared/schema";
import { useAuth } from "@/contexts/AuthContext";
import TeamManagement from "@/components/TeamManagement";
import Phase1Tools from "@/components/phase1/Phase1Tools";
import Phase2Tools from "@/components/phase2/Phase2Tools";
import Phase3Tools from "@/components/phase3/Phase3Tools";
import Phase4Tools from "@/components/phase4/Phase4Tools";
import Phase5Tools from "@/components/phase5/Phase5Tools";
import AnalysisReport from "@/components/AnalysisReport";
import { KanbanBoard } from "@/components/KanbanBoard";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const editProjectSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").transform(val => val.trim()).refine(val => val.length > 0, "Nome não pode ser apenas espaços"),
  description: z.string().optional().transform(val => val?.trim()),
});

type EditProjectData = z.infer<typeof editProjectSchema>;

const phaseData = {
  1: { 
    icon: Users, 
    title: "Empatizar", 
    description: "Entenda profundamente seus usuários",
    color: "bg-red-100 text-red-700 border-red-200",
    tools: ["Mapa de Empatia", "Personas", "Entrevistas", "Observações"]
  },
  2: { 
    icon: Target, 
    title: "Definir", 
    description: "Defina claramente o problema a resolver",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    tools: ["POV Statements", "How Might We", "Problem Statements"]
  },
  3: { 
    icon: Lightbulb, 
    title: "Idear", 
    description: "Gere ideias criativas para soluções",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    tools: ["Brainstorming", "Categorização", "Priorização"]
  },
  4: { 
    icon: Wrench, 
    title: "Prototipar", 
    description: "Construa versões testáveis das suas ideias",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    tools: ["Protótipos Digitais", "Protótipos Físicos", "Storyboards"]
  },
  5: { 
    icon: TestTube, 
    title: "Testar", 
    description: "Valide suas soluções com usuários reais",
    color: "bg-green-100 text-green-700 border-green-200",
    tools: ["Planos de Teste", "Coleta de Feedback", "Análise de Resultados"]
  },
};

function EditProjectDialog({ project, projectId }: { project: Project; projectId: string }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const form = useForm<EditProjectData>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      name: project.name,
      description: project.description || "",
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async (data: EditProjectData) => {
      return await apiRequest('PUT', `/api/projects/${project.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "stats"] });
      toast({
        title: t("project.detail.edit.toast.success.title"),
        description: t("project.detail.edit.toast.success.description"),
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: t("project.detail.edit.toast.error.title"),
        description: t("project.detail.edit.toast.error.description"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EditProjectData) => {
    updateProjectMutation.mutate(data);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      form.reset({
        name: project.name,
        description: project.description || "",
      });
    } else {
      form.reset({
        name: project.name,
        description: project.description || "",
      });
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" data-testid="button-edit-project">
          <Edit2 className="w-4 h-4 mr-2" />
          {t("project.detail.edit.button.open")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("project.detail.edit.title")}</DialogTitle>
          <DialogDescription>
            {t("project.detail.edit.description")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("project.detail.edit.field.name.label")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("project.detail.edit.field.name.placeholder")}
                      data-testid="input-project-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("project.detail.edit.field.description.label")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t("project.detail.edit.field.description.placeholder")}
                      rows={4}
                      data-testid="input-project-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} data-testid="button-cancel">
                {t("project.detail.edit.button.cancel")}
              </Button>
              <Button type="submit" disabled={updateProjectMutation.isPending} data-testid="button-save">
                {updateProjectMutation.isPending
                  ? t("project.detail.edit.button.saving")
                  : t("project.detail.edit.button.save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function GuidingCriteriaSummaryCard({ projectId }: { projectId: string }) {
  const { data: criteria, isLoading, isError } = useQuery<GuidingCriterion[]>({
    queryKey: ["/api/projects", projectId, "guiding-criteria"],
    enabled: !!projectId,
  });

  if (isLoading || isError || !criteria || criteria.length === 0) {
    return null;
  }

  const topCriteria = criteria.slice(0, 3);

  const importanceClass = (importance: string | null | undefined) => {
    if (importance === "high") return "bg-red-100 text-red-800";
    if (importance === "low") return "bg-gray-100 text-gray-800";
    return "bg-blue-100 text-blue-800";
  };

  const importanceLabel = (importance: string | null | undefined) => {
    if (importance === "high") return t("project.detail.guiding.importance.high");
    if (importance === "low") return t("project.detail.guiding.importance.low");
    return t("project.detail.guiding.importance.medium");
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3 flex items-start gap-3">
        <div className="p-2 rounded-full bg-blue-100 text-blue-700">
          <Filter className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <CardTitle className="text-base font-semibold text-gray-900">
            {t("project.detail.guiding.title")}
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            {t("project.detail.guiding.description")}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {topCriteria.map((criterion) => (
          <div key={criterion.id} className="flex items-start gap-3">
            <div>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${importanceClass(
                  criterion.importance
                )}`}
              >
                {importanceLabel(criterion.importance)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-gray-900 truncate" title={criterion.title}>
                  {criterion.title}
                </span>
                {criterion.category && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
                    {criterion.category}
                  </span>
                )}
              </div>
              {criterion.description && (
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {criterion.description}
                </p>
              )}
            </div>
          </div>
        ))}
        {criteria.length > 3 && (
          <p className="text-xs text-gray-500 mt-1">
            {t("project.detail.guiding.more", {
              count: String(criteria.length - 3),
            })}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function PhaseCard({ phaseNumber, isActive, isCompleted, onClick, isUpdating }: { 
  phaseNumber: number; 
  isActive: boolean; 
  isCompleted: boolean;
  onClick: () => void;
  isUpdating: boolean;
}) {
  const phase = phaseData[phaseNumber as keyof typeof phaseData];
  const Icon = phase.icon;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('PhaseCard clicked:', phaseNumber);
    if (!isUpdating) {
      onClick();
    }
  };

  return (
    <Card 
      className={`transition-all duration-200 select-none ${
        isUpdating 
          ? "opacity-50 cursor-not-allowed" 
          : "cursor-pointer hover:shadow-lg"
      } ${
        isActive 
          ? `border-2 ${phase.color} shadow-md` 
          : isCompleted 
          ? "border-green-200 bg-green-50 hover:bg-green-100" 
          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
      }`}
      data-testid={`card-phase-${phaseNumber}`}
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${
            isActive 
              ? phase.color 
              : isCompleted 
              ? "bg-green-100 text-green-700" 
              : "bg-gray-100 text-gray-500"
          }`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">
              Fase {phaseNumber}: {phase.title}
            </CardTitle>
            <CardDescription className="text-sm">
              {phase.description}
            </CardDescription>
          </div>
          {isCompleted && (
            <Badge className="bg-green-100 text-green-800">Concluída</Badge>
          )}
          {isActive && (
            <Badge className="bg-blue-100 text-blue-800">Atual</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Ferramentas:</h4>
          <div className="flex flex-wrap gap-1">
            {phase.tools.map((tool) => (
              <Badge 
                key={tool} 
                variant="outline" 
                className="text-xs"
                data-testid={`badge-tool-${tool.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {tool}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DvfSummaryCard({ projectId }: { projectId: string }) {
  const { data: assessments = [], isLoading, isError } = useQuery<DvfAssessment[]>({
    queryKey: ["/api/dvf-assessments", projectId],
    enabled: !!projectId,
  });

  if (isLoading || isError || !assessments || assessments.length === 0) {
    return null;
  }

  const assessment =
    assessments.find((a) => a.itemId === "double-diamond-export") ?? assessments[0];

  const desirability = assessment.desirabilityScore || 0;
  const feasibility = assessment.feasibilityScore || 0;
  const viability = assessment.viabilityScore || 0;
  const overall = assessment.overallScore || (desirability + feasibility + viability) / 3;

  const rec = (assessment.recommendation || "modify") as "proceed" | "modify" | "stop";
  const { t } = useLanguage();
  const recLabel: Record<typeof rec, string> = {
    proceed: t("project.detail.dfv.summary.rec.proceed"),
    modify: t("project.detail.dfv.summary.rec.modify"),
    stop: t("project.detail.dfv.summary.rec.stop"),
  };
  const recColor: Record<typeof rec, string> = {
    proceed: "bg-green-100 text-green-800",
    modify: "bg-yellow-100 text-yellow-800",
    stop: "bg-red-100 text-red-800",
  };

  return (
    <Card className="border-2 border-indigo-200 bg-indigo-50/60">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-indigo-600 text-white">
            <Brain className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg text-indigo-900">
              {t("project.detail.dfv.summary.title")}
            </CardTitle>
            <CardDescription className="text-sm text-indigo-700">
              {t("project.detail.dfv.summary.description")}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-900">
              {overall.toFixed(1)}/5
            </div>
            <div className="text-xs text-indigo-700">
              {t("project.detail.dfv.summary.overallLabel")}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="space-y-1">
            <div className="font-medium text-gray-800">
              {t("dd.project.dfv.score.desirability")}
            </div>
            <div className="text-xl font-semibold text-red-600">
              {desirability.toFixed(1)}/5
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-medium text-gray-800">
              {t("dd.project.dfv.score.feasibility")}
            </div>
            <div className="text-xl font-semibold text-blue-600">
              {feasibility.toFixed(1)}/5
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-medium text-gray-800">
              {t("dd.project.dfv.score.viability")}
            </div>
            <div className="text-xl font-semibold text-green-600">
              {viability.toFixed(1)}/5
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="text-sm text-gray-700">
            {t("project.detail.dfv.summary.recommendationLabel")}
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${recColor[rec]}`}>
            {recLabel[rec]}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id;
  const { user } = useAuth();
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
   const { t, language } = useLanguage();

  const localeMap: Record<string, string> = {
    "pt-BR": "pt-BR",
    en: "en-US",
    es: "es-ES",
    fr: "fr-FR",
  };

  const currentLocale = localeMap[language] || "en-US";

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Project not found");
      return response.json();
    },
    enabled: !!projectId,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/projects", projectId, "stats"],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}/stats`);
      if (!response.ok) throw new Error("Stats not found");
      return response.json();
    },
    enabled: !!projectId,
  });

  // Mutation to update project phase
  const updatePhaseMutation = useMutation({
    mutationFn: async (newPhase: number) => {
      console.log('Making API request to update phase:', newPhase, 'for project:', projectId);
      const result = await apiRequest('PUT', `/api/projects/${projectId}`, { currentPhase: newPhase });
      console.log('API request successful:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('Phase update successful:', data);
      // Invalidate and refetch project data
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "stats"] });
    },
    onError: (error) => {
      console.error('Phase update failed:', error);
    },
  });

  const handlePhaseChange = (phaseNumber: number) => {
    setSelectedPhase(phaseNumber);
    console.log('Phase change requested:', { 
      phaseNumber, 
      currentPhase: project?.currentPhase, 
      isPending: updatePhaseMutation.isPending,
      projectId 
    });
    
    if (!project) {
      console.error('No project data available');
      return;
    }

    if (updatePhaseMutation.isPending) {
      console.log('Mutation already pending, skipping');
      return;
    }

    if (phaseNumber !== project.currentPhase) {
      console.log('Updating phase from', project.currentPhase, 'to', phaseNumber);
      updatePhaseMutation.mutate(phaseNumber);
    } else {
      console.log('Phase already selected:', phaseNumber);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t("project.detail.notFound.title")}
          </h2>
          <p className="text-gray-600 mb-6">
            {t("project.detail.notFound.description")}
          </p>
          <Link href="/projects">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("project.detail.notFound.backButton")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const effectivePhase = selectedPhase ?? project.currentPhase ?? 1;

  return (
    <div className="project-detail">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/projects">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("project.detail.header.back")}
            </Button>
          </Link>
          <div className="flex-1">
            <h1
              className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900"
              data-testid="heading-project-name"
            >
              {project.name}
            </h1>
            {project.description && (
              <p
                className="text-gray-600 mt-1"
                data-testid="text-project-description"
              >
                {project.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/projects/${project.id}/journey`}>
              <Button variant="outline" size="sm">
                <Map className="w-4 h-4 mr-2" />
                {t("project.detail.header.journey")}
              </Button>
            </Link>
            <EditProjectDialog project={project} projectId={projectId!} />
            <Badge
              variant={
                project.status === "completed" ? "default" : "secondary"
              }
              className={
                project.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : ""
              }
              data-testid="badge-project-status"
            >
              {project.status === "completed"
                ? t("project.detail.header.status.completed")
                : t("project.detail.header.status.inProgress")}
            </Badge>
          </div>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("project.detail.stats.progress.title")}
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className="text-2xl font-bold mb-2"
                data-testid="text-completion-rate"
              >
                {project.completionRate}%
              </div>
              <Progress value={project.completionRate || 0} className="h-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("project.detail.stats.currentPhase.title")}
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-current-phase">
                {t("project.detail.stats.currentPhase.value", {
                  phase: String(project.currentPhase),
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                {project.currentPhase
                  ? phaseData[
                      project.currentPhase as keyof typeof phaseData
                    ]?.title
                  : "N/A"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("project.detail.stats.createdAt.title")}
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className="text-2xl font-bold"
                data-testid="text-created-date"
              >
                {project.createdAt
                  ? new Date(project.createdAt).toLocaleDateString(currentLocale)
                  : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats &&
                  t("project.detail.stats.tools", {
                    completed: String(stats.completedTools),
                    total: String(stats.totalTools),
                  })}
              </p>
            </CardContent>
          </Card>
        </div>

        <GuidingCriteriaSummaryCard projectId={project.id} />

        {/* Main Content with Tabs */}
        <Tabs defaultValue="phases" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4 gap-2 h-auto">
            <TabsTrigger
              value="phases"
              data-testid="tab-phases"
              className="text-xs sm:text-sm whitespace-normal sm:whitespace-nowrap py-2"
            >
              {t("project.detail.tabs.phases")}
            </TabsTrigger>
            <TabsTrigger
              value="kanban"
              data-testid="tab-kanban"
              className="text-xs sm:text-sm whitespace-normal sm:whitespace-nowrap py-2"
            >
              <Columns3 className="w-4 h-4 mr-2 hidden sm:inline" />
              {t("project.detail.tabs.kanban")}
            </TabsTrigger>
            <TabsTrigger
              value="analysis"
              data-testid="tab-analysis"
              className="text-xs sm:text-sm whitespace-normal sm:whitespace-nowrap py-2"
            >
              <Brain className="w-4 h-4 mr-2 hidden sm:inline" />
              {t("project.detail.tabs.analysis")}
            </TabsTrigger>
            <TabsTrigger
              value="team"
              data-testid="tab-team"
              className="text-xs sm:text-sm whitespace-normal sm:whitespace-nowrap py-2"
            >
              <Users className="w-4 h-4 mr-2 hidden sm:inline" />
              {t("project.detail.tabs.team")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="phases" className="space-y-6">
            {/* Design Thinking Phases */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {t("project.detail.phases.title")}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5].map((phaseNumber) => (
                  <PhaseCard
                    key={phaseNumber}
                    phaseNumber={phaseNumber}
                    isActive={effectivePhase === phaseNumber}
                    isCompleted={(project.currentPhase || 1) > phaseNumber}
                    onClick={() => handlePhaseChange(phaseNumber)}
                    isUpdating={updatePhaseMutation.isPending}
                  />
                ))}

                {/* Benchmarking Card */}
                <Card className="bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-purple-200 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-purple-600 text-white">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg text-purple-900">
                          {t("project.detail.benchmarking.title")}
                        </CardTitle>
                        <CardDescription className="text-sm text-purple-700">
                          {t("project.detail.benchmarking.description")}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link href="/benchmarking">
                      <Button
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        data-testid="button-benchmarking"
                      >
                        {t("project.detail.benchmarking.button")}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Ferramentas da Fase Selecionada */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {t("project.detail.phaseTools.title", {
                  phase: String(effectivePhase),
                })}
              </h2>
              {effectivePhase === 1 && <Phase1Tools projectId={project.id} />}
              {effectivePhase === 2 && <Phase2Tools projectId={project.id} />}
              {effectivePhase === 3 && <Phase3Tools projectId={project.id} />}
              {effectivePhase === 4 && <Phase4Tools projectId={project.id} />}
              {effectivePhase === 5 && <Phase5Tools projectId={project.id} />}
            </div>

            {/* DFV Assessment Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {t("project.detail.dfvSection.title")}
              </h2>
              <DvfSummaryCard projectId={project.id} />
            </div>
          </TabsContent>

          <TabsContent value="kanban" className="space-y-6">
            <KanbanBoard projectId={project.id} />
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <AnalysisReport projectId={project.id} />
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {t("project.detail.team.title")}
            </h2>
            <p className="text-gray-600 mb-2">
              {t("project.detail.team.description")}
            </p>
            <TeamManagement
              projectId={project.id}
              isOwner={project.userId === user?.id}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}