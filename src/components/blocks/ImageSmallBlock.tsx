import { MediaFrame } from "../media/MediaFrame";
import { useProjectMediaBase, useProjectMediaCacheBust } from "@/contexts/ProjectMediaBaseContext";

type ImageSmallBlockProps = {
  left: {
    kind: "image" | "video";
    src: string;
    poster?: string;
  };
  right: {
    kind: "image" | "video";
    src: string;
    poster?: string;
  };
  /** Per-row object-fit: use \"contain\" to fully show media (no cropping), or \"cover\" to fill frame. Default \"cover\". */
  objectFit?: "contain" | "cover";
};

export function ImageSmallBlock({ left, right, objectFit = "cover" }: ImageSmallBlockProps) {
  const basePath = useProjectMediaBase();
  return (
    <div data-reveal="imageSmall" className="grid w-full grid-cols-1 md:grid-cols-2 items-stretch gap-6 md:gap-[53px] py-6 md:py-8">
      <div className="relative rounded-[12px] overflow-hidden w-full min-w-0" style={{ aspectRatio: "447/623" }}>
        <MediaFrame
          kind={left.kind}
          src={left.src}
          poster={left.poster}
          basePath={basePath}
          aspectClassName="h-full w-full"
          objectFit={objectFit}
          aspectRatio="447/623"
        />
      </div>
      <div className="relative rounded-[12px] overflow-hidden w-full min-w-0" style={{ aspectRatio: "447/623" }}>
        <MediaFrame
          kind={right.kind}
          src={right.src}
          poster={right.poster}
          basePath={basePath}
          aspectClassName="h-full w-full"
          objectFit={objectFit}
          aspectRatio="447/623"
        />
      </div>
    </div>
  );
}

