"use client";

import { createContext, useContext } from "react";

const DEFAULT_BASE = "/media/projects/rotera";

type MediaBaseValue = { basePath: string; cacheBust?: string };

const ProjectMediaBaseContext = createContext<MediaBaseValue>({ basePath: DEFAULT_BASE });

export function ProjectMediaBaseProvider({
  basePath,
  cacheBust,
  children,
}: {
  basePath: string;
  /** Optional cache-bust string (e.g. "2") appended as ?v= to media URLs so updated assets are fetched */
  cacheBust?: string;
  children: React.ReactNode;
}) {
  return (
    <ProjectMediaBaseContext.Provider value={{ basePath, cacheBust }}>
      {children}
    </ProjectMediaBaseContext.Provider>
  );
}

export function useProjectMediaBase(): string {
  return useContext(ProjectMediaBaseContext).basePath ?? DEFAULT_BASE;
}

export function useProjectMediaCacheBust(): string | undefined {
  return useContext(ProjectMediaBaseContext).cacheBust;
}
