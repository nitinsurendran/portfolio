export type MediaKind = "image" | "video";

export type Media = {
  kind: MediaKind;
  src: string; // supports .mp4, .mov, .jpg, .png, .webp, etc
  poster?: string; // for video
  alt?: string; // for images
  preload?: "none" | "metadata" | "auto";
};

export type ProjectBlock =
  | { type: "ProjectTitle" }
  | { type: "BackNavigation" }
  | { type: "ProjectDescription"; description?: string; badges?: Array<{ label: string; icon?: string }> }
  | { type: "HeroMedia"; key: string } // key like "hero"
  | { type: "ProjectOverview" }
  | { type: "ImageLarge"; key: string; width?: number } // key like "section1"
  | { type: "ImageSmall"; key: string } // key like "section1"
  | { type: "Body"; content: string[]; heading?: string } // paragraphs as array, preserves line breaks
  | { type: "Divider" }
  | { type: "Impact" }
  | { type: "OtherProjects" }
  | { type: "Footer"; variant?: "default" | "alt" };

export type ProjectContent = {
  slug: string;
  title: string;
  description: string;
  badges?: Array<{ label: string; icon?: string }>;
  blocks: ProjectBlock[];
};

