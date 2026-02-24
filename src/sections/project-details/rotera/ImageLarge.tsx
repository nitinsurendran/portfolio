import { MediaFrame } from "@/components/media/MediaFrame";
import { Media } from "@/content/types";

type ImageLargeProps = {
  media?: Media;
  width?: number; // For rotated variant (929px vs 960px)
};

export function ImageLarge({ media, width = 960 }: ImageLargeProps) {
  return (
    <div data-reveal="imageLarge" className="flex gap-6 md:gap-[53px] items-start py-6 md:py-8 relative">
      <div
        className="w-full max-w-full relative rounded-[12px] shrink-0 overflow-hidden min-w-0"
        style={{ maxWidth: width, aspectRatio: "960/623" }}
      >
        <MediaFrame
          kind={media?.kind}
          src={media?.src}
          poster={media?.poster}
          alt={media?.alt}
          preload={media?.preload}
          autoplayOnViewport={true}
          aspectClassName="h-full w-full"
        />
      </div>
    </div>
  );
}
