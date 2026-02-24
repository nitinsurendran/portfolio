"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import { archiveProjects } from "@/data/projects";
import { gsap } from "gsap";

export function MoreProjects() {
  const [showArchives, setShowArchives] = useState(false);
  const archiveSectionRef = useRef<HTMLDivElement>(null);
  const archiveCardsRef = useRef<HTMLDivElement>(null);

  // Trigger reveal animations for archive cards after they're mounted
  useEffect(() => {
    if (!showArchives || !archiveCardsRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      // Set all cards to visible immediately
      const cards = archiveCardsRef.current.querySelectorAll<HTMLElement>(
        "[data-reveal-item='project-card']"
      );
      gsap.set(cards, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      });
      return;
    }

    // Get all archive project cards
    const cards = Array.from(
      archiveCardsRef.current.querySelectorAll<HTMLElement>(
        "[data-reveal-item='project-card']"
      )
    );

    if (cards.length === 0) return;

    // Set initial hidden state
    gsap.set(cards, {
      opacity: 0,
      y: 10,
      filter: "blur(6px)",
      willChange: "transform, opacity, filter",
    });

    // Animate cards in with stagger (same as main project cards)
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.85,
      ease: "power3.out",
      delay: 0.12,
      stagger: 0.12,
      clearProps: "willChange",
    });

    // Cleanup function
    return () => {
      // No cleanup needed for manual animations
    };
  }, [showArchives]);

  const handleClick = () => {
    setShowArchives(true);
  };

  return (
    <section className={showArchives ? "pb-16 pt-0" : "py-16"} data-reveal="archives" ref={archiveSectionRef}>
      <div>
        {!showArchives ? (
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="rounded-full gap-2"
              onClick={handleClick}
            >
              <Archive className="h-4 w-4" aria-hidden="true" />
              <span>From the archives</span>
            </Button>
          </div>
        ) : (
          // Archive cards list - same structure as SelectProjects
          // When shown, use negative margin to match spacing between cards (12px gap + 10px padding each side = 32px)
          // SelectProjects has pb-16 (64px), so we need -mt-[52px] to compensate: 64px - 12px = 52px
          <div
            ref={archiveCardsRef}
            className="flex flex-col gap-[12px] -mt-[52px]"
            data-reveal-group="project-cards"
          >
            {archiveProjects.map((project) => (
              <div
                key={project.slug}
                className="py-[10px]"
                data-reveal-item="project-card"
              >
                {/* MCP: ProjectList wrapper has py-[10px] */}
                <ProjectCard
                  slug={project.slug}
                  title={project.title}
                  description={project.description}
                  badges={project.badges}
                  year={project.year}
                  videoSrc={project.media?.type === "video" ? project.media.src : undefined}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

