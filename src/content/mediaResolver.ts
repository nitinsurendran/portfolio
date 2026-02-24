import { Media } from "./types";
import { roteraManifest } from "./projects/rotera.manifest";

type Manifest = readonly string[];

/**
 * Map of slug to project folder name (for media paths)
 * The slug in the URL may differ from the folder name
 */
const SLUG_TO_FOLDER: Record<string, string> = {
  "rotera": "rotera",
  "reimagining-3d-product-exploration-at-ikea": "rotera", // Legacy slug support
};

/**
 * Map of slug to manifest
 */
const MANIFESTS: Record<string, Manifest> = {
  "rotera": roteraManifest,
  "reimagining-3d-product-exploration-at-ikea": roteraManifest, // Legacy slug support
};

/**
 * Gets the project folder name for a slug
 */
function getProjectFolder(slug: string): string {
  return SLUG_TO_FOLDER[slug] || slug;
}

/**
 * Gets the manifest for a slug
 */
export function getManifest(slug: string): Manifest {
  return MANIFESTS[slug] || [];
}

/**
 * Checks if a path exists in the manifest
 * Manifest paths are relative (e.g., "hero/hero.mov")
 * We check both the exact path and normalized versions
 */
function hasFile(manifest: Manifest, relativePath: string): boolean {
  // Normalize: remove leading/trailing slashes, handle both formats
  const normalized = relativePath.replace(/^\/+|\/+$/g, "");
  const found = manifest.some(entry => {
    const entryNormalized = entry.replace(/^\/+|\/+$/g, "");
    const matches = entryNormalized === normalized || entryNormalized === relativePath || entry === relativePath;
    return matches;
  });
  // TEMP DEV: Debug manifest matching
  if (!found && relativePath.includes("section1")) {
    console.log("[hasFile] Not found:", { relativePath, normalized, manifestEntries: manifest.filter(e => e.includes("section1")) });
  }
  return found;
}

/**
 * Resolves hero media for a project
 * Priority: video (.mov > .mp4) > image (.jpg > .png)
 * Poster: project-specific > shared
 */
export function resolveHeroMedia(slug: string, manifest?: Manifest): Media {
  // TEMP: Hardcode hero for rotera to test
  if (slug === "rotera" || slug === "reimagining-3d-product-exploration-at-ikea") {
    return {
      kind: "video",
      src: "/media/projects/rotera/hero/hero.mov",
      poster: "/media/projects/rotera/posters/hero.jpg",
      preload: "metadata",
    };
  }
  
  // Use provided manifest or get from map
  const projectManifest = manifest || getManifest(slug);
  const projectFolder = getProjectFolder(slug);
  const basePath = `/media/projects/${projectFolder}`;
  const sharedPath = `/media/projects/_shared`;
  
  // Video candidates (priority: .mov > .mp4)
  const videoCandidates = [
    `${basePath}/hero/hero.mov`,
    `${basePath}/hero/hero.mp4`,
  ];
  
  // Image candidates (priority: .jpg > .png)
  const imageCandidates = [
    `${basePath}/hero/hero.jpg`,
    `${basePath}/hero/hero.png`,
  ];
  
  // Poster candidates (project-specific > shared)
  const posterCandidates = [
    `${basePath}/posters/hero.jpg`,
    `${sharedPath}/posters/hero.jpg`,
  ];
  
  // Check for video first
  for (const candidate of videoCandidates) {
    // Extract relative path: "/media/projects/rotera/hero/hero.mov" -> "hero/hero.mov"
    const relativePath = candidate.replace(`/media/projects/${projectFolder}/`, "");
    if (hasFile(projectManifest, relativePath)) {
      const poster = posterCandidates.find(p => {
        let posterRelative = p.replace(`/media/projects/${projectFolder}/`, "");
        if (posterRelative === p) {
          posterRelative = p.replace(`/media/projects/_shared/`, "");
        }
        return hasFile(projectManifest, posterRelative);
      });
      
      return {
        kind: "video",
        src: candidate,
        poster: poster || undefined,
        preload: "metadata",
      };
    }
  }
  
  // Check for image
  for (const candidate of imageCandidates) {
    const relativePath = candidate.replace(`/media/projects/${projectFolder}/`, "");
    if (hasFile(projectManifest, relativePath)) {
      return {
        kind: "image",
        src: candidate,
        alt: "Hero image",
      };
    }
  }
  
  // Fallback: empty placeholder
  return {
    kind: "image",
    src: "",
    alt: "Hero image",
  };
}

/**
 * Resolves large media (ImageLarge blocks)
 * Priority: video (.mov > .mp4) > image (.jpg > .png)
 * Poster: project-specific > shared
 */
