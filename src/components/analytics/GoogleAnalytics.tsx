"use client";

import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GA_DEBUG = process.env.NEXT_PUBLIC_GA_DEBUG === "true";
const isProduction = process.env.NODE_ENV === "production";
const shouldLoad = (isProduction || GA_DEBUG) && GA_ID && GA_ID.trim() !== "";

/**
 * Injects GA4 via gtag.js. Renders only when:
 * - NODE_ENV is production (or NEXT_PUBLIC_GA_DEBUG=true), and
 * - NEXT_PUBLIC_GA_ID is set.
 * Uses send_page_view: false so SPA pageviews are sent by AnalyticsPageView.
 */
export function GoogleAnalytics() {
  if (!shouldLoad || !GA_ID) return null;

  return (
    <>
      <Script
        id="ga-inline"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { anonymize_ip: true, send_page_view: false });
          `,
        }}
      />
      <Script
        id="ga-script"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
