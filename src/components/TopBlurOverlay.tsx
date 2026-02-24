"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function TopBlurOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const currentStateRef = useRef<boolean>(false); // Track if overlay is currently on

  useEffect(() => {
    const overlayEl = overlayRef.current;
    if (!overlayEl) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // Reduced motion: simple scroll listener, no animation
      const handleScroll = () => {
        const scrollY = window.scrollY;
        if (scrollY > 8) {
          overlayEl.style.opacity = "1";
        } else {
          overlayEl.style.opacity = "0";
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
        gsap.set(overlayEl, { opacity: 1 });
      } else {
        currentStateRef.current = false;
        gsap.set(overlayEl, { opacity: 0 });
      }
    }, overlayEl);

    // Scroll listener with GSAP animations
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const shouldBeOn = scrollY > 8;

      // Only animate if state changed
      if (shouldBeOn !== currentStateRef.current) {
        currentStateRef.current = shouldBeOn;

        if (shouldBeOn) {
          // Fade in
          gsap.to(overlayEl, {
            opacity: 1,
            duration: 0.45,
            ease: "power2.out",
            overwrite: "auto",
          });
        } else {
          // Fade out
          gsap.to(overlayEl, {
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
      id="top-blur-overlay"
      ref={overlayRef}
      aria-hidden="true"
      className="fixed top-0 left-0 w-full h-20 z-[9999] pointer-events-none opacity-0 backdrop-blur-xl bg-gradient-to-b from-slate-50/70 to-transparent border-b border-slate-200/20"
    />
  );
}

