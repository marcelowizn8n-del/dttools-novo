import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth();
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError("");
      setIsLoading(true);
      await login(data.email, data.password);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.login.error.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <LogIn className="h-5 w-5" />
          {t("auth.login.title")}
        </CardTitle>
        <CardDescription>
          {t("auth.login.subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.login.email.label")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("auth.login.email.placeholder")}
              data-testid="input-email"
              autoComplete="email"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {t("auth.login.password.label")}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("auth.login.password.placeholder")}
                data-testid="input-password"
                autoComplete="off"
                {...form.register("password")}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                data-testid="button-toggle-password"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {form.formState.errors.password && (
              <p className="text-sm text-red-600">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription data-testid="text-error">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            data-testid="button-submit"
          >
            {isLoading ? t("auth.login.submitting") : t("auth.login.submit")}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t("auth.login.orContinueWith")}
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => window.location.href = "/api/auth/google"}
            data-testid="button-google-login"
          >
            <SiGoogle className="mr-2 h-4 w-4" />
            {t("auth.login.google")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}