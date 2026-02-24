"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

export function CursorLayer() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const spotlightX = useRef<((value: number) => void) | null>(null);
  const spotlightY = useRef<((value: number) => void) | null>(null);
  const activeRegionRef = useRef<HTMLElement | null>(null);
  const isVisibleRef = useRef<boolean>(false);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Desktop-only guard: only enable on devices with hover and fine pointer
    const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!supportsHover) return;

    const spotlight = spotlightRef.current;
    if (!spotlight) return;

    // Initialize quickTo for smooth cursor following
    spotlightX.current = gsap.quickTo(spotlight, "x", { duration: 0.4, ease: "power3.out" });
    spotlightY.current = gsap.quickTo(spotlight, "y", { duration: 0.4, ease: "power3.out" });

    // Set initial hidden state (xPercent/yPercent centers the element)
    gsap.set(spotlight, { autoAlpha: 0, xPercent: -50, yPercent: -50, x: 0, y: 0 });

    // Show cursor
    const showCursor = (x: number, y: number) => {
      // Update position
      if (spotlightX.current && spotlightY.current) {
        spotlightX.current(x);
        spotlightY.current(y);
      }

      // Show if not already visible
      if (!isVisibleRef.current) {
        gsap.to(spotlight, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
        isVisibleRef.current = true;
      }
    };

    // Hide cursor
    const hideCursor = () => {
      if (isVisibleRef.current) {
        gsap.to(spotlight, {
          autoAlpha: 0,
          scale: 0.9,
          duration: 0.2,
          ease: "power2.out",
        });
        isVisibleRef.current = false;
      }
    };

    // Handle pointer move - region-based tracking (prevents jumpiness)
    const handlePointerMove = (e: PointerEvent) => {
      const el = e.target as Element | null;
      if (!el) return;

      const x = e.clientX;
      const y = e.clientY;

      const cardTarget = el.closest('[data-cursor="card"]') as HTMLElement | null;

      if (!cardTarget) {
        // Not hovering a card - hide cursor
        if (activeRegionRef.current !== null) {
          activeRegionRef.current = null;
          hideCursor();
        }
        return;
      }

      // If we're still in the same region, just update position (no re-animation)
      if (cardTarget === activeRegionRef.current) {
        // Update positions only
        if (spotlightX.current && spotlightY.current) {
          spotlightX.current(x);
          spotlightY.current(y);
        }
        return;
      }

      // Region changed - entered a new card region
      activeRegionRef.current = cardTarget;
      showCursor(x, y);
    };

    document.addEventListener("pointermove", handlePointerMove);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div
      ref={spotlightRef}
      className="fixed left-0 top-0 z-[9999] pointer-events-none w-[110px] h-[110px] rounded-full backdrop-blur-md"
      style={{
        background: "radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0) 70%)",
      }}
    />
  );
}

