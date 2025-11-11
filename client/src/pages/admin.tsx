import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Eye, Search, Filter, Users, BarChart3, FolderOpen, UserPlus, CreditCard, MessageSquare, Video, Diamond, Globe, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth, ProtectedRoute } from "@/contexts/AuthContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import ArticleEditor from "@/components/admin/ArticleEditor";
import TestimonialsTab from "@/components/admin/TestimonialsTab";
import AdminVideos from "./AdminVideos";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Article, User, Project, SubscriptionPlan, DoubleDiamondProject } from "@shared/schema";

function ArticlesTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/articles/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Artigo deletado",
        description: "O artigo foi removido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao deletar artigo",
        description: "Ocorreu um erro ao tentar deletar o artigo.",
        variant: "destructive",
      });
    },
  });

  const categories = [
    { id: "all", label: "Todas as categorias" },
    { id: "empathize", label: "Empatizar" },
    { id: "define", label: "Definir" },
    { id: "ideate", label: "Idear" },
    { id: "prototype", label: "Prototipar" },
    { id: "test", label: "Testar" },
    { id: "design-thinking", label: "Design Thinking" },
    { id: "creativity", label: "Criatividade" },
    { id: "ux-ui", label: "UX/UI" },
  ];

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.label || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      empathize: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      define: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300", 
      ideate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      prototype: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      test: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      "design-thinking": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
      creativity: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      "ux-ui": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
    };
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || article.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold" data-testid="articles-title">
            Gerenciar Artigos
          </h2>
          <p className="text-muted-foreground">
            Crie, edite e gerencie os artigos da biblioteca
          </p>
        </div>
        <Button onClick={() => {
          setEditingArticle(null); // Limpa qualquer artigo em edição
          setIsCreating(true);
        }} data-testid="button-create-article">
          <Plus className="mr-2 h-4 w-4" />
          Novo Artigo
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar artigos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-articles"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48" data-testid="select-category-filter">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Articles Table */}
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
                  <TableHead>Categoria</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground" data-testid="no-articles-message">
                        {searchTerm || categoryFilter !== "all" 
                          ? "Nenhum artigo encontrado com os filtros aplicados."
                          : "Nenhum artigo encontrado. Crie o primeiro artigo!"
                        }
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredArticles.map((article) => (
                    <TableRow key={article.id} data-testid={`row-article-${article.id}`}>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate" title={article.title}>
                          {article.title}
                        </div>
                        {article.description && (
                          <div className="text-sm text-muted-foreground truncate" title={article.description}>
                            {article.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(article.category)}>
                          {getCategoryLabel(article.category)}
                        </Badge>
                      </TableCell>
                      <TableCell>{article.author}</TableCell>
                      <TableCell>{formatDate(article.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant={article.published ? "default" : "secondary"}>
                          {article.published ? "Publicado" : "Rascunho"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/library/article/${article.id}`, '_blank')}
                            data-testid={`button-view-${article.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingArticle(article)}
                            data-testid={`button-edit-${article.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                data-testid={`button-delete-${article.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Deletar artigo</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja deletar o artigo "{article.title}"? 
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteArticleMutation.mutate(article.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
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

      {/* Article Editor Dialog */}
      <ArticleEditor
        article={editingArticle}
        isOpen={!!editingArticle || isCreating}
        onClose={() => {
          setEditingArticle(null);
          setIsCreating(false);
        }}
      />
    </div>
  );
}

// Simplified User Form Schema - email and name required
const userFormSchema = z.object({
  username: z.string().min(3, "Username deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  role: z.enum(["user", "admin"]).default("user"),
});


// Dialog para editar limites personalizados de usuário

// Dialog para editar limites personalizados de usuário
function UserLimitsDialog({ 
  user, 
  isOpen, 
  onClose 
}: { 
  user: Omit<User, 'password'>; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const { toast } = useToast();
  
  const limitsFormSchema = z.object({
    customMaxProjects: z.number().nullable(),
    customMaxDoubleDiamondProjects: z.number().nullable(),
    customAiChatLimit: z.number().nullable(),
  });
  
  const form = useForm<z.infer<typeof limitsFormSchema>>({
    resolver: zodResolver(limitsFormSchema),
    defaultValues: {
      customMaxProjects: (user as any).customMaxProjects || null,
      customMaxDoubleDiamondProjects: (user as any).customMaxDoubleDiamondProjects || null,
      customAiChatLimit: (user as any).customAiChatLimit || null,
    },
  });

  const updateLimitsMutation = useMutation({
    mutationFn: async (data: z.infer<typeof limitsFormSchema>) => {
      const response = await apiRequest("PUT", `/api/users/${user.id}/limits`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Limites atualizados",
        description: "Os limites personalizados foram salvos com sucesso.",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar limites",
        description: "Ocorreu um erro ao salvar os limites.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: z.infer<typeof limitsFormSchema>) => {
    updateLimitsMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Limites Personalizados: {user.username}</DialogTitle>
          <DialogDescription>
            Configure limites específicos para este usuário. Deixe vazio para usar o limite do plano.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customMaxProjects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Máx. Projetos (vazio = usar plano)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      {...field} 
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="Padrão do plano" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customMaxDoubleDiamondProjects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Máx. Double Diamonds (vazio = usar plano)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      {...field} 
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="Padrão do plano" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customAiChatLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Máx. Chat IA (vazio = usar plano)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      {...field} 
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="Padrão do plano" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={updateLimitsMutation.isPending}>
                {updateLimitsMutation.isPending ? "Salvando..." : "Salvar Limites"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


function UsersTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isCreating, setIsCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<Omit<User, 'password'> | null>(null);
  const [editingUserLimits, setEditingUserLimits] = useState<Omit<User, 'password'> | null>(null);
  const { toast } = useToast();

  const { data: users = [], isLoading } = useQuery<Omit<User, 'password'>[]>({
    queryKey: ["/api/users"],
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: z.infer<typeof userFormSchema>) => {
      const response = await apiRequest("POST", "/api/users", userData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setIsCreating(false);
      toast({
        title: "Usuário criado",
        description: "O usuário foi criado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao criar usuário",
        description: "Ocorreu um erro ao tentar criar o usuário.",
        variant: "destructive",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const response = await apiRequest("PUT", `/api/users/${id}`, { role });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Usuário atualizado",
        description: "O papel do usuário foi atualizado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar usuário",
        description: "Ocorreu um erro ao tentar atualizar o usuário.",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/users/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Usuário excluído",
        description: "O usuário foi removido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir usuário",
        description: "Ocorreu um erro ao tentar excluir o usuário.",
        variant: "destructive",
      });
    },
  });

  const toggleUserRole = (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    updateUserMutation.mutate({ id: userId, role: newRole });
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold" data-testid="users-title">
            Gerenciar Usuários
          </h2>
          <p className="text-muted-foreground">
            Crie, edite e gerencie os usuários do sistema
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} data-testid="button-create-user">
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-users"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40" data-testid="select-role-filter">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os papéis</SelectItem>
            <SelectItem value="admin">Administradores</SelectItem>
            <SelectItem value="user">Usuários</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
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
                  <TableHead>Username</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <p className="text-muted-foreground" data-testid="no-users-message">
                        {searchTerm || roleFilter !== "all" 
                          ? "Nenhum usuário encontrado com os filtros aplicados."
                          : "Nenhum usuário encontrado."
                        }
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                          {user.role === "admin" ? "Administrador" : "Usuário"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleUserRole(user.id, user.role)}
                            disabled={updateUserMutation.isPending}
                            data-testid={`button-toggle-role-${user.id}`}
                          >
                            <Edit className="mr-1 h-3 w-3" />
                            {user.role === "admin" ? "Tornar Usuário" : "Tornar Admin"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingUserLimits(user)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Limites
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                data-testid={`button-delete-${user.id}`}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o usuário "{user.username}"? 
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteUserMutation.mutate(user.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Excluir
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

      {/* Create User Dialog */}
      <UserCreateDialog 
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onSubmit={(data) => createUserMutation.mutate(data)}
        isSubmitting={createUserMutation.isPending}
      />
    </div>
  );
}

// User Creation Dialog Component
function UserCreateDialog({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isSubmitting 
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: z.infer<typeof userFormSchema>) => void;
  isSubmitting: boolean;
}) {
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      email: "",
      name: "",
      password: "",
      role: "user",
    },
  });

  const handleSubmit = (data: z.infer<typeof userFormSchema>) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" data-testid="dialog-create-user">
        <DialogHeader>
          <DialogTitle>Criar Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar um novo usuário no sistema.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="João Silva" data-testid="input-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="joao@exemplo.com" data-testid="input-email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username (login)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="joao.silva" data-testid="input-username" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} placeholder="Mínimo 6 caracteres" data-testid="input-password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Papel</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-user-role">
                        <SelectValue placeholder="Selecione o papel" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                data-testid="button-cancel"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                data-testid="button-submit"
              >
                {isSubmitting ? "Criando..." : "Criar Usuário"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>


      );
}

// Projects Management Tab Component
function ProjectsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [phaseFilter, setPhaseFilter] = useState("all");
  const { toast } = useToast();

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/admin/projects"],
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/projects/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      toast({
        title: "Projeto excluído",
        description: "O projeto foi removido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir projeto",
        description: "Ocorreu um erro ao tentar excluir o projeto.",
        variant: "destructive",
      });
    },
  });

  const getStatusLabel = (status: string) => {
    return status === "completed" ? "Concluído" : "Em Progresso";
  };

  const getStatusColor = (status: string) => {
    return status === "completed" 
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
  };

  const getPhaseLabel = (phase: number | null) => {
    if (!phase) return "N/A";
    const phases = ["Empatizar", "Definir", "Idear", "Prototipar", "Testar"];
    return phases[phase - 1] || `Fase ${phase}`;
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesPhase = phaseFilter === "all" || (project.currentPhase?.toString() === phaseFilter);
    return matchesSearch && matchesStatus && matchesPhase;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold" data-testid="projects-title">
            Gerenciar Projetos
          </h2>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os projetos do sistema
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar projetos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-projects"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40" data-testid="select-status-filter">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="in_progress">Em Progresso</SelectItem>
            <SelectItem value="completed">Concluído</SelectItem>
          </SelectContent>
        </Select>
        <Select value={phaseFilter} onValueChange={setPhaseFilter}>
          <SelectTrigger className="w-40" data-testid="select-phase-filter">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as fases</SelectItem>
            <SelectItem value="1">Fase 1 - Empatizar</SelectItem>
            <SelectItem value="2">Fase 2 - Definir</SelectItem>
            <SelectItem value="3">Fase 3 - Idear</SelectItem>
            <SelectItem value="4">Fase 4 - Prototipar</SelectItem>
            <SelectItem value="5">Fase 5 - Testar</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Table */}
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
                  <TableHead>Nome do Projeto</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fase Atual</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground" data-testid="no-projects-message">
                        {searchTerm || statusFilter !== "all" || phaseFilter !== "all"
                          ? "Nenhum projeto encontrado com os filtros aplicados."
                          : "Nenhum projeto encontrado."
                        }
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project) => (
                    <TableRow key={project.id} data-testid={`row-project-${project.id}`}>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate" title={project.name}>
                          {project.name}
                        </div>
                        {project.description && (
                          <div className="text-sm text-muted-foreground truncate" title={project.description}>
                            {project.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(project.status)}>
                          {getStatusLabel(project.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getPhaseLabel(project.currentPhase)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 transition-all duration-300"
                              style={{ width: `${project.completionRate || 0}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(project.completionRate || 0)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(project.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/projects/${project.id}`, '_blank')}
                            data-testid={`button-view-${project.id}`}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.href = `/projects/${project.id}`}
                            data-testid={`button-edit-${project.id}`}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                data-testid={`button-delete-project-${project.id}`}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o projeto "{project.name}"? 
                                  Esta ação não pode ser desfeita e removerá todos os dados associados.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteProjectMutation.mutate(project.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Excluir
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
    </div>
  );
}

// Double Diamond Management Tab Component
function DoubleDiamondTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("all");
  const { toast } = useToast();

  const { data: projects = [], isLoading } = useQuery<DoubleDiamondProject[]>({
    queryKey: ["/api/admin/double-diamond"],
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/double-diamond/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/double-diamond"] });
      toast({
        title: "Projeto Double Diamond excluído",
        description: "O projeto foi removido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir projeto",
        description: "Ocorreu um erro ao tentar excluir o projeto.",
        variant: "destructive",
      });
    },
  });

  const getPhaseLabel = (phase: string | null) => {
    if (!phase) return "N/A";
    const phases: Record<string, string> = {
      "discover": "Descobrir",
      "define": "Definir",
      "develop": "Desenvolver",
      "deliver": "Entregar",
      "dfv": "Análise DFV"
    };
    return phases[phase] || phase;
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      "pending": "Pendente",
      "in_progress": "Em Progresso",
      "completed": "Concluído"
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    if (status === "completed") {
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    } else if (status === "in_progress") {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
    return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPhase = phaseFilter === "all" || project.currentPhase === phaseFilter;
    return matchesSearch && matchesPhase;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold" data-testid="double-diamond-title">
            Gerenciar Projetos Double Diamond
          </h2>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os projetos Double Diamond do sistema
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar projetos Double Diamond..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-double-diamond"
          />
        </div>
        <Select value={phaseFilter} onValueChange={setPhaseFilter}>
          <SelectTrigger className="w-48" data-testid="select-phase-filter-dd">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as fases</SelectItem>
            <SelectItem value="discover">Descobrir</SelectItem>
            <SelectItem value="define">Definir</SelectItem>
            <SelectItem value="develop">Desenvolver</SelectItem>
            <SelectItem value="deliver">Entregar</SelectItem>
            <SelectItem value="dfv">Análise DFV</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Table */}
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
                  <TableHead>Nome do Projeto</TableHead>
                  <TableHead>Fase Atual</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground" data-testid="no-double-diamond-message">
                        {searchTerm || phaseFilter !== "all"
                          ? "Nenhum projeto Double Diamond encontrado com os filtros aplicados."
                          : "Nenhum projeto Double Diamond encontrado."
                        }
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project) => (
                    <TableRow key={project.id} data-testid={`row-dd-project-${project.id}`}>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate" title={project.name}>
                          {project.name}
                        </div>
                        {project.description && (
                          <div className="text-sm text-muted-foreground truncate" title={project.description}>
                            {project.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getPhaseLabel(project.currentPhase)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={getStatusColor(project.discoverStatus || "pending")}>
                            Descobrir: {getStatusLabel(project.discoverStatus || "pending")}
                          </Badge>
                          {project.deliverStatus === "completed" && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              Completo
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 transition-all duration-300"
                              style={{ width: `${project.completionPercentage || 0}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(project.completionPercentage || 0)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(project.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/double-diamond/${project.id}`, '_blank')}
                            data-testid={`button-view-dd-${project.id}`}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.href = `/double-diamond/${project.id}`}
                            data-testid={`button-edit-dd-${project.id}`}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                data-testid={`button-delete-dd-${project.id}`}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o projeto Double Diamond "{project.name}"? 
                                  Esta ação não pode ser desfeita e removerá todos os dados associados.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteProjectMutation.mutate(project.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Excluir
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
    </div>
  );
}

// Admin Dashboard Tab Component
function DashboardTab() {
  const { data: stats, isLoading } = useQuery<{
    totalUsers: number;
    totalProjects: number;
    totalArticles: number;
    totalDoubleDiamondProjects: number;
    totalVideos: number;
    totalTestimonials: number;
    totalPlans: number;
    projectsByStatus: { in_progress: number; completed: number };
    projectsByPhase: { phase1: number; phase2: number; phase3: number; phase4: number; phase5: number };
    doubleDiamondByPhase: { discover: number; define: number; develop: number; deliver: number; dfv: number };
    doubleDiamondByStatus: { pending: number; in_progress: number; completed: number };
    usersByRole: { admin: number; user: number };
    articlesByCategory: Record<string, number>;
    articlesWithTranslations: { withEnglish: number; withSpanish: number; withFrench: number; fullyTranslated: number };
  }>({
    queryKey: ["/api/admin/stats"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Dashboard Administrativo</h2>
          <p className="text-muted-foreground">
            Visão geral do sistema e métricas de uso
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-8 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Dashboard Administrativo</h2>
          <p className="text-muted-foreground">
            Erro ao carregar estatísticas do sistema
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold" data-testid="dashboard-title">
          Dashboard Administrativo
        </h2>
        <p className="text-muted-foreground">
          Visão geral do sistema e métricas de uso
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card data-testid="card-total-users">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-blue-600" />
              <h3 className="ml-2 text-sm font-medium text-muted-foreground">
                Total de Usuários
              </h3>
            </div>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </CardContent>
        </Card>

        <Card data-testid="card-total-projects">
          <CardContent className="p-6">
            <div className="flex items-center">
              <FolderOpen className="h-4 w-4 text-green-600" />
              <h3 className="ml-2 text-sm font-medium text-muted-foreground">
                Projetos DT
              </h3>
            </div>
            <p className="text-2xl font-bold">{stats.totalProjects}</p>
          </CardContent>
        </Card>

        <Card data-testid="card-total-double-diamond">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Diamond className="h-4 w-4 text-cyan-600" />
              <h3 className="ml-2 text-sm font-medium text-muted-foreground">
                Double Diamond
              </h3>
            </div>
            <p className="text-2xl font-bold">{stats.totalDoubleDiamondProjects}</p>
          </CardContent>
        </Card>

        <Card data-testid="card-total-articles">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="h-4 w-4 text-purple-600" />
              <h3 className="ml-2 text-sm font-medium text-muted-foreground">
                Total de Artigos
              </h3>
            </div>
            <p className="text-2xl font-bold">{stats.totalArticles}</p>
          </CardContent>
        </Card>

        <Card data-testid="card-total-videos">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Video className="h-4 w-4 text-red-600" />
              <h3 className="ml-2 text-sm font-medium text-muted-foreground">
                Vídeos Tutoriais
              </h3>
            </div>
            <p className="text-2xl font-bold">{stats.totalVideos}</p>
          </CardContent>
        </Card>

        <Card data-testid="card-total-testimonials">
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 text-yellow-600" />
              <h3 className="ml-2 text-sm font-medium text-muted-foreground">
                Depoimentos
              </h3>
            </div>
            <p className="text-2xl font-bold">{stats.totalTestimonials}</p>
          </CardContent>
        </Card>

        <Card data-testid="card-active-projects">
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-4 w-4 text-orange-600" />
              <h3 className="ml-2 text-sm font-medium text-muted-foreground">
                Projetos Ativos
              </h3>
            </div>
            <p className="text-2xl font-bold">{stats.projectsByStatus.in_progress}</p>
          </CardContent>
        </Card>

        <Card data-testid="card-articles-translated">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="h-4 w-4 text-indigo-600" />
              <h3 className="ml-2 text-sm font-medium text-muted-foreground">
                Artigos Traduzidos
              </h3>
            </div>
            <p className="text-2xl font-bold">{stats.articlesWithTranslations?.fullyTranslated || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">
              de {stats.totalArticles} total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Projects by Phase */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Projetos por Fase
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.projectsByPhase).map(([phase, count]) => {
                const phaseLabels = {
                  phase1: "Fase 1 - Empatizar",
                  phase2: "Fase 2 - Definir", 
                  phase3: "Fase 3 - Idear",
                  phase4: "Fase 4 - Prototipar",
                  phase5: "Fase 5 - Testar"
                };
                const percentage = stats.totalProjects > 0 ? (count as number / stats.totalProjects * 100) : 0;
                
                return (
                  <div key={phase} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{phaseLabels[phase as keyof typeof phaseLabels]}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">{count as number}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Users by Role */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Usuários por Papel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Administradores</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ 
                        width: `${stats.totalUsers > 0 ? (stats.usersByRole.admin / stats.totalUsers * 100) : 0}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{stats.usersByRole.admin}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Usuários</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ 
                        width: `${stats.totalUsers > 0 ? (stats.usersByRole.user / stats.totalUsers * 100) : 0}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{stats.usersByRole.user}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Articles by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="mr-2 h-5 w-5" />
              Artigos por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.articlesByCategory).map(([category, count]) => {
                const categoryLabels = {
                  empathize: "Empatizar",
                  define: "Definir",
                  ideate: "Idear",
                  prototype: "Prototipar",
                  test: "Testar"
                };
                const percentage = stats.totalArticles > 0 ? (count as number / stats.totalArticles * 100) : 0;
                
                return (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{categoryLabels[category as keyof typeof categoryLabels]}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">{count as number}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Double Diamond by Phase */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Diamond className="mr-2 h-5 w-5" />
              Double Diamond por Fase
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.doubleDiamondByPhase || {}).map(([phase, count]) => {
                const phaseLabels: Record<string, string> = {
                  discover: "Descobrir",
                  define: "Definir",
                  develop: "Desenvolver",
                  deliver: "Entregar",
                  dfv: "Análise DFV"
                };
                const percentage = stats.totalDoubleDiamondProjects > 0 ? (count as number / stats.totalDoubleDiamondProjects * 100) : 0;
                
                return (
                  <div key={phase} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{phaseLabels[phase] || phase}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cyan-500 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">{count as number}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Double Diamond Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Diamond className="mr-2 h-5 w-5" />
              Status Double Diamond
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pendentes</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-500 transition-all duration-300"
                      style={{ 
                        width: `${stats.totalDoubleDiamondProjects > 0 ? ((stats.doubleDiamondByStatus?.pending || 0) / stats.totalDoubleDiamondProjects * 100) : 0}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{stats.doubleDiamondByStatus?.pending || 0}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Em Progresso</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ 
                        width: `${stats.totalDoubleDiamondProjects > 0 ? ((stats.doubleDiamondByStatus?.in_progress || 0) / stats.totalDoubleDiamondProjects * 100) : 0}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{stats.doubleDiamondByStatus?.in_progress || 0}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Completos</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ 
                        width: `${stats.totalDoubleDiamondProjects > 0 ? ((stats.doubleDiamondByStatus?.completed || 0) / stats.totalDoubleDiamondProjects * 100) : 0}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{stats.doubleDiamondByStatus?.completed || 0}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Articles Translation Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              Status de Tradução dos Artigos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Com Inglês</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ 
                        width: `${stats.totalArticles > 0 ? ((stats.articlesWithTranslations?.withEnglish || 0) / stats.totalArticles * 100) : 0}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{stats.articlesWithTranslations?.withEnglish || 0}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Com Espanhol</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 transition-all duration-300"
                      style={{ 
                        width: `${stats.totalArticles > 0 ? ((stats.articlesWithTranslations?.withSpanish || 0) / stats.totalArticles * 100) : 0}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{stats.articlesWithTranslations?.withSpanish || 0}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Com Francês</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 transition-all duration-300"
                      style={{ 
                        width: `${stats.totalArticles > 0 ? ((stats.articlesWithTranslations?.withFrench || 0) / stats.totalArticles * 100) : 0}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{stats.articlesWithTranslations?.withFrench || 0}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                  Totalmente Traduzidos
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ 
                        width: `${stats.totalArticles > 0 ? ((stats.articlesWithTranslations?.fullyTranslated || 0) / stats.totalArticles * 100) : 0}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{stats.articlesWithTranslations?.fullyTranslated || 0}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FolderOpen className="mr-2 h-5 w-5" />
              Status dos Projetos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Em Progresso</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ 
                        width: `${stats.totalProjects > 0 ? (stats.projectsByStatus.in_progress / stats.totalProjects * 100) : 0}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{stats.projectsByStatus.in_progress}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Concluídos</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ 
                        width: `${stats.totalProjects > 0 ? (stats.projectsByStatus.completed / stats.totalProjects * 100) : 0}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{stats.projectsByStatus.completed}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const planFormSchema = z.object({
  displayName: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  priceMonthly: z.number().min(0, "Preço mensal deve ser maior ou igual a 0"),
  priceYearly: z.number().min(0, "Preço anual deve ser maior ou igual a 0"),
  maxProjects: z.number().nullable(),
  maxPersonasPerProject: z.number().nullable(),
  maxUsersPerTeam: z.number().nullable(),
  includedUsers: z.number().nullable(),
  pricePerAdditionalUser: z.number().nullable(),
  aiChatLimit: z.number().nullable(),
  maxDoubleDiamondProjects: z.number().nullable(),
  hasCollaboration: z.boolean(),
  hasSso: z.boolean(),
  hasCustomIntegrations: z.boolean(),
});

function PlanEditDialog({ 
  plan, 
  isOpen, 
  onClose 
}: { 
  plan: SubscriptionPlan; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof planFormSchema>>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      displayName: plan.displayName,
      description: plan.description || "",
      priceMonthly: plan.priceMonthly / 100,
      priceYearly: plan.priceYearly / 100,
      maxProjects: plan.maxProjects,
      maxPersonasPerProject: plan.maxPersonasPerProject,
      maxUsersPerTeam: plan.maxUsersPerTeam,
      includedUsers: plan.includedUsers,
      pricePerAdditionalUser: plan.pricePerAdditionalUser ? plan.pricePerAdditionalUser / 100 : null,
      aiChatLimit: plan.aiChatLimit,
      maxDoubleDiamondProjects: plan.maxDoubleDiamondProjects,
      hasCollaboration: plan.hasCollaboration || false,
      hasSso: plan.hasSso || false,
      hasCustomIntegrations: plan.hasCustomIntegrations || false,
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: async (data: z.infer<typeof planFormSchema>) => {
      const payload = {
        ...data,
        priceMonthly: Math.round(data.priceMonthly * 100),
        priceYearly: Math.round(data.priceYearly * 100),
        pricePerAdditionalUser: data.pricePerAdditionalUser ? Math.round(data.pricePerAdditionalUser * 100) : null,
      };
      const response = await apiRequest("PUT", `/api/subscription-plans/${plan.id}`, payload);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscription-plans"] });
      toast({
        title: "Plano atualizado",
        description: "As alterações foram salvas com sucesso.",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar plano",
        description: "Ocorreu um erro ao salvar as alterações.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: z.infer<typeof planFormSchema>) => {
    updatePlanMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Plano: {plan.displayName}</DialogTitle>
          <DialogDescription>
            Atualize as configurações e limites do plano de assinatura
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Plano</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Individual" />
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
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Para profissionais individuais" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="priceMonthly"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço Mensal (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          placeholder="40.00" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priceYearly"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço Anual (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          placeholder="400.00" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-4">Limites do Plano</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="maxProjects"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Máx. Projetos (vazio = ilimitado)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            {...field} 
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                            placeholder="Ilimitado" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="aiChatLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Limite Chat IA (vazio = ilimitado)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            {...field} 
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                            placeholder="Ilimitado" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxDoubleDiamondProjects"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Máx. Projetos Double Diamond (vazio = ilimitado)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            {...field} 
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                            placeholder="Ilimitado (ex: 3 para plano Free)" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-4">Usuários da Equipe</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="maxUsersPerTeam"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Máx. Usuários (vazio = ilimitado)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            {...field} 
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                            placeholder="Ilimitado" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="includedUsers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Usuários Incluídos no Preço</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            {...field} 
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                            placeholder="Ex: 10" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pricePerAdditionalUser"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço/Usuário Adicional (R$)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            step="0.01"
                            {...field} 
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                            placeholder="Ex: 29.00" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-4">Recursos Incluídos</h3>
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="hasCollaboration"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4"
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">
                          Colaboração em Equipe (múltiplos usuários editando)
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hasSso"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4"
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">
                          SSO - Single Sign-On (Login com Google, Microsoft, etc)
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hasCustomIntegrations"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4"
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">
                          Integrações Customizadas (APIs, CRM, Slack, etc)
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={updatePlanMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={updatePlanMutation.isPending}
              >
                {updatePlanMutation.isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function SubscriptionPlansTab() {
  const { toast } = useToast();
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const { data: plans = [], isLoading } = useQuery<SubscriptionPlan[]>({
    queryKey: ["/api/subscription-plans"],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(cents / 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold" data-testid="plans-title">
            Planos de Assinatura
          </h2>
          <p className="text-muted-foreground">
            Gerencie os planos de assinatura do DTTools
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-60" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map(plan => (
            <Card key={plan.id} className="relative">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {plan.displayName}
                  <Badge variant="outline" className="ml-2">
                    {plan.name}
                  </Badge>
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Mensal:</span>
                    <span className="text-sm font-bold">{formatPrice(plan.priceMonthly)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Anual:</span>
                    <span className="text-sm font-bold">{formatPrice(plan.priceYearly)}</span>
                  </div>
                  {plan.priceYearly > 0 && plan.priceMonthly > 0 && (
                    <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-green-700 dark:text-green-300">No plano anual sai por:</span>
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">
                          {formatPrice(Math.floor(plan.priceYearly / 12))}/mês
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-green-600 dark:text-green-400">Economia:</span>
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                          {formatPrice((plan.priceMonthly * 12) - plan.priceYearly)}/ano
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Limites:</span>
                    <ul className="mt-2 space-y-1 text-muted-foreground">
                      <li>• Projetos: {plan.maxProjects != null ? plan.maxProjects : 'Ilimitado'}</li>
                      <li>• Personas/Projeto: {plan.maxPersonasPerProject != null ? plan.maxPersonasPerProject : 'Ilimitado'}</li>
                      <li>• Usuários/Equipe: {plan.maxUsersPerTeam != null ? plan.maxUsersPerTeam : 'Ilimitado'}</li>
                      <li>• Chat IA: {plan.aiChatLimit != null ? plan.aiChatLimit : 'Ilimitado'}</li>
                    </ul>
                  </div>
                  {plan.includedUsers && (
                    <div className="text-sm pt-2 border-t">
                      <span className="font-medium text-primary">Modelo de Cobrança:</span>
                      <p className="mt-1 text-muted-foreground">
                        • {plan.includedUsers} usuário{plan.includedUsers > 1 ? 's' : ''} incluído{plan.includedUsers > 1 ? 's' : ''}
                      </p>
                      {plan.pricePerAdditionalUser && (
                        <p className="text-muted-foreground">
                          • {formatPrice(plan.pricePerAdditionalUser)} por usuário adicional
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <span className="text-sm font-medium">Recursos:</span>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {plan.hasCollaboration && (
                      <Badge variant="secondary" className="text-xs">Colaboração</Badge>
                    )}
                    {plan.hasPermissionManagement && (
                      <Badge variant="secondary" className="text-xs">Permissões</Badge>
                    )}
                    {plan.hasSharedWorkspace && (
                      <Badge variant="secondary" className="text-xs">Workspace</Badge>
                    )}
                    {plan.hasCommentsAndFeedback && (
                      <Badge variant="secondary" className="text-xs">Comentários</Badge>
                    )}
                    {plan.hasSso && (
                      <Badge variant="secondary" className="text-xs">SSO</Badge>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setEditingPlan(plan)}
                    data-testid={`button-edit-plan-${plan.id}`}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editingPlan && (
        <PlanEditDialog
          plan={editingPlan}
          isOpen={!!editingPlan}
          onClose={() => setEditingPlan(null)}
        />
      )}
    </div>
  );
}

export default function AdminPage() {
  const { isAdmin } = useAuth();

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2" data-testid="admin-title">
              Administração
            </h1>
            <p className="text-muted-foreground">
              Gerencie artigos, vídeos, usuários, projetos e configurações do sistema
            </p>
          </div>

          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="dashboard" data-testid="tab-dashboard">
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="users" data-testid="tab-users">
                <Users className="mr-2 h-4 w-4" />
                Usuários
              </TabsTrigger>
              <TabsTrigger value="projects" data-testid="tab-projects">
                <FolderOpen className="mr-2 h-4 w-4" />
                Projetos
              </TabsTrigger>
              <TabsTrigger value="double-diamond" data-testid="tab-double-diamond">
                <Diamond className="mr-2 h-4 w-4" />
                Double Diamond
              </TabsTrigger>
              <TabsTrigger value="articles" data-testid="tab-articles">
                <Eye className="mr-2 h-4 w-4" />
                Artigos
              </TabsTrigger>
              <TabsTrigger value="videos" data-testid="tab-videos">
                <Video className="mr-2 h-4 w-4" />
                Vídeos
              </TabsTrigger>
              <TabsTrigger value="testimonials" data-testid="tab-testimonials">
                <MessageSquare className="mr-2 h-4 w-4" />
                Depoimentos
              </TabsTrigger>
              <TabsTrigger value="plans" data-testid="tab-plans">
                <CreditCard className="mr-2 h-4 w-4" />
                Planos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <DashboardTab />
            </TabsContent>

            <TabsContent value="users">
              <UsersTab />
            </TabsContent>

            <TabsContent value="projects">
              <ProjectsTab />
            </TabsContent>

            <TabsContent value="double-diamond">
              <DoubleDiamondTab />
            </TabsContent>

            <TabsContent value="articles">
              <ArticlesTab />
            </TabsContent>

            <TabsContent value="videos">
              <AdminVideos />
            </TabsContent>

            <TabsContent value="testimonials">
              <TestimonialsTab />
            </TabsContent>

            <TabsContent value="plans">
              <SubscriptionPlansTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}