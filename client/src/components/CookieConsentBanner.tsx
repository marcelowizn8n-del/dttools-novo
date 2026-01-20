import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  getCookieConsent,
  onOpenCookiePreferences,
  setCookieConsent,
} from "@/lib/cookieConsent";

export default function CookieConsentBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const existing = useMemo(() => getCookieConsent(), []);

  const [analytics, setAnalytics] = useState<boolean>(existing?.analytics ?? false);
  const [marketing, setMarketing] = useState<boolean>(existing?.marketing ?? false);

  useEffect(() => {
    const consent = getCookieConsent();
    if (!consent) {
      setVisible(true);
    }

    const unsubscribe = onOpenCookiePreferences(() => {
      const current = getCookieConsent();
      setAnalytics(current?.analytics ?? false);
      setMarketing(current?.marketing ?? false);
      setPreferencesOpen(true);
    });

    return () => unsubscribe();
  }, []);

  const acceptAll = () => {
    setCookieConsent({ essential: true, analytics: true, marketing: true });
    setVisible(false);
  };

  const rejectNonEssential = () => {
    setCookieConsent({ essential: true, analytics: false, marketing: false });
    setVisible(false);
  };

  const savePreferences = () => {
    setCookieConsent({ essential: true, analytics, marketing });
    setVisible(false);
    setPreferencesOpen(false);
  };

  return (
    <>
      {visible ? (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 sm:px-4 sm:pb-4">
          <div className="container mx-auto max-w-4xl">
            <Card>
              <CardContent className="p-4 sm:p-5">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">
                      {t("privacy.cookies.banner.title")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t("privacy.cookies.banner.description")}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <Button type="button" variant="outline" onClick={rejectNonEssential}>
                      {t("privacy.cookies.reject")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setPreferencesOpen(true)}
                    >
                      {t("privacy.cookies.manage")}
                    </Button>
                    <Button type="button" onClick={acceptAll}>
                      {t("privacy.cookies.accept")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}

      <Dialog open={preferencesOpen} onOpenChange={setPreferencesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("privacy.cookies.preferences.title")}</DialogTitle>
            <DialogDescription>{t("privacy.cookies.preferences.description")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <Label>{t("privacy.cookies.categories.essential")}</Label>
                <div className="text-sm text-muted-foreground">
                  {t("privacy.cookies.categories.essential.desc")}
                </div>
              </div>
              <Switch checked={true} disabled={true} />
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <Label>{t("privacy.cookies.categories.analytics")}</Label>
                <div className="text-sm text-muted-foreground">
                  {t("privacy.cookies.categories.analytics.desc")}
                </div>
              </div>
              <Switch checked={analytics} onCheckedChange={setAnalytics} />
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <Label>{t("privacy.cookies.categories.marketing")}</Label>
                <div className="text-sm text-muted-foreground">
                  {t("privacy.cookies.categories.marketing.desc")}
                </div>
              </div>
              <Switch checked={marketing} onCheckedChange={setMarketing} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setPreferencesOpen(false)}>
              {t("privacy.cookies.cancel")}
            </Button>
            <Button type="button" onClick={savePreferences}>
              {t("privacy.cookies.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
