import { lazy, Suspense } from "react";
import { Switch, Route, useLocation, Link } from "wouter";
import { queryClient } from "./lib/queryClient";

// Force new bundle hash - v1760549203
const APP_VERSION = "1760549203";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import CookieConsentBanner from "@/components/CookieConsentBanner";
const LandingPage = lazy(() => import("@/pages/landing"));
const ProjectsPage = lazy(() => import("@/pages/projects"));
const ProjectsMarketingPage = lazy(() => import("@/pages/projects-marketing"));
const ProjectDetailPage = lazy(() => import("@/pages/project-detail"));
const ProjectJourneyPage = lazy(() => import("@/pages/project-journey"));
const LibraryPage = lazy(() => import("@/pages/library"));
const ArticleDetailPage = lazy(() => import("@/pages/article-detail"));
const AdminPage = lazy(() => import("@/pages/admin"));
const AnalyticsPage = lazy(() => import("@/pages/Analytics"));
const LoginPage = lazy(() => import("@/pages/login"));
const SignupPage = lazy(() => import("@/pages/signup"));
const CompleteProfilePage = lazy(() => import("@/pages/complete-profile"));
const PricingPage = lazy(() => import("@/pages/pricing"));
const ChatPage = lazy(() => import("@/pages/chat"));
const ProfilePage = lazy(() => import("@/pages/profile"));
const BenchmarkingPage = lazy(() => import("@/pages/benchmarking"));
const CommercialPage = lazy(() => import("@/pages/commercial"));
const HelpCenter = lazy(() => import("@/pages/HelpCenter"));
const PrivacyPolicy = lazy(() => import("@/pages/privacy-policy"));
const Terms = lazy(() => import("@/pages/terms"));
const Support = lazy(() => import("@/pages/support"));
const ScreenshotCapture = lazy(() => import("@/components/ScreenshotCapture"));
const NotFound = lazy(() => import("@/pages/not-found"));
import { useAuth, ProtectedRoute } from "@/contexts/AuthContext";
const DashboardPage = lazy(() => import("@/pages/dashboard"));
const OnboardingAI = lazy(() => import("@/pages/OnboardingAI"));
const DashboardAI = lazy(() => import("@/pages/DashboardAI"));
const AdminSectors = lazy(() => import("@/pages/AdminSectors"));
const AdminCases = lazy(() => import("@/pages/AdminCases"));
const VideoTutorials = lazy(() => import("@/pages/VideoTutorials"));
const DoubleDiamond = lazy(() => import("@/pages/DoubleDiamond"));
const DoubleDiamondProject = lazy(() => import("@/pages/DoubleDiamondProject"));
const AddonsPage = lazy(() => import("@/pages/addons"));
const InviteAcceptPage = lazy(() => import("@/pages/invite-accept"));

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
    </div>
  );
}

function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <Suspense fallback={<RouteFallback />}>
      {isAuthenticated ? <DashboardPage /> : <LandingPage />}
    </Suspense>
  );
}

function ProjectsRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <Suspense fallback={<RouteFallback />}>
      {isAuthenticated ? <ProjectsPage /> : <ProjectsMarketingPage />}
    </Suspense>
  );
}

function ProtectedProjectDetail() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    setLocation('/login');
    return null;
  }
  
  return (
    <Suspense fallback={<RouteFallback />}>
      <ProjectDetailPage />
    </Suspense>
  );
}


