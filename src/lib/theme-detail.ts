/**
 * Key for storing the user's theme preference before entering a case study detail page.
 * Detail pages force dark mode; we restore this saved value when the user leaves.
 */
export const THEME_BEFORE_DETAIL_KEY = "portfolio-theme-before-detail";

export function getStoredThemeBeforeDetail(): "light" | "dark" | null {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem(THEME_BEFORE_DETAIL_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return null;
}

export function setStoredThemeBeforeDetail(theme: "light" | "dark"): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(THEME_BEFORE_DETAIL_KEY, theme);
}

export function clearStoredThemeBeforeDetail(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(THEME_BEFORE_DETAIL_KEY);
}
