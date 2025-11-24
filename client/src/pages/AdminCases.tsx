import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { SuccessCase, IndustrySector } from "@shared/schema";

export default function AdminCases() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingCase, setEditingCase] = useState<SuccessCase | null>(null);
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    sectorId: "",
    descriptionPt: "",
    descriptionEn: "",
    descriptionEs: "",
    descriptionFr: "",
    logoUrl: "",
    isActive: true,
  });
  const { toast } = useToast();

  const { data: sectors = [] } = useQuery<IndustrySector[]>({
    queryKey: ["/api/admin/sectors"],
  });

  const { data: cases = [], isLoading } = useQuery<SuccessCase[]>({
    queryKey: ["/api/admin/cases"],
  });

  const filteredCases = sectorFilter === "all"
    ? cases
    : cases.filter(c => c.sectorId === sectorFilter);

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/admin/cases", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cases"] });
      toast({
        title: "Case criado",
        description: "O case de sucesso foi criado com sucesso.",
      });
      setIsCreating(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Erro ao criar case",
        description: "Ocorreu um erro ao tentar criar o case.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const response = await apiRequest("PUT", `/api/admin/cases/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cases"] });
      toast({
        title: "Case atualizado",
        description: "O case de sucesso foi atualizado com sucesso.",
      });
      setEditingCase(null);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar case",
        description: "Ocorreu um erro ao tentar atualizar o case.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/cases/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cases"] });
      toast({
        title: "Case deletado",
        description: "O case foi removido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao deletar case",
        description: "Ocorreu um erro ao tentar deletar o case.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      sectorId: "",
      descriptionPt: "",
      descriptionEn: "",
      descriptionEs: "",
      descriptionFr: "",
      logoUrl: "",
      isActive: true,
    });
  };

  const handleEdit = (successCase: SuccessCase) => {
    setEditingCase(successCase);
    setFormData({
      name: successCase.name,
      company: successCase.company,
      sectorId: successCase.sectorId || "",
      descriptionPt: successCase.descriptionPt || "",
      descriptionEn: successCase.descriptionEn || "",
      descriptionEs: successCase.descriptionEs || "",
      descriptionFr: successCase.descriptionFr || "",
      logoUrl: successCase.logoUrl || "",
      isActive: successCase.isActive ?? true,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCase) {
      updateMutation.mutate({ id: editingCase.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingCase(null);
    resetForm();
  };

  const getSectorName = (sectorId: string) => {
    const sector = sectors.find(s => s.id === sectorId);
    return sector?.namePt || "N/A";
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Cases de Sucesso</h1>
          <p className="text-muted-foreground mt-1">
            Adicione e gerencie cases inspiradores para geração de MVPs
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} data-testid="button-create-case">
          <Plus className="mr-2 h-4 w-4" />
          Novo Case
        </Button>
      </div>

      <div className="mb-4">
        <Select value={sectorFilter} onValueChange={setSectorFilter}>
          <SelectTrigger className="w-full md:w-64" data-testid="select-sector-filter">
            <SelectValue placeholder="Filtrar por setor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os setores</SelectItem>
            {sectors.map((sector) => (
              <SelectItem key={sector.id} value={sector.id}>
                {sector.icon} {sector.namePt}
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
                  <Skeleton className="h-12 w-12 rounded" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Logo</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Setor</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCases.map((successCase) => (
                    <TableRow key={successCase.id}>
                      <TableCell>
                        {successCase.logoUrl ? (
                          <img src={successCase.logoUrl} alt={successCase.name} className="w-10 h-10 object-contain rounded" />
                        ) : (
                          <div className="w-10 h-10 bg-muted rounded flex items-center justify-center text-xs">
                            N/A
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{successCase.name}</TableCell>
                      <TableCell>{successCase.sectorId ? getSectorName(successCase.sectorId) : "N/A"}</TableCell>
                      <TableCell className="max-w-md truncate">
                        {successCase.descriptionPt || successCase.descriptionEn || "Sem descrição"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={successCase.isActive ? "default" : "secondary"}>
                          {successCase.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(successCase)}
                            data-testid={`button-edit-case-${successCase.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                data-testid={`button-delete-case-${successCase.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja deletar o case "{successCase.name}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(successCase.id)}
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
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreating || !!editingCase} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCase ? "Editar Case de Sucesso" : "Novo Case de Sucesso"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Nome do Case</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Airbnb, Uber, Netflix..."
                  required
                  data-testid="input-case-name"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Nome da Empresa</label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Ex: Airbnb Inc."
                  required
                  data-testid="input-case-company"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Setor</label>
                <Select
                  value={formData.sectorId}
                  onValueChange={(value) => setFormData({ ...formData, sectorId: value })}
                  required
                >
                  <SelectTrigger data-testid="select-case-sector">
                    <SelectValue placeholder="Selecione o setor" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((sector) => (
                      <SelectItem key={sector.id} value={sector.id}>
                        {sector.icon} {sector.namePt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">URL do Logo</label>
                <Input
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://..."
                  data-testid="input-case-logo"
                />
                {formData.logoUrl && (
                  <img src={formData.logoUrl} alt="Preview" className="w-20 h-20 object-contain rounded border" />
                )}
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  data-testid="switch-case-active"
                />
                <label className="text-sm font-medium">Case ativo</label>
              </div>

              <Tabs defaultValue="pt" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="pt">PT 🇧🇷</TabsTrigger>
                  <TabsTrigger value="en">EN 🇺🇸</TabsTrigger>
                  <TabsTrigger value="es">ES 🇪🇸</TabsTrigger>
                  <TabsTrigger value="fr">FR 🇫🇷</TabsTrigger>
                </TabsList>
                <TabsContent value="pt" className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Descrição (Português)</label>
                    <Textarea
                      value={formData.descriptionPt}
                      onChange={(e) => setFormData({ ...formData, descriptionPt: e.target.value })}
                      placeholder="Descreva o case de sucesso..."
                      rows={4}
                      data-testid="input-case-description-pt"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="en" className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Description (English)</label>
                    <Textarea
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                      placeholder="Describe the success case..."
                      rows={4}
                      data-testid="input-case-description-en"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="es" className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Descripción (Español)</label>
                    <Textarea
                      value={formData.descriptionEs}
                      onChange={(e) => setFormData({ ...formData, descriptionEs: e.target.value })}
                      placeholder="Describe el caso de éxito..."
                      rows={4}
                      data-testid="input-case-description-es"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="fr" className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Description (Français)</label>
                    <Textarea
                      value={formData.descriptionFr}
                      onChange={(e) => setFormData({ ...formData, descriptionFr: e.target.value })}
                      placeholder="Décrivez le cas de réussite..."
                      rows={4}
                      data-testid="input-case-description-fr"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                data-testid="button-cancel-case"
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-save-case"
              >
                <Save className="mr-2 h-4 w-4" />
                {editingCase ? "Salvar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
