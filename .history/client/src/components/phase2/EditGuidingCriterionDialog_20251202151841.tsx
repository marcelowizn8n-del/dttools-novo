import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertGuidingCriterionSchema, type GuidingCriterion, type InsertGuidingCriterion } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/contexts/LanguageContext";

interface EditGuidingCriterionDialogProps {
  criterion: GuidingCriterion;
  projectId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface GuidingCriterionEditFormValues {
  title: string;
  description: string;
  category: string;
  importance: "low" | "medium" | "high";
  tags: string[];
}

export default function EditGuidingCriterionDialog({
  criterion,
  projectId,
  isOpen,
  onOpenChange,
}: EditGuidingCriterionDialogProps) {
  const { toast } = useToast();
  const { t } = useLanguage();

  const form = useForm<GuidingCriterionEditFormValues>({
    resolver: zodResolver(insertGuidingCriterionSchema.omit({ projectId: true })),
    defaultValues: {
      title: criterion.title || "",
      description: criterion.description || "",
      category: criterion.category || "",
      importance: (criterion.importance as "low" | "medium" | "high") || "medium",
      tags: Array.isArray(criterion.tags)
        ? (criterion.tags as unknown[]).map((tag) => String(tag))
        : [],
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<InsertGuidingCriterion>) => {
      const payload: Partial<InsertGuidingCriterion> = {
        ...data,
        projectId,
      };
      const response = await apiRequest("PUT", `/api/guiding-criteria/${criterion.id}`, payload);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "guiding-criteria"] });
      toast({
        title: t("guidingCriteria.toast.update.success.title"),
        description: t("guidingCriteria.toast.update.success.description"),
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: t("guidingCriteria.toast.update.error.title"),
        description: t("guidingCriteria.toast.update.error.description"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: GuidingCriterionEditFormValues) => {
    const payload: Partial<InsertGuidingCriterion> = {
      title: data.title,
      description: data.description,
      category: data.category,
      importance: data.importance,
      tags: data.tags,
    };
    updateMutation.mutate(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("guidingCriteria.dialog.edit.title")}</DialogTitle>
          <DialogDescription>
            {t("guidingCriteria.dialog.edit.description")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("guidingCriteria.form.title.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("guidingCriteria.form.title.placeholder")}
                      {...field}
                      data-testid="input-edit-guiding-criterion-title"
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
                      data-testid="input-edit-guiding-criterion-description"
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
                      data-testid="input-edit-guiding-criterion-category"
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
                      data-testid="select-edit-guiding-criterion-importance"
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
                      data-testid="input-edit-guiding-criterion-tags"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel-edit-guiding-criterion"
              >
                {t("guidingCriteria.common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                data-testid="button-save-edit-guiding-criterion"
              >
                {updateMutation.isPending
                  ? t("guidingCriteria.dialog.edit.button.saving")
                  : t("guidingCriteria.dialog.edit.button.save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
