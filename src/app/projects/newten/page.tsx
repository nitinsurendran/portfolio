"use client";

import { useEffect, useState, useRef } from "react";
import Container from "@/components/layout/Container";
import { HeaderBlock } from "@/components/blocks/HeaderBlock";
import { DividerBlock } from "@/components/blocks/DividerBlock";
import { ImageLargeBlock } from "@/components/blocks/ImageLargeBlock";
import { ImageSmallBlock } from "@/components/blocks/ImageSmallBlock";
import { TextBlock } from "@/components/blocks/TextBlock";
import { VimeoEmbedBlock } from "@/components/blocks/VimeoEmbedBlock";
import { OtherProjects } from "@/sections/project-details/rotera/OtherProjects";
import { Footer } from "@/sections/home/Footer";
import { initReveal } from "@/lib/gsap/reveal";
import { getProjectBySlug } from "@/data/projects";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ProjectMediaBaseProvider } from "@/contexts/ProjectMediaBaseContext";
import { newtenOverview, newtenCopy, type NewtenContentKey } from "@/content/projects/newten";

type ManifestBlock =
  | {
      type: "header";
      title: string;
      subtitle?: string;
      tags?: string[];
      badges?: Array<{ label: string; icon?: string }>;
      heroMedia?: { kind: "image" | "video"; src: string; poster?: string };
      showHero?: boolean;
      overviewLeft?: {
        industry?: string;
        whatIDid?: string;
        toolsUsed?: string;
        year?: string;
      };
      overviewLeftLabels?: {
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
  | { type: "divider" }
  | { type: "imageLarge"; media: { kind: "image" | "video"; src: string; poster?: string }; width?: number }
  | {
      type: "imageSmall";
      left: { kind: "image" | "video"; src: string; poster?: string };
      right: { kind: "image" | "video"; src: string; poster?: string };
    }
  | { type: "text"; heading?: string; content?: string; contentKey?: NewtenContentKey }
  | { type: "vimeoEmbed"; videoId: string; title?: string }
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
    case "header": {
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
          showHero={block.showHero ?? true}
          overviewLeft={block.overviewLeft}
          overviewLeftLabels={block.type === "header" ? block.overviewLeftLabels : undefined}
          overviewRight={newtenOverview}
          backHref={block.backHref}
        />
      );
    }
    case "divider":
      return <DividerBlock key={index} />;
    case "imageLarge":
      return <ImageLargeBlock key={index} media={block.media} width={block.width} />;
    case "imageSmall":
      return <ImageSmallBlock key={index} left={block.left} right={block.right} />;
    case "text": {
      let heading: string | undefined;
      let content: string;
      if (block.contentKey) {
        const section = newtenCopy[block.contentKey];
        heading = section.heading;
        content = section.content;
      } else {
        heading = block.heading;
        content = block.content ?? "";
      }
      return <TextBlock key={index} heading={heading} content={content} />;
    }
    case "vimeoEmbed":
      return <VimeoEmbedBlock key={index} videoId={block.videoId} title={block.title} />;
    case "otherProjects":
      return <OtherProjects key={index} />;
    case "footer":
      return <Footer key={index} variant={block.variant || "default"} />;
    default:
      if (process.env.NODE_ENV === "development") {
        console.warn("[NewTenPage] Unknown block type:", (block as ManifestBlock & { type: string }).type);
      }
      return null;
  }
}

export default function NewTenPage() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const project = getProjectBySlug("newten");
  const projectBadges = project?.badges;
  const projectTitle = project?.title;
  const projectDescription = project?.description;

  useEffect(() => {
    fetch("/media/projects/newten/manifest.json", { cache: "no-store" })
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
    <ProjectMediaBaseProvider basePath="/media/projects/newten">
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
