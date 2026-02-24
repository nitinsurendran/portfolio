type YoutubeEmbedBlockProps = {
  videoId: string;
  title?: string;
};

const EMBED_BASE = "https://www.youtube.com/embed";

export function YoutubeEmbedBlock({ videoId, title = "YouTube video player" }: YoutubeEmbedBlockProps) {
  const embedSrc = `${EMBED_BASE}/${videoId}?si=TPutxy7D7eGeLMoc`;
  return (
    <div data-reveal="youtubeEmbed" className="w-full max-w-full py-6 md:py-8">
      <div
        className="relative w-full overflow-hidden rounded-[12px]"
        style={{ aspectRatio: "560/315" }}
      >
        <iframe
          width="560"
          height="315"
          src={embedSrc}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}
