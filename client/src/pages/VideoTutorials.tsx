import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Video, Play, Clock, Youtube, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import type { VideoTutorial } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function VideoTutorials() {
  const { language } = useLanguage();
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);

  const { data: videos = [], isLoading } = useQuery<VideoTutorial[]>({
    queryKey: ["/api/video-tutorials"],
  });

  const handleVideoClick = async (video: VideoTutorial) => {
    if (video.youtubeUrl) {
      await apiRequest("POST", `/api/video-tutorials/${video.id}/view`);
      window.open(video.youtubeUrl, '_blank');
    }
  };

  const getPhaseLabel = (phase: string) => {
    const labels: Record<string, Record<string, string>> = {
      overview: {
        pt: "Visão Geral",
        en: "Overview",
        es: "Visión General",
        fr: "Vue d'ensemble",
        zh: "概览"
      },
      empathize: {
        pt: "Empatizar",
        en: "Empathize",
        es: "Empatizar",
        fr: "Empathiser",
        zh: "同理"
      },
      define: {
        pt: "Definir",
        en: "Define",
        es: "Definir",
        fr: "Définir",
        zh: "定义"
      },
      ideate: {
        pt: "Idear",
        en: "Ideate",
        es: "Idear",
        fr: "Idéer",
        zh: "发想"
      },
      prototype: {
        pt: "Prototipar",
        en: "Prototype",
        es: "Prototipar",
        fr: "Prototyper",
        zh: "原型"
      },
      test: {
        pt: "Testar",
        en: "Test",
        es: "Probar",
        fr: "Tester",
        zh: "测试"
      }
    };

    const langKey =
      language === "pt-BR"
        ? "pt"
        : language === "de"
        ? "en"
        : language;

    return labels[phase]?.[langKey] || phase;
  };

  const getPhaseColor = (phase: string) => {
    const colors: Record<string, string> = {
      overview: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      empathize: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      define: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      ideate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      prototype: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      test: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return colors[phase] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  const getLocalizedTitle = (video: VideoTutorial) => {
    if (language === 'zh') {
      if ((video as any).titleZh) return (video as any).titleZh as string;
      if (video.titleEn) return video.titleEn;
      return video.title;
    }

    if ((language === 'en' || language === 'de') && video.titleEn) return video.titleEn;
    if (language === 'es' && video.titleEs) return video.titleEs;
    if (language === 'fr' && video.titleFr) return video.titleFr;
    return video.title;
  };

  const getLocalizedDescription = (video: VideoTutorial) => {
    if (language === 'zh') {
      if ((video as any).descriptionZh) return (video as any).descriptionZh as string;
      if (video.descriptionEn) return video.descriptionEn;
      return video.description || "";
    }

    if ((language === 'en' || language === 'de') && video.descriptionEn) return video.descriptionEn;
    if (language === 'es' && video.descriptionEs) return video.descriptionEs;
    if (language === 'fr' && video.descriptionFr) return video.descriptionFr;
    return video.description || "";
  };

  const groupedVideos = videos.reduce((acc, video) => {
    if (!acc[video.phase]) {
      acc[video.phase] = [];
    }
    acc[video.phase].push(video);
    return acc;
  }, {} as Record<string, VideoTutorial[]>);

  const phases = ["overview", "empathize", "define", "ideate", "prototype", "test"];

  const content: Record<string, {
    title: string;
    subtitle: string;
    noVideos: string;
    watchVideo: string;
    views: string;
    comingSoon: string;
    expandDetails: string;
    collapseDetails: string;
  }> = {
    "pt": {
      title: "Vídeos Tutoriais",
      subtitle: "Aprenda Design Thinking com tutoriais passo a passo",
      noVideos: "Nenhum vídeo disponível nesta fase ainda.",
      watchVideo: "Assistir Vídeo",
      views: "visualizações",
      comingSoon: "Em breve! Os vídeos estão sendo produzidos.",
      expandDetails: "Ver detalhes",
      collapseDetails: "Ocultar detalhes"
    },
    "pt-BR": {
      title: "Vídeos Tutoriais",
      subtitle: "Aprenda Design Thinking com tutoriais passo a passo",
      noVideos: "Nenhum vídeo disponível nesta fase ainda.",
      watchVideo: "Assistir Vídeo",
      views: "visualizações",
      comingSoon: "Em breve! Os vídeos estão sendo produzidos.",
      expandDetails: "Ver detalhes",
      collapseDetails: "Ocultar detalhes"
    },
    "en": {
      title: "Video Tutorials",
      subtitle: "Learn Design Thinking with step-by-step tutorials",
      noVideos: "No videos available in this phase yet.",
      watchVideo: "Watch Video",
      views: "views",
      comingSoon: "Coming soon! Videos are being produced.",
      expandDetails: "View details",
      collapseDetails: "Hide details"
    },
    "es": {
      title: "Tutoriales en Video",
      subtitle: "Aprende Design Thinking con tutoriales paso a paso",
      noVideos: "Aún no hay videos disponibles en esta fase.",
      watchVideo: "Ver Video",
      views: "visualizaciones",
      comingSoon: "¡Próximamente! Los videos están siendo producidos.",
      expandDetails: "Ver detalles",
      collapseDetails: "Ocultar detalles"
    },
    "fr": {
      title: "Tutoriels Vidéo",
      subtitle: "Apprenez le Design Thinking avec des tutoriels étape par étape",
      noVideos: "Aucune vidéo disponible dans cette phase pour le moment.",
      watchVideo: "Regarder la Vidéo",
      views: "vues",
      comingSoon: "Bientôt disponible ! Les vidéos sont en cours de production.",
      expandDetails: "Voir les détails",
      collapseDetails: "Masquer les détails"
    },
    "zh": {
      title: "教学视频",
      subtitle: "通过循序渐进的教程学习设计思维",
      noVideos: "该阶段暂时没有可用视频。",
      watchVideo: "观看视频",
      views: "次观看",
      comingSoon: "即将推出！视频正在制作中。",
      expandDetails: "查看详情",
      collapseDetails: "收起详情"
    }
  };

  const t = content[language] || content[language === 'pt-BR' ? 'pt-BR' : 'en'];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Video className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold" data-testid="page-title">
              {t.title}
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            {t.subtitle}
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              {phases.map((phase) => (
                <TabsTrigger key={phase} value={phase} data-testid={`tab-${phase}`}>
                  {getPhaseLabel(phase)}
                </TabsTrigger>
              ))}
            </TabsList>

            {phases.map((phase) => (
              <TabsContent key={phase} value={phase}>
                <div className="space-y-4">
                  {groupedVideos[phase] && groupedVideos[phase].length > 0 ? (
                    groupedVideos[phase].map((video) => (
                      <Card key={video.id} data-testid={`video-card-${video.id}`}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={getPhaseColor(video.phase)}>
                                  {getPhaseLabel(video.phase)}
                                </Badge>
                                {video.duration && (
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    {video.duration}
                                  </div>
                                )}
                                {(video.viewCount ?? 0) > 0 && (
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Play className="h-4 w-4" />
                                    {video.viewCount} {t.views}
                                  </div>
                                )}
                              </div>
                              <CardTitle className="text-xl mb-2">
                                {getLocalizedTitle(video)}
                              </CardTitle>
                              <CardDescription>
                                {getLocalizedDescription(video)}
                              </CardDescription>
                            </div>
                            {video.youtubeUrl ? (
                              <Button
                                onClick={() => handleVideoClick(video)}
                                className="ml-4"
                                data-testid={`button-watch-${video.id}`}
                              >
                                <Youtube className="mr-2 h-4 w-4" />
                                {t.watchVideo}
                              </Button>
                            ) : (
                              <Badge variant="secondary" className="ml-4">
                                {t.comingSoon}
                              </Badge>
                            )}
                          </div>
                        </CardHeader>

                        {video.tags && video.tags.length > 0 && (
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {video.tags.map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground" data-testid="no-videos-message">
                          {t.noVideos}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {t.comingSoon}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}

        <div className="mt-12 p-6 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">
            {(language.startsWith('pt') || language === 'pt-BR') ? '📹 Vídeos em Produção' :
             language === 'en' || language === 'de' ? '📹 Videos in Production' :
             language === 'es' ? '📹 Videos en Producción' :
             language === 'zh' ? '📹 视频制作中' :
             '📹 Vidéos en Production'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {(language.startsWith('pt') || language === 'pt-BR') ? 'Os roteiros completos para Google Veo 3.1 estão prontos! Os vídeos serão gravados e adicionados em breve. Enquanto isso, você pode usar todas as ferramentas da plataforma.' :
             language === 'en' || language === 'de' ? 'Complete scripts for Google Veo 3.1 are ready! Videos will be recorded and added soon. Meanwhile, you can use all platform tools.' :
             language === 'es' ? '¡Los guiones completos para Google Veo 3.1 están listos! Los videos se grabarán y agregarán pronto. Mientras tanto, puedes usar todas las herramientas de la plataforma.' :
             language === 'zh' ? 'Google Veo 3.1 的完整脚本已经准备好！视频将很快录制并添加。在此期间，你可以正常使用平台的所有工具。' :
             'Les scripts complets pour Google Veo 3.1 sont prêts ! Les vidéos seront enregistrées et ajoutées bientôt. En attendant, vous pouvez utiliser tous les outils de la plateforme.'}
          </p>
        </div>
      </div>
  );
}
