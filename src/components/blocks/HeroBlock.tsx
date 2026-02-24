import { MediaFrame } from "../media/MediaFrame";

type HeroBlockProps = {
  media: {
    kind: "image" | "video";
    src: string;
    poster?: string;
  };
};

export function HeroBlock({ media }: HeroBlockProps) {
  return (
    <div className="w-full relative rounded-[12px] overflow-hidden" style={{ aspectRatio: "960/623" }}>
      <MediaFrame
        kind={media.kind}
        src={media.src}
        poster={media.poster}
        aspectClassName="h-full w-full"
        objectFit="cover"
        priority
      />
    </div>
  );
}

