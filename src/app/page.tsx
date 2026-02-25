"use client";

import { useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { Description } from "../sections/home/Description";
import { Header } from "../sections/home/Header";
import { Intro } from "../sections/home/Intro";
import { SelectProjects } from "../sections/home/SelectProjects";
import Container from "../components/layout/Container";
import { initReveal } from "../lib/gsap/reveal";

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { setTheme, resolvedTheme } = useTheme();

  // Default to light only when theme is still "system" (no user choice yet).
  // Do not overwrite a deliberate light/dark toggle.
  useEffect(() => {
    if (resolvedTheme === "system") setTheme("light");
  }, [resolvedTheme, setTheme]);

  // Defer GSAP reveal until after first paint; skip if no [data-reveal] elements (perf)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let cleanup: (() => void) | undefined;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (root.querySelectorAll("[data-reveal]").length === 0) return;
        cleanup = initReveal(root);
      });
    });
    return () => {
      cancelAnimationFrame(id);
      cleanup?.();
    };
  }, []);

  return (
    <main className="pt-[144px] flex flex-col gap-3 min-w-0">
      {/* MCP: Homepage frame has pt-[144px] (gap-36) and gap-[12px] (gap-3) between children */}
      <div ref={rootRef}>
        <Container>
          <Header />
          <Intro />
          <Description />
          <SelectProjects />
          {/* Collabs and Footer are rendered inside each tab (Work + Experiments) so they appear in both */}
        </Container>
      </div>
    </main>
  );
}
