import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Globe, Save, Languages, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertArticleSchema, type Article } from "@shared/schema";

const articleFormSchema = insertArticleSchema.extend({
  tags: z.string().optional().default(""),
  category: z.string().min(1, "Categoria é obrigatória"),
  title: z.string().min(1, "Título é obrigatório"),
  author: z.string().min(1, "Autor é obrigatório"),
  content: z.string().min(1, "Conteúdo é obrigatório"),
  titleEn: z.string().optional(),
  contentEn: z.string().optional(),
  descriptionEn: z.string().optional(),
  titleEs: z.string().optional(),
  contentEs: z.string().optional(),
  descriptionEs: z.string().optional(),
  titleFr: z.string().optional(),
  contentFr: z.string().optional(),
  descriptionFr: z.string().optional(),
  // Campo derivado apenas para o formulário: indica se o artigo é PREMIUM (Biblioteca Premium)
  isPremium: z.boolean().optional().default(false),
});

type ArticleFormData = z.infer<typeof articleFormSchema>;

interface ArticleEditorProps {
  article?: Article | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ArticleEditor({ article, isOpen, onClose }: ArticleEditorProps) {
  const [languageTab, setLanguageTab] = useState("pt");
  const [customCategory, setCustomCategory] = useState("");
  const [isCustomCategorySelected, setIsCustomCategorySelected] = useState(false);
  const { toast } = useToast();

  const defaultFormValues: ArticleFormData = {
    title: "",
    author: "",
    category: "design-thinking",
    description: "",
    content: "",
    tags: "",
    published: true,
    titleEn: "",
    contentEn: "",
    descriptionEn: "",
    titleEs: "",
    contentEs: "",
    descriptionEs: "",
    titleFr: "",
    contentFr: "",
    descriptionFr: "",
    isPremium: false,
  };

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (isOpen) {
      if (article) {
        form.reset({
          title: article.title || "",
          author: article.author || "",
          category: article.category || "design-thinking",
          description: article.description || "",
          content: article.content || "",
          tags: Array.isArray(article.tags) ? article.tags.join(", ") : "",
          published: article.published ?? true,
          titleEn: article.titleEn || "",
          contentEn: article.contentEn || "",
          descriptionEn: article.descriptionEn || "",
          titleEs: article.titleEs || "",
          contentEs: article.contentEs || "",
          descriptionEs: article.descriptionEs || "",
          titleFr: article.titleFr || "",
          contentFr: article.contentFr || "",
          descriptionFr: article.descriptionFr || "",
          isPremium: Array.isArray(article.tags)
            ? article.tags.includes("library-premium")
            : false,
        });
      } else {
        form.reset(defaultFormValues);
        setIsCustomCategorySelected(false);
        setCustomCategory("");
      }
      setLanguageTab("pt");
    } else {
      setLanguageTab("pt");
      setIsCustomCategorySelected(false);
      setCustomCategory("");
      form.reset(defaultFormValues);
    }
  }, [isOpen, article]);

  const createArticleMutation = useMutation({
    mutationFn: async (data: ArticleFormData) => {
      const { isPremium, ...rest } = data;

      let tagsArray = rest.tags
        ? rest.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [];

      // Garante que a tag especial "library-premium" representa conteúdo PREMIUM da biblioteca
      if (isPremium) {
        if (!tagsArray.includes("library-premium")) {
          tagsArray.push("library-premium");
        }
      } else {
        tagsArray = tagsArray.filter((tag) => tag !== "library-premium");
      }

      const payload = {
        ...rest,
        tags: tagsArray,
      };

      const response = await apiRequest("POST", "/api/articles", payload);
      if (!response.ok) {
        throw new Error("Failed to create article");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Artigo criado",
        description: "O artigo foi criado com sucesso.",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Erro ao criar artigo",
        description: "Ocorreu um erro ao criar o artigo.",
        variant: "destructive",
      });
    },
  });

  const updateArticleMutation = useMutation({
    mutationFn: async (data: ArticleFormData) => {
      const { isPremium, ...rest } = data;

      let tagsArray = rest.tags
        ? rest.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [];

      if (isPremium) {
        if (!tagsArray.includes("library-premium")) {
          tagsArray.push("library-premium");
        }
      } else {
        tagsArray = tagsArray.filter((tag) => tag !== "library-premium");
      }

      const payload = {
        ...rest,
        tags: tagsArray,
      };

      const response = await apiRequest("PUT", `/api/articles/${article?.id}`, payload);
      if (!response.ok) {
        throw new Error("Failed to update article");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Artigo atualizado",
        description: "O artigo foi atualizado com sucesso.",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar artigo",
        description: "Ocorreu um erro ao atualizar o artigo.",
        variant: "destructive",
      });
    },
  });

  const translateMutation = useMutation({
    mutationFn: async () => {
      const title = form.getValues("title");
      const description = form.getValues("description");
      const content = form.getValues("content");

      if (!title || !description || !content) {
        throw new Error("Preencha título, descrição e conteúdo em português primeiro");
      }

      const response = await apiRequest("POST", "/api/admin/translate/article", {
        title,
        description,
        content
      });

      if (!response.ok) {
        throw new Error("Failed to translate");
      }

      return response.json();
    },
    onSuccess: (data) => {
      form.setValue("titleEn", data.titleEn);
      form.setValue("descriptionEn", data.descriptionEn);
      form.setValue("contentEn", data.contentEn);
      form.setValue("titleEs", data.titleEs);
      form.setValue("descriptionEs", data.descriptionEs);
      form.setValue("contentEs", data.contentEs);
      form.setValue("titleFr", data.titleFr);
      form.setValue("descriptionFr", data.descriptionFr);
      form.setValue("contentFr", data.contentFr);

      toast({
        title: "Tradução completa! ✨",
        description: "O artigo foi traduzido para inglês, espanhol e francês automaticamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao traduzir",
        description: error.message || "Ocorreu um erro ao traduzir o artigo.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ArticleFormData) => {
    if (article) {
      updateArticleMutation.mutate(data);
    } else {
      createArticleMutation.mutate(data);
    }
  };

  const isLoading = createArticleMutation.isPending || updateArticleMutation.isPending;

  const categories = [
    { value: "empathize", label: "Empatizar" },
    { value: "define", label: "Definir" },
    { value: "ideate", label: "Idear" },
    { value: "prototype", label: "Prototipar" },
    { value: "test", label: "Testar" },
    { value: "design-thinking", label: "Design Thinking" },
    { value: "creativity", label: "Criatividade" },
    { value: "ux-ui", label: "UX/UI" },
    { value: "custom", label: "📝 Categoria Personalizada" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-3xl lg:max-w-5xl h-[100svh] sm:h-[95vh] max-h-[100svh] sm:max-h-[95vh] p-0 gap-0 overflow-hidden flex flex-col">
        <DialogDescription className="sr-only">
          {article ? "Editar artigo existente" : "Criar novo artigo para a biblioteca"}
        </DialogDescription>
        
        <DialogHeader className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 border-b bg-background">
          <DialogTitle data-testid="editor-title" className="text-lg sm:text-xl font-semibold">
            {article ? "Editar Artigo" : "Criar Novo Artigo"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Language Selector */}
              <div className="border-2 border-primary/20 rounded-lg p-4 bg-primary/5">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="h-5 w-5 text-primary" />
                  <Label className="text-base font-semibold">Selecione o Idioma</Label>
                </div>
                
                <Tabs value={languageTab} onValueChange={setLanguageTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 h-12 bg-background">
                    <TabsTrigger value="pt" data-testid="tab-lang-pt" className="text-base font-semibold">
                      🇧🇷 PT
                    </TabsTrigger>
                    <TabsTrigger value="en" data-testid="tab-lang-en" className="text-base font-semibold">
                      🇺🇸 EN
                    </TabsTrigger>
                    <TabsTrigger value="es" data-testid="tab-lang-es" className="text-base font-semibold">
                      🇪🇸 ES
                    </TabsTrigger>
                    <TabsTrigger value="fr" data-testid="tab-lang-fr" className="text-base font-semibold">
                      🇫🇷 FR
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Preencha os campos abaixo no idioma selecionado
                  </p>
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
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Autor</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nome do autor"
                          data-testid="input-author"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          if (value === "custom") {
                            setIsCustomCategorySelected(true);
                            field.onChange("custom");
                          } else {
                            setIsCustomCategorySelected(false);
                            setCustomCategory("");
                            field.onChange(value);
                          }
                        }} 
                        value={field.value || "design-thinking"}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isCustomCategorySelected && (
                        <FormControl className="mt-2">
                          <Input
                            placeholder="Digite uma categoria personalizada"
                            value={customCategory}
                            onChange={(e) => {
                              setCustomCategory(e.target.value);
                              field.onChange(e.target.value);
                            }}
                            data-testid="input-custom-category"
                          />
                        </FormControl>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Publicado</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        O artigo será visível na biblioteca
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value ?? true}
                        onCheckedChange={field.onChange}
                        data-testid="switch-published"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPremium"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Conteúdo PREMIUM</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Disponível apenas para quem tem o add-on <strong>Biblioteca Premium</strong>
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                        data-testid="switch-premium"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite as tags separadas por vírgula"
                        data-testid="input-tags"
                        {...field}
                      />
                    </FormControl>
                    <div className="text-sm text-muted-foreground">
                      Exemplo: empatia, pesquisa, usuários
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Portuguese Content */}
              {languageTab === "pt" && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título (Português) *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o título do artigo"
                            data-testid="input-title"
                            {...field}
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
                        <FormLabel>Descrição (opcional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Breve descrição do artigo"
                            data-testid="textarea-description"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conteúdo *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Escreva o conteúdo do artigo em Markdown..."
                            className="min-h-[250px] sm:min-h-[400px] resize-none font-mono text-sm"
                            data-testid="textarea-content"
                            {...field}
                          />
                        </FormControl>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          Use Markdown: **negrito**, *itálico*, # títulos
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* English Content */}
              {languageTab === "en" && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="titleEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (English)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter the article title"
                            data-testid="input-title-en"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="descriptionEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief article description"
                            data-testid="textarea-description-en"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contentEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write the article content in Markdown..."
                            className="min-h-[250px] sm:min-h-[400px] resize-none font-mono text-sm"
                            data-testid="textarea-content-en"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          Use Markdown: **bold**, *italic*, # headings
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Spanish Content */}
              {languageTab === "es" && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="titleEs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título (Español)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingrese el título del artículo"
                            data-testid="input-title-es"
                            {...field}
                            value={field.value ?? ""}
                          />
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
                        <FormLabel>Descripción (opcional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Breve descripción del artículo"
                            data-testid="textarea-description-es"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contentEs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contenido</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Escriba el contenido del artículo en Markdown..."
                            className="min-h-[250px] sm:min-h-[400px] resize-none font-mono text-sm"
                            data-testid="textarea-content-es"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          Use Markdown: **negrita**, *cursiva*, # títulos
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* French Content */}
              {languageTab === "fr" && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="titleFr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre (Français)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Entrez le titre de l'article"
                            data-testid="input-title-fr"
                            {...field}
                            value={field.value ?? ""}
                          />
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
                        <FormLabel>Description (optionnel)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brève description de l'article"
                            data-testid="textarea-description-fr"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contentFr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contenu</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Rédigez le contenu de l'article en Markdown..."
                            className="min-h-[250px] sm:min-h-[400px] resize-none font-mono text-sm"
                            data-testid="textarea-content-fr"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          Utilisez Markdown: **gras**, *italique*, # titres
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Footer with buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  data-testid="button-cancel"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  data-testid="button-save"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Salvando..." : "Salvar Artigo"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
