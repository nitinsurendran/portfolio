"use client";

import { useEffect, useRef } from "react";
import Container from "@/components/layout/Container";
import { HeaderBlock } from "@/components/blocks/HeaderBlock";
import { DividerBlock } from "@/components/blocks/DividerBlock";
import { ImageLargeBlock } from "@/components/blocks/ImageLargeBlock";
import { ImageSmallBlock } from "@/components/blocks/ImageSmallBlock";
import { MediaFrame } from "@/components/media/MediaFrame";
import { TextBlock } from "@/components/blocks/TextBlock";
import { QuoteBlock } from "@/components/blocks/QuoteBlock";
import { Impact } from "@/sections/project-details/rotera/Impact";
import { OtherProjects } from "@/sections/project-details/rotera/OtherProjects";
import { Footer } from "@/sections/home/Footer";
import { initReveal } from "@/lib/gsap/reveal";
import { getProjectBySlug } from "@/data/projects";
import { notFound } from "next/navigation";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ProjectMediaBaseProvider } from "@/contexts/ProjectMediaBaseContext";
import {
  ikeaComplementarySetsCopy,
  type IkeaComplementarySetsContentKey,
} from "@/content/projects/ikea-complementary-sets";
import type { ProjectOverviewContent, ProjectOverviewLeft } from "@/data/projects";

const PROJECT_SLUG = "from-single-products-to-complementary-sets-at-ikea";
const MEDIA_BASE = `/media/projects/${PROJECT_SLUG}`;

const PLACEHOLDER_LARGE = {
  kind: "image" as const,
  src: "sections/placeholder-large.svg",
};
const PLACEHOLDER_SMALL = {
  kind: "image" as const,
  src: "sections/placeholder-small.svg",
};
/** Video above "The solution" */
const IMAGE_THE_SOLUTION = {
  kind: "video" as const,
  src: "sections/the-solution.mov",
};
/** Image above "Why this mattered" */
const IMAGE_WHY_THIS_MATTERED = {
  kind: "image" as const,
  src: "sections/why-this-mattered.png",
};
/** Row above "Design Intent" */
const IMAGE_DESIGN_INTENT_LEFT = {
  kind: "video" as const,
  src: "sections/design-intent-left.mov",
};
const IMAGE_DESIGN_INTENT_RIGHT = {
  kind: "video" as const,
  src: "sections/design-intent-right.mov",
};
/** Three videos above "The experience" */
const IMAGE_THE_EXPERIENCE_1 = {
  kind: "video" as const,
  src: "sections/the-experience-1.mov",
};
const IMAGE_THE_EXPERIENCE_2 = {
  kind: "video" as const,
  src: "sections/the-experience-2.mov",
};
const IMAGE_THE_EXPERIENCE_3 = {
  kind: "video" as const,
  src: "sections/the-experience-3.mov",
};
const IMAGE_THE_EXPERIENCE_4 = {
  kind: "video" as const,
  src: "sections/the-experience-4.mov",
};
const IMAGE_THE_EXPERIENCE_5 = {
  kind: "video" as const,
  src: "sections/the-experience-5.mov",
};
const IMAGE_THE_EXPERIENCE_6 = {
  kind: "video" as const,
  src: "sections/the-experience-6.mov",
};
/** Image above "Role of AI" */
const IMAGE_ROLE_OF_AI = {
  kind: "image" as const,
  src: "sections/role-of-ai.png",
};

type Block =
  | {
      type: "header";
      title: string;
      subtitle?: string;
      badges?: Array<{ label: string; icon?: string }>;
      heroMedia?: { kind: "image" | "video"; src: string; poster?: string };
      showHero?: boolean;
      overviewRight?: { heading?: string; paragraphs: string[] };
      backHref?: string;
    }
  | { type: "divider" }
  | {
      type: "imageLarge";
      media: { kind: "image" | "video"; src: string; poster?: string };
      width?: number;
    }
  | {
      type: "imageSmall";
      left: { kind: "image" | "video"; src: string; poster?: string };
      right: { kind: "image" | "video"; src: string; poster?: string };
      /** Optional per-row objectFit for ImageSmall (\"contain\" to fit without cropping, \"cover\" to fill frame). */
      objectFit?: "contain" | "cover";
    }
  | {
      type: "imageSmallCentered";
      media: { kind: "image" | "video"; src: string; poster?: string };
    }
  | {
      type: "imageSmallCentered";
      media: { kind: "image" | "video"; src: string; poster?: string };
    }
  | {
      type: "text";
      heading?: string;
      content?: string;
      contentKey?: IkeaComplementarySetsContentKey;
    }
  | { type: "quote"; content?: string; contentKey?: IkeaComplementarySetsContentKey; size?: "default" | "large" | "4xl" }
  | { type: "impact"; content?: string }
  | { type: "otherProjects" }
  | { type: "footer"; variant?: "default" | "alt" };

