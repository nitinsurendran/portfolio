"use client";

import { useLayoutEffect } from "react";
import { useTheme } from "next-themes";
import {
  getStoredThemeBeforeDetail,
  clearStoredThemeBeforeDetail,
} from "@/lib/theme-detail";

/**
 * Project detail pages load in dark mode by default.
 * Restore the user's previous theme when they leave any project page.
 */
export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setTheme } = useTheme();

  useLayoutEffect(() => {
    setTheme("dark");
    return () => {
      const restore = getStoredThemeBeforeDetail();
      clearStoredThemeBeforeDetail();
      setTheme(restore ?? "light");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
