/**
 * Google Analytics gtag.js types for window.dataLayer and window.gtag.
 * Used by GA4 integration; no SSR usage.
 */
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export {};
