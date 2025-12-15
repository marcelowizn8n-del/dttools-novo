import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, Eye, EyeOff, AlertCircle } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

type SignupFormData = {
  name: string;
  email: string;
  password: string;
};

interface SignupFormProps {
  onSuccess?: (userData: SignupFormData) => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const signupSchema = z.object({
    name: z.string().min(2, t("auth.validation.name.min")),
    email: z.string().email(t("auth.validation.email.invalid")),
    password: z.string().min(6, t("auth.validation.password.min")),
  });

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const watchPassword = form.watch("password");

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;

    if (score <= 2) {
      return {
        text: t("auth.signup.passwordStrength.weak"),
        color: "text-red-600",
        bg: "bg-red-200",
        percent: 33,
      };
    }
    if (score <= 3) {
      return {
        text: t("auth.signup.passwordStrength.medium"),
        color: "text-yellow-600",
        bg: "bg-yellow-200",
        percent: 66,
      };
    }
    return {
      text: t("auth.signup.passwordStrength.strong"),
      color: "text-green-600",
      bg: "bg-green-200",
      percent: 100,
    };
  };

  const onSubmit = async (data: SignupFormData) => {
    try {
      setError("");
      setIsLoading(true);
      
      // Call signup API diretamente com campos essenciais
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t("auth.signup.error.generic"));
      }

      onSuccess?.(data);

      // Success - redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.signup.error.generic"));
      setIsLoading(false);
    }
  };

  const passwordStrength = watchPassword ? getPasswordStrength(watchPassword) : null;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <UserPlus className="h-5 w-5 text-blue-600" />
          {t("auth.signup.title")}
        </CardTitle>
        <CardDescription>
          {t("auth.signup.subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              {t("auth.signup.name.label")}
            </Label>
            <Input
              id="name"
              type="text"
              placeholder={
                t("auth.signup.name.placeholder")
              }
              data-testid="input-name"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              {t("auth.signup.email.label")}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={t("auth.signup.email.placeholder")}
              data-testid="input-email"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">
              {t("auth.signup.password.label")}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={
                  t("auth.signup.password.placeholder")
                }
                data-testid="input-password"
                {...form.register("password")}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setShowPassword(!showPassword)}
                data-testid="button-toggle-password"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            
            {/* Password Strength Indicator */}
            {watchPassword && (
              <div className="space-y-1">
                <div className={`text-xs ${passwordStrength?.color}`}>
                  {t("auth.signup.passwordStrength.label")}
                  {passwordStrength?.text}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full transition-all ${passwordStrength?.bg}`}
                    style={{ width: `${getPasswordStrength(watchPassword).percent}%` }}
                  />
                </div>
              </div>
            )}

            {form.formState.errors.password && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
            data-testid="button-submit"
          >
            {isLoading ? t("auth.signup.submitting") : t("auth.signup.submit")}
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
            data-testid="button-google-signup"
          >
            <SiGoogle className="mr-2 h-4 w-4" />
            {t("auth.signup.google")}
          </Button>

          <div className="text-center text-sm text-gray-600">
            {t("auth.signup.alreadyHaveAccount")}{" "}
            <Link href="/login">
              <Button variant="link" className="p-0 h-auto font-medium text-blue-600 hover:text-blue-700">
                {t("auth.signup.loginLink")}
              </Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}