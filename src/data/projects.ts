import { resolveHeroMedia } from "@/content/mediaResolver";

export type BadgeItem = {
  label: string;
  icon?: string;
};

export type ProjectOverviewContent = {
  heading?: string;
  paragraphs: string[];
};

export type ProjectOverviewLeft = {
  industry?: string;
  whatIDid?: string;
  toolsUsed?: string;
  year?: string;
};

export type Project = {
  slug: string;
  title: string;
  description: string;
  badges: BadgeItem[];
  /** Optional year for display on cards and filtering (e.g. "2025", "2024"). */
  year?: string;
  images?: string[]; // Placeholder for future image paths
  type?: "work" | "experiment"; // Optional type field for filtering
  media?: {
    type: "video" | "image";
    src: string;
  };
  /** Optional zoom for card video thumbnail (e.g. 1.25) so subject appears closer. */
  thumbnailVideoScale?: number;
  /** Optional overview left column (Industry, What I did, Tools, Year) for project detail page. */
  overviewLeft?: ProjectOverviewLeft;
  /** Optional overview (right column) for project detail page. When set, overrides default in ProjectOverview. */
  overview?: ProjectOverviewContent;
};

// Work projects (current projects)
export const workProjects: Project[] = [
  // 1. Reimagining 3D Product Exploration at IKEA
  {
    slug: "rotera",
    title: "Reimagining 3D Product Exploration at IKEA",
    description:
      "A layered approach to 3D product exploration, adding context, scale, and intent over time to support confident home decisions.",
    badges: [
      {
        label: "Spatial Product Experience",
        icon: "sparkles",
      },
      {
        label: "3D Commerce Systems",
        icon: "cuboid",
      },
      {
        label: "Progressive Product Exploration",
        icon: "layers",
      },
    ],
    year: "2022 - 2024",
    type: "work",
    media: {
      type: "video",
      src: "/media/projects/rotera/hero/hero.mov",
    },
  },
  // 2. From Single Products to Complementary Sets at IKEA
  {
    slug: "from-single-products-to-complementary-sets-at-ikea",
    title: "From Single Products to Complementary Sets at IKEA",
    description:
      "Designing confidence into multi-product decisions",
    badges: [
      {
        label: "Contextual Suggestions",
        icon: "sparkles",
      },
      {
        label: "3D Product Bundling",
        icon: "cuboid",
      },
    ],
    year: "2023 - 2024",
    type: "work",
    media: {
      type: "video",
      src: "/media/projects/from-single-products-to-complementary-sets-at-ikea/hero/hero.mov",
    },
    overviewLeft: {
      industry: "Home furnishing, E-commerce, Spatial Computing",
      whatIDid: "UX/Product Design, 3D Prototyping, Conceptualisation",
      toolsUsed: "Figma, Blender",
      year: "2025",
    },
    overview: {
      heading: "Overview",
      paragraphs: [
        "Complete the Look rethinks how complementary furniture and accessories are discovered and selected online. Embedded within the 3D product experience, it allows customers to explore, add, and customise related items directly in context, one at a time. The experience is designed to reduce cognitive load, avoid forced bundles, and support confident decision-making through spatial clarity - using AI-assisted recommendations as guidance rather than persuasion.",
      ],
    },
  },
  // 3. IKEA Embedded Storage Experiences
  {
    slug: "ikea-embedded-storage",
    title: "IKEA Embedded Storage Experiences",
    description:
      "Designing how people imagine and interact with storage",
    badges: [
      { label: "Work in progress", icon: "clock" },
      { label: "Embedded Experiences", icon: "box" },
      { label: "Spatial Interaction Design", icon: "layers" },
    ],
    year: "2025 - ongoing",
    type: "work",
    media: {
      type: "video",
      src: "/media/projects/ikea-embedded-storage/hero/hero.mov",
    },
    thumbnailVideoScale: 1.25,
  },
  // 4. BEAT - Driver's Request Screen
  {
    slug: "beat",
    title: "BEAT - Driver's Request Screen",
    description:
      "How small changes in timing, language, and information hierarchy reshaped driver behavior in a real-time marketplace",
    badges: [
      {
        label: "Mobility & Ride-hailing",
        icon: "sparkles",
      },
      {
        label: "UX Research & Product Design",
        icon: "layers",
      },
    ],
    year: "2021",
    type: "work",
    media: {
      type: "video",
      src: "/media/projects/beat/hero/hero.mp4",
    },
  },
  // 5. Cybernetic Landscapes
  {
    slug: "cybernetic-landscapes",
    title: "Cybernetic Landscapes",
    description:
      "Agentic ecological intelligence for long-term land performance.",
    badges: [
      {
        label: "Climate Intelligence",
        icon: "sparkles",
      },
      {
        label: "AI-Native Systems",
        icon: "cpu",
      },
      {
        label: "Founding Designer",
        icon: "layers",
      },
    ],
    year: "2024 - ongoing",
    type: "work",
    media: {
      type: "image",
      src: "/media/projects/cybernetic-landscapes/hero/hero.png",
    },
  },
];

