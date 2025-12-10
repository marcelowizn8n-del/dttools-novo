import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Sparkles, Loader2, CheckCircle2, Circle, Download, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BpmnDiagram } from "@shared/schema";
import { BpmnEditor } from "@/components/bpmn/BpmnEditor";

interface DoubleDiamondProject {
  id: string;
  name: string;
  description?: string;
  currentPhase: string;
  completionPercentage: number;
  sectorId?: string | null;
  successCaseId?: string | null;
  customSuccessCase?: string | null;
  customSuccessCaseUrl?: string | null;
  customSuccessCasePdfUrl?: string | null;
  targetAudience?: string | null;
  problemStatement?: string | null;
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

type InitialBriefingFormData = {
  name: string;
  description?: string;
  sectorId?: string;
  successCaseId?: string;
  customSuccessCase?: string;
  customSuccessCaseUrl?: string;
  customSuccessCasePdfUrl?: string;
  targetAudience: string;
  problemStatement: string;
};

const DEFAULT_BPMN_XML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BpmnDiagram_1">
    <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="172" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

export default function DoubleDiamondProject() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const { language, t } = useLanguage();
  const [isEditingBriefing, setIsEditingBriefing] = useState(false);
  const [isCreatingBpmnDiagram, setIsCreatingBpmnDiagram] = useState(false);
  const [selectedBpmnDiagramId, setSelectedBpmnDiagramId] = useState<string | null>(null);
  const [newDiagramTitle, setNewDiagramTitle] = useState("");
  const [newDiagramType, setNewDiagramType] = useState<"as-is" | "to-be" | "other">("to-be");

  const initialBriefingSchema = z.object({
    name: z.string().min(3, t("dd.project.briefing.validation.name.min")),
    description: z.string().optional(),
    sectorId: z.string().optional(),
    successCaseId: z.string().optional(),
    customSuccessCase: z.string().optional(),
    customSuccessCaseUrl: z.string().optional(),
    customSuccessCasePdfUrl: z.string().optional(),
    targetAudience: z.string().min(10, t("dd.project.briefing.validation.targetAudience.min")),
    problemStatement: z.string().min(20, t("dd.project.briefing.validation.problemStatement.min")),
  });

  // Fetch project
  const { data: project, isLoading, isError, error } = useQuery<DoubleDiamondProject>({
    queryKey: ["/api/double-diamond", id],
    enabled: !!id
  });

