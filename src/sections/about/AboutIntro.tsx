import { MediaFrame } from "@/components/media/MediaFrame";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import Link from "next/link";

export function AboutIntro() {
  return (
    <div data-reveal="aboutIntro" className="flex flex-col gap-6 md:gap-8 min-w-0 w-full">
      {/* Name — same style as Work history heading (Figma: 48px semibold) */}
      <h1 className="font-sans text-3xl font-semibold tracking-normal text-foreground">
        Nitin Surendran
      </h1>

      {/* Photo */}
      <div
        className="relative w-full overflow-hidden rounded-xl min-w-0"
        style={{ aspectRatio: "479/581" }}
      >
        <MediaFrame
          kind="image"
          src="/images/about/profile.jpg"
          alt="Nitin Surendran"
          aspectClassName="h-full w-full object-cover"
        />
      </div>

      {/* Bio content — text-xl, regular, leading-[28px] */}
      <div className="flex flex-col gap-4">
        <p className="font-sans text-xl font-normal leading-[28px] text-foreground mb-0">
          I'm an{" "}
          <span className="text-[#78350f] dark:text-amber-200">Interaction Designer</span> based in
          Amsterdam, weaving together the intricate threads of technology and human experience. Most
          of my work is rooted in a deep understanding of human behavior and the potential of
          emerging technologies, aiming to craft experiences that are functional + impactful.
        </p>
        <p className="font-sans text-xl font-normal leading-[28px] text-foreground mb-0">
          As a designer, I specialize in envisioning and prototyping new products that make complex
          systems feel intuitive and human. I often work at the intersection of 3D, spatial
          interfaces, and AI-driven experiences - translating technical possibility into usable,
          meaningful interactions.
        </p>
        <p className="font-sans text-xl font-normal leading-[28px] text-foreground mb-0">
          I currently work at{" "}
          <Link
            href="https://www.ikea.com/"
            className="underline decoration-solid underline-offset-2 hover:opacity-70 transition-opacity"
            target="_blank"
            rel="noopener noreferrer"
          >
            IKEA
          </Link>
          , shaping 3D and spatial commerce experiences across the web. Previously, I designed for
          mobility at{" "}
          <Link
            href="https://www.free-now.com/uk/"
            className="underline decoration-solid underline-offset-2 hover:opacity-70 transition-opacity"
            target="_blank"
            rel="noopener noreferrer"
          >
            Beat (acquired by FreeNow)
          </Link>{" "}
          and for travel at{" "}
          <Link
            href="https://www.redbus.in/"
            className="underline decoration-solid underline-offset-2 hover:opacity-70 transition-opacity"
            target="_blank"
            rel="noopener noreferrer"
          >
            redBus
          </Link>
          , collaborating with global teams to build consumer-facing products at scale.
        </p>
        <p className="font-sans text-xl font-normal leading-[28px] text-foreground mb-0">
          Beyond product work, I experiment with immersive systems, biomimicry, and playful
          interaction - interests shaped during my time at the{" "}
          <Link
            href="https://www.ciid.dk/"
            className="underline decoration-solid underline-offset-2 hover:opacity-70 transition-opacity"
            target="_blank"
            rel="noopener noreferrer"
          >
            Copenhagen Institute of Interaction Design (CIID)
          </Link>
          , where I graduated from the interaction design programme in 2021.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
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
    </div>
  );
}
