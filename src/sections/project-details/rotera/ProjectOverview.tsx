import type { ProjectOverviewContent } from "@/data/projects";

type ProjectOverviewProps = {
  /** When provided, used for the right column (heading + paragraphs). Otherwise shows default Rotera overview. */
  overviewRight?: ProjectOverviewContent;
};

const DEFAULT_OVERVIEW: ProjectOverviewContent = {
  heading: "Exploring the Role of 3D in Product Decisions",
  paragraphs: [
    "Digital product pages have traditionally been built around static images and specifications, even when customers are making inherently spatial decisions - about size, fit, proportion, and how a product relates to their home. This case study explores how 3D can move beyond visual novelty and become a meaningful tool for understanding products in space.",
    "Over multiple iterations, I worked on evolving IKEA's 3D product experience from a simple viewer into a progressively richer exploration system. Each version intentionally added a new layer of understanding: starting with basic product inspection, then introducing shoppability, dimensional clarity, and finally room-level context through integration with IKEA Kreativ and IKEA Planners.",
  ],
};

export function ProjectOverview({ overviewRight }: ProjectOverviewProps) {
  const right = overviewRight ?? DEFAULT_OVERVIEW;
  const heading = right.heading ?? "Overview";
  return (
    <div data-reveal="overview" className="flex flex-col md:flex-row gap-6 md:gap-12 items-start py-8 min-w-0">
      <div className="flex flex-col gap-5 relative w-full max-w-[476px] min-w-0">
        <div className="flex flex-col gap-[2px]">
          <p className="font-sans text-base font-normal leading-6 text-foreground">
            Industry
          </p>
          <p className="font-sans text-base font-normal leading-6 text-muted-foreground">
            Home furnishing, E-commerce, Spatial Computing
          </p>
        </div>
        <div className="flex flex-col gap-[2px]">
          <p className="font-sans text-base font-normal leading-6 text-foreground">
            What I did
          </p>
          <p className="font-sans text-base font-normal leading-6 text-muted-foreground w-[289px]">
            UX/Product Design, 3D Prototyping, Conceptualisation
          </p>
        </div>
        <div className="flex flex-col gap-[2px]">
          <p className="font-sans text-base font-normal leading-6 text-foreground">
            Tools used
          </p>
          <p className="font-sans text-base font-normal leading-6 text-muted-foreground">
            Figma, Blender
          </p>
        </div>
        <div className="flex flex-col gap-[2px]">
          <p className="font-sans text-base font-normal leading-6 text-foreground">
            Year
          </p>
          <p className="font-sans text-base font-normal leading-6 text-muted-foreground">
            2022 - 2024
          </p>
        </div>
      </div>
      <div className="flex flex-col items-start relative w-full max-w-[431px] min-w-0">
        <div className="flex flex-col gap-[10px] items-start w-full min-w-0">
          <p className="font-sans text-base font-normal leading-6 text-foreground">
            {heading}
          </p>
          <div className="leading-6 text-muted-foreground w-full max-w-[421px] min-w-0">
            {right.paragraphs.map((paragraph, index) => (
              <p key={index} className={index > 0 ? "mt-4 mb-0" : "mb-0"}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