// Experiment projects (placeholders - reuse same structure)
export const experimentProjects: Project[] = [
  {
    slug: "loop",
    title: "Loop",
    description:
      "A sensory toy system: designed in wood, shaped through 3D printing, and brought to life with embedded interaction.",
    badges: [
      {
        label: "Tangible Interaction Design",
        icon: "hand",
      },
      {
        label: "Rapid Prototyping",
        icon: "box",
      },
      {
        label: "Embedded Interaction (Sensors + Sound)",
        icon: "radio",
      },
    ],
    year: "2020",
    type: "experiment",
    media: {
      type: "image",
      src: "/media/projects/loop/hero/hero.png",
    },
  },
  {
    slug: "digital-rams",
    title: "Digital Rams",
    description:
      "Translating Industrial Design into Spatial Digital Interaction",
    badges: [
      {
        label: "3D Interaction Design",
        icon: "cuboid",
      },
      {
        label: "Motion & Micro-Interactions",
        icon: "activity",
      },
      {
        label: "Experimental Prototyping",
        icon: "flaskConical",
      },
    ],
    year: "2020",
    type: "experiment",
    media: {
      type: "image",
      src: "/media/projects/digital-rams/hero/hero.png",
    },
  },
  {
    slug: "newten",
    title: "NewTen",
    description:
      "A physical interface for tuning credible news by distance, allowing you to explore information at different geographical scales.",
    badges: [
      {
        label: "Tangible Interface",
        icon: "hand",
      },
      {
        label: "Speculative Design",
        icon: "sparkles",
      },
      {
        label: "Physical Computing (Arduino)",
        icon: "radio",
      },
    ],
    year: "2020",
    type: "experiment",
    media: {
      type: "image",
      src: "/media/projects/newten/hero/hero.png", // card thumbnail
    },
  },
];

// Archive projects (older projects from archives)
export const archiveProjects: Project[] = [
  {
    slug: "archive-1",
    title: "Archive Project 1",
    description:
      "An archived project showcasing past work and design explorations. This project demonstrates various design principles and methodologies.",
    badges: [
      {
        label: "Archive",
        icon: "sparkles",
      },
      {
        label: "Past Work",
        icon: "layers",
      },
    ],
    type: "work",
  },
  {
    slug: "archive-2",
    title: "Archive Project 2",
    description:
      "Another archived project from previous design work. This represents earlier explorations and design thinking.",
    badges: [
      {
        label: "Exploration",
        icon: "cuboid",
      },
      {
        label: "Research",
        icon: "cpu",
      },
    ],
    type: "work",
  },
  {
    slug: "archive-3",
    title: "Archive Project 3",
    description:
      "A third archived project highlighting different aspects of design work and creative problem-solving approaches.",
    badges: [
      {
        label: "Concept",
        icon: "sparkles",
      },
      {
        label: "Prototype",
        icon: "layers",
      },
    ],
    type: "work",
  },
];

// Combined array for backward compatibility
export const projects: Project[] = [...workProjects, ...experimentProjects, ...archiveProjects];

// Helper to get project by slug
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

// Thumbnail for cards/other projects: main thumbnail if image, else hero image (or video poster / video src)
export function getProjectThumbnailUrl(project: Project): string {
  // 1. If project explicitly has an image hero, use it.
  if (project.media?.type === "image") {
    return project.media.src;
  }

  // 2. For video heroes, try to use a poster or resolved image.
  if (project.media?.type === "video") {
    const hero = resolveHeroMedia(project.slug);
    if (hero.kind === "video" && hero.poster) return hero.poster;
    if (hero.kind === "image" && hero.src) return hero.src;
    // If no poster/image is available, fall back to the video src itself.
    return project.media.src;
  }

  // 3. Final fallback: conventional hero placeholder.
  // Every project that doesn't have a specific hero image should have this asset.
  return `/media/projects/${project.slug}/hero/hero-placeholder.svg`;
}

