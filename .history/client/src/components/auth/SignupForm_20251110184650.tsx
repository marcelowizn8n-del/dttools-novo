import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import { Link } from "wouter";

const signupSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  confirmEmail: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
}).refine((data) => data.email === data.confirmEmail, {
  message: "Emails não coincidem",
  path: ["confirmEmail"],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess?: (userData: Omit<SignupFormData, 'confirmPassword' | 'confirmEmail'>) => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
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

    if (score <= 2) return { text: "Fraca", color: "text-red-600", bg: "bg-red-200" };
    if (score <= 3) return { text: "Média", color: "text-yellow-600", bg: "bg-yellow-200" };
    return { text: "Forte", color: "text-green-600", bg: "bg-green-200" };
  };

  const onSubmit = async (data: SignupFormData) => {
    try {
      setError("");
      setIsLoading(true);
      
      // Call signup API directly
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
        throw new Error(errorData.error || 'Erro ao criar conta');
      }

      // Success - redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta");
      setIsLoading(false);
    }
  };

  const passwordStrength = watchPassword ? getPasswordStrength(watchPassword) : null;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <UserPlus className="h-5 w-5 text-blue-600" />
          Criar Conta
        </CardTitle>
        <CardDescription>
          Preencha seus dados para começar a usar o DTTools
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Nome de Exibição */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome de Exibição</Label>
            <Input
              id="name"
              type="text"
              placeholder="Como você quer ser chamado? (ex: João Silva)"
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
            <Label htmlFor="email">Email (usado para login)</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
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

          {/* Confirmar Email */}
          <div className="space-y-2">
            <Label htmlFor="confirmEmail">Confirmar Email</Label>
            <Input
              id="confirmEmail"
              type="email"
              placeholder="Digite o email novamente"
              data-testid="input-confirm-email"
              {...form.register("confirmEmail")}
            />
            {form.formState.errors.confirmEmail && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {form.formState.errors.confirmEmail.message}
              </p>
            )}
          </div>

          {/* Senha */}
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite uma senha"
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
                  Força da senha: {passwordStrength?.text}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full transition-all ${passwordStrength?.bg}`}
                    style={{ width: `${(getPasswordStrength(watchPassword).text === 'Fraca' ? 33 : getPasswordStrength(watchPassword).text === 'Média' ? 66 : 100)}%` }}
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

          {/* Confirmar Senha */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Digite a senha novamente"
                data-testid="input-confirm-password"
                {...form.register("confirmPassword")}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                data-testid="button-toggle-confirm-password"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {form.formState.errors.confirmPassword.message}
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
            {isLoading ? "Criando conta..." : "Criar Conta"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou continue com
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
            Cadastrar com Google
          </Button>

          <div className="text-center text-sm text-gray-600">
            Já tem uma conta?{" "}
            <Link href="/login">
              <Button variant="link" className="p-0 h-auto font-medium text-blue-600 hover:text-blue-700">
                Fazer login
              </Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}