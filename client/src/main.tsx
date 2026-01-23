// Build: 2025-10-15T01:50:00Z - Force cache invalidation
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import ScreenshotGenerator from "./utils/screenshot-generator";
import {
  isAnalyticsAllowed,
  isErrorReportingAllowed,
  onCookieConsentUpdated,
} from "./lib/cookieConsent";

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    Sentry?: any;
    __dttoolsGaLoaded?: boolean;
    __dttoolsSentryLoaded?: boolean;
  }
}

function loadScript(src: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.async = true;
    script.src = src;
    script.crossOrigin = "anonymous";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

function getEnv(name: string): string | undefined {
  return (import.meta.env as any)?.[name] as string | undefined;
}

function ensureGaLoaded() {
  const measurementId = getEnv("VITE_GA4_MEASUREMENT_ID");
  if (!measurementId) return;
  if (window.__dttoolsGaLoaded) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer!.push(arguments);
  };

  window.__dttoolsGaLoaded = true;

  loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`, "dttools-ga4")
    .then(() => {
      if (!window.gtag) return;
      window.gtag("js", new Date());
      window.gtag("config", measurementId, {
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      });
    })
    .catch((err) => {
      console.warn("GA4 load failed:", err);
    });
}

function enableGa() {
  const measurementId = getEnv("VITE_GA4_MEASUREMENT_ID");
  if (!measurementId) return;

  (window as any)[`ga-disable-${measurementId}`] = false;
  ensureGaLoaded();

  if (window.__dttoolsGaLoaded && window.gtag) {
    window.gtag("config", measurementId, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
  }
}

function disableGa() {
  const measurementId = getEnv("VITE_GA4_MEASUREMENT_ID");
  if (!measurementId) return;
  (window as any)[`ga-disable-${measurementId}`] = true;
}

function ensureSentryLoaded() {
  const dsn = getEnv("VITE_SENTRY_DSN");
  if (!dsn) return;
  if (window.__dttoolsSentryLoaded) return;

  window.__dttoolsSentryLoaded = true;

  loadScript("https://browser.sentry-cdn.com/7.120.0/bundle.tracing.min.js", "dttools-sentry")
    .then(() => {
      const Sentry = window.Sentry;
      if (!Sentry?.init) return;

      const environment = getEnv("VITE_SENTRY_ENVIRONMENT") || (import.meta.env.PROD ? "production" : "development");
      const release = getEnv("VITE_SENTRY_RELEASE");

      Sentry.init({
        dsn,
        environment,
        release,
        sendDefaultPii: false,
        tracesSampleRate: 0.05,
        beforeSend(event: any) {
          if (event?.user) delete event.user;
          return event;
        },
      });
    })
    .catch((err) => {
      console.warn("Sentry load failed:", err);
    });
}

function disableSentry() {
  try {
    const Sentry = window.Sentry;
    if (Sentry?.close) {
      Sentry.close(0);
    }
  } catch {
    // ignore
  }

  window.__dttoolsSentryLoaded = false;
}

function syncTelemetryWithConsent() {
  if (isAnalyticsAllowed()) {
    enableGa();
  } else {
    disableGa();
  }

  if (isErrorReportingAllowed()) {
    ensureSentryLoaded();
  } else {
    disableSentry();
  }
}

syncTelemetryWithConsent();
onCookieConsentUpdated(() => syncTelemetryWithConsent());

// Global error handling
window.onerror = (message, source, lineno, colno, error) => {
  console.error("Global Error:", {
    message,
    source,
    line: lineno,
    column: colno,
    error: error?.stack
  });
  
  // Log to monitoring service in production
  if (import.meta.env.PROD && isErrorReportingAllowed()) {
    // Send to analytics/monitoring service
    console.warn("Error logged for monitoring:", message);
  }
  
  return false; // Let default error handling continue
};

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error("Unhandled Promise Rejection:", {
    reason: event.reason,
    promise: event.promise
  });
  
  // Log to monitoring service in production
  if (import.meta.env.PROD && isErrorReportingAllowed()) {
    console.warn("Promise rejection logged for monitoring:", event.reason);
  }
  
  // Prevent default behavior only in production
  if (import.meta.env.PROD) {
    event.preventDefault();
  }
});

// Global screenshot functions available in any page - Simple version using html2canvas directly

// Simple screenshot function using html2canvas directly
//(window as any).captureFullPage = async (filename = 'dttools-page') => {
//  try {
//    console.log('🚀 Iniciando captura...');
    
    // Dynamic import of html2canvas
//    const html2canvas = (await import('html2canvas')).default;
    
    // Scroll to top
//    window.scrollTo(0, 0);
//    await new Promise(resolve => setTimeout(resolve, 1000));

//    const canvas = await html2canvas(document.body, {
//      useCORS: true,
//      allowTaint: true,
//      scale: 2,
//      backgroundColor: '#ffffff',
//      height: Math.max(
//        document.body.scrollHeight,
//        document.body.offsetHeight,
//        document.documentElement.clientHeight,
//        document.documentElement.scrollHeight,
//        document.documentElement.offsetHeight
//      )
//    });
    
    // Create download link
//    canvas.toBlob((blob) => {
//      if (blob) {
//        const url = URL.createObjectURL(blob);
//        const link = document.createElement('a');
//        link.href = url;
//        link.download = `dttools-${filename}.png`;
//        link.style.display = 'none';
//        document.body.appendChild(link);
//        link.click();
//        document.body.removeChild(link);
//        URL.revokeObjectURL(url);
//        console.log(`✅ Screenshot saved as: dttools-${filename}.png`);
//      }
//    }, 'image/png', 0.95);
    
//  } catch (error) {
//    console.error('❌ Error capturing screenshot:', error);
//  }
//};

// Simple section capture
//(window as any).captureSection = async (selector: string, filename = 'dttools-section') => {
//  try {
//    console.log(`🚀 Capturando seção: ${selector}`);
    
//    const html2canvas = (await import('html2canvas')).default;
//    const element = document.querySelector(selector) as HTMLElement;
    
//    if (!element) {
//      console.error(`❌ Element not found: ${selector}`);
//      return;
//    }

//    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
//    await new Promise(resolve => setTimeout(resolve, 1000));

//    const canvas = await html2canvas(element, {
//      useCORS: true,
//      allowTaint: true,
//      scale: 2,
//      backgroundColor: '#ffffff'
//    });
    
//    canvas.toBlob((blob) => {
//      if (blob) {
//        const url = URL.createObjectURL(blob);
//        const link = document.createElement('a');
//        link.href = url;
//        link.download = `dttools-${filename}.png`;
//        link.style.display = 'none';
//        document.body.appendChild(link);
//        link.click();
//        document.body.removeChild(link);
//        URL.revokeObjectURL(url);
//        console.log(`✅ Section screenshot saved as: dttools-${filename}.png`);
//      }
//    }, 'image/png', 0.95);
    
//  } catch (error) {
//    console.error('❌ Error capturing section:', error);
//  }
//};

// Quick capture functions for common sections
//(window as any).captureHero = () => (window as any).captureSection('section:first-child', 'hero');
//(window as any).captureFeatures = () => (window as any).captureSection('section:nth-child(3)', 'features');

// Helper to show available commands
//(window as any).showScreenshotHelp = () => {
//  console.log(`
//🎯 DTTOOLS SCREENSHOT COMMANDS:

//📸 FUNÇÕES DISPONÍVEIS:
//captureFullPage()                    - Captura página completa
//captureFullPage('nome-personalizado') - Captura com nome específico
//captureSection('seletor', 'nome')    - Captura elemento específico
//captureHero()                        - Captura hero section
//captureFeatures()                    - Captura seção de features

//💡 EXEMPLOS:
//captureFullPage('home-completa')
//captureHero()
//captureSection('.minha-classe', 'minha-secao')

//🔧 TESTE SIMPLES:
//captureFullPage('teste')
//  `);
//};

// Test function loading
//setTimeout(() => {
//  if (typeof (window as any).captureFullPage === 'function') {
//    console.log('✅ DTTools Screenshot System loaded successfully!');
//    console.log('📋 Type: showScreenshotHelp() for commands');
//  } else {
//    console.error('❌ Failed to load screenshot functions');
//  }
//}, 2000);

// Service Worker disabled - cleanup handled in index.html
// PWA features temporarily disabled until cache issues are resolved

// Clear cache functionality - triggered by ?clear-cache=true URL parameter
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('clear-cache') === 'true') {
  console.log('🧹 Limpando cache e Service Workers...');
  
  // Clear all caches
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => caches.delete(name));
      console.log('✅ Cache limpo!');
    });
  }
  
  // Unregister all service workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => registration.unregister());
      console.log('✅ Service Workers removidos!');
    });
  }
  
  // Clear localStorage and sessionStorage
  localStorage.clear();
  sessionStorage.clear();
  console.log('✅ Storage limpo!');
  
  // Show success message and redirect after 2 seconds
  document.body.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      font-family: system-ui, -apple-system, sans-serif;
      text-align: center;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    ">
      <div style="background: rgba(255,255,255,0.1); padding: 40px; border-radius: 20px; backdrop-filter: blur(10px);">
        <h1 style="font-size: 3em; margin: 0 0 20px 0;">✅</h1>
        <h2 style="margin: 0 0 10px 0;">Cache Limpo com Sucesso!</h2>
        <p style="opacity: 0.9; margin: 0 0 20px 0;">
          Todo o cache, Service Workers e dados locais foram removidos.
        </p>
        <p style="opacity: 0.7; font-size: 0.9em;">
          Redirecionando para o DTTools em 2 segundos...
        </p>
      </div>
    </div>
  `;
  
  setTimeout(() => {
    window.location.href = '/';
  }, 2000);
  
} else {
  createRoot(document.getElementById("root")!).render(<App />);
}
// Force rebuild Tue Nov 11 00:25:48 -03 2025
