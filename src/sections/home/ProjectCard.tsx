"use client";

import { Activity, ArrowRight, Clock, Cuboid, Cpu, FlaskConical, Hand, Layers, Box, Radio, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ComponentType, useRef, useEffect, useLayoutEffect, useState } from "react";
import { gsap } from "gsap";
import { useTheme } from "next-themes";
import { setStoredThemeBeforeDetail } from "@/lib/theme-detail";
import { prefersLowBandwidth, shouldUseVideoThumb } from "@/lib/media/bandwidth";

type BadgeItem = {
  label: string;
  icon?: string;
};

// Icon map: string identifier -> Lucide icon component
const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  activity: Activity,
  clock: Clock,
  sparkles: Sparkles,
  cuboid: Cuboid,
  layers: Layers,
  cpu: Cpu,
  hand: Hand,
  box: Box,
  radio: Radio,
  flaskConical: FlaskConical,
};

type ProjectCardProps = {
  slug: string;
  title: string;
  description: string;
  badges: BadgeItem[];
  /** Optional year for display (e.g. "2025"). */
  year?: string;
  videoSrc?: string;
  /** Thumbnail image for card (e.g. experiment hero). Used when videoSrc is not set. */
  thumbnailSrc?: string;
  /** Zoom for card video (e.g. 1.25) so subject appears closer; frame crops edges. */
  thumbnailVideoScale?: number;
  /** When "experiments", link includes ?from=experiments so back returns to Experiments tab. */
  fromTab?: "work" | "experiments";
};

