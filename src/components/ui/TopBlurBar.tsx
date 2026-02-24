"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type TopBlurBarProps = {
  /** Height of the blur bar. Defaults to 140px to match header area. */
  height?: string;
};

export function TopBlurBar({ height = "h-[140px]" }: TopBlurBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const currentStateRef = useRef<boolean>(false); // Track if overlay is currently on

  useEffect(() => {
    const barEl = barRef.current;
    if (!barEl) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // Reduced motion: simple scroll listener, no animation
      const handleScroll = () => {
        const scrollY = window.scrollY;
        if (scrollY > 8) {
          barEl.style.opacity = "1";
        } else {
          barEl.style.opacity = "0";
        }
      };

      // Set initial state
      handleScroll();

      window.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }

    // Normal motion: use GSAP with scroll listener
    const ctx = gsap.context(() => {
      // Set initial state
      const initialScrollY = window.scrollY;
      if (initialScrollY > 8) {
        currentStateRef.current = true;
        gsap.set(barEl, { opacity: 1 });
      } else {
        currentStateRef.current = false;
        gsap.set(barEl, { opacity: 0 });
      }
    }, barEl);

    // Scroll listener with GSAP animations
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const shouldBeOn = scrollY > 8;

      // Only animate if state changed
      if (shouldBeOn !== currentStateRef.current) {
        currentStateRef.current = shouldBeOn;

        if (shouldBeOn) {
          // Fade in
          gsap.to(barEl, {
            opacity: 1,
            duration: 0.45,
            ease: "power2.out",
            overwrite: "auto",
          });
        } else {
          // Fade out
          gsap.to(barEl, {
            opacity: 0,
            duration: 0.25,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      ctx.revert();
    };
  }, []);

  return (
    <div
      id="top-blur-bar"
      ref={barRef}
      aria-hidden="true"
      className={`fixed top-0 left-0 right-0 w-full ${height} z-[9999] pointer-events-none opacity-0 bg-white/14 dark:bg-black/14 backdrop-blur-lg`}
      style={{
        maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
      }}
    />
  );
}

