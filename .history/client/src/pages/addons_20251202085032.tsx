import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Diamond, Cpu, Users, BookOpen, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/contexts/LanguageContext";

interface SubscriptionInfo {
  plan?: {
    name?: string;
    displayName?: string | null;
    priceMonthly?: number | null;
  } | null;
  limits?: {
    maxDoubleDiamondProjects?: number | null;
    maxDoubleDiamondExports?: number | null;
    aiChatLimit?: number | null;
    canExportPDF?: boolean;
    canExportPNG?: boolean;
    canExportCSV?: boolean;
    canCollaborate?: boolean;
    libraryArticlesCount?: number | null;
  } | null;
  addons?: {
    doubleDiamondPro: boolean;
    exportPro: boolean;
    aiTurbo: boolean;
    collabAdvanced: boolean;
    libraryPremium: boolean;
    raw?: any[];
  } | null;
}

const ADDONS_CONFIG = [
  {
    key: "double_diamond_pro",
    field: "doubleDiamondPro" as const,
    title: "Double Diamond Pro",
    description:
      "Projetos Double Diamond ilimitados e exportações liberadas para o sistema principal.",
    icon: Diamond,
  },
  {
    key: "export_pro",
    field: "exportPro" as const,
    title: "Export Pro",
    description: "Libera exportação em PDF, PNG e CSV para seus projetos.",
    icon: Sparkles,
  },
  {
    key: "ai_turbo",
    field: "aiTurbo" as const,
    title: "IA Turbo",
    description: "+300 mensagens de IA por mês, além do limite do seu plano.",
    icon: Cpu,
  },
  {
    key: "collab_advanced",
    field: "collabAdvanced" as const,
    title: "Colaboração Avançada",
    description:
      "Colaboração em tempo real, comentários, feedbacks e workspace compartilhado.",
    icon: Users,
  },
  {
    key: "library_premium",
    field: "libraryPremium" as const,
    title: "Biblioteca Premium",
    description: "Acesso completo à biblioteca de artigos, vídeos e materiais premium.",
    icon: BookOpen,
  },
];

export default function AddonsPage() {
  const { toast } = useToast();
  const { t } = useLanguage();

  const { data, isLoading } = useQuery<SubscriptionInfo | null>({
    queryKey: ["/api/subscription-info"],
  });

  const createAddonCheckout = useMutation({
    mutationFn: async ({ addonKey }: { addonKey: string }) => {
      const response = await apiRequest("POST", "/api/addons/create-checkout-session", {
        addonKey,
        billingPeriod: "monthly",
      });
      return response.json();
    },
    onSuccess: (result: any) => {
      if (result?.url) {
        window.location.href = result.url;
      } else {
        toast({
          title: t("addons.toast.checkout.missingConfig.title"),
          description: t("addons.toast.checkout.missingConfig.description"),
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: t("addons.toast.checkout.error.title"),
        description: error?.message || t("addons.toast.checkout.error.description"),
        variant: "destructive",
      });
    },
  });

  const cancelAddonSubscription = useMutation({
    mutationFn: async ({ addonKey }: { addonKey: string }) => {
      const response = await apiRequest(
        "POST",
        "/api/addons/cancel-subscription",
        { addonKey }
      );
      return response.json();
    },
    onSuccess: (result: any) => {
      toast({
        title: t("addons.toast.cancel.success.title"),
        description:
          result?.message ||
          t("addons.toast.cancel.success.description.default"),
      });
      // Dados serão atualizados quando o webhook do Stripe rodar;
      // ainda assim atualizamos subscription-info para refletir qualquer mudança imediata.
      // (Por exemplo, admins podem ter alterado algo manualmente.)
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      import("@/lib/queryClient").then(({ queryClient }) => {
        queryClient.invalidateQueries({ queryKey: ["/api/subscription-info"] });
      });
    },
    onError: (error: any) => {
      toast({
        title: t("addons.toast.cancel.error.title"),
        description:
          error?.message || t("addons.toast.cancel.error.description"),
        variant: "destructive",
      });
    },
  });

  const plan = data?.plan;
  const limits = data?.limits;
  const addons = data?.addons;

  const currentMaxDoubleDiamond = limits?.maxDoubleDiamondProjects;
  const currentAiChatLimit = limits?.aiChatLimit;

  const isUnlimited = (value: number | null | undefined) => value === null || value === undefined;

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-[calc(100vh-80px)]">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{t("addons.header.title")}</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {t("addons.header.subtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* Plano atual */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">{t("addons.currentPlan.title")}</CardTitle>
              <CardDescription>
                {plan ? (
                  <>
                    {plan.displayName || plan.name || "Plano atual"}
                    {plan.priceMonthly === 0 && ` ${t("addons.currentPlan.freeSuffix")}`}
                  </>
                ) : (
                  t("addons.currentPlan.loading")
                )}
              </CardDescription>
            </div>
            {limits && (
              <div className="text-xs sm:text-sm text-muted-foreground text-right">
                <div>
                  Double Diamond: {isUnlimited(limits.maxDoubleDiamondProjects) ? "ilimitado" : `${limits.maxDoubleDiamondProjects} projetos`}
                </div>
                <div>
                  Exports: {isUnlimited(limits.maxDoubleDiamondExports) ? "ilimitados" : `${limits.maxDoubleDiamondExports} exports`}
                </div>
                <div>
                  IA Chat: {isUnlimited(limits.aiChatLimit) ? "ilimitado" : `${limits.aiChatLimit} msgs/mês`}
                </div>
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Lista de add-ons */}
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}

        {!isLoading && (
          <div className="grid gap-6 md:grid-cols-2">
            {ADDONS_CONFIG.map((addon) => {
              const Icon = addon.icon;
              const isActive = Boolean(addons && (addons as any)[addon.field]);

              return (
                <Card key={addon.key} className="flex flex-col">
                  <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                          {addon.title}
                          {isActive ? (
                            <Badge variant="default" className="bg-green-500 text-white flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> {t("addons.status.active")}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <XCircle className="h-3 w-3" /> {t("addons.status.inactive")}
                            </Badge>
                          )}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between pt-0 space-y-4">
                    <p className="text-sm text-muted-foreground mb-2">{addon.description}</p>

                    <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-xs text-muted-foreground max-w-xs sm:max-w-[220px]">
                        {addon.key === "double_diamond_pro" &&
                          currentMaxDoubleDiamond !== null &&
                          currentMaxDoubleDiamond !== undefined && (
                            <span>
                              Sem o add-on, seu limite atual é de {currentMaxDoubleDiamond} projetos
                              Double Diamond.
                            </span>
                          )}
                        {addon.key === "ai_turbo" &&
                          currentAiChatLimit !== null &&
                          currentAiChatLimit !== undefined && (
                            <span>
                              Limite atual de IA: {currentAiChatLimit} mensagens/mês.
                            </span>
                          )}
                      </div>
                      <div className="flex gap-2 sm:justify-end">
                        {isActive ? (
                          <>
                            <Button variant="outline" size="sm" disabled>
                              {t("addons.status.active")}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                cancelAddonSubscription.mutate({ addonKey: addon.key })
                              }
                              disabled={cancelAddonSubscription.isPending}
                            >
                              {cancelAddonSubscription.isPending
                                ? t("addons.button.canceling")
                                : t("addons.button.cancel")}
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => createAddonCheckout.mutate({ addonKey: addon.key })}
                            disabled={createAddonCheckout.isPending}
                          >
                            {t("addons.button.activate")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
