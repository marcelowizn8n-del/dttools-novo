import { Info, Sparkles, Target, TrendingUp } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface WelcomeMessageProps {
  userName?: string;
  onDismiss?: () => void;
  className?: string;
}

export function WelcomeMessage({ userName, onDismiss, className }: WelcomeMessageProps) {
  const { t } = useLanguage();
  const title = userName
    ? t("dashboard.welcome.title", { name: userName })
    : t("dashboard.welcome.title.generic");

  return (
    <Card className={`border-l-4 border-l-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {title}! 👋
            </h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              {t("dashboard.welcome.intro")}
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Target className="w-3.5 h-3.5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {t("dashboard.welcome.section.what.title")}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t("dashboard.welcome.section.what.text")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {t("dashboard.welcome.section.how.title")}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t("dashboard.welcome.section.how.text")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {t("dashboard.welcome.section.gain.title")}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t("dashboard.welcome.section.gain.text")}
                  </p>
                </div>
              </div>
            </div>

            <Alert className="mt-4 bg-white/60 border-blue-300">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-gray-700">
                {t("dashboard.welcome.tip")}
              </AlertDescription>
            </Alert>

            {onDismiss && (
              <button
                onClick={onDismiss}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium underline"
                data-testid="button-dismiss-welcome"
              >
                {t("dashboard.welcome.dismiss")}
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
