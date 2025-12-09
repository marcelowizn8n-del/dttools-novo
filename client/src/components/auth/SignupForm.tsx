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
import { useLanguage } from "@/contexts/LanguageContext";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess?: (userData: SignupFormData) => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();

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

    if (score <= 2) return { text: language === "zh" ? "弱" : "Weak", color: "text-red-600", bg: "bg-red-200" };
    if (score <= 3) return { text: language === "zh" ? "中等" : "Medium", color: "text-yellow-600", bg: "bg-yellow-200" };
    return { text: language === "zh" ? "强" : "Strong", color: "text-green-600", bg: "bg-green-200" };
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
        throw new Error(errorData.error || 'Error creating account');
      }

      onSuccess?.(data);

      // Success - redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating account");
      setIsLoading(false);
    }
  };

  const passwordStrength = watchPassword ? getPasswordStrength(watchPassword) : null;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <UserPlus className="h-5 w-5 text-blue-600" />
          {language === "pt-BR" ? "Criar Conta" : language === "zh" ? "创建账户" : "Create Account"}
        </CardTitle>
        <CardDescription>
          {language === "pt-BR"
            ? "Preencha seus dados para começar a usar o DTTools"
            : language === "zh"
            ? "填写信息即可开始使用 DTTools"
            : "Fill in your details to start using DTTools"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              {language === "pt-BR" ? "Nome de Exibição" : language === "zh" ? "显示名称" : "Display Name"}
            </Label>
            <Input
              id="name"
              type="text"
              placeholder={
                language === "pt-BR"
                  ? "Como você quer ser chamado? (ex: João Silva)"
                  : language === "zh"
                  ? "你希望我们如何称呼你？(例如：张伟)"
                  : "How should we call you? (e.g. John Smith)"
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
              {language === "pt-BR"
                ? "Email (usado para login)"
                : language === "zh"
                ? "邮箱（用于登录）"
                : "Email (used for login)"}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={language === "zh" ? "you@example.com" : "you@example.com"}
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
              {language === "pt-BR" ? "Senha" : language === "zh" ? "密码" : "Password"}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={
                  language === "pt-BR" ? "Digite uma senha" : language === "zh" ? "请输入密码" : "Enter a password"
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
                  {language === "pt-BR" ? "Força da senha: " : language === "zh" ? "密码强度：" : "Password strength: "}
                  {passwordStrength?.text}
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
            {isLoading
              ? language === "pt-BR"
                ? "Criando conta..."
                : language === "zh"
                ? "正在创建账户..."
                : "Creating account..."
              : language === "pt-BR"
              ? "Criar Conta"
              : language === "zh"
              ? "创建账户"
              : "Create Account"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {language === "pt-BR" ? "Ou continue com" : language === "zh" ? "或使用以下方式继续" : "Or continue with"}
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
            {language === "pt-BR" ? "Cadastrar com Google" : language === "zh" ? "使用 Google 注册" : "Sign up with Google"}
          </Button>

          <div className="text-center text-sm text-gray-600">
            {language === "pt-BR" ? "Já tem uma conta?" : language === "zh" ? "已经有账户？" : "Already have an account?"}{" "}
            <Link href="/login">
              <Button variant="link" className="p-0 h-auto font-medium text-blue-600 hover:text-blue-700">
                {language === "pt-BR" ? "Fazer login" : language === "zh" ? "登录" : "Log in"}
              </Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}