import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";

import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof Error)) return fallback;
  const idx = error.message.indexOf(":");
  if (idx === -1) return error.message || fallback;

  const payload = error.message.slice(idx + 1).trim();
  try {
    const parsed = JSON.parse(payload) as { error?: string; message?: string };
    return parsed.message || parsed.error || fallback;
  } catch {
    return payload || error.message || fallback;
  }
}

export default function InviteAcceptPage() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [attempted, setAttempted] = useState(false);

  const token = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return (params.get("token") || "").trim();
  }, []);

  const returnTo = encodeURIComponent(`${window.location.pathname}${window.location.search}`);

  const acceptInviteMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/invites/${token}/accept`);
      return response.json();
    },
    onSuccess: (data: { projectId?: string }) => {
      toast({
        title: "Convite aceito",
        description: "Você entrou na equipe do projeto.",
      });

      window.location.href = data?.projectId ? `/projects/${data.projectId}` : "/dashboard";
    },
    onError: (error) => {
      toast({
        title: "Não foi possível aceitar o convite",
        description: getApiErrorMessage(error, "Verifique se você está logado com o e-mail convidado."),
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!token || attempted || isLoading || !isAuthenticated) return;
    setAttempted(true);
    acceptInviteMutation.mutate();
  }, [token, attempted, isLoading, isAuthenticated, acceptInviteMutation]);

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Link de convite inválido</CardTitle>
            <CardDescription>O token do convite não foi encontrado na URL.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Verificando sessão...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Aceitar convite para equipe</CardTitle>
            <CardDescription>
              Faça login (ou crie conta) com o mesmo e-mail que recebeu o convite.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Link href={`/login?redirect=${returnTo}`}>
              <Button>Entrar e aceitar</Button>
            </Link>
            <Link href={`/signup?redirect=${returnTo}`}>
              <Button variant="outline">Criar conta</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Aceitando convite...</CardTitle>
          <CardDescription>
            {acceptInviteMutation.isPending
              ? "Estamos adicionando você ao projeto."
              : "Se nada acontecer, recarregue a página."}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
