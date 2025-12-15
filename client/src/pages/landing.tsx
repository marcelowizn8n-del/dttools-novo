import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Users, Target, Lightbulb, Wrench, TestTube, Star, CheckCircle, Zap, Globe, BookOpen, TrendingUp, BarChart3, Trello, Sparkles, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import type { Testimonial } from "@shared/schema";
// Use direct path to logo in public root  
const logoHorizontal = "/logo-horizontal.png";
import dttoolsIcon from "../assets/dttools-icon.png";

const phases = [
  {
    id: 1,
    icon: Users,
    titleKey: "landing.phase.empathize.title",
    descKey: "landing.phase.empathize.desc",
    bgColor: "#90C5E0",
    hoverColor: "#69A1C5",
    iconColor: "text-white",
    completed: false
  },
  {
    id: 2,
    icon: Target,
    titleKey: "landing.phase.define.title",
    descKey: "landing.phase.define.desc",
    bgColor: "#3A5A7E",
    hoverColor: "#2A4259",
    iconColor: "text-white",
    completed: false
  },
  {
    id: 3,
    icon: Lightbulb,
    titleKey: "landing.phase.ideate.title",
    descKey: "landing.phase.ideate.desc",
    bgColor: "#FFD700",
    hoverColor: "#E6C200",
    iconColor: "text-black",
    completed: false
  },
  {
    id: 4,
    icon: Wrench,
    titleKey: "landing.phase.prototype.title",
    descKey: "landing.phase.prototype.desc",
    bgColor: "#FF8C42",
    hoverColor: "#E0773A",
    iconColor: "text-white",
    completed: false
  },
  {
    id: 5,
    icon: TestTube,
    titleKey: "landing.phase.test.title",
    descKey: "landing.phase.test.desc",
    bgColor: "#76D7C4",
    hoverColor: "#48A9A6",
    iconColor: "text-black",
    completed: false
  }
];

// Helper to get translated testimonial text
function getTranslatedTestimonial(testimonial: Testimonial, language: Language): string | null {
  const langMap: Record<Language, string | null | undefined> = {
    "pt-BR": testimonial.testimonialPt,
    "en": testimonial.testimonialEn,
    "es": testimonial.testimonialEs,
    "fr": testimonial.testimonialFr,
    // No DB fields for German/Chinese yet; don't fall back to English.
    "de": null,
    "zh": null,
  };

  return langMap[language] || null;
}

