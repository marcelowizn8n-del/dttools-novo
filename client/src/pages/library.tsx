import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Book, Search, Calendar, User, Lightbulb, Box, TestTube, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import type { Article } from "@shared/schema";

// Helper to get translated article content
function getTranslatedArticle(article: Article, language: Language) {
  const langMap: Record<Language, { title: string | null; description: string | null; content: string | null }> = {
    "pt-BR": { title: article.title, description: article.description, content: article.content },
    "en": { title: article.titleEn, description: article.descriptionEn, content: article.contentEn },
    "es": { title: article.titleEs, description: article.descriptionEs, content: article.contentEs },
    "fr": { title: article.titleFr, description: article.descriptionFr, content: article.contentFr },
  };

  const translation = langMap[language];
  
  return {
    title: translation.title || article.title,
    description: translation.description || article.description,
    content: translation.content || article.content,
  };
}

const categories = [
  { id: "all", labelKey: "library.all", icon: BookOpen, descriptionKey: "library.all.desc" },
  { id: "empathize", labelKey: "library.category.empathize", icon: Book, descriptionKey: "library.category.empathize.desc" },
  { id: "define", labelKey: "library.category.define", icon: Search, descriptionKey: "library.category.define.desc" },
  { id: "ideate", labelKey: "library.category.ideate", icon: Lightbulb, descriptionKey: "library.category.ideate.desc" },
  { id: "prototype", labelKey: "library.category.prototype", icon: Box, descriptionKey: "library.category.prototype.desc" },
  { id: "test", labelKey: "library.category.test", icon: TestTube, descriptionKey: "library.category.test.desc" },
];

function ArticleCard({ article }: { article: Article }) {
  const { language, t } = useLanguage();
  const translated = getTranslatedArticle(article, language);
  
  const formatDate = (date: Date | string | null) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    }).format(new Date(date));
  };

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? t(cat.labelKey) : category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      empathize: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      define: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      ideate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      prototype: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      test: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <Badge className={getCategoryColor(article.category)} data-testid={`badge-category-${article.id}`}>
            {getCategoryLabel(article.category)}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-3 w-3" />
            {formatDate(article.createdAt)}
          </div>
        </div>
        <CardTitle className="line-clamp-2 text-lg leading-relaxed font-semibold" data-testid={`title-${article.id}`}>
          {translated.title}
        </CardTitle>
        {translated.description && (
          <CardDescription className="line-clamp-3" data-testid={`description-${article.id}`}>
            {translated.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <User className="mr-1 h-3 w-3" />
          <span data-testid={`author-${article.id}`}>{article.author}</span>
        </div>
        {article.tags && Array.isArray(article.tags) && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {article.tags.slice(0, 3).map((tag: string, index: number) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs"
                data-testid={`tag-${article.id}-${index}`}
              >
                {tag}
              </Badge>
            ))}
            {article.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{article.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link href={`/library/article/${article.id}`} className="w-full">
          <Button className="w-full" data-testid={`button-read-${article.id}`}>
            {t("library.read.article")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function ArticleCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-3">
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex gap-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-14" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { language, t } = useLanguage();

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const filteredArticles = articles.filter(article => {
    const translated = getTranslatedArticle(article, language);
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = 
      translated.title.toLowerCase().includes(searchLower) ||
      translated.description?.toLowerCase().includes(searchLower) ||
      article.author.toLowerCase().includes(searchLower);
    
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getArticleCount = (categoryId: string) => {
    if (categoryId === "all") return articles.length;
    return articles.filter(article => article.category === categoryId).length;
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4" data-testid="page-title">
            {t("library.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="page-description">
            {t("library.subtitle")}
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("library.search.placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
        </div>

        {/* Categories and Articles */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2" data-testid="tabs-categories">
            {categories.map((category) => {
              const Icon = category.icon;
              const count = getArticleCount(category.id);
              
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex flex-col items-center gap-1 p-2 sm:p-3 h-auto text-xs sm:text-sm"
                  data-testid={`tab-${category.id}`}
                >
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs font-medium whitespace-nowrap">{t(category.labelKey)}</span>
                  <Badge variant="secondary" className="text-xs">
                    {count}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-6">
              {/* Category description */}
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2" data-testid={`category-title-${category.id}`}>
                  {t(category.labelKey)}
                </h2>
                <p className="text-muted-foreground" data-testid={`category-description-${category.id}`}>
                  {t(category.descriptionKey)}
                </p>
                <Separator className="mt-4" />
              </div>

              {/* Articles grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <ArticleCardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" data-testid="articles-grid">
                  {filteredArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2" data-testid="no-articles-title">
                    {t("library.no.articles")}
                  </h3>
                  <p className="text-muted-foreground" data-testid="no-articles-description">
                    {searchTerm 
                      ? t("library.no.match", { term: searchTerm })
                      : t("library.no.articles.category")
                    }
                  </p>
                  {searchTerm && (
                    <Button
                      variant="outline"
                      onClick={() => setSearchTerm("")}
                      className="mt-4"
                      data-testid="button-clear-search"
                    >
                      {t("library.clear.search")}
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
