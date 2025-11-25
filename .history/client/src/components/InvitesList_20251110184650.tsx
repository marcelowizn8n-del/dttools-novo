import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Check, X, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ProjectInvite {
  id: string;
  projectId: string;
  email: string;
  role: string;
  invitedBy: string;
  status: string;
  token: string;
  expiresAt: Date;
  respondedAt?: Date;
  createdAt: Date;
}

export default function InvitesList() {
  const { toast } = useToast();

  const { data: invites, isLoading } = useQuery<ProjectInvite[]>({
    queryKey: ['/api/invites'],
  });

  const acceptMutation = useMutation({
    mutationFn: async (token: string) =>
      apiRequest(`/api/invites/${token}/accept`, "POST"),
    onSuccess: () => {
      toast({
        title: "Convite aceito!",
        description: "Você agora tem acesso ao projeto.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/invites'] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao aceitar convite",
        description: error.message || "Não foi possível aceitar o convite. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const declineMutation = useMutation({
    mutationFn: async (token: string) =>
      apiRequest(`/api/invites/${token}/decline`, "POST"),
    onSuccess: () => {
      toast({
        title: "Convite recusado",
        description: "O convite foi recusado.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/invites'] });
    },
    onError: () => {
      toast({
        title: "Erro ao recusar convite",
        description: "Não foi possível recusar o convite. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const pendingInvites = invites?.filter(invite => invite.status === 'pending') || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Convites Pendentes
          </CardTitle>
          <CardDescription>Carregando convites...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (pendingInvites.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Convites Pendentes
          <Badge variant="secondary">{pendingInvites.length}</Badge>
        </CardTitle>
        <CardDescription>
          Você tem {pendingInvites.length} {pendingInvites.length === 1 ? 'convite pendente' : 'convites pendentes'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingInvites.map((invite, index) => {
            const isExpired = new Date(invite.expiresAt) < new Date();
            
            return (
              <div key={invite.id}>
                {index > 0 && <Separator className="my-4" />}
                <div className="space-y-3" data-testid={`invite-${invite.id}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">
                            Convite para colaborar em projeto
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Como <Badge variant="outline" className="ml-1">
                              {invite.role === 'editor' ? 'Editor' : 'Visualizador'}
                            </Badge>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground ml-10">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Expira em {format(new Date(invite.expiresAt), "dd/MM/yyyy", { locale: ptBR })}
                        </div>
                      </div>
                    </div>
                    {isExpired ? (
                      <Badge variant="destructive">Expirado</Badge>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => declineMutation.mutate(invite.token)}
                          disabled={declineMutation.isPending}
                          data-testid={`button-decline-${invite.id}`}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Recusar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => acceptMutation.mutate(invite.token)}
                          disabled={acceptMutation.isPending}
                          data-testid={`button-accept-${invite.id}`}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Aceitar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
