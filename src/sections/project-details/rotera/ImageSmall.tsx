import { MediaFrame } from "@/components/media/MediaFrame";
import { Media } from "@/content/types";

type ImageSmallProps = {
  left?: Media;
  right?: Media;
};

export function ImageSmall({ left, right }: ImageSmallProps) {
  return (
    <div data-reveal="imageSmall" className="grid w-full grid-cols-1 md:grid-cols-2 items-stretch gap-6 md:gap-[53px] py-6 md:py-8">
      <div className="relative rounded-[12px] overflow-hidden w-full min-w-0" style={{ aspectRatio: "447/623" }}>
        <MediaFrame
          kind={left?.kind}
          src={left?.src}
          poster={left?.poster}
          alt={left?.alt || "Left image"}
          preload={left?.preload}
          autoplayOnViewport={true}
          aspectClassName="h-full w-full"
        />
      </div>
      <div className="relative rounded-[12px] overflow-hidden w-full min-w-0" style={{ aspectRatio: "447/623" }}>
        <MediaFrame
          kind={right?.kind}
          src={right?.src}
          poster={right?.poster}
          alt={right?.alt || "Right image"}
          preload={right?.preload}
          autoplayOnViewport={true}
          aspectClassName="h-full w-full"
        />
      </div>
    </div>
  );
}
