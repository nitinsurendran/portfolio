"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
  workProjects,
  experimentProjects,
  getProjectThumbnailUrl,
  type Project,
} from "@/data/projects";
import { useTheme } from "next-themes";
import { setStoredThemeBeforeDetail } from "@/lib/theme-detail";

const mainList: Project[] = [...workProjects, ...experimentProjects];

function getNextThreeProjects(currentSlug: string): Project[] {
  const n = mainList.length;
  if (n === 0) return [];
  const currentIndex = mainList.findIndex((p) => p.slug === currentSlug);
  if (currentIndex === -1) return mainList.slice(0, Math.min(3, n));
  return [1, 2, 3].map((offset) => mainList[(currentIndex + offset) % n]);
}

export function OtherProjects() {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const currentSlug = (pathname ?? "").replace(/^\/projects\/?/, "").split("/")[0] ?? "";
  const otherProjects = getNextThreeProjects(currentSlug);

  return (
    <div data-reveal="otherProjects" className="flex flex-col md:flex-row gap-6 md:gap-[83px] items-start py-14 min-w-0">
      <div className="flex items-center justify-center shrink-0 min-w-0">
        <p className="font-sans text-3xl md:text-5xl font-semibold leading-tight md:leading-[48px] text-foreground">
          Other projects
        </p>
      </div>
      <div className="flex flex-col items-start relative w-full max-w-[544px] min-w-0">
        {otherProjects.map((project, index) => {
          const thumbnailUrl = getProjectThumbnailUrl(project);
          const isVideoThumb = /\.(mov|mp4|webm)$/i.test(thumbnailUrl);
          return (
          <div key={project.slug}>
            <Link
              href={`/projects/${project.slug}`}
              className="group flex gap-4 items-center p-4 relative shrink-0 w-full hover:bg-accent hover:text-accent-foreground transition-colors duration-300 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              onClick={() => {
                if (resolvedTheme === "light" || resolvedTheme === "dark") {
                  setStoredThemeBeforeDetail(resolvedTheme);
                }
              }}
            >
              <div className="relative rounded-sm shrink-0 size-16 overflow-hidden bg-muted">
                {isVideoThumb ? (
                  <video
                    src={thumbnailUrl}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="object-cover size-full"
                  />
                ) : (
                  // Using native img for robustness
                  <img
                    src={thumbnailUrl}
                    alt=""
                    width={64}
                    height={64}
                    className="object-cover size-full"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="basis-0 flex flex-col gap-1 grow items-start min-h-px min-w-px relative shrink-0">
                <div className="flex items-center justify-center relative shrink-0">
                  <p className="font-sans text-sm font-medium leading-5 text-foreground">
                    {project.title}
                  </p>
                </div>
                <div className="flex items-center justify-center relative shrink-0 w-full">
                  <p className="font-sans text-sm font-normal leading-5 text-muted-foreground">
                    {project.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center relative rounded-full shrink-0 size-9 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </div>
            </Link>
            {index < otherProjects.length - 1 && (
              <div className="h-px w-full bg-border my-0" />
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}

