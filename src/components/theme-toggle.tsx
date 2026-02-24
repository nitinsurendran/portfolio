"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { animateThemeTransition } from "@/lib/gsap/theme-transition";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";
  const nextTheme = isDark ? "light" : "dark";

  const handleClick = () => {
    if (!mounted) return;
    animateThemeTransition({ onSwitch: () => setTheme(nextTheme) });
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-9 min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      onClick={handleClick}
      aria-label={label}
      title={label}
      disabled={!mounted}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
