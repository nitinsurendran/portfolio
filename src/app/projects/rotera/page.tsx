"use client";

import { useEffect, useState, useRef } from "react";
import Container from "@/components/layout/Container";
import { HeroBlock } from "@/components/blocks/HeroBlock";
import { ImageLargeBlock } from "@/components/blocks/ImageLargeBlock";
import { ImageSmallBlock } from "@/components/blocks/ImageSmallBlock";
import { TextBlock } from "@/components/blocks/TextBlock";
import { SpacerBlock } from "@/components/blocks/SpacerBlock";
import { HeaderBlock } from "@/components/blocks/HeaderBlock";
import { DividerBlock } from "@/components/blocks/DividerBlock";
import { Impact } from "@/sections/project-details/rotera/Impact";
import { OtherProjects } from "@/sections/project-details/rotera/OtherProjects";
import { Footer } from "@/sections/home/Footer";
import { initReveal } from "@/lib/gsap/reveal";
import { getProjectBySlug } from "@/data/projects";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ProjectMediaBaseProvider } from "@/contexts/ProjectMediaBaseContext";

type ManifestBlock =
  | {
      type: "header";
      title: string;
      subtitle?: string;
      tags?: string[];
      badges?: Array<{ label: string; icon?: string }>;
      heroMedia: { kind: "image" | "video"; src: string; poster?: string };
      overviewLeft?: {
        industry?: string;
        whatIDid?: string;
        toolsUsed?: string;
        year?: string;
      };
      overviewRight?: {
        heading?: string;
        paragraphs?: string[];
      };
      backHref?: string;
    }
  | { type: "hero"; media: { kind: "image" | "video"; src: string; poster?: string } }
  | { type: "imageLarge"; media: { kind: "image" | "video"; src: string; poster?: string }; width?: number }
  | {
      type: "imageSmall";
      left: { kind: "image" | "video"; src: string; poster?: string };
      right: { kind: "image" | "video"; src: string; poster?: string };
    }
  | { type: "text"; heading?: string; content: string }
  | { type: "spacer" }
  | { type: "divider" }
  | { type: "impact"; content?: string }
  | { type: "otherProjects" }
  | { type: "footer"; variant?: "default" | "alt" };

type Manifest = {
  blocks: ManifestBlock[];
};

function renderBlock(
  block: ManifestBlock,
  index: number,
  projectBadges?: Array<{ label: string; icon?: string }>,
  projectTitle?: string,
  projectDescription?: string
) {
  switch (block.type) {
    case "header":
      // Use project data (source of truth) for title, subtitle, and badges
      const badges = projectBadges || block.badges;
      const title = projectTitle || block.title;
      const subtitle = projectDescription || block.subtitle;
      return (
        <HeaderBlock
          key={index}
          title={title}
          subtitle={subtitle}
          tags={block.tags}
          badges={badges}
          heroMedia={block.heroMedia}
          overviewLeft={block.overviewLeft}
          overviewRight={block.overviewRight}
          backHref={block.backHref}
        />
      );
    case "hero":
      return <HeroBlock key={index} media={block.media} />;
    case "imageLarge":
      return <ImageLargeBlock key={index} media={block.media} width={block.width} />;
    case "imageSmall":
      return <ImageSmallBlock key={index} left={block.left} right={block.right} />;
    case "text":
      return <TextBlock key={index} heading={block.heading} content={block.content} />;
    case "spacer":
      return <SpacerBlock key={index} />;
    case "divider":
      return <DividerBlock key={index} />;
    case "impact":
      return <Impact key={index} content={block.content} />;
    case "otherProjects":
      return <OtherProjects key={index} />;
    case "footer":
      return <Footer key={index} variant={block.variant || "default"} />;
    default:
      if (process.env.NODE_ENV === "development") {
        console.warn("[RoteraPage] Unknown block type:", (block as any).type);
      }
      return null;
  }
}

export default function RoteraPage() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Get project data (source of truth) for title, description, and badges
  const project = getProjectBySlug("rotera");
  const projectBadges = project?.badges;
  const projectTitle = project?.title;
  const projectDescription = project?.description;

  useEffect(() => {
    fetch("/media/projects/rotera/manifest.json", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load manifest: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => setManifest(data))
      .catch((err) => {
        console.error("Failed to load manifest:", err);
        setError(err.message);
      });
  }, []);

  // Defer GSAP reveal until after first paint + manifest; skip if no [data-reveal] (perf)
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !manifest) return;
    let cleanup: (() => void) | undefined;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (root.querySelectorAll("[data-reveal]").length === 0) return;
        cleanup = initReveal(root);
      });
    });
    return () => {
      cancelAnimationFrame(id);
      cleanup?.();
    };
  }, [manifest]);

  if (error) {
    return (
      <main className="pt-[144px] pb-0 relative">
        <Container>
          <div className="py-8 text-center text-red-500">
            Failed to load manifest: {error}
          </div>
        </Container>
      </main>
    );
  }

  if (!manifest) {
    return (
      <main className="pt-[144px] pb-0 relative">
        <Container>
          <div className="py-8 text-center text-slate-400">Loading...</div>
        </Container>
      </main>
    );
  }

  return (
    <ProjectMediaBaseProvider basePath="/media/projects/rotera">
      <main className="pt-[144px] pb-0 relative">
        <Container>
          <div ref={rootRef}>
            {manifest.blocks.map((block, index) =>
              renderBlock(block, index, projectBadges, projectTitle, projectDescription)
            )}
          </div>
        </Container>
        <ScrollToTop />
      </main>
    </ProjectMediaBaseProvider>
  );
}
