import { MediaFrame } from "../media/MediaFrame";
import { useProjectMediaBase } from "@/contexts/ProjectMediaBaseContext";

function resolveHref(path: string, base: string): string {
  if (!path || path.trim() === "") return "";
  if (path.startsWith("/") || path.startsWith("http")) return path;
  const baseClean = base.replace(/\/$/, "");
  const pathClean = path.replace(/^\//, "");
  return `${baseClean}/${pathClean}`;
}

type ImageLargeBlockProps = {
  media: {
    kind: "image" | "video";
    src: string;
    poster?: string;
  };
  width?: number; // Default 960px
  /** When true, container has no fixed aspect ratio — image dictates height (e.g. long/tall images). */
  adaptive?: boolean;
  /** "cover" fills frame (default); "contain" fits full media in frame. */
  objectFit?: "contain" | "cover";
};

export function ImageLargeBlock({ media, width = 960, adaptive = false, objectFit = "cover" }: ImageLargeBlockProps) {
  const basePath = useProjectMediaBase();
  const fullSrc = resolveHref(media.src, basePath);

  if (adaptive && media.kind === "image") {
    return (
      <div className="flex gap-6 md:gap-[53px] items-start py-6 md:py-8 relative">
        <div
          data-reveal="imageLarge"
          className="w-full max-w-full relative shrink-0 overflow-hidden rounded-[12px] min-w-0"
          style={{ maxWidth: width, borderRadius: 12, overflow: "hidden" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fullSrc}
            alt=""
            className="w-full h-auto block object-contain"
            style={{ maxWidth: "100%" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 md:gap-[53px] items-start py-6 md:py-8 relative">
      <div
        data-reveal="imageLarge"
        className="w-full max-w-full relative shrink-0 min-w-0"
        style={{ maxWidth: width, aspectRatio: "960/623" }}
      >
        <MediaFrame
          kind={media.kind}
          src={media.src}
          poster={media.poster}
          basePath={basePath}
          aspectClassName="h-full w-full"
          objectFit={objectFit}
        />
      </div>
    </div>
  );
}