export function ProjectCard({ slug, title, description, badges, year, videoSrc, thumbnailSrc, thumbnailVideoScale, fromTab }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const ringRef = useRef<HTMLDivElement>(null);
  const badgesRowRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const subtitleSlotRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isPlayingRef = useRef<boolean>(false);
  const isIntersectingRef = useRef<boolean>(false);
  const arrowX = useRef<((value: number) => void) | null>(null);
  const arrowY = useRef<((value: number) => void) | null>(null);
  const isMagneticActiveRef = useRef<boolean>(false);
  const [allowVideoThumb, setAllowVideoThumb] = useState<boolean | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  // Decide once per mount whether this environment should use video thumbnails.
  useEffect(() => {
    if (!videoSrc) {
      setAllowVideoThumb(null);
      return;
    }
    setAllowVideoThumb(shouldUseVideoThumb());
  }, [videoSrc]);

  // When video thumbnails are allowed, mount the <video> only when the card is near the viewport.
  useEffect(() => {
    if (!videoSrc) return;
    if (allowVideoThumb !== true) return;
    if (!cardRef.current) return;

    const el = cardRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setShowVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [videoSrc, allowVideoThumb]);

  // Viewport-based video autoplay with IntersectionObserver (skip when Save-Data or slow connection)
  useEffect(() => {
    if (!videoSrc || !showVideo || !videoRef.current) return;
    if (prefersLowBandwidth()) return;

    const video = videoRef.current;
    let observer: IntersectionObserver | null = null;

    // IntersectionObserver callback
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      const isIntersecting = entry.isIntersecting && entry.intersectionRatio >= 0.6;
      isIntersectingRef.current = isIntersecting;

      // Only change play state if it actually changed
      if (isIntersecting && !isPlayingRef.current) {
        // Card is sufficiently visible - play video
        isPlayingRef.current = true;
        try {
          video.play().catch(() => {
            // Silently handle play promise rejection
            isPlayingRef.current = false;
          });
        } catch (error) {
          // Silently handle play errors
          isPlayingRef.current = false;
        }
      } else if (!isIntersecting && isPlayingRef.current) {
        // Card is not visible - pause video (don't reset currentTime)
        isPlayingRef.current = false;
        try {
          video.pause();
        } catch (error) {
          // Silently handle pause errors
        }
      }
    };

    // Create IntersectionObserver with 60% threshold
    observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.6,
    });

    // Observe the card container
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    // Handle visibility change (tab hidden/visible)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden - pause video
        if (isPlayingRef.current && video) {
          try {
            video.pause();
            isPlayingRef.current = false;
          } catch (error) {
            // Silently handle pause errors
          }
        }
      } else {
        // Tab is visible again - play if card is intersecting
        if (isIntersectingRef.current && !isPlayingRef.current && video) {
          try {
            video.play().catch(() => {
              // Silently handle play promise rejection
            });
            isPlayingRef.current = true;
          } catch (error) {
            // Silently handle play errors
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (observer) {
        observer.disconnect();
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [videoSrc, showVideo]);

  // GSAP hover animation - minimal and flat (no shadow, no scale)
  useLayoutEffect(() => {
    if (!cardRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      // On reduced motion, set final states immediately (no animations)
      if (ringRef.current) gsap.set(ringRef.current, { opacity: 0 });
      if (cardRef.current) gsap.set(cardRef.current, { y: 0 });
      // Badges: visible on reduced motion so content remains accessible
      if (badgesRowRef.current) gsap.set(badgesRowRef.current, { opacity: 1, y: 0 });
      // Arrow: hidden (hover-only)
      if (arrowRef.current) gsap.set(arrowRef.current, { autoAlpha: 0, x: 0 });
      // Subtitle slot: collapsed (height: 0)
      if (subtitleSlotRef.current) gsap.set(subtitleSlotRef.current, { height: 0 });
      // Subtitle content: hidden (hover-only)
      if (subtitleRef.current) gsap.set(subtitleRef.current, { autoAlpha: 0, y: 0, filter: "blur(0px)" });
      return;
    }

    // Pointer-only guard: only attach listeners if device supports hover and fine pointer
    const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!supportsHover) {
      // On touch devices, no hover - badges stay hidden (only visible on hover)
      if (ringRef.current) gsap.set(ringRef.current, { opacity: 0 });
      if (cardRef.current) gsap.set(cardRef.current, { y: 0 });
      if (badgesRowRef.current) gsap.set(badgesRowRef.current, { autoAlpha: 0 });
      // Arrow: hidden (hover-only)
      if (arrowRef.current) gsap.set(arrowRef.current, { autoAlpha: 0, x: 0 });
      // Subtitle slot: collapsed (height: 0)
      if (subtitleSlotRef.current) gsap.set(subtitleSlotRef.current, { height: 0 });
      // Subtitle content: hidden (hover-only)
      if (subtitleRef.current) gsap.set(subtitleRef.current, { autoAlpha: 0, y: 0, filter: "blur(0px)" });
      return;
    }

    let tl: gsap.core.Timeline | null = null;
    let subtitleSlotTween: gsap.core.Tween | null = null;
    let subtitleContentTween: gsap.core.Tween | null = null;
    let subtitleHeight: number | null = null;

    const ctx = gsap.context(() => {
      const ring = ringRef.current;
      const badgesRow = badgesRowRef.current;
      const arrow = arrowRef.current;
      const subtitleSlot = subtitleSlotRef.current;
      const subtitle = subtitleRef.current;

      if (!ring || !badgesRow || !arrow || !subtitleSlot || !subtitle) return;

      // Set initial states (non-hover) - using autoAlpha for smooth visibility
      // Ring: hidden by default
      gsap.set(ring, {
        opacity: 0,
      });

      // Card content: initial position (will lift on hover)
      gsap.set(cardRef.current, {
        y: 0,
      });

      // Badges: hidden by default, visible on hover only
      gsap.set(badgesRow, {
        autoAlpha: 0,
        y: 0,
      });

      // Arrow: hidden by default, will fade in and slide from left on hover
      gsap.set(arrow, {
        autoAlpha: 0,
        x: -6,
      });

      // Subtitle slot: collapsed by default (height: 0)
      gsap.set(subtitleSlot, {
        height: 0,
      });

      // Subtitle content: hidden by default, will fade in on hover
      gsap.set(subtitle, {
        autoAlpha: 0,
        y: 10,
        filter: "blur(8px)",
      });

      // Create paused timeline (reverses smoothly)
      tl = gsap.timeline({ 
        paused: true, 
        overwrite: "auto",
      });

      // Ring: fade in (starts at t=0)
      tl.to(ring, {
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
      }, 0);

      // Card content: subtle lift (starts at t=0)
      tl.to(cardRef.current, {
        y: -2,
        duration: 0.45,
        ease: "power3.out",
      }, 0);

      // Badges: reveal on hover (same stagger as arrow)
      tl.to(badgesRow, {
        autoAlpha: 1,
        duration: 0.28,
        ease: "power3.out",
      }, 0.06);

      // Arrow: reveal with micro-stagger (starts at t=0.06 for subtle delay)
      tl.to(arrow, {
        autoAlpha: 1,
        x: 0,
        duration: 0.28,
        ease: "power3.out",
      }, 0.06);

      // Subtitle: handled separately for independent in/out animations (not in timeline)
    }, cardRef);

    const el = cardRef.current;
    const arrow = arrowRef.current;
    if (!el) return;

    // Initialize magnetic quickTo with arrow ref
    if (arrow) {
      arrowX.current = gsap.quickTo(arrow, "x", { duration: 0.3, ease: "power3.out" });
      arrowY.current = gsap.quickTo(arrow, "y", { duration: 0.3, ease: "power3.out" });
    }

    const onEnter = () => {
      if (tl) {
        tl.timeScale(1); // Normal speed on enter
        tl.play();
      }
      
      // Measure subtitle height once (or use cached value)
      const subtitleSlot = subtitleSlotRef.current;
      const subtitle = subtitleRef.current;
      if (subtitleSlot && subtitle) {
        // Measure natural height if not already measured
        if (subtitleHeight === null) {
          // Temporarily make subtitle visible and slot auto to measure natural height
          gsap.set(subtitle, { autoAlpha: 1, y: 0, filter: "blur(0px)" });
          gsap.set(subtitleSlot, { height: "auto" });
          subtitleHeight = subtitleSlot.scrollHeight;
          // Restore original states (hidden, offset, blurred)
          gsap.set(subtitleSlot, { height: 0 });
          gsap.set(subtitle, { autoAlpha: 0, y: 10, filter: "blur(8px)" });
        }
        
        // Kill any existing animations
        if (subtitleSlotTween) subtitleSlotTween.kill();
        if (subtitleContentTween) subtitleContentTween.kill();
        
        // Animate slot height to expand (pushes badges down smoothly)
        subtitleSlotTween = gsap.to(subtitleSlot, {
          height: subtitleHeight,
          duration: 0.45,
          ease: "power3.out",
        });
        
        // Animate subtitle content with delay (starts 0.06s after slot starts expanding)
        subtitleContentTween = gsap.to(subtitle, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.42,
          ease: "power3.out",
          delay: 0.06,
        });
      }
      isMagneticActiveRef.current = true;
    };

    const onLeave = () => {
      if (tl) {
        tl.timeScale(1); // Normal speed on leave for smooth reverse
        tl.reverse();
      }
      
      // Animate subtitle content out first (faster)
      const subtitle = subtitleRef.current;
      if (subtitle) {
        if (subtitleContentTween) subtitleContentTween.kill();
        subtitleContentTween = gsap.to(subtitle, {
          autoAlpha: 0,
          y: 10,
          filter: "blur(8px)",
          duration: 0.22,
          ease: "power2.out",
        });
      }
      
      // Then collapse slot height (pushes badges back up smoothly)
      const subtitleSlot = subtitleSlotRef.current;
      if (subtitleSlot) {
        if (subtitleSlotTween) subtitleSlotTween.kill();
        subtitleSlotTween = gsap.to(subtitleSlot, {
          height: 0,
          duration: 0.35,
          ease: "power2.out",
        });
      }
      
      isMagneticActiveRef.current = false;
      
      // Reset arrow position
      if (arrow && arrowX.current && arrowY.current) {
        arrowX.current(0);
        arrowY.current(0);
      }
    };

    // Magnetic arrow tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMagneticActiveRef.current || !arrow || !arrowX.current || !arrowY.current) return;

      const arrowRect = arrow.getBoundingClientRect();
      const arrowCenterX = arrowRect.left + arrowRect.width / 2;
      const arrowCenterY = arrowRect.top + arrowRect.height / 2;

      const deltaX = e.clientX - arrowCenterX;
      const deltaY = e.clientY - arrowCenterY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = 10;

      if (distance > 0) {
        const factor = Math.min(distance, maxDistance) / distance;
        const moveX = deltaX * factor * 0.5; // Subtle movement (50% of max)
        const moveY = deltaY * factor * 0.5;

        arrowX.current(moveX);
        arrowY.current(moveY);
      }
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("mousemove", handleMouseMove);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("mousemove", handleMouseMove);
      // Cleanup subtitle animations
      if (subtitleSlotTween) {
        subtitleSlotTween.kill();
        subtitleSlotTween = null;
      }
      if (subtitleContentTween) {
        subtitleContentTween.kill();
        subtitleContentTween = null;
      }
      ctx.revert();
    };
  }, []);

  const projectHref = fromTab === "experiments" ? `/projects/${slug}?from=experiments` : `/projects/${slug}`;

  const placeholderImageSrc =
    thumbnailSrc || (videoSrc ? `/media/projects/${slug}/hero/hero-placeholder.svg` : undefined);

  const shouldRenderVideo = !!videoSrc && allowVideoThumb === true && showVideo;

  return (
    <Link 
      href={projectHref} 
      className="block no-underline rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      onClick={() => {
        if (resolvedTheme === "light" || resolvedTheme === "dark") {
          setStoredThemeBeforeDetail(resolvedTheme);
        }
      }}
    >
      {/* Card root with group for hover state management, relative for absolute arrow overlay */}
      <div
        ref={cardRef}
        data-cursor="card"
        data-cursor-magnet="arrow"
        className="relative group cursor-pointer rounded-2xl bg-background p-[10px] motion-reduce:transition-none lg:hover:bg-accent lg:focus-within:bg-accent dark:lg:hover:bg-accent/20 dark:lg:focus-within:bg-accent/20 transition-colors duration-300 ease-out"
      >
        {/* MCP values: padding 10px all sides, radius 16px, hover uses amber/2 accent token */}
        {/* Default: bg-background, Hover (lg+): bg-accent (amber/2 in light), dark:hover:bg-accent/20 (dark) */}
        
        {/* Ring overlay: inner ring on hover (GSAP-controlled) */}
        <div
          ref={ringRef}
          className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-border pointer-events-none"
        />

        {/* Hero Media Container: video or thumbnail image, aspect-ratio 16/10 */}
        <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-background">
          {shouldRenderVideo ? (
            <video
              ref={videoRef}
              src={videoSrc}
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              poster={placeholderImageSrc}
              className="w-full h-full object-cover"
              style={thumbnailVideoScale != null ? { transform: `scale(${thumbnailVideoScale})` } : undefined}
            />
          ) : placeholderImageSrc ? (
            <Image
              src={placeholderImageSrc}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground border border-dashed border-foreground/20">
              Image
            </div>
          )}
        </div>

        {/* ProjectInfo: MCP gap-[12px] between ImageBlock and ProjectInfo */}
        {/* min-w-0 ensures flex children can shrink properly */}
        <div className="mt-[12px] flex min-w-0 flex-col">
          {/* Title and optional year */}
          <div className="flex flex-wrap items-baseline gap-2">
            <h3 className="font-sans text-lg font-semibold text-foreground break-words">
              {title}
            </h3>
            {year && (
              <span className="font-sans text-sm font-normal text-muted-foreground shrink-0">
                {year}
              </span>
            )}
          </div>
          {/* Subtitle slot: collapsible container that pushes badges down on hover */}
          {/* Height: 0 at rest, expands smoothly on hover via GSAP */}
          <div
            ref={subtitleSlotRef}
            className="hidden lg:block overflow-hidden h-0"
          >
            <p
              ref={subtitleRef}
              data-hover="subtitle"
              className="max-w-[600px] line-clamp-2 text-sm font-normal leading-5 text-muted-foreground"
            >
              {/* MCP: text-sm (14px), Regular, leading 20px, color gray/11 (#646464) */}
              {description}
            </p>
          </div>
          {/* Badges row: flex-nowrap prevents wrapping, badges stay on one row */}
          {/* Spacing: exactly 10px between title and badges row */}
          <div ref={badgesRowRef} data-hover="badges" className="flex flex-nowrap gap-2 overflow-hidden mt-[10px] opacity-0">
            {badges.map((badge) => {
              const Icon = badge.icon ? ICONS[badge.icon] : null;
              return (
                <Badge
                  key={badge.label}
                  variant="outline"
                  className="gap-2 shrink-0 group-hover:bg-[#FFF7C2] group-hover:border-[#FFEE9C] dark:group-hover:bg-accent dark:group-hover:text-accent-foreground dark:group-hover:border-accent group-focus-within:bg-[#FFF7C2] group-focus-within:border-[#FFEE9C] dark:group-focus-within:bg-accent dark:group-focus-within:text-accent-foreground dark:group-focus-within:border-accent transition-colors"
                >
                  {/* Badge hover: #FFF7C2 fill and #FFEE9C stroke in light mode, accent in dark mode */}
                  {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                  <span className="whitespace-nowrap">{badge.label}</span>
                </Badge>
              );
            })}
          </div>
        </div>
        {/* Arrow: absolute overlay, bottom-right with 10px padding, appears on desktop hover only */}
        {/* Does not affect layout width of title/subtitle/badges */}
        {/* GSAP handles opacity/x animation, CSS provides fallback for reduced motion */}
        <div
          ref={arrowRef}
          data-hover="arrow"
          className="absolute right-[10px] bottom-[10px] hidden lg:flex items-center justify-center opacity-0 pointer-events-none motion-reduce:transition-none motion-reduce:transform-none"
        >
          <ArrowRight className="h-6 w-6 text-foreground" />
        </div>
      </div>
    </Link>
  );
}