function getBlocks(overview?: ProjectOverviewContent): Block[] {
  const c = ikeaComplementarySetsCopy;
  return [
    {
      type: "header",
      title: "",
      subtitle: "",
      badges: [],
      heroMedia: undefined,
      overviewRight: overview
        ? { heading: overview.heading, paragraphs: overview.paragraphs }
        : undefined,
      backHref: "/",
    },
    { type: "divider" },
    { type: "imageLarge", media: IMAGE_THE_SOLUTION },
    {
      type: "text",
      contentKey: "theSolution",
    },
    { type: "divider" },
    { type: "imageLarge", media: IMAGE_WHY_THIS_MATTERED },
    {
      type: "text",
      contentKey: "whyThisMattered",
    },
    { type: "divider" },
    {
      type: "imageSmall",
      left: IMAGE_DESIGN_INTENT_LEFT,
      right: IMAGE_DESIGN_INTENT_RIGHT,
      objectFit: "contain",
    },
    {
      type: "text",
      contentKey: "designIntent",
    },
    { type: "divider" },
    {
      type: "imageSmallCentered",
      media: IMAGE_THE_EXPERIENCE_1,
    },
    { type: "imageLarge", media: IMAGE_THE_EXPERIENCE_2 },
    { type: "imageLarge", media: IMAGE_THE_EXPERIENCE_3 },
    { type: "imageLarge", media: IMAGE_THE_EXPERIENCE_4 },
    { type: "imageLarge", media: IMAGE_THE_EXPERIENCE_5 },
    { type: "imageLarge", media: IMAGE_THE_EXPERIENCE_6 },
    {
      type: "text",
      contentKey: "theExperience",
    },
    { type: "divider" },
    { type: "imageLarge", media: IMAGE_ROLE_OF_AI },
    {
      type: "text",
      contentKey: "roleOfAI",
    },
    { type: "divider" },
    {
      type: "text",
      contentKey: "howUsersReacted",
    },
    { type: "quote", contentKey: "userQuote", size: "4xl" },
    { type: "divider" },
    {
      type: "text",
      contentKey: "personalInsight",
    },
    { type: "divider" },
    { type: "impact", content: c.impactDummy },
    { type: "otherProjects" },
    { type: "footer", variant: "default" },
    { type: "footer", variant: "alt" },
  ];
}

function getTextFromCopy(
  key: IkeaComplementarySetsContentKey
): { heading?: string; content: string } {
  const section = ikeaComplementarySetsCopy[key];
  if (typeof section === "string") {
    return { content: section };
  }
  if (section && typeof section === "object" && "content" in section) {
    return {
      heading: (section as { heading?: string }).heading,
      content: (section as { content: string }).content,
    };
  }
  return { content: "" };
}

function renderBlock(
  block: Block,
  index: number,
  projectTitle: string,
  projectSubtitle: string,
  projectBadges: Array<{ label: string; icon?: string }>,
  heroMedia: { kind: "image" | "video"; src: string; poster?: string } | undefined,
  overviewLeft: ProjectOverviewLeft | undefined,
  overviewRight: ProjectOverviewContent | undefined
) {
  switch (block.type) {
    case "header":
      return (
        <HeaderBlock
          key={index}
          title={projectTitle}
          subtitle={projectSubtitle}
          badges={projectBadges}
          heroMedia={heroMedia}
          showHero={true}
          overviewLeft={overviewLeft}
          overviewRight={
            overviewRight
              ? { heading: overviewRight.heading, paragraphs: overviewRight.paragraphs }
              : undefined
          }
          backHref="/"
        />
      );
    case "divider":
      return <DividerBlock key={index} />;
    case "imageLarge":
      return (
        <ImageLargeBlock
          key={index}
          media={block.media}
          width={block.width}
        />
      );
    case "imageSmall":
      return (
        <ImageSmallBlock
          key={index}
          left={block.left}
          right={block.right}
          objectFit={block.objectFit}
        />
      );
    case "imageSmallCentered":
      return (
        <div key={index} className="flex justify-center py-6 md:py-8">
          <div
            className="relative rounded-[12px] overflow-hidden w-full max-w-[447px] min-w-0"
            style={{ aspectRatio: "447/623" }}
          >
            <MediaFrame
              kind={block.media.kind}
              src={block.media.src}
              poster={block.media.poster}
              aspectClassName="h-full w-full"
              objectFit="cover"
              aspectRatio="447/623"
            />
          </div>
        </div>
      );
    case "text": {
      const { heading, content } = block.contentKey
        ? getTextFromCopy(block.contentKey)
        : { heading: block.heading, content: block.content ?? "" };
      return <TextBlock key={index} heading={heading} content={content} />;
    }
    case "quote": {
      const quoteContent = block.contentKey
        ? (ikeaComplementarySetsCopy[block.contentKey] as string) ?? block.content ?? ""
        : block.content ?? "";
      return <QuoteBlock key={index} content={quoteContent} size={block.size} />;
    }
    case "impact":
      return <Impact key={index} content={block.content} />;
    case "otherProjects":
      return <OtherProjects key={index} />;
    case "footer":
      return <Footer key={index} variant={block.variant ?? "default"} />;
    default:
      return null;
  }
}

export default function FromSingleProductsToComplementarySetsPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const project = getProjectBySlug(PROJECT_SLUG);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cleanup = initReveal(root);
    return cleanup;
  }, []);

  if (!project) {
    notFound();
  }

  const heroMedia = project.media
    ? {
        kind: project.media.type as "image" | "video",
        src: project.media.src,
      }
    : undefined;

  const blocks = getBlocks(project.overview);
  // Override header with project data (blocks[0] is header placeholder)
  blocks[0] = {
    ...blocks[0],
    type: "header",
    title: project.title,
    subtitle: project.description,
    badges: project.badges,
    heroMedia,
    overviewRight: project.overview
      ? { heading: project.overview.heading, paragraphs: project.overview.paragraphs }
      : undefined,
    backHref: "/",
  };

  return (
    <ProjectMediaBaseProvider basePath={MEDIA_BASE}>
      <main className="pt-[144px] pb-0 relative">
        <Container>
          <div ref={rootRef}>
            {blocks.map((block, index) =>
              renderBlock(
                block,
                index,
                project.title,
                project.description,
                project.badges,
                heroMedia,
                project.overviewLeft,
                project.overview
              )
            )}
          </div>
        </Container>
        <ScrollToTop />
      </main>
    </ProjectMediaBaseProvider>
  );
}
