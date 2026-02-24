import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, Cuboid, Cpu, FlaskConical, Hand, Layers, Box, Radio, Sparkles } from "lucide-react";
import { ComponentType } from "react";
import { MediaFrame } from "../media/MediaFrame";

// Icon map: string identifier -> Lucide icon component
const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  activity: Activity,
  clock: Clock,
  sparkles: Sparkles,
  cuboid: Cuboid,
  layers: Layers,
  cpu: Cpu,
  hand: Hand,
  box: Box,
  radio: Radio,
  flaskConical: FlaskConical,
};

type HeaderBlockProps = {
  title: string;
  subtitle?: string;
  tags?: string[]; // Legacy support - will be converted to badges
  badges?: Array<{ label: string; icon?: string }>;
  heroMedia?: {
    kind: "image" | "video";
    src: string;
    poster?: string;
  };
  /** Zoom for hero video (e.g. 1.25) so subject appears closer; frame crops edges. */
  heroVideoScale?: number;
  /** When false, overview is shown but hero media is omitted (hero can be a separate block after divider) */
  showHero?: boolean;
  overviewLeft?: {
    industry?: string;
    whatIDid?: string;
    toolsUsed?: string;
    year?: string;
  };
  /** Optional labels for overview left column (e.g. "Role", "Date", "Deliverables", "Team") */
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
  backHref?: string; // Default "/"
};

const DEFAULT_LEFT_LABELS = {
  industry: "Industry",
  whatIDid: "What I did",
  toolsUsed: "Tools used",
  year: "Year",
};

export function HeaderBlock({
  title,
  subtitle,
  tags = [],
  badges,
  heroMedia,
  heroVideoScale,
  showHero = true,
  overviewLeft,
  overviewLeftLabels,
  overviewRight,
  backHref = "/",
}: HeaderBlockProps) {
  const leftLabels = { ...DEFAULT_LEFT_LABELS, ...overviewLeftLabels };
  // Convert tags to badges if badges not provided (legacy support)
  // If badges are provided, use them; otherwise convert tags to badges
  const displayBadges = badges || tags.map((tag) => {
    // Infer icon from tag label (same logic as before)
    const iconKey = tag.toLowerCase().includes("spatial") || tag.toLowerCase().includes("contextual")
      ? "sparkles"
      : tag.toLowerCase().includes("3d") || tag.toLowerCase().includes("bundling")
      ? "cuboid"
      : tag.toLowerCase().includes("progressive") || tag.toLowerCase().includes("exploration")
      ? "layers"
      : tag.toLowerCase().includes("commerce") || tag.toLowerCase().includes("systems")
      ? "cuboid"
      : undefined;
    return { label: tag, icon: iconKey };
  });
  return (
    <>
      {/* Back Navigation */}
      <div data-reveal="backNavigation" className="fixed left-[2px] top-px px-[38px] py-[12px] z-[10000]">
        <Link
          href={backHref}
          className="flex items-center justify-center p-[44px] hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md"
          aria-label="Back to homepage"
        >
          <div className="relative size-[48px]">
            <div className="absolute inset-0 rounded-full border-2 border-foreground/20 flex items-center justify-center">
              <ArrowLeft className="h-5 w-5 text-foreground" aria-hidden="true" />
            </div>
          </div>
        </Link>
      </div>

      {/* Title */}
      <div data-reveal="projectTitle" className="py-[10px]">
        <h1 className="font-sans text-[60px] font-normal leading-[60px] text-foreground">
          {title}
        </h1>
      </div>

      {/* Subtitle + Tags */}
      {subtitle && (
        <div data-reveal="projectDescription" className="flex flex-col gap-6 h-[113px] py-[10px]">
          <p className="font-sans text-xl font-normal leading-[28px] text-foreground w-[856px]">
            {subtitle}
          </p>
          {displayBadges.length > 0 && (
            <div className="flex gap-[10px]">
              {displayBadges.map((badge) => {
                const Icon = badge.icon ? ICONS[badge.icon] : null;
                return (
                  <Badge
                    key={badge.label}
                    variant="outline"
                    className="gap-1 h-[22px] px-2 py-[2px]"
                  >
                    {Icon && <Icon className="h-3 w-3" aria-hidden="true" />}
                    <span className="text-xs font-medium leading-4">{badge.label}</span>
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Hero Media */}
      {showHero && heroMedia && (
        <div data-reveal="hero" className="w-full h-[623px] relative rounded-[12px] overflow-hidden pt-8">
          <MediaFrame
            kind={heroMedia.kind}
            src={heroMedia.src}
            poster={heroMedia.poster}
            aspectClassName="h-full w-full"
            objectFit="cover"
            videoScale={heroVideoScale}
          />
        </div>
      )}

      {/* Overview Section */}
      {(overviewLeft || overviewRight) && (
        <div data-reveal="overview" className="flex flex-col md:flex-row gap-6 md:gap-12 items-start py-8 min-w-0">
          {overviewLeft && (
            <div className="flex flex-col gap-5 relative w-full max-w-[476px] min-w-0">
              {overviewLeft.industry && (
                <div className="flex flex-col gap-[2px]">
                  <p className="font-sans text-base font-normal leading-6 text-foreground">
                    {leftLabels.industry}
                  </p>
                  <p className="font-sans text-base font-normal leading-6 text-muted-foreground">
                    {overviewLeft.industry}
                  </p>
                </div>
              )}
              {overviewLeft.whatIDid && (
                <div className="flex flex-col gap-[2px]">
                  <p className="font-sans text-base font-normal leading-6 text-foreground">
                    {leftLabels.whatIDid}
                  </p>
                  <p className="font-sans text-base font-normal leading-6 text-muted-foreground w-[289px]">
                    {overviewLeft.whatIDid}
                  </p>
                </div>
              )}
              {overviewLeft.toolsUsed && (
                <div className="flex flex-col gap-[2px]">
                  <p className="font-sans text-base font-normal leading-6 text-foreground">
                    {leftLabels.toolsUsed}
                  </p>
                  <p className="font-sans text-base font-normal leading-6 text-muted-foreground">
                    {overviewLeft.toolsUsed}
                  </p>
                </div>
              )}
              {overviewLeft.year && (
                <div className="flex flex-col gap-[2px]">
                  <p className="font-sans text-base font-normal leading-6 text-foreground">
                    {leftLabels.year}
                  </p>
                  <p className="font-sans text-base font-normal leading-6 text-muted-foreground">
                    {overviewLeft.year}
                  </p>
                </div>
              )}
            </div>
          )}

          {overviewRight && (
            <div className="flex flex-col items-start relative w-full max-w-[431px] min-w-0">
              <div className="flex flex-col gap-[10px] items-start w-full">
                {overviewRight.heading && (
                  <p className="font-sans text-base font-normal leading-6 text-foreground">
                    {overviewRight.heading}
                  </p>
                )}
                {overviewRight.paragraphs && overviewRight.paragraphs.length > 0 && (
                  <div className="leading-6 text-muted-foreground w-[421px]">
                    {overviewRight.paragraphs.map((para, idx) => (
                      <p key={idx} className={idx === overviewRight.paragraphs!.length - 1 ? "mb-0" : "mb-0"}>
                        {para}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

