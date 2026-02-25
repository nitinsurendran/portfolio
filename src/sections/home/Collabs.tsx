// Logo assets live in /public/media/collabs/logo-1.png ... logo-6.png
// You can replace those files with your collaborators' logos; no code changes needed.
export function Collabs() {
  return (
    <section className="py-16" data-reveal="collabs">
      {/* No internal padding - relies on Container padding (lg:px-[60px]) */}
      {/* Figma node: 7314-6986 (Collaboration section) */}
      <div className="space-y-4">
        <h2 className="font-sans text-xl font-semibold text-foreground">
          I've collab'd in the past with:
        </h2>
        <div className="flex items-center w-full">
          {Array.from({ length: 5 }).map((_, index) => {
            const src = `/media/collabs/logo-${index + 1}.png`;
            const alt = `Collaborator ${index + 1} logo`;
            const isLogo5 = index === 4;
            const logoBoxClass = isLogo5
              ? "flex h-5 w-20 items-center justify-center shrink-0 md:h-6 md:w-24"
              : "flex h-8 w-20 items-center justify-center shrink-0 md:h-10 md:w-24";
            return (
              <span key={index} className="contents">
                <div className={logoBoxClass}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={alt}
                    className="max-h-full max-w-full object-contain opacity-90 transition-opacity hover:opacity-100"
                    loading="lazy"
                  />
                </div>
                {index < 4 && (
                  <div
                    className="flex flex-1 min-w-[4px] justify-center items-center"
                    aria-hidden
                  >
                    {/* Gap marker: same width gap = marker centered in equal space */}
                    <span className="w-0.5 h-6 bg-slate-500/25 rounded-full shrink-0" />
                  </div>
                )}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

