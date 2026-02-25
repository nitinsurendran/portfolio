import { ArrowUpRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Intro() {
  return (
    <section aria-labelledby="intro-heading" className="py-[10px]" data-reveal="intro">
      {/* MCP: Intro has py-[10px] and internal gap-[10px] */}
      <div className="flex flex-col gap-[10px]">
        <div className="sr-only" id="intro-heading">
          Intro
        </div>
        <p className="font-sans text-xl font-normal leading-7 text-foreground">
          {/* MCP: text-xl (20px), leading-7 (28px), text-foreground (slate-12) */}
          {/* MCP: "Interaction Designer" uses text-muted-foreground, rest uses text-foreground */}
          I'm an{" "}
          <span className="text-[#78350f] dark:text-amber-200">Interaction Designer</span> based in
          Amsterdam, weaving together the intricate threads of technology and
          human experience. Most of my work is rooted in a deep understanding
          of human behavior and the potential of emerging technologies, aiming
          to craft experiences that are functional + impactful.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="w-fit rounded-full gap-2" asChild>
            {/* w-fit prevents button from stretching in flex row parent */}
            <Link href="/about" target="_blank" rel="noopener noreferrer">
              <span>About me</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" className="w-fit rounded-full gap-2" asChild>
            <Link
              href="/Nitin%20Surendran%20-%20CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>View resume</span>
              <FileText className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        {/* TODO: Confirm exact type size/line-height from Figma (28px token) */}
        {/* TODO: Confirm exact spacing between paragraph and CTA */}
        {/* TODO: Confirm CTA variant/background/border per Figma */}
      </div>
    </section>
  );
}

