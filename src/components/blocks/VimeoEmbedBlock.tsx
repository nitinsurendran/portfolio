type VimeoEmbedBlockProps = {
  videoId: string;
  title?: string;
};

const EMBED_BASE = "https://player.vimeo.com/video";

export function VimeoEmbedBlock({ videoId, title = "Vimeo video player" }: VimeoEmbedBlockProps) {
  const embedSrc = `${EMBED_BASE}/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479`;
  return (
    <div data-reveal="vimeoEmbed" className="w-full max-w-full py-6 md:py-8">
      <div
        className="relative w-full overflow-hidden rounded-[12px]"
        style={{ aspectRatio: "16/9" }}
      >
        <iframe
          src={embedSrc}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}
