"use client";

import { getProjectBySlug } from "@/data/projects";
import { notFound, useParams } from "next/navigation";
import Container from "@/components/layout/Container";
import { useRef, useEffect } from "react";
import { initReveal } from "@/lib/gsap/reveal";
import { useTheme } from "next-themes";
import {
  getStoredThemeBeforeDetail,
  clearStoredThemeBeforeDetail,
} from "@/lib/theme-detail";
import { Separator } from "@/components/ui/separator";
import { Footer } from "@/sections/home/Footer";
import { ProjectTitle } from "@/sections/project-details/rotera/ProjectTitle";
import { BackNavigation } from "@/sections/project-details/rotera/BackNavigation";
import { ProjectDescription } from "@/sections/project-details/rotera/ProjectDescription";
import { HeroImage } from "@/sections/project-details/rotera/HeroImage";
import { ProjectOverview } from "@/sections/project-details/rotera/ProjectOverview";
import { ImageLarge } from "@/sections/project-details/rotera/ImageLarge";
import { ImageSmall } from "@/sections/project-details/rotera/ImageSmall";
import { Body } from "@/sections/project-details/rotera/Body";
import { Impact } from "@/sections/project-details/rotera/Impact";
import { OtherProjects } from "@/sections/project-details/rotera/OtherProjects";
import { rotera } from "@/content/projects/rotera";
import { ProjectBlock, Media } from "@/content/types";
import { resolveHeroMedia, resolveLargeMedia, resolveSmallMedia, getManifest } from "@/content/mediaResolver";
import { ScrollToTop } from "@/components/ScrollToTop";

