import { ArrowUpRight } from "lucide-react";

type FooterProps = {
  variant?: "default" | "alt";
};

export function Footer({ variant = "default" }: FooterProps) {
  // Variant 1 (default): "Let's connect" with Email/CV/LinkedIn links
  // Figma node: 7059-2364
  // Figma values: bg-[#fcfcfd] (slate/1), py-[10px], gap-[16px]
  // Note: Padding now comes from shared Container (px-[60px]), not footer-specific
  // Typography: text-xl (20px), semibold (600) for heading, regular for links
  // Colors: text-[#1c2024] (slate/12) for heading and links
  if (variant === "default") {
    return (
      <footer className="bg-[#fcfcfd] dark:bg-background py-[35px]" data-reveal="footer">
        {/* Figma node: 7059-2364 */}
        {/* Padding: py-[35px] (top and bottom 35px) */}
        {/* No internal horizontal padding - relies on Container padding (lg:px-[60px]) */}
        {/* No w-full - respects Container width naturally */}
        {/* Figma: gap-[16px] between heading and links */}
        <div className="flex flex-col gap-4">
          {/* "Let's connect" heading */}
          {/* Figma: text-xl (20px), semibold (600), leading-7 (28px), text-[#1c2024] (slate/12) */}
          <p className="font-sans text-xl font-semibold leading-7 text-foreground">
            Let's connect
          </p>
          {/* Links row: Email, CV, LinkedIn, Calendly */}
          {/* Figma: text-xl (20px), regular, leading-[28px], text-[#1c2024] (slate/12), underline */}
          {/* Figma shows links positioned at left-0, left-[71px], left-[119px] - using flex gap for semantic spacing */}
          <nav className="flex items-center gap-8" aria-label="Contact links">
            <a
              href="mailto:nitin.design.works@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xl font-normal leading-[28px] text-foreground underline decoration-solid underline-offset-2 hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring inline-flex items-center gap-[4px]"
            >
              Email
              <ArrowUpRight className="h-[14px] w-[14px]" aria-hidden="true" />
            </a>
            <a
              href="/Nitin%20Surendran%20-%20CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xl font-normal leading-[28px] text-foreground underline decoration-solid underline-offset-2 hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring inline-flex items-center gap-[4px]"
            >
              CV
              <ArrowUpRight className="h-[14px] w-[14px]" aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/in/nitinsurendran/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xl font-normal leading-[28px] text-foreground underline decoration-solid underline-offset-2 hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring inline-flex items-center gap-[4px]"
            >
              LinkedIn
              <ArrowUpRight className="h-[14px] w-[14px]" aria-hidden="true" />
            </a>
            <a
              href="https://calendly.com/nitin-design-works/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xl font-normal leading-[28px] text-foreground underline decoration-solid underline-offset-2 hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring inline-flex items-center gap-[4px]"
            >
              Calendly
              <ArrowUpRight className="h-[14px] w-[14px]" aria-hidden="true" />
            </a>
          </nav>
        </div>
      </footer>
    );
  }

  // Variant 2 (alt): "Designed and built by..." with "Last update: 2026"
  // Figma node: 7314-6986
  // Figma values: bg-[#fcfcfd] (slate/1), py-[35px], gap-[428px] between text elements
  // Note: Padding now comes from shared Container (px-[60px]), not footer-specific
  // Typography: text-sm (14px), regular, default line-height
  // Colors: text-[#60646c] (slate/11)
  // Footer/2 intentionally opts out of GSAP reveal to prevent disappearing during layout/animation changes.
  return (
    <footer className="bg-[#fcfcfd] dark:bg-background py-[35px]" data-reveal="none">
      {/* Figma node: 7314-6986 */}
      {/* Padding: py-[35px] (top and bottom 35px) */}
      {/* No internal horizontal padding - relies on Container padding (lg:px-[60px]) */}
      {/* No w-full - respects Container width naturally */}
      {/* Figma: gap-[428px] between text elements (using justify-between) */}
      {/* Typography applied at container level: text-sm font-normal */}
      <div className="flex items-center justify-between text-sm font-normal">
        {/* Left text: "Designed and built by Nitin Surendran." */}
        {/* Inherits text-sm font-normal from container, color: text-[#60646c] (slate/11) */}
        <p className="text-muted-foreground">
          Designed and built by Nitin Surendran.
        </p>
        {/* Right text: "Last update: 2026" */}
        {/* Inherits text-sm font-normal from container, color: text-[#60646c] (slate/11) */}
        <p className="text-muted-foreground">
          Last update: 2026
        </p>
      </div>
    </footer>
  );
}

