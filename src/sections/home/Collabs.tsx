// Logo assets live in /public/media/collabs/logo-1.png ... logo-6.png
// You can replace those files with your collaborators' logos; no code changes needed.
export function Collabs() {
  return (
    <section className="py-16" data-reveal="collabs">
      {/* No internal padding - relies on Container padding (lg:px-[60px]) */}
      {/* Figma node: 7314-6986 (Collaboration section) */}
      <div className="space-y-4">
        <h2 className="font-sans text-xl font-semibold text-foreground">
          I've collaborated in the past with
        </h2>
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {Array.from({ length: 5 }).map((_, index) => {
            const src = `/media/collabs/logo-${index + 1}.png`;
            const alt = `Collaborator ${index + 1} logo`;
            return (
              <div
                key={index}
                className="flex h-12 md:h-14 items-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={alt}
                  className="max-h-10 md:max-h-12 w-auto object-contain"
                  loading="lazy"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