export default function ProjectPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { slug } = useParams<{ slug: string }>();
  const project = getProjectBySlug(slug);
  const { setTheme } = useTheme();

  // Set dark once on mount so toggle can switch to light without this effect re-running. Restore on leave.
  useEffect(() => {
    setTheme("dark");
    return () => {
      const restore = getStoredThemeBeforeDetail();
      clearStoredThemeBeforeDetail();
      setTheme(restore ?? "light");
    };
    // Empty deps: run only once per mount so we never overwrite user's theme toggle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!rootRef.current) return;
    const cleanup = initReveal(rootRef.current);
    return cleanup;
  }, []);

  if (!project) {
    notFound();
  }

  // Use content blocks for Rotera, fallback to legacy for other projects
  const useContentBlocks = slug === "rotera";
  const content = useContentBlocks ? rotera : null;
  
  // Get manifest for debug overlay
  const manifest = useContentBlocks ? getManifest(slug) : [];

  // Render a single block
  const renderBlock = (block: ProjectBlock, index: number) => {
    switch (block.type) {
      case "ProjectTitle":
        return <ProjectTitle key={index} />;
      case "BackNavigation":
        return <BackNavigation key={index} />;
      case "ProjectDescription":
        return (
          <ProjectDescription
            key={index}
            description={block.description || project.description}
            badges={block.badges || project.badges}
          />
        );
      case "HeroMedia": {
        const media = resolveHeroMedia(slug);
        return <HeroImage key={index} media={media} />;
      }
      case "ProjectOverview":
        return <ProjectOverview key={index} overviewRight={project.overview} />;
      case "ImageLarge": {
        const media = resolveLargeMedia(slug, block.key);
        return <ImageLarge key={index} media={media} width={block.width} />;
      }
      case "ImageSmall": {
        const { left, right } = resolveSmallMedia(slug, block.key);
        return <ImageSmall key={index} left={left} right={right} />;
      }
      case "Body":
        return (
          <Body
            key={index}
            content={block.content.join("\n\n")}
            heading={block.heading}
          />
        );
      case "Divider":
        return (
          <div key={index} className="py-[10px]">
            <Separator className="h-px" />
          </div>
        );
      case "Impact":
        return <Impact key={index} />;
      case "OtherProjects":
        return <OtherProjects key={index} />;
      case "Footer":
        return <Footer key={index} variant={block.variant || "default"} />;
      default:
        return null;
    }
  };

  // Legacy rendering for non-Rotera projects (fallback)
  if (!useContentBlocks) {
    // Body content from Figma
    const bodyContent1 = `Version 1 defined the baseline: a quiet, reliable 3D canvas focused on viewing the product in three dimensions. Something to test the waters with - that's it.

The interface remained deliberately quiet. A dedicated modal, framed in neutral lighting, free of decision-making pressure. This allowed the object itself - its form, proportions, and presence to take precedence over the interface surrounding it. 

Colour variants were integrated directly into the 3D view, enabling quick comparison without breaking focus or context. The interaction was intentionally lightweight: select a variant, observe the change, move on. At this stage, the goal was not configuration.

An AR entry point was included from the start as a natural extension of the 3D experience. Available when the screen was no longer enough and the product needed to be understood in physical space.

Version 1 laid the foundations of the system. It set the baseline for all subsequent iterations, allowing later versions to build complexity without losing clarity.`;

    const bodyContent2 = `With the foundations in place, this iteration brought conversion closer to the surface.

The add-to-bag action became a clear, primary element of the experience - no longer something that required stepping back out of 3D. The intent was simple: if a customer is confident enough to explore a product in three dimensions, they should be able to act on that confidence without friction.

3D product exploration and shopping were no longer treated as separate modes. Instead, 3D became a natural part of the purchasing flow, sitting alongside familiar IKEA shopping behaviours rather than outside of them.

This version also expanded how context was explored. When exploring AR view, I tried showing products as they might appear in real, imperfect spaces. Furniture was placed in lived-in environments: rooms with clutter, rooms with pets, rooms that felt occupied or unfinished.`;

    const bodyContent3 = `This iteration introduced dimensions directly into the 3D view, anchoring measurements to the product itself rather than pushing them into specifications or tables elsewhere on the page. Height, width, and depth became part of the visual experience.

Measurements were designed to appear lightly, without overwhelming the product. They surfaced when needed and receded when not, allowing customers to move between visual exploration and practical evaluation without leaving the 3D canvas.

By placing dimensions on the object, the experience reduced the mental translation customers often have to perform: switching between numbers, imagination, and space.

This approach was applied across different categories, from storage to lighting, reinforcing that scale matters regardless of product type. Whether tall, wide, or suspended, each product communicated its physical presence directly through the 3D view.`;

    const bodyContent4 = `Up to this point, the 3D experience had been centred on the product: how it looks, how big it is, how confidently it can be chosen. Version 3 introduced a new question - how would it look inside a room?

This was the first time the 3D product view was explicitly linked to IKEA Kreativ. A simple but deliberate toggle allowed customers to move between "3D view" and "Design in a room," signalling a shift from isolated inspection to spatial composition.

The transition into Kreativ was designed to feel continuous. Inside the room view, the selected product appeared already placed, grounded in realistic lighting and scale, surrounded by empty space ready to be shaped.

Version 3 established the foundations for embedded room experiences at IKEA. It demonstrated how a product-level interaction could naturally extend into room-level design, and how planning tools like Kreativ could be introduced earlier in the shopping journey; without overwhelming users or breaking flow.`;

    const bodyContent5 = `Alongside the shift into room-based exploration, we also revisited how colour variants were represented. Rather than relying on hex colour swatches or miniature product photos, we introduced a new approach that used close-up images of the product itself - which allowed users to look at the textures.`;

    const bodyContent6 = `Planners are powerful, but demanding. Kreativ is spatial and intuitive, but open-ended. This version explored how both could live closer to the product - without forcing users to commit too early.

To soften the jump into planners, we experimented with a snapshot view. Just enough of the planner to hint at what's possible. Kreativ was brought in with the same restraint. Room selection, early placement, and variant changes happened before entering the full tool.`;

    return (
      <main className="pt-[144px] pb-0 relative" ref={rootRef}>
        <Container>
          <ProjectTitle />
          <BackNavigation />
          <ProjectDescription description={project.description} badges={project.badges} />
          <HeroImage />
          <ProjectOverview overviewRight={project.overview} />
          <ImageLarge />
          <ImageSmall />
          <Body content={bodyContent1} heading="Version 1: Establishing the 3D Canvas" />
          <div className="py-[10px]">
            <Separator className="h-px" />
          </div>
          <ImageLarge />
          <Body content={bodyContent2} heading="Version 1.1: Making 3D Part of the Shopping Journey" />
          <div className="py-[10px]">
            <Separator className="h-px" />
          </div>
          <ImageLarge />
          <ImageSmall />
          <Body content={bodyContent3} heading="Version 2: Making Scale Explicit" />
          <div className="py-[10px]">
            <Separator className="h-px" />
          </div>
          <ImageLarge />
          <ImageLarge width={929} />
          <Body content={bodyContent4} heading="Version 3: From Product to Room" />
          <div className="py-[10px]">
            <Separator className="h-px" />
          </div>
          <ImageLarge />
          <Body content={bodyContent5} heading="Version 3.1: Texture swatches" />
          <div className="py-[10px]">
            <Separator className="h-px" />
          </div>
          <ImageSmall />
          <Body content={bodyContent6} heading="Version 4: Embedding Planning Tools Without Breaking the Journey" />
          <Impact />
          <div className="py-[10px]">
            <Separator className="h-px" />
          </div>
          <OtherProjects />
          <Footer variant="default" />
          <Footer variant="alt" />
        </Container>
        <ScrollToTop />
      </main>
    );
  }

  // Helper to get project folder (duplicated from resolver for debug)
  function getProjectFolder(slug: string): string {
    const SLUG_TO_FOLDER: Record<string, string> = {
      "rotera": "rotera",
      "reimagining-3d-product-exploration-at-ikea": "rotera", // Legacy slug support
    };
    return SLUG_TO_FOLDER[slug] || slug;
  }
  
  // Helper to check if path is in manifest
  function isInManifest(src: string | undefined, manifest: readonly string[]): boolean {
    if (!src) return false;
    const projectFolder = getProjectFolder(slug);
    const relativePath = src.replace(`/media/projects/${projectFolder}/`, "").replace(`/media/projects/${projectFolder}/`, "");
    const normalized = relativePath.replace(/^\/+|\/+$/g, "");
    return manifest.some(entry => {
      const entryNormalized = entry.replace(/^\/+|\/+$/g, "");
      return entryNormalized === normalized;
    });
  }
  
  // Collect debug info for first 3 media blocks
  const debugInfo: Array<{
    blockType: string;
    key?: string;
    media?: Media;
    left?: Media;
    right?: Media;
    inManifest?: boolean;
  }> = [];
  
  if (useContentBlocks && content) {
    let mediaBlockCount = 0;
    for (const block of content.blocks) {
      if (mediaBlockCount >= 3) break;
      
      if (block.type === "HeroMedia") {
        const media = resolveHeroMedia(slug);
        debugInfo.push({
          blockType: "HeroMedia",
          media,
          inManifest: isInManifest(media.src, manifest),
        });
        mediaBlockCount++;
      } else if (block.type === "ImageLarge") {
        const media = resolveLargeMedia(slug, block.key);
        debugInfo.push({
          blockType: "ImageLarge",
          key: block.key,
          media,
          inManifest: isInManifest(media.src, manifest),
        });
        mediaBlockCount++;
      } else if (block.type === "ImageSmall") {
        const { left, right } = resolveSmallMedia(slug, block.key);
        debugInfo.push({
          blockType: "ImageSmall",
          key: block.key,
          left,
          right,
          inManifest: isInManifest(left.src, manifest) && isInManifest(right.src, manifest),
        });
        mediaBlockCount++;
      }
    }
  }

  // Content blocks rendering for Rotera
  return (
    <main className="pt-[144px] pb-0 relative" ref={rootRef}>
      <Container>
        {/* Debug overlay - dev only */}
        {process.env.NODE_ENV === "development" && debugInfo.length > 0 && (
          <div className="fixed top-4 left-4 z-50 bg-black/90 text-white p-4 rounded-lg text-xs font-mono max-w-md overflow-auto max-h-96">
            <div className="font-bold mb-2">DEBUG: Media Resolution</div>
            <div className="mb-2">Slug: {slug}</div>
            {debugInfo.map((info, idx) => (
              <div key={idx} className="mb-4 p-2 bg-gray-800 rounded">
                <div className="font-semibold">{info.blockType} {info.key && `(${info.key})`}</div>
                {info.media && (
                  <>
                    <div>Kind: {info.media.kind}</div>
                    <div>Src: {info.media.src || "(empty)"}</div>
                    <div>Poster: {info.media.poster || "(none)"}</div>
                    <div>In Manifest: {info.inManifest ? "✓" : "✗"}</div>
                  </>
                )}
                {info.left && info.right && (
                  <>
                    <div>Left: {info.left.src || "(empty)"} {isInManifest(info.left.src, manifest) ? "✓" : "✗"}</div>
                    <div>Right: {info.right.src || "(empty)"} {isInManifest(info.right.src, manifest) ? "✓" : "✗"}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
        {content?.blocks.map((block, index) => renderBlock(block, index))}
      </Container>
      <ScrollToTop />
    </main>
  );
}
