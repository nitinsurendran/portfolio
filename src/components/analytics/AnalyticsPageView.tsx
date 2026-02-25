"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Sends a page_view event on client-side route change (App Router).
 * Uses pathname only (no search params) to avoid useSearchParams Suspense requirement.
 * No-ops if NEXT_PUBLIC_GA_ID is missing; safe in SSR.
 */
export function AnalyticsPageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (!GA_ID?.trim()) return;

    const send = () => {
      if (typeof window === "undefined" || !window.gtag) return false;
      const pagePath = pathname ?? window.location.pathname;
      const search = typeof window !== "undefined" ? window.location.search : "";
      window.gtag("event", "page_view", {
        page_path: search ? `${pagePath}${search}` : pagePath,
        page_title: typeof document !== "undefined" ? document.title : "",
      });
      return true;
    };

    if (send()) return;
    const t = setTimeout(() => { send(); }, 150);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
