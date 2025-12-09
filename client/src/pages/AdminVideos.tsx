import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Eye, Search, Video, Youtube, Languages, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { VideoTutorial } from "@shared/schema";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const videoFormSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  titleEn: z.string().optional(),
  titleEs: z.string().optional(),
  titleFr: z.string().optional(),
  titleZh: z.string().optional(),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  descriptionEn: z.string().optional(),
  descriptionEs: z.string().optional(),
  descriptionFr: z.string().optional(),
  descriptionZh: z.string().optional(),
  phase: z.enum(["overview", "empathize", "define", "ideate", "prototype", "test"]),
  youtubeUrl: z.string().url("URL do YouTube inválida").optional().or(z.literal("")),
  thumbnailUrl: z.string().url("URL da thumbnail inválida").optional().or(z.literal("")),
  duration: z.string().optional(),
  order: z.number().int().min(0),
  isActive: z.boolean(),
  tagsInput: z.string().optional(), // Input field for tags (comma-separated string)
});

type VideoFormData = z.infer<typeof videoFormSchema>;

export default function AdminVideos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("all");
  const [editingVideo, setEditingVideo] = useState<VideoTutorial | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: videos = [], isLoading } = useQuery<VideoTutorial[]>({
    queryKey: ["/api/video-tutorials"],
  });

  const form = useForm<VideoFormData>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: {
      title: "",
      titleEn: "",
      titleEs: "",
      titleFr: "",
      titleZh: "",
      description: "",
      descriptionEn: "",
      descriptionEs: "",
      descriptionFr: "",
      descriptionZh: "",
      phase: "overview",
      youtubeUrl: "",
      thumbnailUrl: "",
      duration: "",
      order: 0,
      isActive: true,
      tagsInput: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: VideoFormData) => {
      const response = await apiRequest("POST", "/api/admin/video-tutorials", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/video-tutorials"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Vídeo criado",
        description: "O vídeo tutorial foi criado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao criar vídeo",
        description: "Ocorreu um erro ao tentar criar o vídeo tutorial.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<VideoFormData> }) => {
      const response = await apiRequest("PUT", `/api/admin/video-tutorials/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/video-tutorials"] });
      setIsDialogOpen(false);
      setEditingVideo(null);
      form.reset();
      toast({
        title: "Vídeo atualizado",
        description: "O vídeo tutorial foi atualizado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar vídeo",
        description: "Ocorreu um erro ao tentar atualizar o vídeo tutorial.",
        variant: "destructive",
      });
    },
  });

  const translateMutation = useMutation({
    mutationFn: async () => {
      const title = form.getValues("title");
      const description = form.getValues("description");

      if (!title || !description) {
        throw new Error("Preencha título e descrição em português primeiro");
      }

      const response = await apiRequest("POST", "/api/admin/translate/video", {
        title,
        description
      });

      if (!response.ok) {
        throw new Error("Failed to translate");
      }

      return response.json();
    },
    onSuccess: (data) => {
      form.setValue("titleEn", data.titleEn);
      form.setValue("descriptionEn", data.descriptionEn);
      form.setValue("titleEs", data.titleEs);
      form.setValue("descriptionEs", data.descriptionEs);
      form.setValue("titleFr", data.titleFr);
      form.setValue("descriptionFr", data.descriptionFr);
      form.setValue("titleZh", data.titleZh || "");
      form.setValue("descriptionZh", data.descriptionZh || "");

      toast({
        title: "Tradução completa! ✨",
        description: "O vídeo foi traduzido para inglês, espanhol, francês e chinês automaticamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao traduzir",
        description: error.message || "Ocorreu um erro ao traduzir o vídeo.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/video-tutorials/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/video-tutorials"] });
      toast({
        title: "Vídeo deletado",
        description: "O vídeo tutorial foi removido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao deletar vídeo",
        description: "Ocorreu um erro ao tentar deletar o vídeo tutorial.",
        variant: "destructive",
      });
    },
  });

  const phases = [
    { id: "all", label: "Todas as Fases" },
    { id: "overview", label: "Visão Geral" },
    { id: "empathize", label: "Empatizar" },
    { id: "define", label: "Definir" },
    { id: "ideate", label: "Idear" },
    { id: "prototype", label: "Prototipar" },
    { id: "test", label: "Testar" },
  ];

  const getPhaseLabel = (phase: string) => {
    const phaseObj = phases.find(p => p.id === phase);
    return phaseObj?.label || phase;
  };

  const getPhaseColor = (phase: string) => {
    const colors: Record<string, string> = {
      overview: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      empathize: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      define: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      ideate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      prototype: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      test: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return colors[phase] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (video.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPhase = phaseFilter === "all" || video.phase === phaseFilter;
    return matchesSearch && matchesPhase;
  });

  const handleEdit = (video: VideoTutorial) => {
    setEditingVideo(video);
    form.reset({
      title: video.title,
      titleEn: video.titleEn || "",
      titleEs: video.titleEs || "",
      titleFr: video.titleFr || "",
      titleZh: (video as any).titleZh || "",
      description: video.description || "",
      descriptionEn: video.descriptionEn || "",
      descriptionEs: video.descriptionEs || "",
      descriptionFr: video.descriptionFr || "",
      descriptionZh: (video as any).descriptionZh || "",
      phase: video.phase as any,
      youtubeUrl: video.youtubeUrl || "",
      thumbnailUrl: video.thumbnailUrl || "",
      duration: video.duration || "",
      order: video.order ?? 0,
      isActive: video.isActive ?? true,
      tagsInput: (video.tags && Array.isArray(video.tags)) ? video.tags.join(", ") : "",
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingVideo(null);
    form.reset({
      title: "",
      titleEn: "",
      titleEs: "",
      titleFr: "",
      titleZh: "",
      description: "",
      descriptionEn: "",
      descriptionEs: "",
      descriptionFr: "",
      descriptionZh: "",
      phase: "overview",
      youtubeUrl: "",
      thumbnailUrl: "",
      duration: "",
      order: videos.length,
      isActive: true,
      tagsInput: "",
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: VideoFormData) => {
    const { tagsInput, ...rest } = data;
    const videoData = {
      ...rest,
      tags: tagsInput ? tagsInput.split(",").map(t => t.trim()).filter(Boolean) : [],
    };

    if (editingVideo) {
      updateMutation.mutate({ id: editingVideo.id, data: videoData });
    } else {
      createMutation.mutate(videoData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2" data-testid="videos-title">
            <Video className="h-6 w-6" />
            Gerenciar Vídeos Tutoriais
          </h2>
          <p className="text-muted-foreground">
            Adicione links do YouTube para os vídeos tutoriais de Design Thinking
          </p>
        </div>
        <Button onClick={handleCreate} data-testid="button-create-video">
          <Plus className="mr-2 h-4 w-4" />
          Novo Vídeo
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar vídeos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-videos"
          />
        </div>
        <Select value={phaseFilter} onValueChange={setPhaseFilter}>
          <SelectTrigger className="w-48" data-testid="select-phase-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {phases.map((phase) => (
              <SelectItem key={phase.id} value={phase.id}>
                {phase.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/5" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Fase</TableHead>
                  <TableHead>URL YouTube</TableHead>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Visualizações</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVideos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-muted-foreground" data-testid="no-videos-message">
                        {searchTerm || phaseFilter !== "all"
                          ? "Nenhum vídeo encontrado com os filtros aplicados."
                          : "Nenhum vídeo encontrado. Crie o primeiro vídeo!"
                        }
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVideos.map((video) => (
                    <TableRow key={video.id} data-testid={`row-video-${video.id}`}>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate" title={video.title}>
                          {video.title}
                        </div>
                        {video.description && (
                          <div className="text-sm text-muted-foreground truncate" title={video.description}>
                            {video.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getPhaseColor(video.phase)}>
                          {getPhaseLabel(video.phase)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {video.youtubeUrl ? (
                          <a
                            href={video.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:underline"
                          >
                            <Youtube className="h-4 w-4" />
                            Ver vídeo
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-sm">Não adicionado</span>
                        )}
                      </TableCell>
                      <TableCell>{video.order}</TableCell>
                      <TableCell>{video.viewCount || 0}</TableCell>
                      <TableCell>
                        <Badge variant={video.isActive ? "default" : "secondary"}>
                          {video.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {video.youtubeUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(video.youtubeUrl!, '_blank')}
                              data-testid={`button-view-${video.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(video)}
                            data-testid={`button-edit-${video.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" data-testid={`button-delete-${video.id}`}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja deletar o vídeo "{video.title}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteMutation.mutate(video.id)}>
                                  Deletar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingVideo ? "Editar Vídeo Tutorial" : "Novo Vídeo Tutorial"}</DialogTitle>
            <DialogDescription>
              {editingVideo
                ? "Edite as informações do vídeo tutorial"
                : "Adicione um novo vídeo tutorial ao sistema"
              }
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título (PT) *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Introdução ao Design Thinking" data-testid="input-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="titleEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título (EN)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="English title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="titleEs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título (ES)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Título en español" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="titleFr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título (FR)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Titre en français" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="titleZh"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título (ZH)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="标题（中文，可选）" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (PT) *</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} placeholder="Descrição do vídeo" data-testid="input-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => translateMutation.mutate()}
                  disabled={translateMutation.isPending}
                  data-testid="button-auto-translate"
                  className="gap-2"
                >
                  {translateMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Traduzindo...
                    </>
                  ) : (
                    <>
                      <Languages className="h-4 w-4" />
                      Traduzir Automaticamente
                    </>
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="descriptionEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição (EN)</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={2} placeholder="English description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="descriptionEs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição (ES)</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={2} placeholder="Descripción en español" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="descriptionFr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição (FR)</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={2} placeholder="Description en français" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="descriptionZh"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição (ZH)</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={2} placeholder="视频的中文描述（可选）" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phase"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fase *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-phase">
                            <SelectValue placeholder="Selecione a fase" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="overview">Visão Geral</SelectItem>
                          <SelectItem value="empathize">Empatizar</SelectItem>
                          <SelectItem value="define">Definir</SelectItem>
                          <SelectItem value="ideate">Idear</SelectItem>
                          <SelectItem value="prototype">Prototipar</SelectItem>
                          <SelectItem value="test">Testar</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: 5:30" data-testid="input-duration" />
                      </FormControl>
                      <FormDescription>Formato: MM:SS</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="youtubeUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL do YouTube</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://www.youtube.com/watch?v=..." data-testid="input-youtube-url" />
                    </FormControl>
                    <FormDescription>Cole o link completo do vídeo no YouTube</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Thumbnail</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://..." data-testid="input-thumbnail-url" />
                    </FormControl>
                    <FormDescription>Opcional - URL da imagem de capa</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tagsInput"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="design thinking, empatia, personas" data-testid="input-tags" />
                    </FormControl>
                    <FormDescription>Separe as tags por vírgula</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ordem de Exibição</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          data-testid="input-order"
                        />
                      </FormControl>
                      <FormDescription>Ordem de exibição (0 = primeiro)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Ativo</FormLabel>
                        <FormDescription>
                          Vídeo visível para usuários
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-active"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingVideo(null);
                    form.reset();
                  }}
                  data-testid="button-cancel"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-submit"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Salvando..."
                    : editingVideo
                      ? "Atualizar Vídeo"
                      : "Criar Vídeo"
                  }
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
