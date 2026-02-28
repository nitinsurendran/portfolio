"use client";

import Image from "next/image";
import React, { useState } from "react";
import { SmartVideo } from "./SmartVideo";
import { useProjectMediaBase, useProjectMediaCacheBust } from "@/contexts/ProjectMediaBaseContext";

/** Single source of truth for detail-page media frame: 12px rounded corners + overflow-hidden. */
const MEDIA_FRAME_CLASS = "relative overflow-hidden rounded-[12px]";
const MEDIA_FRAME_STYLE: React.CSSProperties = { borderRadius: 12, overflow: "hidden" };

function resolveHref(path: string | undefined, base: string, cacheBust?: string): string {
  if (!path || path.trim() === "") return "";
  if (path.startsWith("/") || path.startsWith("http")) return path;
  const baseClean = base.replace(/\/$/, "");
  const pathClean = path.replace(/^\//, "");
  const url = `${baseClean}/${pathClean}`;
  return cacheBust ? `${url}?v=${cacheBust}` : url;
}

type MediaFrameProps = {
  kind?: "image" | "video";
  src?: string;
  poster?: string;
  alt?: string;
  preload?: "none" | "metadata" | "auto";
  className?: string;
  aspectClassName?: string;
  autoplayOnViewport?: boolean;
  basePath?: string;
  priority?: boolean;
  /** Image/video object-fit. Default "cover" fills frame; "contain" shows full media. */
  objectFit?: "contain" | "cover";
  /** Slight zoom for video (e.g. 1.05) so bottom/edges are cropped. */
  videoScale?: number;
  /** Aspect ratio for video container (e.g. "960/623" large, "447/623" small). Default "960/623". */
  aspectRatio?: string;
};

/**
 * MediaFrame - Single source of truth for detail-page media. One media element (image or video).
 * Always renders inside a 12px rounded frame with overflow-hidden. Uses next/image and SmartVideo.
 */
export function MediaFrame({
  kind,
  src,
  poster,
  alt = "Media",
  className = "",
  aspectClassName,
  basePath: basePathProp,
  priority = false,
  objectFit = "cover",
  videoScale,
  aspectRatio: aspectRatioProp = "960/623",
}: MediaFrameProps) {
  const [hasError, setHasError] = useState(false);
  const contextBase = useProjectMediaBase();
  const cacheBust = useProjectMediaCacheBust();
  const basePath = basePathProp ?? contextBase;
  const fullSrc = resolveHref(src, basePath, cacheBust);
  const fullPoster = resolveHref(poster, basePath, cacheBust);
  const inferredKind =
    kind || (fullSrc && /\.(mov|mp4|webm)$/i.test(fullSrc) ? "video" : "image");

  const frameClass = `${MEDIA_FRAME_CLASS} ${aspectClassName || ""} ${className}`.trim();

  // Poster only (no src) — next/image fill needs relative parent
  if ((!fullSrc || fullSrc.trim() === "") && fullPoster) {
    return (
      <div className={frameClass} style={MEDIA_FRAME_STYLE}>
        <Image
          src={fullPoster}
          alt={alt}
          fill
          className={objectFit === "contain" ? "object-contain" : "object-cover"}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 960px"
        />
      </div>
    );
  }

  if (!fullSrc || fullSrc.trim() === "") {
    return <div className={frameClass} style={MEDIA_FRAME_STYLE} />;
  }

  // VIDEO: SmartVideo (already has MEDIA_FRAME_CLASS internally; pass through so aspect fits)
  if (inferredKind === "video") {
    return (
      <SmartVideo
        src={fullSrc}
        poster={fullPoster || undefined}
        className={`${aspectClassName || ""} ${className}`.trim()}
        aspectRatio={aspectRatioProp}
        priority={priority}
        alt={alt}
        objectFit={objectFit}
        scale={videoScale}
      />
    );
  }

  // IMAGE: next/image with responsive sizes; frame clips to 12px (inline style ensures clip in all envs)
  // SVG requires unoptimized so Next.js doesn't try to optimize it
  const isSvg = /\.svg$/i.test(fullSrc);
  return (
    <div className={frameClass} style={MEDIA_FRAME_STYLE}>
      {!hasError ? (
        <Image
          src={fullSrc}
          alt={alt}
          fill
          className={`w-full h-full ${objectFit === "contain" ? "object-contain" : "object-cover"}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 960px"
          priority={priority}
          unoptimized={isSvg}
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm">
          Media
        </div>
      )}
    </div>
  );
}
