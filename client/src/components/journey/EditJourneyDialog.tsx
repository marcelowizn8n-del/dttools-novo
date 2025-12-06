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
import type { Journey, InsertJourney } from "@shared/schema";
import { Edit2, Plus } from "lucide-react";

interface EditJourneyDialogProps {
  projectId: string;
  journey?: Journey | null;
}

export default function EditJourneyDialog({
  projectId,
  journey,
}: EditJourneyDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(journey?.name ?? "");
  const [persona, setPersona] = useState(journey?.persona ?? "");
  const [primaryGoal, setPrimaryGoal] = useState(journey?.primaryGoal ?? "");
  const [description, setDescription] = useState(journey?.description ?? "");

  const resetFromJourney = () => {
    setName(journey?.name ?? "");
    setPersona(journey?.persona ?? "");
    setPrimaryGoal(journey?.primaryGoal ?? "");
    setDescription(journey?.description ?? "");
  };

  const mutation = useMutation({
    mutationFn: async (data: Partial<InsertJourney>) => {
      if (journey) {
        await apiRequest("PUT", `/api/journeys/${journey.id}`, data);
      } else {
        await apiRequest("POST", `/api/projects/${projectId}/journeys`, data);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["/api/projects", projectId, "journeys"],
      });
      setOpen(false);
      toast({
        title: journey ? "Jornada atualizada" : "Jornada criada",
        description: journey
          ? "As informações da jornada foram atualizadas."
          : "A jornada foi criada com sucesso.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar a jornada.",
      });
    },
  });

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (value) {
      resetFromJourney();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: "Nome obrigatório",
        description: "Defina um nome para a jornada.",
      });
      return;
    }

    const payload: Partial<InsertJourney> = {
      name: name.trim(),
      description: description.trim() || undefined,
      persona: persona.trim() || undefined,
      primaryGoal: primaryGoal.trim() || undefined,
    };

    mutation.mutate(payload);
  };

  const isEditing = !!journey;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {isEditing ? (
            <Edit2 className="w-3 h-3 mr-1" />
          ) : (
            <Plus className="w-3 h-3 mr-1" />
          )}
          {isEditing ? "Editar jornada" : "Criar jornada"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar jornada" : "Criar nova jornada"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Nome da jornada</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Jornada principal do PM"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Persona foco</label>
            <Input
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              placeholder="Ex: Product Manager digital"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Objetivo principal</label>
            <Textarea
              value={primaryGoal}
              onChange={(e) => setPrimaryGoal(e.target.value)}
              placeholder="O que esta jornada deve alcançar para o usuário?"
              rows={3}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Descrição (opcional)</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contexto geral da jornada."
              rows={3}
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
