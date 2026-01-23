export type CookieConsent = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  errorReporting: boolean;
  updatedAt: string;
};

const STORAGE_KEY = "dttools-cookie-consent";
const OPEN_PREFERENCES_EVENT = "dttools:open-cookie-preferences";
const CONSENT_UPDATED_EVENT = "dttools:cookie-consent-updated";

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookieConsent>;

    if (typeof parsed !== "object" || parsed === null) return null;
    if (parsed.essential !== true) return null;
    if (typeof parsed.analytics !== "boolean") return null;
    if (typeof parsed.marketing !== "boolean") return null;
    const errorReporting =
      typeof (parsed as any).errorReporting === "boolean" ? (parsed as any).errorReporting : true;
    if (typeof parsed.updatedAt !== "string") return null;

    return {
      ...(parsed as CookieConsent),
      errorReporting,
    };
  } catch {
    return null;
  }
}

export function setCookieConsent(input: Omit<CookieConsent, "updatedAt">): CookieConsent {
  const consent: CookieConsent = {
    ...input,
    essential: true,
    errorReporting: input.errorReporting ?? true,
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    window.dispatchEvent(new Event(CONSENT_UPDATED_EVENT));
  }

  return consent;
}

export function clearCookieConsent() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(CONSENT_UPDATED_EVENT));
}

export function openCookiePreferences() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
}

export function onOpenCookiePreferences(handler: () => void) {
  if (typeof window === "undefined") return () => {};

  const listener = () => handler();
  window.addEventListener(OPEN_PREFERENCES_EVENT, listener);
  return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, listener);
}

export function onCookieConsentUpdated(handler: () => void) {
  if (typeof window === "undefined") return () => {};

  const listener = () => handler();
  window.addEventListener(CONSENT_UPDATED_EVENT, listener);
  return () => window.removeEventListener(CONSENT_UPDATED_EVENT, listener);
}

export function isAnalyticsAllowed(): boolean {
  const consent = getCookieConsent();
  return !!consent?.analytics;
}

export function isMarketingAllowed(): boolean {
  const consent = getCookieConsent();
  return !!consent?.marketing;
}

export function isErrorReportingAllowed(): boolean {
  const consent = getCookieConsent();
  return consent ? consent.errorReporting : true;
}
