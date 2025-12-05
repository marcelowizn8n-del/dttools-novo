import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Search, Clock, CheckCircle, BarChart3, Users, Target, Lightbulb, Wrench, TestTube, TrendingUp, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProjectSchema, type Project, type InsertProject } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

const phaseIcons = {
  1: { icon: Users, labelKey: "phases.empathize", color: "bg-red-100 text-red-700" },
  2: { icon: Target, labelKey: "phases.define", color: "bg-orange-100 text-orange-700" },
  3: { icon: Lightbulb, labelKey: "phases.ideate", color: "bg-yellow-100 text-yellow-700" },
  4: { icon: Wrench, labelKey: "phases.prototype", color: "bg-blue-100 text-blue-700" },
  5: { icon: TestTube, labelKey: "phases.test", color: "bg-green-100 text-green-700" },
};

function ProjectCard({ project }: { project: Project }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { t, language } = useLanguage();

  const currentPhaseConfig =
    phaseIcons[project.currentPhase as keyof typeof phaseIcons] || phaseIcons[1];
  const Icon = currentPhaseConfig.icon;

  const localeMap: Record<string, string> = {
    "pt-BR": "pt-BR",
    en: "en-US",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
    zh: "zh-CN",
  };
  const dateLocale = localeMap[language] || "pt-BR";

  const handleCardClick = () => {
    setLocation(`/projects/${project.id}`);
  };

  const handleExportPPTX = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent card navigation
    e.stopPropagation();
    
    try {
      toast({
        title: t("projects.export.pptx.generating.title"),
        description: t("projects.export.generating.description"),
      });

      // Fetch the PPTX with proper authentication
      const response = await fetch(`/api/projects/${project.id}/export-pptx`, {
        method: 'GET',
        credentials: 'include', // Include session cookies
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(t("projects.export.error.sessionExpired"));
        }
        throw new Error(
          t("projects.export.error.http", {
            status: String(response.status),
            statusText: response.statusText,
          })
        );
      }

      // Get the PPTX as blob
      const pptxBlob = await response.blob();
      
      // Create download URL and trigger download
      const url = URL.createObjectURL(pptxBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project.name.replace(/[^a-zA-Z0-9]/g, '_')}_DTTools.pptx`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
      
      toast({
        title: t("projects.export.success.title"),
        description: t("projects.export.success.description", { type: "PPTX" }),
      });
    } catch (error) {
      console.error("Error exporting PPTX:", error);
      toast({
        title: t("projects.export.error.title"),
        description:
          error instanceof Error
            ? error.message
            : t("projects.export.error.description", { type: "PPTX" }),
        variant: "destructive",
      });
    }
  };

  const handleExportPDF = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent card navigation
    e.stopPropagation();
    
    try {
      toast({
        title: t("projects.export.pdf.generating.title"),
        description: t("projects.export.generating.description"),
      });

      // Fetch the PDF with proper authentication
      const response = await fetch(`/api/projects/${project.id}/export-pdf`, {
        method: 'GET',
        credentials: 'include', // Include session cookies
        headers: {
          'Accept': 'application/pdf',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sessão expirada. Faça login novamente.');
        }
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      // Get the PDF as blob
      const pdfBlob = await response.blob();
      
      // Create download URL and trigger download
      const url = URL.createObjectURL(pdfBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project.name.replace(/[^a-zA-Z0-9]/g, '_')}_DTTools.pdf`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
      
      toast({
        title: t("projects.export.success.title"),
        description: t("projects.export.success.description", { type: "PDF" }),
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        title: t("projects.export.error.title"),
        description:
          error instanceof Error
            ? error.message
            : t("projects.export.error.description", { type: "PDF" }),
        variant: "destructive",
      });
    }
  };

  const handleExportMarkdown = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent card navigation
    e.stopPropagation();
    
    try {
      toast({
        title: t("projects.export.markdown.generating.title"),
        description: t("projects.export.generating.description"),
      });

      // Fetch the markdown content with proper authentication
      const response = await fetch(`/api/projects/${project.id}/export-markdown`, {
        method: 'GET',
        credentials: 'include', // Include session cookies
        headers: {
          'Accept': 'text/markdown',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sessão expirada. Faça login novamente.');
        }
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      // Get the markdown content as text
      const markdownContent = await response.text();
      
      // Create blob and download
      const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project.name.replace(/[^a-zA-Z0-9]/g, '_')}_DTTools.md`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
      
      toast({
        title: t("projects.export.success.title"),
        description: t("projects.export.success.description", { type: "Markdown" }),
      });
    } catch (error) {
      console.error("Error exporting Markdown:", error);
      toast({
        title: t("projects.export.error.title"),
        description:
          error instanceof Error
            ? error.message
            : t("projects.export.error.description", { type: "Markdown" }),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative group">
      <Card 
        onClick={handleCardClick}
        className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                })}
              </span>
            </div>

            {/* Export Dropdown - compacto e responsivo */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 px-2 whitespace-nowrap"
                  data-testid={`button-export-${project.id}`}
                  onClick={(e) => {
                    // Evitar navegar para o card ao abrir o menu
                    e.stopPropagation();
                  }}
                >
                  <Download className="w-3 h-3 mr-1" />
                  {t("projects.card.export.button")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={handleExportPPTX}
                  data-testid={`menu-export-pptx-${project.id}`}
                >
                  <FileText className="w-3 h-3 mr-2" />
                  {t("projects.card.export.pptx")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleExportPDF}
                  data-testid={`menu-export-pdf-${project.id}`}
                >
                  <FileText className="w-3 h-3 mr-2" />
                  {t("projects.card.export.pdf")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleExportMarkdown}
                  data-testid={`menu-export-markdown-${project.id}`}
                >
                  <FileText className="w-3 h-3 mr-2" />
                  {t("projects.card.export.markdown")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

function CreateProjectDialog() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      const response = await apiRequest("POST", "/api/projects", data);
      return response.json();
    },
    onSuccess: (project: Project) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: t("projects.create.toast.success.title"),
        description: t("projects.create.toast.success.description"),
      });
      setIsOpen(false);
      form.reset();
      if (project?.id) {
        setLocation(`/projects/${project.id}`);
      }
    },
    onError: () => {
      toast({
        title: t("projects.create.toast.error.title"),
        description: t("projects.create.toast.error.description"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProject) => {
    createProjectMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-create-project">
          <Plus className="w-4 h-4 mr-2" />
          {t("projects.create.button.open")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("projects.create.title")}</DialogTitle>
          <DialogDescription>
            {t("projects.create.description")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("projects.create.field.name.label")}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t("projects.create.field.name.placeholder")}
                      {...field} 
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
                  <FormLabel>{t("projects.create.field.description.label")}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t("projects.create.field.description.placeholder")}
                      className="resize-none"
                      rows={3}
                      {...field}
                      value={field.value || ""}
                      data-testid="input-project-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                data-testid="button-cancel"
              >
                {t("projects.create.button.cancel")}
              </Button>
              <Button 
                type="submit" 
                disabled={createProjectMutation.isPending}
                data-testid="button-submit"
              >
                {createProjectMutation.isPending
                  ? t("projects.create.button.submitting")
                  : t("projects.create.button.submit")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useLanguage();

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeProjects = projects.filter(p => p.status === "in_progress").length;
  const completedProjects = projects.filter(p => p.status === "completed").length;
  const avgCompletion = projects.length > 0 
    ? Math.round(projects.reduce((sum, p) => sum + (p.completionRate || 0), 0) / projects.length)
    : 0;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" data-testid="heading-projects">
            {t("projects.page.title")}
          </h1>
          <p className="text-gray-600 mt-1">
            {t("projects.page.subtitle")}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Link href="/benchmarking">
            <Button variant="outline" className="border-blue-600 text-blue-700 hover:bg-blue-50" data-testid="button-benchmarking">
              <BarChart3 className="w-4 h-4 mr-2" />
              {t("projects.benchmarking.title")}
            </Button>
          </Link>
          <CreateProjectDialog />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("projects.stats.active.title")}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-active-projects">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              {t("projects.stats.active.subtitle")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("projects.stats.completed.title")}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-completed-projects">{completedProjects}</div>
            <p className="text-xs text-muted-foreground">
              {t("projects.stats.completed.subtitle")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("projects.stats.average.title")}
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-average-completion">{avgCompletion}%</div>
            <p className="text-xs text-muted-foreground">
              {t("projects.stats.average.subtitle")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={t("projects.search.placeholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          data-testid="input-search-projects"
        />
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Lightbulb className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {projects.length === 0
              ? t("projects.empty.noProjects.title")
              : t("projects.empty.noResults.title")}
          </h3>
          <p className="text-gray-600 mb-6">
            {projects.length === 0
              ? t("projects.empty.noProjects.description")
              : t("projects.empty.noResults.description")}
          </p>
          {projects.length === 0 && <CreateProjectDialog />}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          
          {/* Benchmarking Card */}
          <Link href="/benchmarking">
            <Card className="border-2 border-dashed border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all duration-300 cursor-pointer bg-gradient-to-br from-purple-50 to-blue-50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mb-3">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {t("projects.benchmarking.title")}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {t("projects.benchmarking.subtitle")}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    {t("projects.benchmarking.item.industryAnalysis")}
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    {t("projects.benchmarking.item.maturityAssessment")}
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" data-testid="button-benchmarking-projects">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {t("projects.benchmarking.cta")}
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}
    </div>
  );
}