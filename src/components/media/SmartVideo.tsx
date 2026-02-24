"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { prefersLowBandwidth } from "@/lib/media/bandwidth";

type SmartVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  aspectRatio?: string;
  priority?: boolean;
  alt?: string;
  /** Use "contain" to show full video without cropping; "cover" fills frame (default). */
  objectFit?: "contain" | "cover";
  /** Slight zoom (e.g. 1.05) so edges/bottom are cropped; frame overflow-hidden clips. */
  scale?: number;
};

// Set to true only when debugging video frame clipping (red/green/blue outlines, hotpink bg).
const DEBUG_VIDEO_FRAME = false;

/** Detect reduced motion (avoids mounting video logic when true). */
function usePrefersReducedMotion(): boolean {
  const [value, setValue] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setValue(mq.matches);
    const fn = () => setValue(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return value;
}

/** Poster-only mode: reduced motion OR low bandwidth (saveData / 2g / 3g). No video mount. */
function usePosterOnlyMode(): boolean {
  const [value, setValue] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(true);
      return;
    }
    if (prefersLowBandwidth()) setValue(true);
  }, []);
  return value;
}

/**
 * Lazy-mounts video when near viewport. Once mounted, never unmounts (hasMounted ref).
 * Poster via next/image only — do NOT set poster on <video> to avoid double fetch.
 * Respects prefers-reduced-motion and network-aware (saveData / 2g / 3g) → poster-only.
 */
export function SmartVideo({
  src,
  poster,
  className = "",
  aspectRatio = "960/623",
  priority = false,
  alt = "",
  objectFit = "cover",
  scale,
}: SmartVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);
  const [isNearViewport, setIsNearViewport] = useState(priority);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const prefersReducedMotion = usePrefersReducedMotion();
  const posterOnlyMode = usePosterOnlyMode();
  const posterOnly = prefersReducedMotion || posterOnlyMode;
  const showVideoBlock = isNearViewport || hasMountedRef.current;

  const effectiveObjectFit: "contain" | "cover" =
    DEBUG_VIDEO_FRAME ? "cover" : objectFit;
  const effectiveScale = DEBUG_VIDEO_FRAME ? undefined : scale;

  // Lazy mount: once in viewport, set true; hasMountedRef ensures we never unmount video again (hooks run unconditionally)
  useEffect(() => {
    if (posterOnly) return;
    if (priority) {
      hasMountedRef.current = true;
      return;
    }
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsNearViewport(true);
          hasMountedRef.current = true;
        }
      },
      { rootMargin: "100px", threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [priority, posterOnly]);

  // Play/pause when in/out of view (only when video block is shown; hooks run unconditionally)
  useEffect(() => {
    if (!showVideoBlock || posterOnly) return;
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          video.play().catch(() => {});
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [showVideoBlock, posterOnly]);

  // Poster-only: reduced motion or low bandwidth — no video element
  if (posterOnly && poster) {
    return (
      <div
        ref={containerRef}
        className={`relative overflow-hidden rounded-[12px] bg-background ${className}`}
        style={{
          aspectRatio,
          borderRadius: 12,
          overflow: "hidden",
          contain: "paint",
          ...(DEBUG_VIDEO_FRAME
            ? { outline: "4px solid red", background: "hotpink" }
            : {}),
        }}
      >
        <Image
          src={poster}
          alt={alt}
          fill
          className={
            effectiveObjectFit === "contain" ? "object-contain" : "object-cover"
          }
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 960px"
          priority={priority}
        />
      </div>
    );
  }
  if (posterOnly) {
    return (
      <div
        ref={containerRef}
        className={`relative overflow-hidden rounded-[12px] bg-muted ${className}`}
        style={{
          aspectRatio,
          borderRadius: 12,
          overflow: "hidden",
          contain: "paint",
          ...(DEBUG_VIDEO_FRAME
            ? { outline: "4px solid red", background: "hotpink" }
            : {}),
        }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 text-sm"
          aria-hidden
        >
          Video
        </div>
      </div>
    );
  }

  // Below viewport and never mounted: skeleton only (no poster fetch)
  if (!showVideoBlock) {
    return (
      <div
        ref={containerRef}
        className={`relative overflow-hidden rounded-[12px] bg-muted ${className}`}
        style={{
          aspectRatio,
          borderRadius: 12,
          overflow: "hidden",
          contain: "paint",
          ...(DEBUG_VIDEO_FRAME
            ? { outline: "4px solid red", background: "hotpink" }
            : {}),
        }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 text-sm"
          aria-hidden
        >
          Video
        </div>
      </div>
    );
  }

  // Near viewport or already mounted: render video once, never unmount. Poster via next/image only (no poster attr on video).
  // Single clipping root: this div establishes the rounded frame. Clipping is done here only (no border-radius on video).
  // contain: paint forces all descendants (including accelerated video) to be clipped to this element's border box.
  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-[12px] bg-background ${className}`}
      style={{
        aspectRatio,
        borderRadius: 12,
        overflow: "hidden",
        contain: "paint",
        ...(DEBUG_VIDEO_FRAME
          ? { outline: "4px solid red", background: "hotpink" }
          : {}),
      }}
    >
      {poster && (
        <span
          className={`absolute inset-0 block transition-opacity duration-300 ${
            isPlaying && !videoFailed ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          aria-hidden={isPlaying}
          style={DEBUG_VIDEO_FRAME ? { outline: "4px solid green" } : undefined}
        >
          <Image
            src={poster}
            alt={alt}
            fill
            className={
              effectiveObjectFit === "contain" ? "object-contain" : "object-cover"
            }
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 960px"
            priority={priority}
          />
        </span>
      )}
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        className={`absolute inset-0 h-full w-full ${
          effectiveObjectFit === "contain" ? "object-contain" : "object-cover"
        } outline-none ring-0 border-0`}
        style={{
          background: "transparent",
          ...(effectiveScale != null ? { transform: `scale(${effectiveScale})` } : {}),
          ...(DEBUG_VIDEO_FRAME ? { outline: "4px solid blue" } : {}),
        }}
        onError={() => setVideoFailed(true)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
}
