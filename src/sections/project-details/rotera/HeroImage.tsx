import { MediaFrame } from "@/components/media/MediaFrame";
import { Media } from "@/content/types";

type HeroImageProps = {
  media?: Media;
};

export function HeroImage({ media }: HeroImageProps) {
  return (
    <div data-reveal="hero" className="flex gap-6 md:gap-[53px] items-start py-6 md:py-8 relative">
      <div className="w-full max-w-[960px] relative rounded-[12px] shrink-0 overflow-hidden min-w-0 bg-background" style={{ aspectRatio: "960/623" }}>
        <MediaFrame
          kind={media?.kind}
          src={media?.src}
          poster={media?.poster}
          alt={media?.alt}
          preload={media?.preload}
          priority
          aspectClassName="h-full w-full"
        />
      </div>
    </div>
  );
}