function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/projects" component={ProjectsRoute} />
      <Route path="/projects/:id" component={ProtectedProjectDetail} />
      <Route path="/projects/:id/journey">
        <ProtectedRoute>
          <Suspense fallback={<RouteFallback />}>
            <ProjectJourneyPage />
          </Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/library">
        <ProtectedRoute>
          <Suspense fallback={<RouteFallback />}>
            <LibraryPage />
          </Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/biblioteca">
        <ProtectedRoute>
          <Suspense fallback={<RouteFallback />}>
            <LibraryPage />
          </Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/library/article/:id">
        <Suspense fallback={<RouteFallback />}>
          <ArticleDetailPage />
        </Suspense>
      </Route>
      <Route path="/biblioteca/artigo/:id">
        <Suspense fallback={<RouteFallback />}>
          <ArticleDetailPage />
        </Suspense>
      </Route>
      <Route path="/video-tutorials">
        <Suspense fallback={<RouteFallback />}>
          <VideoTutorials />
        </Suspense>
      </Route>
      <Route path="/tutoriais">
        <Suspense fallback={<RouteFallback />}>
          <VideoTutorials />
        </Suspense>
      </Route>
      <Route path="/pricing">
        <Suspense fallback={<RouteFallback />}>
          <PricingPage />
        </Suspense>
      </Route>
      <Route path="/login">
        <Suspense fallback={<RouteFallback />}>
          <LoginPage />
        </Suspense>
      </Route>
      <Route path="/signup">
        <Suspense fallback={<RouteFallback />}>
          <SignupPage />
        </Suspense>
      </Route>
      <Route path="/invite/accept">
        <Suspense fallback={<RouteFallback />}>
          <InviteAcceptPage />
        </Suspense>
      </Route>
      <Route path="/complete-profile">
        <Suspense fallback={<RouteFallback />}>
          <CompleteProfilePage />
        </Suspense>
      </Route>
      
      {/* Protected Routes */}
      <Route path="/dashboard">
        <ProtectedRoute>
          <Suspense fallback={<RouteFallback />}>
            <DashboardPage />
          </Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/chat">
        <ProtectedRoute>
          <Suspense fallback={<RouteFallback />}>
            <ChatPage />
          </Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute>
          <Suspense fallback={<RouteFallback />}>
            <ProfilePage />
          </Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/admin">
        <ProtectedRoute adminOnly={true}>
          <Suspense fallback={<RouteFallback />}>
            <AdminPage />
          </Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/sectors">
        <ProtectedRoute adminOnly={true}>
          <Suspense fallback={<RouteFallback />}>
            <AdminSectors />
          </Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/cases">
        <ProtectedRoute adminOnly={true}>
          <Suspense fallback={<RouteFallback />}>
            <AdminCases />
          </Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/analytics">
        <ProtectedRoute adminOnly={true}>
          <Suspense fallback={<RouteFallback />}>
            <AnalyticsPage />
          </Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/benchmarking">
        <ProtectedRoute>
          <Suspense fallback={<RouteFallback />}>
            <BenchmarkingPage />
          </Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/commercial">
        <ProtectedRoute>
          <Suspense fallback={<RouteFallback />}>
            <CommercialPage />
          </Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/double-diamond">
        <ProtectedRoute>
          <Suspense fallback={<RouteFallback />}>
            <DoubleDiamond />
          </Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/double-diamond/:id">
        <ProtectedRoute>
          <Suspense fallback={<RouteFallback />}>
            <DoubleDiamondProject />
          </Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/addons">
        <ProtectedRoute>
          <Suspense fallback={<RouteFallback />}>
            <AddonsPage />
          </Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/onboarding-ai">
        <ProtectedRoute>
          <Suspense fallback={<RouteFallback />}>
            <OnboardingAI />
          </Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard-ai/:projectId">
        <ProtectedRoute>
          <Suspense fallback={<RouteFallback />}>
            <DashboardAI />
          </Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/help">
        <Suspense fallback={<RouteFallback />}>
          <HelpCenter />
        </Suspense>
      </Route>
      <Route path="/ajuda">
        <Suspense fallback={<RouteFallback />}>
          <HelpCenter />
        </Suspense>
      </Route>
      <Route path="/privacy-policy">
        <Suspense fallback={<RouteFallback />}>
          <PrivacyPolicy />
        </Suspense>
      </Route>
      <Route path="/privacidade">
        <Suspense fallback={<RouteFallback />}>
          <PrivacyPolicy />
        </Suspense>
      </Route>
      <Route path="/terms">
        <Suspense fallback={<RouteFallback />}>
          <Terms />
        </Suspense>
      </Route>
      <Route path="/termos">
        <Suspense fallback={<RouteFallback />}>
          <Terms />
        </Suspense>
      </Route>
      <Route path="/support">
        <Suspense fallback={<RouteFallback />}>
          <Support />
        </Suspense>
      </Route>
      <Route path="/screenshots">
        <Suspense fallback={<RouteFallback />}>
          <ScreenshotCapture />
        </Suspense>
      </Route>
      
      <Route>
        <Suspense fallback={<RouteFallback />}>
          <NotFound />
        </Suspense>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <AppLayout />
              <Toaster />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function AppLayout() {
  const { t } = useLanguage();

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Router />
      </main>
      <CookieConsentBanner />
      <footer className="border-t border-border">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 text-sm text-muted-foreground flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} DTTools</div>
          <div className="flex gap-4">
            <Link href="/termos" className="hover:underline">{t("footer.terms")}</Link>
            <Link href="/privacidade" className="hover:underline">{t("footer.privacy")}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;