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
import { useLanguage } from "@/contexts/LanguageContext";

const doubleDiamondSchema = z.object({
  name: z.string().min(3, { message: "dd.wizard.validation.name.min" }),
  description: z.string().optional(),
  sectorId: z.string().optional(),
  successCaseId: z.string().optional(),
  customSuccessCase: z.string().optional(),
  customSuccessCaseUrl: z.string().optional(),
  customSuccessCasePdfUrl: z.string().optional(),
  targetAudience: z.string().min(10, { message: "dd.wizard.validation.targetAudience.min" }),
  problemStatement: z.string().min(20, { message: "dd.wizard.validation.problemStatement.min" })
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
  const { t } = useLanguage();

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
      customSuccessCaseUrl: "",
      customSuccessCasePdfUrl: "",
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
        title: t("dd.wizard.toast.create.success.title"),
        description: t("dd.wizard.toast.create.success.description"),
      });
      // Redirecionar para o projeto
      window.location.href = `/double-diamond/${data.id}`;
    },
    onError: (error: any) => {
      const errorData = error.errorData || error;
      
      if (errorData?.code === "DOUBLE_DIAMOND_LIMIT_REACHED") {
        toast({
          title: t("dd.wizard.toast.limit.title"),
          description: errorData.error || t("dd.wizard.toast.limit.description"),
          variant: "destructive",
        });
        // Redirect to pricing after a delay
        setTimeout(() => {
          window.location.href = "/pricing";
        }, 2000);
      } else {
        toast({
          title: t("dd.wizard.toast.create.error.title"),
          description: errorData?.error || error.message || t("dd.wizard.toast.create.error.description"),
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
                <FormLabel>{t("dd.wizard.form.name.label")}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t("dd.wizard.form.name.placeholder")}
                    {...field}
                    data-testid="input-dd-name"
                  />
                </FormControl>
                <FormDescription>
                  {t("dd.wizard.form.name.description")}
                </FormDescription>
                {form.formState.errors.name?.message && (
                  <p className="text-[13px] font-medium text-destructive">
                    {t(form.formState.errors.name.message as string)}
                  </p>
                )}
              </FormItem>
            )}
          />

          {/* Descrição (opcional) */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("dd.wizard.form.description.label")}</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={t("dd.wizard.form.description.placeholder")}
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
                  {t("dd.wizard.form.sector.label")}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="inline-flex items-center">
                        <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm" side="right">
                      <p className="font-semibold mb-1">{t("dd.wizard.form.sector.tooltip.title")}</p>
                      <p className="text-sm">{t("dd.wizard.form.sector.tooltip.body")}</p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-dd-sector">
                      <SelectValue placeholder={t("dd.wizard.form.sector.placeholder")} />
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
                  {t("dd.wizard.form.sector.description")}
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
                  {t("dd.wizard.form.successCase.label")}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="inline-flex items-center">
                        <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm" side="right">
                      <p className="font-semibold mb-1">{t("dd.wizard.form.successCase.tooltip.title")}</p>
                      <p className="text-sm">{t("dd.wizard.form.successCase.tooltip.body")}</p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-dd-success-case">
                      <SelectValue placeholder={t("dd.wizard.form.successCase.placeholder")} />
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
                  {t("dd.wizard.form.successCase.description")}
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
            <div className="relative bg-background px-3 text-sm text-muted-foreground">{t("dd.wizard.form.orLabel")}</div>
          </div>

          {/* Case de Sucesso Personalizado */}
          <FormField
            control={form.control}
            name="customSuccessCase"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("dd.wizard.form.customSuccessCase.label")}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t("dd.wizard.form.customSuccessCase.placeholder")}
                    {...field}
                    data-testid="input-dd-custom-case"
                  />
                </FormControl>
                <FormDescription>
                  {t("dd.wizard.form.customSuccessCase.description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* URL de referência do Case */}
          <FormField
            control={form.control}
            name="customSuccessCaseUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("dd.wizard.form.customSuccessCaseUrl.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("dd.wizard.form.customSuccessCaseUrl.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {t("dd.wizard.form.customSuccessCaseUrl.description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* PDF de referência do Case */}
          <FormField
            control={form.control}
            name="customSuccessCasePdfUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("dd.wizard.form.customSuccessCasePdfUrl.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("dd.wizard.form.customSuccessCasePdfUrl.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {t("dd.wizard.form.customSuccessCasePdfUrl.description")}
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
                  {t("dd.wizard.form.targetAudience.label")}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="inline-flex items-center">
                        <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm" side="right">
                      <p className="font-semibold mb-1">{t("dd.wizard.form.targetAudience.tooltip.title")}</p>
                      <p className="text-sm">{t("dd.wizard.form.targetAudience.tooltip.body")}</p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={t("dd.wizard.form.targetAudience.placeholder")}
                    className="min-h-[80px]"
                    {...field}
                    data-testid="input-dd-target-audience"
                  />
                </FormControl>
                <FormDescription>
                  {t("dd.wizard.form.targetAudience.description")}
                </FormDescription>
                {form.formState.errors.targetAudience?.message && (
                  <p className="text-[13px] font-medium text-destructive">
                    {t(form.formState.errors.targetAudience.message as string)}
                  </p>
                )}
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
                  {t("dd.wizard.form.problemStatement.label")}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="inline-flex items-center">
                        <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm" side="right">
                      <p className="font-semibold mb-1">{t("dd.wizard.form.problemStatement.tooltip.title")}</p>
                      <p className="text-sm">{t("dd.wizard.form.problemStatement.tooltip.body")}</p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={t("dd.wizard.form.problemStatement.placeholder")}
                    className="min-h-[100px]"
                    {...field}
                    data-testid="input-dd-problem-statement"
                  />
                </FormControl>
                <FormDescription>
                  {t("dd.wizard.form.problemStatement.description")}
                </FormDescription>
                {form.formState.errors.problemStatement?.message && (
                  <p className="text-[13px] font-medium text-destructive">
                    {t(form.formState.errors.problemStatement.message as string)}
                  </p>
                )}
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
              {t("dd.wizard.form.buttons.cancel")}
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
                  {t("dd.wizard.form.buttons.submit.loading")}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {t("dd.wizard.form.buttons.submit.idle")}
                </>
              )}
            </Button>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
            <div className="flex gap-3">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  {t("dd.wizard.helper.title")}
                </p>
                <p className="text-blue-700 dark:text-blue-300">
                  {t("dd.wizard.helper.body")}
                </p>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </TooltipProvider>
  );
}
