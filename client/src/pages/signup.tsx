import { useLocation } from "wouter";
import { SignupForm } from "@/components/auth/SignupForm";
import { useAuth } from "@/contexts/AuthContext";

export default function SignupPage() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const redirectTo = (() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect") || "/";
    return redirect.startsWith("/") ? redirect : "/";
  })();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate(redirectTo);
    return null;
  }

  const handleSignupSuccess = () => {
    navigate(redirectTo);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SignupForm onSuccess={handleSignupSuccess} />
    </div>
  );
}