  const { data: bpmnDiagrams = [], isLoading: isLoadingBpmnDiagrams } = useQuery<BpmnDiagram[]>({
    queryKey: ["/api/double-diamond", id, "bpmn-diagrams"],
    enabled: !!id,
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

  if (bpmnDiagrams && bpmnDiagrams.length > 0 && !selectedBpmnDiagramId) {
    setSelectedBpmnDiagramId(bpmnDiagrams[0].id);
  }

  // Generate Discover Phase
  const generateDiscoverMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/double-diamond/${id}/generate/discover`, { language });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/double-diamond", id] });
      toast({
        title: t("dd.project.discover.toast.success.title"),
        description: t("dd.project.discover.toast.success.description"),
      });
      setActiveTab("define");
    },
    onError: (error: any) => {
      toast({
        title: t("dd.project.discover.toast.error.title"),
        description: error.message || t("dd.project.discover.toast.error.description"),
        variant: "destructive"
      });
    }
  });

  const { data: sectors = [] } = useQuery<{ id: string; name: string }[]>({
    queryKey: ["/api/industry-sectors"],
  });

  const { data: successCases = [] } = useQuery<{ id: string; name: string; company: string }[]>({
    queryKey: ["/api/success-cases"],
  });

  const briefingForm = useForm<InitialBriefingFormData>({
    resolver: zodResolver(initialBriefingSchema),
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      sectorId: project?.sectorId || "",
      successCaseId: project?.successCaseId || "",
      customSuccessCase: project?.customSuccessCase || "",
      customSuccessCaseUrl: project?.customSuccessCaseUrl || "",
      customSuccessCasePdfUrl: project?.customSuccessCasePdfUrl || "",
      targetAudience: project?.targetAudience || "",
      problemStatement: project?.problemStatement || "",
    },
  });

  // Atualizar valores do formulário quando o projeto carregar
  if (project && !briefingForm.getValues("name")) {
    briefingForm.reset({
      name: project.name || "",
      description: project.description || "",
      sectorId: project.sectorId || "",
      successCaseId: project.successCaseId || "",
      customSuccessCase: project.customSuccessCase || "",
      customSuccessCaseUrl: project.customSuccessCaseUrl || "",
      customSuccessCasePdfUrl: project.customSuccessCasePdfUrl || "",
      targetAudience: project.targetAudience || "",
      problemStatement: project.problemStatement || "",
    });
  }

  const updateBriefingMutation = useMutation({
    mutationFn: async (data: InitialBriefingFormData) => {
      if (!id) throw new Error(t("dd.project.error.notFound.internal"));
      const response = await apiRequest("PATCH", `/api/double-diamond/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/double-diamond", id] });
      toast({
        title: t("dd.project.briefing.toast.update.success.title"),
        description: t("dd.project.briefing.toast.update.success.description"),
      });
      setIsEditingBriefing(false);
    },
    onError: (error: any) => {
      toast({
        title: t("dd.project.briefing.toast.update.error.title"),
        description: error.message || t("dd.project.briefing.toast.update.error.description"),
        variant: "destructive",
      });
    },
  });

  const exportProjectMutation = useMutation({
    mutationFn: async () => {
      if (!id) {
        throw new Error(t("dd.project.export.error.notFound"));
      }

      const response = await fetch(`/api/double-diamond/${id}/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: `${
            project?.name || t("dd.project.export.fallbackProjectName")
          }${t("dd.project.export.projectNameSuffix")}`,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || t("dd.project.export.error.failed"));
      }
      return data;
    },
    onSuccess: (data: any) => {
      toast({
        title: t("dd.project.export.toast.success.title"),
        description: t("dd.project.export.toast.success.description"),
      });
      setTimeout(() => {
        setLocation(`/projects/${data.projectId}`);
      }, 1500);
    },
    onError: (error: any) => {
      toast({
        title: t("dd.project.export.toast.error.title"),
        description: error.message || t("dd.project.export.toast.error.description"),
        variant: "destructive",
      });
    },
  });

  // Generate Define Phase
  const generateDefineMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/double-diamond/${id}/generate/define`, { language });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/double-diamond", id] });
      toast({
        title: t("dd.project.define.toast.success.title"),
        description: t("dd.project.define.toast.success.description"),
      });
      setActiveTab("develop");
    },
    onError: (error: any) => {
      toast({
        title: t("dd.project.define.toast.error.title"),
        description: error.message || t("dd.project.define.toast.error.description"),
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
        title: t("dd.project.develop.toast.success.title"),
        description: t("dd.project.develop.toast.success.description"),
      });
      setActiveTab("deliver");
    },
    onError: (error: any) => {
      toast({
        title: t("dd.project.develop.toast.error.title"),
        description: error.message || t("dd.project.develop.toast.error.description"),
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
        title: t("dd.project.deliver.toast.success.title"),
        description: t("dd.project.deliver.toast.success.description"),
      });
      setActiveTab("dfv");
    },
    onError: (error: any) => {
      toast({
        title: t("dd.project.deliver.toast.error.title"),
        description: error.message || t("dd.project.deliver.toast.error.description"),
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
        title: t("dd.project.dfv.toast.generate.success.title"),
        description: t("dd.project.dfv.toast.generate.success.description"),
      });
    },
    onError: (error: any) => {
      toast({
        title: t("dd.project.dfv.toast.generate.error.title"),
        description: error.message || t("dd.project.dfv.toast.generate.error.description"),
        variant: "destructive"
      });
    }
  });

  const createBpmnDiagramMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error(t("dd.project.error.notFound.internal"));
      const response = await apiRequest("POST", `/api/double-diamond/${id}/bpmn-diagrams`, {
        title: newDiagramTitle || t("dd.project.bpmn.defaultTitle"),
        type: newDiagramType,
        bpmnXml: DEFAULT_BPMN_XML,
      });
      return await response.json();
    },
    onSuccess: (diagram: BpmnDiagram) => {
      queryClient.invalidateQueries({ queryKey: ["/api/double-diamond", id, "bpmn-diagrams"] });
      setIsCreatingBpmnDiagram(false);
      setNewDiagramTitle("");
      setNewDiagramType("to-be");
      setSelectedBpmnDiagramId(diagram.id);
      toast({
        title: t("dd.project.bpmn.toast.create.success.title"),
        description: t("dd.project.bpmn.toast.create.success.description"),
      });
    },
    onError: (error: any) => {
      toast({
        title: t("dd.project.bpmn.toast.create.error.title"),
        description: error.message || t("dd.project.bpmn.toast.create.error.description"),
        variant: "destructive",
      });
    },
  });

  const deleteBpmnDiagramMutation = useMutation({
    mutationFn: async (diagramId: string) => {
      await apiRequest("DELETE", `/api/bpmn-diagrams/${diagramId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/double-diamond", id, "bpmn-diagrams"] });
      setSelectedBpmnDiagramId(null);
      toast({
        title: t("dd.project.bpmn.toast.delete.success.title"),
        description: t("dd.project.bpmn.toast.delete.success.description"),
      });
    },
    onError: (error: any) => {
      toast({
        title: t("dd.project.bpmn.toast.delete.error.title"),
        description: error.message || t("dd.project.bpmn.toast.delete.error.description"),
        variant: "destructive",
      });
    },
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
            <CardTitle>{t("dd.project.error.load.title")}</CardTitle>
            <CardDescription>
              {(error as any)?.message || t("dd.project.error.load.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/double-diamond", id] })}>
              {t("dd.project.button.retry")}
            </Button>
            <Button variant="outline" onClick={() => setLocation("/double-diamond")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("dd.project.button.back")}
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
            <CardTitle>{t("dd.project.error.notFound.title")}</CardTitle>
            <CardDescription>{t("dd.project.error.notFound.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/double-diamond")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("dd.project.button.back")}
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
          {t("dd.project.header.back")}
        </Button>

        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2" data-testid="text-project-name">{project.name}</h1>
                {project.description && (
                  <p className="text-muted-foreground mb-2">{project.description}</p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingBriefing(true)}
                data-testid="button-edit-briefing"
              >
                {t("dd.project.header.editBriefing")}
              </Button>
            </div>

            {/* Progress */}
            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{t("dd.project.header.progress")}</span>
                <span className="text-muted-foreground">{project.completionPercentage}%</span>
              </div>
              <Progress value={project.completionPercentage} className="h-2" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {t("dd.project.header.currentPhase", {
                phase:
                  project.currentPhase === "discover"
                    ? t("dd.list.phase.discover")
                    : project.currentPhase === "define"
                    ? t("dd.list.phase.define")
                    : project.currentPhase === "develop"
                    ? t("dd.list.phase.develop")
                    : project.currentPhase === "deliver"
                    ? t("dd.list.phase.deliver")
                    : t("dd.project.phase.dfv"),
              })}
            </Badge>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  window.open(`/api/double-diamond/${id}/export/pdf`, '_blank');
                  toast({
                    title: t("dd.project.header.exportPdf.toast.title"),
                    description: t("dd.project.header.exportPdf.toast.description"),
                  });
                }}
                data-testid="button-export-pdf"
              >
                <Download className="mr-2 h-4 w-4" />
                {t("dd.project.header.exportPdf.button")}
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
                  {t("dd.project.header.recreate.button")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isEditingBriefing} onOpenChange={setIsEditingBriefing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("dd.project.briefing.dialog.title")}</DialogTitle>
          </DialogHeader>
          <Form {...briefingForm}>
            <form
              onSubmit={briefingForm.handleSubmit((data) => updateBriefingMutation.mutate(data))}
              className="space-y-4 mt-2"
            >
              <FormField
                control={briefingForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("dd.project.briefing.form.name.label")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={briefingForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("dd.project.briefing.form.description.label")}</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[60px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={briefingForm.control}
                  name="sectorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("dd.project.briefing.form.sector.label")}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("dd.project.briefing.form.sector.placeholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sectors.map((sector) => (
                            <SelectItem key={sector.id} value={sector.id}>
                              {sector.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={briefingForm.control}
                  name="successCaseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("dd.project.briefing.form.successCase.label")}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("dd.project.briefing.form.successCase.placeholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {successCases.map((successCase) => (
                            <SelectItem key={successCase.id} value={successCase.id}>
                              {successCase.name} ({successCase.company})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={briefingForm.control}
                name="customSuccessCase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("dd.project.briefing.form.customSuccessCase.label")}</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[60px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={briefingForm.control}
                name="customSuccessCaseUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("dd.project.briefing.form.customSuccessCaseUrl.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("dd.project.briefing.form.customSuccessCaseUrl.placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={briefingForm.control}
                name="customSuccessCasePdfUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("dd.project.briefing.form.customSuccessCasePdfUrl.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("dd.project.briefing.form.customSuccessCasePdfUrl.placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={briefingForm.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("dd.project.briefing.form.targetAudience.label")}</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[60px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={briefingForm.control}
                name="problemStatement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("dd.project.briefing.form.problemStatement.label")}</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditingBriefing(false)}
                >
                  {t("dd.project.briefing.form.buttons.cancel")}
                </Button>
                <Button type="submit" disabled={updateBriefingMutation.isPending}>
                  {updateBriefingMutation.isPending
                    ? t("dd.project.briefing.form.buttons.submit.loading")
                    : t("dd.project.briefing.form.buttons.submit.idle")}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Phase Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className={activeTab === "discover" ? "border-blue-500" : ""}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">{`1. ${t("dd.list.phase.discover")}`}</CardTitle>
              {getPhaseIcon(project.discoverStatus)}
            </div>
          </CardHeader>
        </Card>

        <Card className={activeTab === "define" ? "border-blue-500" : ""}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">{`2. ${t("dd.list.phase.define")}`}</CardTitle>
              {getPhaseIcon(project.defineStatus)}
            </div>
          </CardHeader>
        </Card>

        <Card className={activeTab === "develop" ? "border-blue-500" : ""}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">{`3. ${t("dd.list.phase.develop")}`}</CardTitle>
              {getPhaseIcon(project.developStatus)}
            </div>
          </CardHeader>
        </Card>

        <Card className={activeTab === "deliver" ? "border-blue-500" : ""}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">{`4. ${t("dd.list.phase.deliver")}`}</CardTitle>
              {getPhaseIcon(project.deliverStatus)}
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab || "discover"} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full flex overflow-x-auto md:grid md:grid-cols-6 h-auto p-1 gap-1">
          <TabsTrigger value="discover" data-testid="tab-discover">{t("dd.project.tabs.discover")}</TabsTrigger>
          <TabsTrigger value="define" data-testid="tab-define">{t("dd.project.tabs.define")}</TabsTrigger>
          <TabsTrigger value="develop" data-testid="tab-develop">{t("dd.project.tabs.develop")}</TabsTrigger>
          <TabsTrigger value="deliver" data-testid="tab-deliver">{t("dd.project.tabs.deliver")}</TabsTrigger>
          <TabsTrigger value="bpmn" data-testid="tab-bpmn">{t("dd.project.tabs.bpmn")}</TabsTrigger>
          <TabsTrigger value="dfv" data-testid="tab-dfv">{t("dd.project.tabs.dfv")}</TabsTrigger>
        </TabsList>

        {/* DISCOVER TAB */}
        <TabsContent value="discover">
          <Card>
            <CardHeader>
              <CardTitle>{t("dd.project.discover.title")}</CardTitle>
              <CardDescription>
                {t("dd.project.discover.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.discoverStatus === "pending" ? (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                  <h3 className="text-lg font-semibold mb-2">{t("dd.project.discover.empty.title")}</h3>
                  <p className="text-muted-foreground mb-6">
                    {t("dd.project.discover.empty.description")}
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
                        {t("dd.project.phase.generate.loading")}
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        {t("dd.project.discover.empty.button.generate")}
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Pain Points */}
                  {project.discoverPainPoints && (
                    <div>
                      <h4 className="font-semibold mb-3">{t("dd.project.discover.section.painPoints.title")}</h4>
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
                      <h4 className="font-semibold mb-3">{t("dd.project.discover.section.insights.title")}</h4>
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
                      <h4 className="font-semibold mb-3">{t("dd.project.discover.section.userNeeds.title")}</h4>
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

        {/* BPMN TAB */}
        <TabsContent value="bpmn">
          <Card>
            <CardHeader>
              <CardTitle>{t("dd.project.bpmn.title")}</CardTitle>
              <CardDescription>
                {t("dd.project.bpmn.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {t("dd.project.bpmn.list.emptyTitle")}
                </p>
                <Button
                  size="sm"
                  onClick={() => setIsCreatingBpmnDiagram(true)}
                  data-testid="button-new-bpmn-diagram"
                >
                  {t("dd.project.bpmn.button.newDiagram")}
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  {isLoadingBpmnDiagrams ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  ) : bpmnDiagrams.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {t("dd.project.bpmn.list.emptyDescription")}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {bpmnDiagrams.map((diagram) => (
                        <button
                          key={diagram.id}
                          type="button"
                          onClick={() => setSelectedBpmnDiagramId(diagram.id)}
                          className={`w-full text-left px-3 py-2 rounded-md border ${
                            selectedBpmnDiagramId === diagram.id
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                              : "border-border hover:bg-muted"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1">
                              <div className="font-medium text-sm truncate">
                                {diagram.title}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {diagram.type === "as-is"
                                  ? t("dd.project.bpmn.type.asIs")
                                  : diagram.type === "to-be"
                                  ? t("dd.project.bpmn.type.toBe")
                                  : t("dd.project.bpmn.type.other")}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(event) => {
                                event.stopPropagation();
                                deleteBpmnDiagramMutation.mutate(diagram.id);
                              }}
                              disabled={deleteBpmnDiagramMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="lg:col-span-2">
                  {selectedBpmnDiagramId && bpmnDiagrams.length > 0 ? (
                    <BpmnEditor
                      diagramId={selectedBpmnDiagramId}
                      initialXml={
                        bpmnDiagrams.find((d) => d.id === selectedBpmnDiagramId)?.bpmnXml || null
                      }
                    />
                  ) : (
                    <div className="flex items-center justify-center h-[400px] border rounded-md text-sm text-muted-foreground">
                      {t("dd.project.bpmn.list.emptyDescription")}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Dialog open={isCreatingBpmnDiagram} onOpenChange={setIsCreatingBpmnDiagram}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{t("dd.project.bpmn.button.newDiagram")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("dd.project.bpmn.form.title.label")}</Label>
                  <Input
                    value={newDiagramTitle}
                    onChange={(e) => setNewDiagramTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("dd.project.bpmn.form.type.label")}</Label>
                  <Select
                    value={newDiagramType}
                    onValueChange={(value) =>
                      setNewDiagramType(value as "as-is" | "to-be" | "other")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="as-is">
                        {t("dd.project.bpmn.type.asIs")}
                      </SelectItem>
                      <SelectItem value="to-be">
                        {t("dd.project.bpmn.type.toBe")}
                      </SelectItem>
                      <SelectItem value="other">
                        {t("dd.project.bpmn.type.other")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsCreatingBpmnDiagram(false)}
                  >
                    {t("dd.project.briefing.form.buttons.cancel")}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => createBpmnDiagramMutation.mutate()}
                    disabled={createBpmnDiagramMutation.isPending || !newDiagramTitle.trim()}
                  >
                    {createBpmnDiagramMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {t("dd.project.briefing.form.buttons.submit.idle")}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* DEFINE TAB */}
        <TabsContent value="define">
          <Card>
            <CardHeader>
              <CardTitle>{t("dd.project.define.title")}</CardTitle>
              <CardDescription>
                {t("dd.project.define.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.defineStatus === "pending" ? (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                  <h3 className="text-lg font-semibold mb-2">{t("dd.project.define.empty.title")}</h3>
                  <p className="text-muted-foreground mb-6">
                    {t("dd.project.define.empty.description")}
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
                        {t("dd.project.phase.generate.loading")}
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        {t("dd.project.define.empty.button.generate")}
                      </>
                    )}
                  </Button>
                  {project.discoverStatus !== "completed" && (
                    <p className="text-sm text-muted-foreground mt-4">
                      {t("dd.project.define.empty.blocked")}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* POV Statements */}
                  {project.definePovStatements && (
                    <div>
                      <h4 className="font-semibold mb-3">{t("dd.project.define.section.pov.title")}</h4>
                      <div className="grid gap-3">
                        {(project.definePovStatements as any[]).map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border rounded-lg hover:border-purple-500 cursor-pointer transition-colors">
                            <p className="font-medium">
                              {t("dd.project.define.section.pov.statement", {
                                user: item.user,
                                need: item.need,
                              })}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {t("dd.project.define.section.pov.insightLabel")}
                              {" "}
                              {item.insight}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* HMW Questions */}
                  {project.defineHmwQuestions && (
                    <div>
                      <h4 className="font-semibold mb-3">{t("dd.project.define.section.hmw.title")}</h4>
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
              <CardTitle>{t("dd.project.develop.title")}</CardTitle>
              <CardDescription>
                {t("dd.project.develop.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {project.developStatus === "pending" ? (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-orange-500" />
                  <h3 className="text-lg font-semibold mb-2">{t("dd.project.develop.empty.title")}</h3>
                  <p className="text-muted-foreground mb-6">
                    {t("dd.project.develop.empty.description")}
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
                        {t("dd.project.phase.generate.loading")}
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        {t("dd.project.develop.empty.button.generate")}
                      </>
                    )}
                  </Button>
                  {project.defineStatus !== "completed" && (
                    <p className="text-sm text-muted-foreground mt-4">
                      {t("dd.project.develop.empty.blocked")}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {project.developIdeas && (
                    <div>
                      <h4 className="font-semibold mb-3">{t("dd.project.develop.section.ideas.title")}</h4>
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
              <CardTitle>{t("dd.project.deliver.title")}</CardTitle>
              <CardDescription>
                {t("dd.project.deliver.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {project.deliverStatus === "pending" ? (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <h3 className="text-lg font-semibold mb-2">{t("dd.project.deliver.empty.title")}</h3>
                  <p className="text-muted-foreground mb-6">
                    {t("dd.project.deliver.empty.description")}
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
                        {t("dd.project.phase.generate.loading")}
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        {t("dd.project.deliver.empty.button.generate")}
                      </>
                    )}
                  </Button>
                  {project.developStatus !== "completed" && (
                    <p className="text-sm text-muted-foreground mt-4">
                      {t("dd.project.deliver.empty.blocked")}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* MVP Concept */}
                  {project.deliverMvpConcept && (
                    <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                      <h4 className="font-semibold mb-3 text-lg">{t("dd.project.deliver.section.mvpConcept.title")}</h4>
                      {(() => {
                        const mvp = project.deliverMvpConcept as any;
                        return (
                          <div className="space-y-3">
                            {mvp.name && (
                              <div>
                                <span className="font-semibold">{t("dd.project.deliver.section.mvpConcept.nameLabel")}</span> {mvp.name}
                              </div>
                            )}
                            {mvp.tagline && (
                              <div>
                                <span className="font-semibold">{t("dd.project.deliver.section.mvpConcept.taglineLabel")}</span> {mvp.tagline}
                              </div>
                            )}
                            {mvp.valueProposition && (
                              <div>
                                <span className="font-semibold">{t("dd.project.deliver.section.mvpConcept.valuePropositionLabel")}</span>
                                <p className="mt-1 text-sm">{mvp.valueProposition}</p>
                              </div>
                            )}
                            {mvp.coreFeatures && Array.isArray(mvp.coreFeatures) && mvp.coreFeatures.length > 0 && (
                              <div>
                                <span className="font-semibold">{t("dd.project.deliver.section.mvpConcept.featuresLabel")}</span>
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
                      <h4 className="font-semibold mb-3 text-lg">{t("dd.project.deliver.section.logoSuggestions.title")}</h4>
                      <div className="grid gap-4">
                        {(project.deliverLogoSuggestions as any[]).map((logo: any, idx: number) => (
                          <div key={idx} className="p-4 border rounded-lg">
                            <div className="font-medium mb-2">{t("dd.project.deliver.section.logoSuggestions.optionLabel", { index: idx + 1 })}</div>
                            {logo.description && <p className="text-sm mb-2">{logo.description}</p>}
                            <div className="flex gap-4 text-sm">
                              {logo.style && <span><span className="font-semibold">{t("dd.project.deliver.section.logoSuggestions.styleLabel")}</span> {logo.style}</span>}
                              {logo.colors && Array.isArray(logo.colors) && (
                                <span><span className="font-semibold">{t("dd.project.deliver.section.logoSuggestions.colorsLabel")}</span> {logo.colors.join(", ")}</span>
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
                      <h4 className="font-semibold mb-3 text-lg">{t("dd.project.deliver.section.landingPage.title")}</h4>
                      {(() => {
                        const landing = project.deliverLandingPage as any;
                        return (
                          <div className="space-y-4">
                            {landing.headline && (
                              <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                                <div className="font-semibold mb-1">{t("dd.project.deliver.section.landingPage.headlineLabel")}</div>
                                <div className="text-lg">{landing.headline}</div>
                              </div>
                            )}
                            {landing.subheadline && (
                              <div className="p-4 border rounded-lg">
                                <div className="font-semibold mb-1">{t("dd.project.deliver.section.landingPage.subheadlineLabel")}</div>
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
                                        <span className="text-sm font-semibold">{t("dd.project.deliver.section.landingPage.ctaLabel")}</span> {section.cta}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            {landing.finalCta && (
                              <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                                <div className="font-semibold mb-1">{t("dd.project.deliver.section.landingPage.finalCtaLabel")}</div>
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
                      <h4 className="font-semibold mb-3 text-lg">{t("dd.project.deliver.section.socialLines.title")}</h4>
                      {(() => {
                        const social = project.deliverSocialMediaLines as any;
                        return (
                          <div className="grid gap-4 md:grid-cols-3">
                            {social.twitter && Array.isArray(social.twitter) && social.twitter.length > 0 && (
                              <div className="p-4 border rounded-lg">
                                <div className="font-semibold mb-2">{t("dd.project.deliver.section.socialLines.twitterLabel")}</div>
                                <ul className="space-y-2 text-sm">
                                  {social.twitter.map((line: string, idx: number) => (
                                    <li key={idx}>• {line}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {social.linkedin && Array.isArray(social.linkedin) && social.linkedin.length > 0 && (
                              <div className="p-4 border rounded-lg">
                                <div className="font-semibold mb-2">{t("dd.project.deliver.section.socialLines.linkedinLabel")}</div>
                                <ul className="space-y-2 text-sm">
                                  {social.linkedin.map((line: string, idx: number) => (
                                    <li key={idx}>• {line}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {social.instagram && Array.isArray(social.instagram) && social.instagram.length > 0 && (
                              <div className="p-4 border rounded-lg">
                                <div className="font-semibold mb-2">{t("dd.project.deliver.section.socialLines.instagramLabel")}</div>
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
                      <h4 className="font-semibold mb-3 text-lg">{t("dd.project.deliver.section.testPlan.title")}</h4>
                      {(() => {
                        const plan = project.deliverTestPlan as any;
                        return (
                          <div className="space-y-3">
                            {plan.objectives && Array.isArray(plan.objectives) && plan.objectives.length > 0 && (
                              <div className="p-4 border rounded-lg">
                                <div className="font-semibold mb-2">{t("dd.project.deliver.section.testPlan.objectivesLabel")}</div>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  {plan.objectives.map((obj: string, idx: number) => (
                                    <li key={idx}>{obj}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {plan.targetUsers && (
                              <div className="p-4 border rounded-lg">
                                <div className="font-semibold mb-1">{t("dd.project.deliver.section.testPlan.targetUsersLabel")}</div>
                                <div className="text-sm">{plan.targetUsers}</div>
                              </div>
                            )}
                            {plan.metrics && Array.isArray(plan.metrics) && plan.metrics.length > 0 && (
                              <div className="p-4 border rounded-lg">
                                <div className="font-semibold mb-2">{t("dd.project.deliver.section.testPlan.metricsLabel")}</div>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  {plan.metrics.map((metric: string, idx: number) => (
                                    <li key={idx}>{metric}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {plan.testMethods && Array.isArray(plan.testMethods) && plan.testMethods.length > 0 && (
                              <div className="p-4 border rounded-lg">
                                <div className="font-semibold mb-2">{t("dd.project.deliver.section.testPlan.testMethodsLabel")}</div>
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
              <CardTitle>{t("dd.project.dfv.title")}</CardTitle>
              <CardDescription>
                {t("dd.project.dfv.subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!project.dfvDesirabilityScore ? (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-indigo-500" />
                  <h3 className="text-lg font-semibold mb-2">{t("dd.project.dfv.empty.title")}</h3>
                  <p className="text-muted-foreground mb-6">
                    {t("dd.project.dfv.empty.description")}
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
                        {t("dd.project.dfv.generate.button.loading")}
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        {t("dd.project.dfv.generate.button.idle")}
                      </>
                    )}
                  </Button>
                  {project.deliverStatus !== "completed" && (
                    <p className="text-sm text-muted-foreground mt-4">
                      {t("dd.project.dfv.generate.blocked")}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{t("dd.project.dfv.cta.title")}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t("dd.project.dfv.cta.description")}
                      </p>
                    </div>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-indigo-500 to-emerald-600"
                      onClick={() => exportProjectMutation.mutate()}
                      disabled={exportProjectMutation.isPending}
                      data-testid="button-export-main-project"
                    >
                      {exportProjectMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("dd.project.dfv.cta.button.loading")}
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          {t("dd.project.dfv.cta.button.idle")}
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Scores */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">{t("dd.project.dfv.score.desirability")}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-blue-600">{project.dfvDesirabilityScore}/100</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">{t("dd.project.dfv.score.feasibility")}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-green-600">{project.dfvFeasibilityScore}/100</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">{t("dd.project.dfv.score.viability")}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-purple-600">{project.dfvViabilityScore}/100</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Explanation of how scores are calculated */}
                  <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground space-y-2">
                    <h4 className="font-semibold text-foreground">{t("dd.dfv.explanation.title")}</h4>
                    <p>
                      {t("dd.dfv.explanation.intro")}
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>{t("dd.dfv.explanation.item.desirability")}</li>
                      <li>{t("dd.dfv.explanation.item.feasibility")}</li>
                      <li>{t("dd.dfv.explanation.item.viability")}</li>
                    </ul>
                    <p>{t("dd.dfv.explanation.footer")}</p>
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
                                  <CardTitle className="text-lg">{t("dd.project.dfv.detail.desirability.title")}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  {dfvData.desirability.strengths && Array.isArray(dfvData.desirability.strengths) && dfvData.desirability.strengths.length > 0 && (
                                    <div>
                                      <h5 className="font-semibold mb-2 text-green-700 dark:text-green-400">{t("dd.project.dfv.detail.section.strengths")}</h5>
                                      <ul className="list-disc list-inside space-y-1 text-sm">
                                        {dfvData.desirability.strengths.map((strength: string, idx: number) => (
                                          <li key={idx}>{strength}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {dfvData.desirability.concerns && Array.isArray(dfvData.desirability.concerns) && dfvData.desirability.concerns.length > 0 && (
                                    <div>
                                      <h5 className="font-semibold mb-2 text-orange-700 dark:text-orange-400">{t("dd.project.dfv.detail.section.concerns")}</h5>
                                      <ul className="list-disc list-inside space-y-1 text-sm">
                                        {dfvData.desirability.concerns.map((concern: string, idx: number) => (
                                          <li key={idx}>{concern}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {dfvData.desirability.reasoning && (
                                    <div>
                                      <h5 className="font-semibold mb-2">{t("dd.project.dfv.detail.section.reasoning")}</h5>
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
                                  <CardTitle className="text-lg">{t("dd.project.dfv.detail.feasibility.title")}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  {dfvData.feasibility.strengths && Array.isArray(dfvData.feasibility.strengths) && dfvData.feasibility.strengths.length > 0 && (
                                    <div>
                                      <h5 className="font-semibold mb-2 text-green-700 dark:text-green-400">{t("dd.project.dfv.detail.section.strengths")}</h5>
                                      <ul className="list-disc list-inside space-y-1 text-sm">
                                        {dfvData.feasibility.strengths.map((strength: string, idx: number) => (
                                          <li key={idx}>{strength}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {dfvData.feasibility.concerns && Array.isArray(dfvData.feasibility.concerns) && dfvData.feasibility.concerns.length > 0 && (
                                    <div>
                                      <h5 className="font-semibold mb-2 text-orange-700 dark:text-orange-400">{t("dd.project.dfv.detail.section.concerns")}</h5>
                                      <ul className="list-disc list-inside space-y-1 text-sm">
                                        {dfvData.feasibility.concerns.map((concern: string, idx: number) => (
                                          <li key={idx}>{concern}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {dfvData.feasibility.reasoning && (
                                    <div>
                                      <h5 className="font-semibold mb-2">{t("dd.project.dfv.detail.section.reasoning")}</h5>
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
                                  <CardTitle className="text-lg">{t("dd.project.dfv.detail.viability.title")}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  {dfvData.viability.strengths && Array.isArray(dfvData.viability.strengths) && dfvData.viability.strengths.length > 0 && (
                                    <div>
                                      <h5 className="font-semibold mb-2 text-green-700 dark:text-green-400">{t("dd.project.dfv.detail.section.strengths")}</h5>
                                      <ul className="list-disc list-inside space-y-1 text-sm">
                                        {dfvData.viability.strengths.map((strength: string, idx: number) => (
                                          <li key={idx}>{strength}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {dfvData.viability.concerns && Array.isArray(dfvData.viability.concerns) && dfvData.viability.concerns.length > 0 && (
                                    <div>
                                      <h5 className="font-semibold mb-2 text-orange-700 dark:text-orange-400">{t("dd.project.dfv.detail.section.concerns")}</h5>
                                      <ul className="list-disc list-inside space-y-1 text-sm">
                                        {dfvData.viability.concerns.map((concern: string, idx: number) => (
                                          <li key={idx}>{concern}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {dfvData.viability.reasoning && (
                                    <div>
                                      <h5 className="font-semibold mb-2">{t("dd.project.dfv.detail.section.reasoning")}</h5>
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
                        <CardTitle className="text-lg">{t("dd.project.dfv.overall.title")}</CardTitle>
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
                        <CardTitle className="text-lg">{t("dd.project.dfv.recommendations.title")}</CardTitle>
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
                        <CardTitle className="text-lg">{t("dd.project.dfv.nextSteps.title")}</CardTitle>
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
