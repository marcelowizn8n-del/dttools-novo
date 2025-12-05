import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, HelpCircle } from "lucide-react";
import { apiRequest, queryClient as globalQueryClient } from "@/lib/queryClient";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const doubleDiamondSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  sectorId: z.string().optional(),
  successCaseId: z.string().optional(),
  customSuccessCase: z.string().optional(),
  targetAudience: z.string().min(10, "Descreva o público-alvo (mínimo 10 caracteres)"),
  problemStatement: z.string().min(20, "Descreva o problema (mínimo 20 caracteres)")
});

type DoubleDiamondFormData = z.infer<typeof doubleDiamondSchema>;

interface Sector {
  id: string;
  name: string;
}

interface SuccessCase {
  id: string;
  name: string;
  company: string;
}

interface DoubleDiamondWizardProps {
  onComplete: () => void;
}

export function DoubleDiamondWizard({ onComplete }: DoubleDiamondWizardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar setores
  const { data: sectors = [] } = useQuery<Sector[]>({
    queryKey: ["/api/industry-sectors"],
  });

  // Buscar cases de sucesso
  const { data: successCases = [] } = useQuery<SuccessCase[]>({
    queryKey: ["/api/success-cases"],
  });

  const form = useForm<DoubleDiamondFormData>({
    resolver: zodResolver(doubleDiamondSchema),
    defaultValues: {
      name: "",
      description: "",
      sectorId: "",
      successCaseId: "",
      customSuccessCase: "",
      targetAudience: "",
      problemStatement: ""
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: DoubleDiamondFormData) => {
      try {
        const response = await apiRequest("POST", "/api/double-diamond", data);
        return await response.json();
      } catch (error: any) {
        // Try to parse error message as JSON
        const errorMessage = error.message || "";
        if (errorMessage.includes("403:")) {
          try {
            const jsonMatch = errorMessage.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const errorData = JSON.parse(jsonMatch[0]);
              throw { ...error, errorData, code: errorData.code };
            }
          } catch {
            // If parsing fails, throw original error
          }
        }
        throw error;
      }
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/double-diamond"] });
      toast({
        title: "✨ Projeto criado com sucesso!",
        description: "Agora vamos gerar os insights com IA nas próximas etapas."
      });
      // Redirecionar para o projeto
      window.location.href = `/double-diamond/${data.id}`;
    },
    onError: (error: any) => {
      const errorData = error.errorData || error;
      
      if (errorData?.code === "DOUBLE_DIAMOND_LIMIT_REACHED") {
        toast({
          title: "Limite atingido",
          description: errorData.error || "Você atingiu o limite de projetos Double Diamond. Faça upgrade para criar mais projetos.",
          variant: "destructive",
        });
        // Redirect to pricing after a delay
        setTimeout(() => {
          window.location.href = "/pricing";
        }, 2000);
      } else {
        toast({
          title: "Erro ao criar projeto",
          description: errorData?.error || error.message || "Tente novamente",
          variant: "destructive"
        });
      }
    }
  });

  const onSubmit = (data: DoubleDiamondFormData) => {
    createMutation.mutate(data);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Nome do Projeto */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Projeto *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: App de Delivery Saudável" 
                  {...field}
                  data-testid="input-dd-name"
                />
              </FormControl>
              <FormDescription>
                Dê um nome descritivo para seu projeto Double Diamond
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Descrição (opcional) */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva brevemente o contexto do projeto..."
                  className="min-h-[60px]"
                  {...field}
                  data-testid="input-dd-description"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Setor */}
        <FormField
          control={form.control}
          name="sectorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Setor / Indústria
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="inline-flex items-center">
                      <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm" side="right">
                    <p className="font-semibold mb-1">Por que selecionar um setor?</p>
                    <p className="text-sm">Selecione o setor da sua solução. A IA utilizará dados específicos do setor (tendências, casos de uso, benchmarks) para gerar insights mais relevantes e contextualizados para o seu projeto.</p>
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-dd-sector">
                    <SelectValue placeholder="Selecione um setor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector.id} value={sector.id}>
                      {sector.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                A IA usará dados do setor para gerar insights mais precisos
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Case de Sucesso */}
        <FormField
          control={form.control}
          name="successCaseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Case de Sucesso para Espelhar
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="inline-flex items-center">
                      <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm" side="right">
                    <p className="font-semibold mb-1">Como usar cases de sucesso?</p>
                    <p className="text-sm">Escolha uma empresa ou produto de sucesso como referência. A IA analisará as estratégias, modelo de negócio e diferenciação deste case para inspirar soluções inovadoras adaptadas ao seu contexto.</p>
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-dd-success-case">
                    <SelectValue placeholder="Selecione um case (ex: Airbnb, Uber)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {successCases.map((successCase) => (
                    <SelectItem key={successCase.id} value={successCase.id}>
                      {successCase.name} ({successCase.company})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                A IA aprenderá com estratégias de cases de sucesso similares
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* OU Texto Customizado */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-muted"></div>
          </div>
          <div className="relative bg-background px-3 text-sm text-muted-foreground">OU</div>
        </div>

        {/* Case de Sucesso Personalizado */}
        <FormField
          control={form.control}
          name="customSuccessCase"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Case de Sucesso Personalizado</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Digite seu próprio case (ex: Magazine Luiza, Nubank, iFood)"
                  {...field}
                  data-testid="input-dd-custom-case"
                />
              </FormControl>
              <FormDescription>
                Se seu case não está na lista, digite aqui o nome da empresa/produto de referência
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Público-Alvo */}
        <FormField
          control={form.control}
          name="targetAudience"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Público-Alvo *
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="inline-flex items-center">
                      <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm" side="right">
                    <p className="font-semibold mb-1">Como descrever o público-alvo?</p>
                    <p className="text-sm">Descreva em detalhes quem são seus usuários ideais: idade, localização, profissão, comportamentos, dores, necessidades e hábitos. Quanto mais específico, melhores serão os personas e insights gerados pela IA.</p>
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Ex: Profissionais ocupados, 25-40 anos, conscientes da saúde, moram em grandes centros urbanos"
                  className="min-h-[80px]"
                  {...field}
                  data-testid="input-dd-target-audience"
                />
              </FormControl>
              <FormDescription>
                Descreva quem é o seu público-alvo (dados demográficos, comportamentos, necessidades)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Descrição do Problema */}
        <FormField
          control={form.control}
          name="problemStatement"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Descrição do Problema *
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="inline-flex items-center">
                      <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm" side="right">
                    <p className="font-semibold mb-1">Como descrever o problema?</p>
                    <p className="text-sm">Explique claramente o problema que você deseja resolver. Inclua: contexto atual, dores dos usuários, limitações das soluções existentes e impacto do problema. Esta descrição é fundamental para a IA gerar POV statements e HMW questions assertivos.</p>
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Ex: Falta de opções saudáveis e rápidas para almoço em horário comercial. As alternativas existentes são caras ou demoradas."
                  className="min-h-[100px]"
                  {...field}
                  data-testid="input-dd-problem-statement"
                />
              </FormControl>
              <FormDescription>
                Descreva o problema que você quer resolver (quanto mais detalhes, melhor a IA trabalha)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onComplete}
            className="flex-1"
            data-testid="button-cancel-dd"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={createMutation.isPending}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            data-testid="button-create-dd"
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Criar Projeto e Gerar com IA
              </>
            )}
          </Button>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
          <div className="flex gap-3">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Automação Total com IA
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                Após criar o projeto, você poderá gerar automaticamente: 12+ pain points, empathy map,
                POV statements, HMW questions, 20+ ideias criativas, MVP completo (logo, landing page,
                social media) e análise DFV estratégica.
              </p>
            </div>
          </div>
        </div>
        </form>
      </Form>
    </TooltipProvider>
  );
}
