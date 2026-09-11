import type { BioWoundLocale } from './content';

export type AnalyticsConsent = 'granted' | 'denied' | null;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const CONSENT_KEY = 'inocare-analytics-consent';
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();

export function initialiseAnalytics(consent: AnalyticsConsent) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };
  window.gtag('consent', 'default', {
    analytics_storage: consent === 'granted' ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  if (consent === 'granted') loadAnalytics();
}

export function loadAnalytics() {
  if (!GA_ID || document.querySelector(`script[data-ga-id="${GA_ID}"]`)) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.dataset.gaId = GA_ID;
  document.head.appendChild(script);
  window.gtag?.('js', new Date());
  window.gtag?.('config', GA_ID, { anonymize_ip: true, page_path: location.pathname });
}

export function setAnalyticsConsent(value: Exclude<AnalyticsConsent, null>) {
  localStorage.setItem(CONSENT_KEY, value);
  window.gtag?.('consent', 'update', { analytics_storage: value });
  if (value === 'granted') loadAnalytics();
}

export function track(event: string, params: Record<string, string | number | boolean | BioWoundLocale>) {
  window.gtag?.('event', event, { page: 'biowound', ...params });
}

