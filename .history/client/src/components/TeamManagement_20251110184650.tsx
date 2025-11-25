import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UserPlus, X, Users, Mail, Shield, Eye, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: string;
  invitedBy: string;
  joinedAt: Date;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

interface TeamManagementProps {
  projectId: string;
  isOwner: boolean;
}

export default function TeamManagement({ projectId, isOwner }: TeamManagementProps) {
  const { toast } = useToast();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"editor" | "viewer">("viewer");

  const { data: members, isLoading } = useQuery<ProjectMember[]>({
    queryKey: ['/api/projects', projectId, 'members'],
  });

  const inviteMutation = useMutation({
    mutationFn: async (data: { email: string; role: string }) =>
      apiRequest(`/api/projects/${projectId}/members/invite`, "POST", data),
    onSuccess: () => {
      toast({
        title: "Convite enviado!",
        description: "O convite foi enviado por email.",
      });
      setIsInviteOpen(false);
      setEmail("");
      setRole("viewer");
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'members'] });
    },
    onError: () => {
      toast({
        title: "Erro ao enviar convite",
        description: "Não foi possível enviar o convite. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (userId: string) =>
      apiRequest(`/api/projects/${projectId}/members/${userId}`, "DELETE"),
    onSuccess: () => {
      toast({
        title: "Membro removido",
        description: "O membro foi removido do projeto.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'members'] });
    },
    onError: () => {
      toast({
        title: "Erro ao remover membro",
        description: "Não foi possível remover o membro. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: string }) =>
      apiRequest(`/api/projects/${projectId}/members/${userId}/role`, "PATCH", { role: newRole }),
    onSuccess: () => {
      toast({
        title: "Permissão atualizada",
        description: "As permissões do membro foram atualizadas.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'members'] });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar permissão",
        description: "Não foi possível atualizar as permissões. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleInvite = () => {
    if (!email || !role) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para enviar o convite.",
        variant: "destructive",
      });
      return;
    }
    inviteMutation.mutate({ email, role });
  };

  const getRoleIcon = (roleStr: string) => {
    switch (roleStr) {
      case "owner":
        return <Shield className="h-4 w-4" />;
      case "editor":
        return <Edit className="h-4 w-4" />;
      case "viewer":
        return <Eye className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getRoleBadgeVariant = (roleStr: string) => {
    switch (roleStr) {
      case "owner":
        return "default";
      case "editor":
        return "secondary";
      case "viewer":
        return "outline";
      default:
        return "outline";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Membros do Projeto
          </CardTitle>
          <CardDescription>Carregando membros...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Membros do Projeto
            </CardTitle>
            <CardDescription>
              {members?.length || 0} {members?.length === 1 ? 'membro' : 'membros'}
            </CardDescription>
          </div>
          {isOwner && (
            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-invite-member">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Convidar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Convidar Membro</DialogTitle>
                  <DialogDescription>
                    Envie um convite por email para colaborar neste projeto.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@exemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9"
                        data-testid="input-invite-email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Permissão</Label>
                    <Select value={role} onValueChange={(value: "editor" | "viewer") => setRole(value)}>
                      <SelectTrigger data-testid="select-invite-role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer" data-testid="select-option-viewer">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Visualizador - Apenas visualização
                          </div>
                        </SelectItem>
                        <SelectItem value="editor" data-testid="select-option-editor">
                          <div className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            Editor - Pode editar o projeto
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsInviteOpen(false)} data-testid="button-cancel-invite">
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleInvite}
                    disabled={inviteMutation.isPending}
                    data-testid="button-send-invite"
                  >
                    {inviteMutation.isPending ? "Enviando..." : "Enviar Convite"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum membro convidado ainda</p>
              {isOwner && <p className="text-sm">Clique em "Convidar" para adicionar membros</p>}
            </div>
          ) : (
            members?.map((member, index) => (
              <div key={member.id}>
                {index > 0 && <Separator className="my-4" />}
                <div className="flex items-center justify-between" data-testid={`member-row-${member.userId}`}>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {member.user?.username?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium" data-testid={`member-name-${member.userId}`}>
                        {member.user?.username || 'Usuário'}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid={`member-email-${member.userId}`}>
                        {member.user?.email || 'Email não disponível'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isOwner && member.role !== 'owner' ? (
                      <Select
                        value={member.role}
                        onValueChange={(newRole) =>
                          updateRoleMutation.mutate({ userId: member.userId, newRole })
                        }
                        disabled={updateRoleMutation.isPending}
                      >
                        <SelectTrigger className="w-[140px]" data-testid={`select-role-${member.userId}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="viewer" data-testid="select-option-viewer-role">
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              Visualizador
                            </div>
                          </SelectItem>
                          <SelectItem value="editor" data-testid="select-option-editor-role">
                            <div className="flex items-center gap-2">
                              <Edit className="h-4 w-4" />
                              Editor
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant={getRoleBadgeVariant(member.role)} data-testid={`badge-role-${member.userId}`}>
                        <div className="flex items-center gap-1">
                          {getRoleIcon(member.role)}
                          {member.role === 'owner' ? 'Proprietário' : 
                           member.role === 'editor' ? 'Editor' : 'Visualizador'}
                        </div>
                      </Badge>
                    )}
                    {isOwner && member.role !== 'owner' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMutation.mutate(member.userId)}
                        disabled={removeMutation.isPending}
                        data-testid={`button-remove-${member.userId}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