export function resolveLargeMedia(slug: string, key: string, manifest?: Manifest): Media {
  // Use provided manifest or get from map
  const projectManifest = manifest || getManifest(slug);
  const projectFolder = getProjectFolder(slug);
  const basePath = `/media/projects/${projectFolder}`;
  const sharedPath = `/media/projects/_shared`;
  
  // Video candidates (priority: .mov > .mp4)
  const videoCandidates = [
    `${basePath}/sections/${key}.mov`,
    `${basePath}/sections/${key}.mp4`,
  ];
  
  // Image candidates (priority: .jpg > .png)
  const imageCandidates = [
    `${basePath}/sections/${key}.jpg`,
    `${basePath}/sections/${key}.png`,
  ];
  
  // Poster candidates (project-specific > shared)
  const posterCandidates = [
    `${basePath}/posters/${key}.jpg`,
    `${sharedPath}/posters/${key}.jpg`,
  ];
  
  // Check for video first
  for (const candidate of videoCandidates) {
    const relativePath = candidate.replace(`/media/projects/${projectFolder}/`, "");
    const found = hasFile(projectManifest, relativePath);
    if (found) {
      const poster = posterCandidates.find(p => {
        // Handle both project-specific and shared paths
        let posterRelative = p.replace(`/media/projects/${projectFolder}/`, "");
        if (posterRelative === p) {
          // It's a shared path
          posterRelative = p.replace(`/media/projects/_shared/`, "");
        }
        return hasFile(projectManifest, posterRelative);
      });
      
      return {
        kind: "video",
        src: candidate,
        poster: poster || undefined,
        preload: "metadata",
      };
    }
  }
  
  // Check for image
  for (const candidate of imageCandidates) {
    const relativePath = candidate.replace(`/media/projects/${projectFolder}/`, "");
    if (hasFile(projectManifest, relativePath)) {
      return {
        kind: "image",
        src: candidate,
        alt: `${key} image`,
      };
    }
  }
  
  // Fallback: empty placeholder
  return {
    kind: "image",
    src: "",
    alt: `${key} image`,
  };
}

/**
 * Resolves small media (ImageSmall blocks - left and right)
 * Priority: video (.mov > .mp4) > image (.jpg > .png) for each side
 * Poster: project-specific > shared for each side
 */
export function resolveSmallMedia(
  slug: string,
  key: string,
  manifest?: Manifest
): { left: Media; right: Media } {
  const projectManifest = manifest || getManifest(slug);
  const projectFolder = getProjectFolder(slug);
  const basePath = `/media/projects/${projectFolder}`;
  const sharedPath = `/media/projects/_shared`;
  
  const resolveSide = (side: "left" | "right"): Media => {
    const sideKey = `${key}-${side}`;
    
    // Video candidates (priority: .mov > .mp4)
    const videoCandidates = [
      `${basePath}/sections/${sideKey}.mov`,
      `${basePath}/sections/${sideKey}.mp4`,
    ];
    
    // Image candidates (priority: .jpg > .png)
    const imageCandidates = [
      `${basePath}/sections/${sideKey}.jpg`,
      `${basePath}/sections/${sideKey}.png`,
    ];
    
    // Poster candidates (project-specific > shared)
    const posterCandidates = [
      `${basePath}/posters/${sideKey}.jpg`,
      `${sharedPath}/posters/${sideKey}.jpg`,
    ];
    
    // Check for video first
    for (const candidate of videoCandidates) {
      const relativePath = candidate.replace(`/media/projects/${projectFolder}/`, "");
      if (hasFile(projectManifest, relativePath)) {
        const poster = posterCandidates.find(p => {
          // Handle both project-specific and shared paths
          let posterRelative = p.replace(`/media/projects/${projectFolder}/`, "");
          if (posterRelative === p) {
            // It's a shared path
            posterRelative = p.replace(`/media/projects/_shared/`, "");
          }
          return hasFile(projectManifest, posterRelative);
        });
        
        return {
          kind: "video",
          src: candidate,
          poster: poster || undefined,
          preload: "metadata",
        };
      }
    }
    
    // Check for image
    for (const candidate of imageCandidates) {
      const relativePath = candidate.replace(`/media/projects/${projectFolder}/`, "");
      if (hasFile(projectManifest, relativePath)) {
        return {
          kind: "image",
          src: candidate,
          alt: `${sideKey} image`,
        };
      }
    }
    
    // Fallback: empty placeholder
    return {
      kind: "image",
      src: "",
      alt: `${sideKey} image`,
    };
  };
  
  return {
    left: resolveSide("left"),
    right: resolveSide("right"),
  };
}

