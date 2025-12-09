import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface NextStepCardProps {
  title: string;
  description: string;
  estimatedTime?: string;
  action: {
    label: string;
    onClick: () => void;
  };
  tips?: string[];
  className?: string;
}

export function NextStepCard({ 
  title, 
  description, 
  estimatedTime, 
  action, 
  tips,
  className 
}: NextStepCardProps) {
  const { t } = useLanguage();
  return (
    <Card className={`border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg">{t("dashboard.nextStep.header")}</CardTitle>
          </div>
          {estimatedTime && (
            <Badge variant="secondary" className="bg-white/80">
              <Clock className="w-3 h-3 mr-1" />
              {estimatedTime}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>

        {tips && tips.length > 0 && (
          <div className="bg-white/70 rounded-lg p-4 border border-blue-200">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              {t("dashboard.nextStep.tips.title")}
            </p>
            <ul className="space-y-1">
              {tips.map((tip, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button 
          onClick={action.onClick}
          size="lg"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          data-testid="button-next-step-action"
        >
          {action.label}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  );
}
