"use client";

import { createContext, useContext } from "react";

const DEFAULT_BASE = "/media/projects/rotera";

const ProjectMediaBaseContext = createContext<string>(DEFAULT_BASE);

export function ProjectMediaBaseProvider({
  basePath,
  children,
}: {
  basePath: string;
  children: React.ReactNode;
}) {
  return (
    <ProjectMediaBaseContext.Provider value={basePath}>
      {children}
    </ProjectMediaBaseContext.Provider>
  );
}

export function useProjectMediaBase(): string {
  return useContext(ProjectMediaBaseContext) ?? DEFAULT_BASE;
}