export default function LandingPage() {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);
  const [, setLocation] = useLocation();
  const { theme } = useTheme();
  const isDarkTheme =
    theme === "dark" ||
    (typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark"));

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const handlePhaseClick = (phaseId: number) => {
    if (isAuthenticated) {
      // Se já está logado, vai para projetos
      setLocation("/projects");
    } else {
      // Se não está logado, vai para o login
      setLocation("/login");
    }
  };

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section
        className={
          "relative bg-gradient-to-br " +
          (isDarkTheme
            ? "from-slate-950 via-slate-900 to-slate-950"
            : "from-blue-50 via-indigo-50 to-purple-50")
        }
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative container mx-auto px-6 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Ícone DTTools GRANDE e proeminente */}
            <div className="mb-6">
              <img 
                src={dttoolsIcon} 
                alt="DTTools Icon" 
                className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 mx-auto mb-4 object-contain drop-shadow-lg"
                data-testid="dttools-icon-landing"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-foreground mb-6 leading-tight">
              {t("landing.hero.title")}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-muted-foreground mb-8 leading-relaxed">
              {t("landing.hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  variant={isDarkTheme ? "glass" : "default"}
                  className={
                    "text-lg px-8 py-6 " +
                    (isDarkTheme
                      ? "rounded-full"
                      : "bg-blue-600 hover:bg-blue-700")
                  }
                >
                  {t("landing.start.free")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant={isDarkTheme ? "glass" : "outline"}
                  size="lg"
                  className={
                    "text-lg px-8 py-6 " +
                    (isDarkTheme
                      ? "rounded-full border border-white/30 text-white/90"
                      : "border-blue-600 text-blue-700 hover:bg-blue-50 bg-white")
                  }
                >
                  {t("landing.view.plans")}
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500 dark:text-muted-foreground mt-4">
              {t("landing.trial.info")}
            </p>
          </div>
        </div>
      </section>

      {/* AI MVP Generator Highlight - For Non-Logged Users */}
      <section
        className={
          "py-12 " +
          (isDarkTheme
            ? "bg-background"
            : "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600")
        }
      >
        <div className="container mx-auto px-6">
          <Card className="border-0 shadow-2xl bg-white dark:bg-card overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-start gap-6 flex-1">
                  <div className="p-5 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg flex-shrink-0">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-foreground">
                        {t("landing.mvp.title")}
                      </h3>
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-sm px-3 py-1">
                        {t("landing.mvp.badge")}
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-muted-foreground text-lg mb-4 leading-relaxed">
                      {t("landing.mvp.subtitle")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "landing.mvp.feature.logo",
                        "landing.mvp.feature.personas",
                        "landing.mvp.feature.landing",
                        "landing.mvp.feature.social",
                        "landing.mvp.feature.bmc",
                      ].map((key) => (
                        <Badge key={key} variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground">
                          <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                          {t(key)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Link href="/signup">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xl px-10 py-7 shadow-xl hover:shadow-2xl transition-all duration-300"
                      data-testid="button-create-ai-mvp-landing"
                    >
                      <Rocket className="mr-3 h-7 w-7" />
                      {t("landing.mvp.button")}
                      <ArrowRight className="ml-3 h-6 w-6" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Design Thinking Process */}
      <section className="py-20 bg-white dark:bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-foreground mb-4">
              {t("landing.5.phases.title")}
            </h2>
            <p className="text-lg text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
              {t("landing.5.phases.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {phases.map((phase) => {
                  const Icon = phase.icon;
                  const isHovered = hoveredPhase === phase.id;
                  
                  return (
                    <Card 
                      key={phase.id}
 className={`cursor-pointer transition-all duration-300 border-2 ${
                        isHovered ? 'shadow-lg scale-105' : 'shadow-md'
                      }`}
                      style={{
                        backgroundColor: isHovered ? phase.hoverColor : phase.bgColor,
                        borderColor: phase.bgColor,
                        color: phase.iconColor === 'text-black' ? '#000' : '#fff'
                      }}
                      onMouseEnter={() => setHoveredPhase(phase.id)}
                      onMouseLeave={() => setHoveredPhase(null)}
                      onClick={() => handlePhaseClick(phase.id)}
                      data-testid={`card-phase-${phase.id}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-4">
                          <div 
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${phase.iconColor}`}
                            style={{ 
                              backgroundColor: 'rgba(255,255,255,0.2)',
                              backdropFilter: 'blur(10px)'
                            }}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {phase.id}. {t(phase.titleKey)}
                            </CardTitle>
                            <CardDescription className="mt-1" style={{ color: phase.iconColor === 'text-black' ? '#666' : 'rgba(255,255,255,0.8)' }}>
                              {t(phase.descKey)}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

      {/* Features Section */}

      {/* Double Diamond Section - Call to Action for Signup */}
      <section
        className={
          "py-20 bg-gradient-to-br " +
          (isDarkTheme
            ? "from-slate-950 via-slate-900 to-slate-950"
            : "from-indigo-50 via-purple-50 to-blue-50")
        }
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 text-sm px-4 py-1">
              ✨ {t("landing.dd.badge")}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-foreground mb-4">
              {t("landing.dd.title")}
            </h2>
            <p className="text-lg text-gray-600 dark:text-muted-foreground max-w-3xl mx-auto">
              {t("landing.dd.subtitle")}
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <Card className="border-2 border-purple-200 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-start gap-5 flex-1">
                    <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm flex-shrink-0">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-3">
                        {t("landing.dd.mini.title")}
                      </h3>
                      <p className="text-blue-100 text-lg mb-4 leading-relaxed">
                        {t("landing.dd.mini.subtitle")}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "landing.dd.feature.pov",
                          "landing.dd.feature.problem",
                          "landing.dd.feature.aiIdeas",
                          "landing.dd.feature.dfv",
                          "landing.dd.feature.prototypes",
                        ].map((key) => (
                          <Badge key={key} className="bg-white/90 text-purple-700 hover:bg-white">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {t(key)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Link href="/signup">
                      <Button 
                        size="lg" 
                        className="bg-white text-purple-600 hover:bg-gray-50 text-xl px-10 py-7 shadow-xl hover:shadow-2xl transition-all duration-300"
                        data-testid="button-double-diamond-cta"
                      >
                        <Rocket className="mr-3 h-7 w-7" />
                        {t("landing.dd.button")}
                        <ArrowRight className="ml-3 h-6 w-6" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              <CardContent className="p-8 bg-white dark:bg-card">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Discovery Diamond */}
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border-2 border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-foreground">
                        {t("landing.dd.discovery.title")}
                      </h4>
                    </div>
                    <p className="text-gray-600 dark:text-muted-foreground text-sm leading-relaxed mb-3">
                      {t("landing.dd.discovery.text")}
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-foreground">{t("landing.dd.discovery.item1")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-foreground">{t("landing.dd.discovery.item2")}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Delivery Diamond */}
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border-2 border-purple-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-foreground">
                        {t("landing.dd.delivery.title")}
                      </h4>
                    </div>
                    <p className="text-gray-600 dark:text-muted-foreground text-sm leading-relaxed mb-3">
                      {t("landing.dd.delivery.text")}
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-foreground">{t("landing.dd.delivery.item1")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-foreground">{t("landing.dd.delivery.item2")}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-border text-center">
                  <p className="text-sm text-gray-500 dark:text-muted-foreground">
                    {t("landing.dd.footer")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-foreground mb-4">
              {t("landing.everything.title")}
            </h2>
            <p className="text-lg text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
              {t("landing.everything.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                titleKey: "landing.features.process.title",
                descKey: "landing.features.process.desc",
              },
              {
                icon: Users,
                titleKey: "landing.features.collab.title",
                descKey: "landing.features.collab.desc",
              },
              {
                icon: BookOpen,
                titleKey: "landing.features.library.title",
                descKey: "landing.features.library.desc",
              },
              {
                icon: TrendingUp,
                titleKey: "landing.features.metrics.title",
                descKey: "landing.features.metrics.desc",
              },
              {
                icon: Globe,
                titleKey: "landing.features.multilang.title",
                descKey: "landing.features.multilang.desc",
              },
              {
                icon: CheckCircle,
                titleKey: "landing.features.export.title",
                descKey: "landing.features.export.desc",
              },
              {
                icon: Trello,
                titleKey: "landing.features.kanban.title",
                descKey: "landing.features.kanban.desc",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-primary/20 rounded-lg flex items-center justify-center mb-3">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl font-semibold">
                      {t(feature.titleKey)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 dark:text-muted-foreground leading-relaxed">
                      {t(feature.descKey)}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benchmarking Section */}
      <section
        className={
          "py-20 bg-gradient-to-br " +
          (isDarkTheme
            ? "from-slate-950 via-slate-900 to-slate-950"
            : "from-purple-50 via-blue-50 to-indigo-50")
        }
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-100 dark:hover:bg-purple-800">
              🚀 {t("landing.dvf.badge")}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-foreground mb-4">
              {t("landing.dvf.title")}
            </h2>
            <p className="text-lg text-gray-600 dark:text-muted-foreground max-w-3xl mx-auto">
              {t("landing.dvf.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left - DVF Explanation */}
            <div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 dark:text-green-300 font-bold text-lg">D</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-foreground mb-2">
                      {t("landing.dvf.d.title")}
                    </h3>
                    <p className="text-gray-600 dark:text-muted-foreground">
                      {t("landing.dvf.d.text")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 dark:text-blue-300 font-bold text-lg">V</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-foreground mb-2">
                      {t("landing.dvf.v.title")}
                    </h3>
                    <p className="text-gray-600 dark:text-muted-foreground">
                      {t("landing.dvf.v.text")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 dark:text-purple-200 font-bold text-lg">F</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-foreground mb-2">
                      {t("landing.dvf.f.title")}
                    </h3>
                    <p className="text-gray-600 dark:text-muted-foreground">
                      {t("landing.dvf.f.text")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Visual representation */}
            <div className="text-center">
              <div className="bg-white dark:bg-card rounded-2xl shadow-lg p-8 max-w-md mx-auto">
                <div className="mb-6">
                  <BarChart3 className="w-16 h-16 text-blue-600 dark:text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-foreground">
                    {t("landing.dvf.card.title")}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-muted-foreground">
                      {t("landing.dvf.card.desirability")}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="w-4/5 h-full bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">4.0/5</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-muted-foreground">
                      {t("landing.dvf.card.viability")}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="w-3/5 h-full bg-blue-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">3.2/5</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-muted-foreground">
                      {t("landing.dvf.card.feasibility")}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="w-4/5 h-full bg-purple-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">4.1/5</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-border">
                  <div className="text-sm text-gray-600 dark:text-muted-foreground mb-1">
                    {t("landing.dvf.card.overall")}
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-primary">3.8/5</div>
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                    {t("landing.dvf.card.aboveAverage")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Link href="/benchmarking">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6" data-testid="button-try-benchmarking">
                {t("landing.dvf.cta.button")}
                <BarChart3 className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-2">
              {t("landing.dvf.cta.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-foreground mb-4">
              {t("landing.trusted.title")}
            </h2>
            <div className="flex justify-center items-center gap-2 mb-8">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-gray-600 dark:text-muted-foreground font-medium">
                {t("landing.rating")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.length > 0 ? (
              testimonials.slice(0, 3).map((testimonial, idx) => {
                const testimonialText =
                  getTranslatedTestimonial(testimonial, language) ||
                  t(`landing.testimonial.${idx + 1}`);
                
                return (
                  <Card key={testimonial.id} className="border-0 shadow-lg bg-card">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-1 mb-4">
                        {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-700 dark:text-muted-foreground italic mb-4 leading-relaxed">
                        "{testimonialText}"
                      </p>
                      <div className="flex items-center gap-3">
                        {testimonial.avatarUrl ? (
                          <img
                            src={testimonial.avatarUrl}
                            alt={testimonial.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {testimonial.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-foreground">{testimonial.name}</div>
                          <div className="text-sm text-gray-600 dark:text-muted-foreground">{testimonial.role}, {testimonial.company}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              // Fallback para quando não houver depoimentos
              [1, 2, 3].map((i) => (
                <Card key={i} className="border-0 shadow-lg bg-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[1,2,3,4,5].map(j => (
                        <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-muted-foreground italic mb-4 leading-relaxed">
                      "{t(`landing.testimonial.${i}`)}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
                      <div>
                        <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded"></div>
                        <div className="h-3 w-32 bg-gray-100 dark:bg-slate-800 rounded mt-1"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className={
          "py-20 pb-48 bg-gradient-to-r " +
          (isDarkTheme ? "from-purple-900 to-blue-900" : "from-blue-600 to-purple-600")
        }
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("landing.ready.title")}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t("landing.ready.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/login">
              <Button
                size="lg"
                variant={isDarkTheme ? "glass" : "default"}
                className={
                  "text-lg px-8 py-6 " +
                  (isDarkTheme
                    ? "rounded-full text-white"
                    : "bg-white text-blue-600 hover:bg-gray-100")
                }
                data-testid="button-start-trial"
              >
                {t("landing.start.trial")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/library">
              <Button
                variant={isDarkTheme ? "glass" : "outline"}
                size="lg"
                className={
                  "text-lg px-8 py-6 " +
                  (isDarkTheme
                    ? "rounded-full border border-white/40 text-white/90"
                    : "border-2 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent")
                }
                data-testid="button-explore-library"
              >
                📚 {t("landing.explore.library")}
              </Button>
            </Link>
          </div>
          {/* Visual spacing to ensure buttons are fully visible */}
          <div className="h-16"></div>
        </div>
      </section>
    </div>
  );
}