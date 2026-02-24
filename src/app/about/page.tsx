"use client";

import { useRef, useEffect } from "react";
import Container from "@/components/layout/Container";
import { initReveal } from "@/lib/gsap/reveal";
import { BackNavigation } from "@/sections/project-details/rotera/BackNavigation";
import { Footer } from "@/sections/home/Footer";
import { AboutIntro } from "@/sections/about/AboutIntro";
import { AboutWorkHistory } from "@/sections/about/AboutWorkHistory";

export default function AboutPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const cleanup = initReveal(rootRef.current);
    return cleanup;
  }, []);

  return (
    <main
      className="pt-[144px] pb-0 relative min-w-0 flex flex-col items-center"
      ref={rootRef}
    >
      <BackNavigation />
      <Container className="w-full">
        {/* Two halves: left = name, photo, content; right = work history. Center-aligned via Container, same padding as site. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:gap-x-16 py-6 md:py-8 w-full min-w-0 items-start">
          <div className="min-w-0 w-full">
            <AboutIntro />
          </div>
          {/* Top padding aligns first work entry with top of profile image (name height + gap) */}
          <div className="min-w-0 w-full lg:pt-[3.75rem]">
            <AboutWorkHistory />
          </div>
        </div>
        <div className="h-[37px]" />
        <div className="h-[37px]" />
        <div className="h-[37px]" />
        <Footer variant="default" />
        <Footer variant="alt" />
      </Container>
    </main>
  );
}
