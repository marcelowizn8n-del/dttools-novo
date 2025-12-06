import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { JourneyStage, InsertJourneyStage } from "@shared/schema";
import { Edit2, Plus } from "lucide-react";

interface EditJourneyStageDialogProps {
  journeyId: string;
  stage?: JourneyStage | null;
  variant?: "default" | "icon";
}

export default function EditJourneyStageDialog({
  journeyId,
  stage,
  variant = "default",
}: EditJourneyStageDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(stage?.title ?? "");
  const [description, setDescription] = useState(stage?.description ?? "");
  const [order, setOrder] = useState<number | undefined>(stage?.order ?? 0);

  const resetFromStage = () => {
    setTitle(stage?.title ?? "");
    setDescription(stage?.description ?? "");
    setOrder(stage?.order ?? 0);
  };

  const mutation = useMutation({
    mutationFn: async (data: Partial<InsertJourneyStage>) => {
      if (stage) {
        await apiRequest("PUT", `/api/journey-stages/${stage.id}`, data);
      } else {
        await apiRequest("POST", `/api/journeys/${journeyId}/stages`, data);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["/api/journeys", journeyId, "stages"],
      });
      setOpen(false);
      toast({
        title: stage ? "Etapa atualizada" : "Etapa criada",
        description: stage
          ? "As informações da etapa foram atualizadas."
          : "A etapa foi criada com sucesso.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar a etapa.",
      });
    },
  });

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (value) {
      resetFromStage();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "Título obrigatório",
        description: "Defina um título para a etapa.",
      });
      return;
    }

    const payload: Partial<InsertJourneyStage> = {
      title: title.trim(),
      description: description.trim() || undefined,
      order: order ?? 0,
    };

    mutation.mutate(payload);
  };

  const isEditing = !!stage;

  const triggerButton =
    variant === "icon" ? (
      <Button variant="ghost" size="icon">
        <Edit2 className="w-4 h-4" />
      </Button>
    ) : (
      <Button variant="outline" size="sm">
        {isEditing ? (
          <Edit2 className="w-3 h-3 mr-1" />
        ) : (
          <Plus className="w-3 h-3 mr-1" />
        )}
        {isEditing ? "Editar etapa" : "Adicionar etapa"}
      </Button>
    );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar etapa" : "Adicionar etapa"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Título da etapa</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Descoberta"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Descrição</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Resumo do que acontece nesta etapa."
              rows={3}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Ordem</label>
            <Input
              type="number"
              value={order ?? 0}
              onChange={(e) => setOrder(Number(e.target.value))}
              min={0}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
