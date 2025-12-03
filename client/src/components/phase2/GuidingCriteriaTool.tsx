import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Trash2, Filter, Tag, Star, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertGuidingCriterionSchema, type GuidingCriterion, type InsertGuidingCriterion } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ContextualTooltip } from "@/components/ui/contextual-tooltip";
import { useLanguage } from "@/contexts/LanguageContext";
import EditGuidingCriterionDialog from "./EditGuidingCriterionDialog";

interface GuidingCriteriaToolProps {
  projectId: string;
}

type GuidingCriterionFormValues = {
  title: string;
  description: string;
  category: string;
  importance: "low" | "medium" | "high";
  tags: string[];
};

function importanceToBadge(importance: string | null | undefined) {
  if (importance === "high") return "bg-red-100 text-red-800";
  if (importance === "low") return "bg-gray-100 text-gray-800";
  return "bg-blue-100 text-blue-800";
}

function GuidingCriterionCard({ criterion, projectId }: { criterion: GuidingCriterion; projectId: string }) {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/guiding-criteria/${criterion.id}`);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "guiding-criteria"] });
      toast({
        title: t("guidingCriteria.toast.delete.success.title"),
        description: t("guidingCriteria.toast.delete.success.description"),
      });
    },
    onError: () => {
      toast({
        title: t("guidingCriteria.toast.delete.error.title"),
        description: t("guidingCriteria.toast.delete.error.description"),
        variant: "destructive",
      });
    },
  });

  const tags: string[] = Array.isArray(criterion.tags)
    ? (criterion.tags as unknown[]).map((t) => String(t))
    : [];

  return (
    <Card className="w-full" data-testid={`card-guiding-criterion-${criterion.id}`}>
      <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <Badge className={`text-xs ${importanceToBadge(criterion.importance)}`} data-testid={`badge-importance-${criterion.id}`}>
              <Star className="w-3 h-3 mr-1" />
              {criterion.importance === "high"
                ? t("guidingCriteria.importance.badge.high")
                : criterion.importance === "low"
                ? t("guidingCriteria.importance.badge.low")
                : t("guidingCriteria.importance.badge.medium")}
            </Badge>
            {criterion.category && (
              <Badge variant="outline" className="text-xs" data-testid={`badge-category-${criterion.id}`}>
                <Filter className="w-3 h-3 mr-1" />
                {criterion.category}
              </Badge>
            )}
          </div>
          <CardTitle className="text-base" data-testid={`title-guiding-criterion-${criterion.id}`}>
            {criterion.title}
          </CardTitle>
          {criterion.description && (
            <CardDescription className="text-sm" data-testid={`description-guiding-criterion-${criterion.id}`}>
              {criterion.description}
            </CardDescription>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditOpen(true)}
            data-testid={`button-edit-guiding-criterion-${criterion.id}`}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            data-testid={`button-delete-guiding-criterion-${criterion.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <EditGuidingCriterionDialog
        criterion={criterion}
        projectId={projectId}
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </Card>
  );
}

function CreateGuidingCriterionDialog({ projectId }: { projectId: string }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
   const { t } = useLanguage();

  const form = useForm<GuidingCriterionFormValues>({
    resolver: zodResolver(insertGuidingCriterionSchema.omit({ projectId: true })),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      importance: "medium",
      tags: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertGuidingCriterion) => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/guiding-criteria`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "guiding-criteria"] });
      toast({
        title: t("guidingCriteria.toast.create.success.title"),
        description: t("guidingCriteria.toast.create.success.description"),
      });
      setIsOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: t("guidingCriteria.toast.create.error.title"),
        description: t("guidingCriteria.toast.create.error.description"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: GuidingCriterionFormValues) => {
    const submitData: InsertGuidingCriterion = {
      ...data,
      projectId,
    };
    createMutation.mutate(submitData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" data-testid="button-create-guiding-criterion">
          <Plus className="w-4 h-4 mr-2" />
          {t("guidingCriteria.dialog.create.button")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("guidingCriteria.dialog.create.title")}</DialogTitle>
          <DialogDescription>
            {t("guidingCriteria.dialog.create.description")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel>{t("guidingCriteria.form.title.label")}</FormLabel>
                    <ContextualTooltip
                      title={t("guidingCriteria.form.title.tooltip.title")}
                      content={t("guidingCriteria.form.title.tooltip.content")}
                      examples={[
                        t("guidingCriteria.form.title.tooltip.example1"),
                        t("guidingCriteria.form.title.tooltip.example2"),
                        t("guidingCriteria.form.title.tooltip.example3"),
                      ]}
                    />
                  </div>
                  <FormControl>
                    <Input
                      placeholder={t("guidingCriteria.form.title.placeholder")}
                      {...field}
                      data-testid="input-guiding-criterion-title"
                    />
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
                  <FormLabel>{t("guidingCriteria.form.description.label")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("guidingCriteria.form.description.placeholder")}
                      className="resize-none"
                      rows={3}
                      {...field}
                      value={field.value ?? ""}
                      data-testid="input-guiding-criterion-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("guidingCriteria.form.category.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("guidingCriteria.form.category.placeholder")}
                      {...field}
                      value={field.value ?? ""}
                      data-testid="input-guiding-criterion-category"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="importance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("guidingCriteria.form.importance.label")}</FormLabel>
                  <FormControl>
                    <select
                      className="border rounded-md px-3 py-2 text-sm w-full"
                      value={field.value || "medium"}
                      onChange={(e) => field.onChange(e.target.value)}
                      data-testid="select-guiding-criterion-importance"
                    >
                      <option value="low">{t("guidingCriteria.form.importance.low")}</option>
                      <option value="medium">{t("guidingCriteria.form.importance.medium")}</option>
                      <option value="high">{t("guidingCriteria.form.importance.high")}</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("guidingCriteria.form.tags.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("guidingCriteria.form.tags.placeholder")}
                      value={Array.isArray(field.value) ? field.value.join(", ") : ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        const parts = value
                          .split(",")
                          .map((p) => p.trim())
                          .filter((p) => p.length > 0);
                        field.onChange(parts);
                      }}
                      data-testid="input-guiding-criterion-tags"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} data-testid="button-cancel-guiding-criterion">
                {t("guidingCriteria.common.cancel")}
              </Button>
              <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit-guiding-criterion">
                {createMutation.isPending
                  ? t("guidingCriteria.dialog.create.button.loading")
                  : t("guidingCriteria.dialog.create.button")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function GuidingCriteriaTool({ projectId }: GuidingCriteriaToolProps) {
  const { t } = useLanguage();
  const { data: criteria, isLoading } = useQuery<GuidingCriterion[] | null>({
    queryKey: ["/api/projects", projectId, "guiding-criteria"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t("guidingCriteria.header.title")}</h2>
            <p className="text-gray-600">
              {t("guidingCriteria.header.subtitle")}
            </p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const list = criteria || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t("guidingCriteria.header.title")}</h2>
          <p className="text-gray-600">
            {t("guidingCriteria.header.helper")}
          </p>
        </div>
        <CreateGuidingCriterionDialog projectId={projectId} />
      </div>

      {list.length > 0 ? (
        <div className="grid gap-4">
          {list.map((criterion) => (
            <GuidingCriterionCard key={criterion.id} criterion={criterion} projectId={projectId} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t("guidingCriteria.empty.title")}</h3>
          <p className="text-gray-600 mb-6">
            {t("guidingCriteria.empty.description")}
          </p>
          <CreateGuidingCriterionDialog projectId={projectId} />
        </div>
      )}
    </div>
  );
}
