"use client";

import Image from "next/image";
import { useState } from "react";
import { SmartVideo } from "./SmartVideo";
import { useProjectMediaBase } from "@/contexts/ProjectMediaBaseContext";

type MediaProps = {
  kind: "image" | "video";
  src: string; // Relative path from project media folder
  poster?: string;
  className?: string;
  autoplay?: boolean;
  priority?: boolean;
  /** Image object-fit: contain (default) or cover. Use cover for hero so image fills frame. */
  objectFit?: "contain" | "cover";
};

function joinMediaPath(base: string, relative: string): string {
  const cleaned = `${base}/${relative}`.replace(/\/+/g, "/");
  return cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
}

export function Media({
  kind,
  src,
  poster,
  className = "",
  autoplay = true,
  priority = false,
  objectFit = "contain",
}: MediaProps) {
  const [hasError, setHasError] = useState(false);
  const basePath = useProjectMediaBase();

  const fullSrc = joinMediaPath(basePath, src);
  const fullPoster = poster ? joinMediaPath(basePath, poster) : undefined;

  // IMAGE RENDERING — next/image with responsive sizes, lazy below fold
  if (kind === "image") {
    return (
      <div className={`relative overflow-hidden h-full w-full rounded-[12px] ${className}`}>
        {!hasError ? (
          <Image
            src={fullSrc}
            alt=""
            fill
            className={objectFit === "cover" ? "object-cover" : "object-contain"}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 960px"
            priority={priority}
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm">
            Image
          </div>
        )}
      </div>
    );
  }

  // VIDEO RENDERING — SmartVideo: lazy-mount when near viewport, preload=metadata, poster via next/image
  return (
    <SmartVideo
      src={fullSrc}
      poster={fullPoster}
      className={`h-full w-full ${className}`}
      aspectRatio="960/623"
      priority={priority}
      alt=""
      objectFit={objectFit}
    />
  );
}

