"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useProjectMediaBase } from "@/contexts/ProjectMediaBaseContext";

function joinPath(base: string, relative: string): string {
  const cleaned = `${base}/${relative}`.replace(/\/+/g, "/");
  return cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
}

type BeforeAfterMediaSliderProps = {
  beforeSrc: string;
  beforeImageVersion?: string;
  afterVideoSrc: string;
  posterSrc?: string;
  beforeAlt?: string;
  defaultPosition?: number;
  width?: number;
  className?: string;
};

const KEYBOARD_STEP = 2;
const KEYBOARD_STEP_LARGE = 10;

export function BeforeAfterMediaSlider({
  beforeSrc,
  beforeImageVersion,
  afterVideoSrc,
  posterSrc,
  beforeAlt = "Before: earlier map or interface state",
  defaultPosition = 44,
  width = 960,
  className,
}: BeforeAfterMediaSliderProps) {
  const basePath = useProjectMediaBase();
  const beforeFull = joinPath(basePath, beforeSrc) + (beforeImageVersion ? `?v=${beforeImageVersion}` : "");
  const afterVideoFull = joinPath(basePath, afterVideoSrc);
  const posterFull = posterSrc ? joinPath(basePath, posterSrc) : undefined;

  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const clamp = useCallback((v: number) => Math.min(100, Math.max(0, v)), []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const updatePositionFromClientX = useCallback(
    (clientX: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = (x / rect.width) * 100;
      setPosition(clamp(pct));
    },
    [clamp]
  );

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => updatePositionFromClientX(e.clientX);
    const onUp = () => setIsDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDragging, updatePositionFromClientX]);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      if (e.touches.length) updatePositionFromClientX(e.touches[0].clientX);
    },
    [updatePositionFromClientX]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const step = e.shiftKey ? KEYBOARD_STEP_LARGE : KEYBOARD_STEP;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPosition((p) => clamp(p - step));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setPosition((p) => clamp(p + step));
      }
    },
    [clamp]
  );

  const shouldAutoplay = !reduceMotion;

  // Entire slider background #EFEFEF (before + after) so letterbox/corners match.
  return (
    <div
      data-reveal="imageLarge"
      className={cn("flex gap-6 md:gap-[53px] items-start py-6 md:py-8 relative", className)}
    >
      <div
        ref={containerRef}
        className="w-full max-w-full relative shrink-0 overflow-hidden rounded-xl min-w-0 select-none touch-none bg-[#EFEFEF]"
        style={{ maxWidth: width, aspectRatio: "960/623" }}
      >
        {/* Equal padding on all sides for both before and after */}
        <div className="absolute inset-6 overflow-hidden rounded-lg bg-[#EFEFEF]">
          <div className="absolute inset-0 overflow-hidden rounded-[inherit] bg-[#EFEFEF]">
            <video
              ref={videoRef}
              src={afterVideoFull}
              poster={posterFull}
              playsInline
              muted
              loop
              preload="metadata"
              autoPlay={shouldAutoplay}
              aria-label="After map walkthrough video"
              className="absolute inset-0 w-full h-full object-contain block rounded-[inherit]"
              style={{ backgroundColor: "#EFEFEF" }}
            />
          </div>
          <div
            className="absolute inset-0 overflow-hidden rounded-[inherit] bg-[#EFEFEF]"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
          {beforeImageVersion ? (
            <img
              src={beforeFull}
              alt={beforeAlt}
              className="absolute inset-0 w-full h-full object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 960px"
            />
          ) : (
            <Image
              src={beforeFull}
              alt={beforeAlt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 960px"
            />
          )}
          </div>
        </div>

        <div
          role="slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          aria-label="Before and after comparison"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => setIsDragging(false)}
          className="absolute top-0 bottom-0 w-1 cursor-ew-resize z-10 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background touch-none"
          style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        >
          <div className="absolute inset-y-0 w-px bg-white/90 shadow-sm" />
          <div className="absolute w-10 h-10 rounded-full bg-background border-2 border-border shadow-md flex items-center justify-center">
            <div className="flex gap-0.5">
              <span className="w-1 h-3 rounded-sm bg-muted-foreground/70" />
              <span className="w-1 h-3 rounded-sm bg-muted-foreground/70" />
            </div>
          </div>
        </div>

        <span
          className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-medium bg-background/90 text-foreground border border-border shadow-sm"
          aria-hidden
        >
          Before
        </span>
        <span
          className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-medium bg-background/90 text-foreground border border-border shadow-sm"
          aria-hidden
        >
          After
        </span>
      </div>
    </div>
  );
}
