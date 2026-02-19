import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Plus, Sparkles, TrendingUp, CheckCircle2, Circle, AlertCircle, ArrowRight, Download, Eye } from "lucide-react";
import { DoubleDiamondWizard } from "@/components/double-diamond/DoubleDiamondWizard";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface DoubleDiamondProject {
  id: string;
  name: string;
  description: string | null;
  currentPhase: string;
  completionPercentage: number;
  isCompleted: boolean;
  createdAt: Date;
}

const FREE_PLAN_DOUBLE_DIAMOND_LIMIT = 3;

export default function DoubleDiamond() {
  const [showWizard, setShowWizard] = useState(false);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const { t } = useLanguage();

  const handleExportProject = async (projectId: string, projectName: string) => {
    try {
      const response = await fetch(`/api/double-diamond/${projectId}/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName: `${projectName} (Continuação)` }),
      });
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: t("dd.list.export.toast.success.title"),
          description: t("dd.list.export.toast.success.description"),
        });
        setTimeout(() => window.location.href = `/projects/${data.projectId}`, 2000);
      } else {
        toast({
          title: t("dd.list.export.toast.error.title"),
          description: data.error || t("dd.list.export.toast.error.description"),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t("dd.list.export.toast.error.title"),
        description: t("dd.list.export.toast.error.network"),
        variant: "destructive",
      });
    }
  };
  const [, setLocation] = useLocation();

  const { data: projects = [], isLoading } = useQuery<DoubleDiamondProject[]>({
    queryKey: ["/api/double-diamond"],
  });

  const { data: subscriptionInfo } = useQuery<any>({
    queryKey: ["/api/subscription-info"],
  });

  // Check if user has reached the limit
  const currentUsage = projects.length;
  const isFreeUser = !subscriptionInfo?.subscription || subscriptionInfo?.plan?.name === "free" || subscriptionInfo?.plan?.priceMonthly === 0;
  
  // Get limit from plan or use default for free users
  const planLimit = subscriptionInfo?.plan?.maxDoubleDiamondProjects;

  // Admins têm limite ilimitado de Double Diamond
  const effectiveLimit = isAdmin
    ? null
    : (planLimit !== null && planLimit !== undefined
        ? planLimit
        : (isFreeUser ? FREE_PLAN_DOUBLE_DIAMOND_LIMIT : null));
  
  const hasReachedLimit = effectiveLimit !== null && currentUsage >= effectiveLimit;
  const remainingProjects = effectiveLimit !== null ? Math.max(0, effectiveLimit - currentUsage) : null;

  const getPhaseLabel = (phase: string) => {
    const phaseKeyMap: Record<string, string> = {
      discover: "dd.list.phase.discover",
      define: "dd.list.phase.define",
      develop: "dd.list.phase.develop",
      deliver: "dd.list.phase.deliver",
    };
    const key = phaseKeyMap[phase];
    return key ? t(key) : phase;
  };

  const getPhaseColor = (phase: string) => {
    const colors: Record<string, string> = {
      discover: "bg-blue-500",
      define: "bg-purple-500",
      develop: "bg-orange-500",
      deliver: "bg-green-500"
    };
    return colors[phase] || "bg-gray-500";
  };

  const handleCreateClick = () => {
    if (hasReachedLimit) {
      setShowLimitAlert(true);
      toast({
        title: t("dd.list.limit.toast.title"),
        description: t("dd.list.limit.toast.description", {
          limit: String(effectiveLimit ?? 0),
        }),
        variant: "destructive",
      });
      return;
    }
    setShowWizard(true);
  };

  const handleUpgrade = () => {
    setLocation("/pricing");
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">{t("dd.list.hero.title")}</h1>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground">
          {t("dd.list.hero.description")}
        </p>
      </div>

      {/* Limit Alert (não mostrar para admin, que é ilimitado) */}
      {showLimitAlert && !isAdmin && effectiveLimit !== null && (
        <Alert className="mb-6 sm:mb-8 border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-900 dark:text-orange-100">
            {t("dd.list.limit.alert.title")}
          </AlertTitle>
          <AlertDescription className="text-orange-800 dark:text-orange-200">
            {t("dd.list.limit.alert.description", {
              limit: String(effectiveLimit ?? 0),
            })}
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-4 mt-2 border-orange-300 text-orange-700 hover:bg-orange-100"
              onClick={handleUpgrade}
            >
              {t("dd.list.limit.alert.button.upgrade")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* CTA criar novo projeto */}
      <Dialog open={showWizard} onOpenChange={setShowWizard}>
        <DialogTrigger asChild>
          <Card 
            className={`mb-6 sm:mb-8 cursor-pointer hover:shadow-lg transition-shadow border-2 border-dashed ${
              hasReachedLimit 
                ? "border-orange-300 bg-orange-50/50 dark:bg-orange-950/10 opacity-75" 
                : "border-primary/50 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20"
            }`}
            onClick={handleCreateClick}
          >
            <CardContent className="p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className={`p-2 sm:p-3 md:p-4 rounded-full flex-shrink-0 ${
                hasReachedLimit ? "bg-orange-500" : "bg-primary"
              }`}>
                <Plus className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold mb-1.5 sm:mb-2 leading-tight">
                  {hasReachedLimit
                    ? t("dd.list.cta.limit.title")
                    : t("dd.list.cta.create.title")}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {hasReachedLimit
                    ? t("dd.list.cta.limit.description", {
                        limit: String(effectiveLimit ?? 0),
                      })
                    : t("dd.list.cta.create.description")}
                  {isFreeUser && !hasReachedLimit && remainingProjects !== null && (
                    <span className="block mt-1 text-xs font-medium text-blue-600">
                      {t("dd.list.cta.remaining", {
                        count: String(remainingProjects),
                      })}
                    </span>
                  )}
                </p>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base flex-shrink-0 w-full sm:w-auto justify-center ${
                hasReachedLimit
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              }`}>
                {hasReachedLimit ? (
                  <>
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="font-medium">
                      {t("dd.list.cta.badge.limit")}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="font-medium">
                      {t("dd.list.cta.badge.ai")}
                    </span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>

        <DialogContent className="w-[calc(100vw-2rem)] max-w-4xl h-[90vh] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2 border-b">
            <DialogTitle className="text-xl sm:text-2xl">{t("dd.list.wizard.title")}</DialogTitle>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6">
            <DoubleDiamondWizard onComplete={() => setShowWizard(false)} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Lista de projetos */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-32 bg-muted" />
            </Card>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-muted rounded-full">
              <TrendingUp className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">
              {t("dd.list.empty.title")}
            </h3>
            <p className="text-muted-foreground max-w-md">
              {t("dd.list.empty.description")}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => window.location.href = `/double-diamond/${project.id}`}
              data-testid={`card-double-diamond-${project.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="mb-2">{project.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description || t("dd.list.card.noDescription")}
                    </CardDescription>
                  </div>
                  {project.isCompleted && (
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Progresso */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span className="text-muted-foreground">
                      {t("dd.list.card.progress.label")}
                    </span>
                    <span className="font-medium">{project.completionPercentage}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all"
                      style={{ width: `${project.completionPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Fase atual */}
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${getPhaseColor(project.currentPhase)}`} />
                  <span className="text-sm text-muted-foreground">
                    {t("dd.list.card.phase.label")} {" "}
                    <span className="font-medium text-foreground">
                      {getPhaseLabel(project.currentPhase)}
                    </span>
                  </span>
                </div>

                {/* Indicador de fases */}
                <div className="flex gap-2 mt-4">
                  {["discover", "define", "develop", "deliver"].map((phase, index) => {
                    const isCompleted = ["discover", "define", "develop", "deliver"].indexOf(project.currentPhase) > index;
                    const isCurrent = project.currentPhase === phase;
                    
                    return (
                      <div 
                        key={phase}
                        className={`flex-1 h-1 rounded-full ${
                          isCompleted ? getPhaseColor(phase) : 
                          isCurrent ? `${getPhaseColor(phase)} opacity-50` : 
                          "bg-muted"
                        }`}
                      />
                    );
                  })}
                </div>
              </CardContent>
              
              <CardFooter className="bg-muted/50 border-t pt-3">
                <div className="flex gap-2 w-full">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/double-diamond/${project.id}`;
                    }}
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    {t("dd.list.card.button.details")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExportProject(project.id, project.name);
                    }}
                    disabled={project.completionPercentage < 50}
                    title={
                      project.completionPercentage < 50
                        ? t("dd.list.card.export.tooltip.disabled")
                        : t("dd.list.card.export.tooltip.enabled")
                    }
                  >
                    <Download className="mr-1 h-4 w-4" />
                    {t("dd.list.card.button.export")}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
