import { useEffect } from "react";
import { useLocation } from "wouter";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const redirectTo = (() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect") || "/";
    return redirect.startsWith("/") ? redirect : "/";
  })();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const handleLoginSuccess = () => {
    navigate(redirectTo);
  };

  return (
    <div className="min-h-screen bg-background flex items-start justify-center p-4 pt-20">
      <LoginForm onSuccess={handleLoginSuccess} />
    </div>
  );
}