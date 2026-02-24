"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

export function Header() {
  const nameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!nameRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // Set final styles immediately without animation
      gsap.set(nameRef.current, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      });
      return;
    }

    // Create GSAP context for cleanup
    const ctx = gsap.context(() => {
      // Animate from initial state to final state
      // Calm, editorial reveal: slower, more intentional timing
      gsap.fromTo(
        nameRef.current,
        {
          opacity: 0,
          y: 6,
          filter: "blur(6px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          delay: 0.3,
        }
      );
    });

    // Cleanup on unmount
    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <header className="py-[10px]">
      {/* MCP: Header has py-[10px] */}
      <div
        ref={nameRef}
        className="font-sans text-[48px] font-semibold leading-[48px] tracking-normal"
        style={{
          willChange: "transform, opacity, filter",
          transform: "translateY(6px)",
          opacity: 0,
          filter: "blur(6px)",
        }}
      >
        {/* MCP: text-5xl (48px), semibold (600), leading-12 (48px), tracking-normal (0px) */}
        {/* Initial styles set inline to prevent flash before GSAP runs */}
        Nitin Surendran
      </div>
      {/* TODO: add bottom divider only if present in Figma */}
    </header>
  );
}

