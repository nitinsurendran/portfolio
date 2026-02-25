"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectCard } from "./ProjectCard";
import { Collabs } from "./Collabs";
import { Footer } from "./Footer";
import { workProjects, experimentProjects } from "@/data/projects";

export function SelectProjects() {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"work" | "experiments">(
    tabFromUrl === "experiments" ? "experiments" : "work"
  );
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const tabsListRef = useRef<HTMLDivElement>(null);
  const workTriggerRef = useRef<HTMLButtonElement>(null);
  const experimentsTriggerRef = useRef<HTMLButtonElement>(null);

  const updatePillPosition = useCallback(() => {
    const activeTrigger = activeTab === "work" ? workTriggerRef.current : experimentsTriggerRef.current;
    const tabsList = tabsListRef.current;
    
    if (activeTrigger && tabsList) {
      const tabsListRect = tabsList.getBoundingClientRect();
      const triggerRect = activeTrigger.getBoundingClientRect();
      
      setPillStyle({
        left: triggerRect.left - tabsListRect.left,
        width: triggerRect.width,
      });
    }
  }, [activeTab]);

  // Initial mount: set pill position after DOM is ready
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is fully rendered
    const rafId = requestAnimationFrame(() => {
      updatePillPosition();
    });
    return () => cancelAnimationFrame(rafId);
  }, [updatePillPosition]);

  // When landing with ?tab=experiments (e.g. back from experiment project), show Experiments tab
  useEffect(() => {
    const t = searchParams.get("tab");
    if (t === "experiments" && activeTab !== "experiments") setActiveTab("experiments");
  }, [searchParams, activeTab]);

  // Update pill position when active tab changes or window resizes
  useEffect(() => {
    updatePillPosition();
    
    const handleResize = () => {
      updatePillPosition();
    };
    
    window.addEventListener("resize", handleResize);
    
    // Use requestAnimationFrame to ensure DOM is updated after tab change
    const rafId = requestAnimationFrame(() => {
      updatePillPosition();
    });
    
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
    };
  }, [activeTab, updatePillPosition]);

  return (
    <section className="py-16" data-reveal="projects">
      <div className="flex flex-col gap-[25px]">
        {/* MCP: gap-[25px] between Title and Tabs */}
        <h2 className="font-sans text-xl font-bold leading-7 text-foreground">
          {/* Matches Intro/Description typography but with bold weight */}
          Selected Projects:
        </h2>
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v === "experiments" ? "experiments" : "work")}
          className="w-full"
        >
          <div className="relative" ref={tabsListRef}>
            <TabsList className="rounded-full p-1">
              <TabsTrigger 
                value="work" 
                className="rounded-full px-4 py-1.5 relative z-10 transition-colors duration-150 ease-out motion-reduce:transition-none cursor-pointer" 
                ref={workTriggerRef}
              >
                Work
              </TabsTrigger>
              <TabsTrigger 
                value="experiments" 
                className="rounded-full px-4 py-1.5 relative z-10 transition-colors duration-150 ease-out motion-reduce:transition-none cursor-pointer" 
                ref={experimentsTriggerRef}
              >
                Experiments
              </TabsTrigger>
            </TabsList>
            {/* Animated pill indicator */}
            <div
              className="absolute top-1 bottom-1 rounded-full bg-background dark:bg-input/30 pointer-events-none transition-[left,width] duration-[280ms] ease-out motion-reduce:transition-none"
              style={{
                left: `${pillStyle.left}px`,
                width: `${pillStyle.width}px`,
              }}
              aria-hidden="true"
            />
          </div>
          {/* MCP: gap-[12px] between Tabs and first ProjectCard, and between ProjectCard items */}
          <TabsContent value="work" className="mt-[12px] flex flex-col gap-0">
            {/* Work projects: map over workProjects array */}
            <div className="flex flex-col gap-[12px]" data-reveal-group="project-cards">
              {workProjects.map((project) => (
                <div key={project.slug} className="py-[10px]" data-reveal-item="project-card">
                  {/* MCP: ProjectList wrapper has py-[10px] */}
                  <ProjectCard
                    slug={project.slug}
                    title={project.title}
                    description={project.description}
                    badges={project.badges}
                    year={project.year}
                    videoSrc={project.media?.type === "video" ? project.media.src : undefined}
                    thumbnailSrc={project.media?.type === "image" ? project.media.src : undefined}
                    thumbnailVideoScale={project.thumbnailVideoScale}
                    fromTab="work"
                  />
                </div>
              ))}
            </div>
            <Collabs />
            <Footer variant="default" />
            <Footer variant="alt" />
          </TabsContent>
          <TabsContent value="experiments" className="mt-[12px] flex flex-col gap-0">
            {/* Experiment projects: map over experimentProjects array */}
            <div className="flex flex-col gap-[12px]" data-reveal-group="project-cards">
              {experimentProjects.map((project) => (
                <div key={project.slug} className="py-[10px]" data-reveal-item="project-card">
                  {/* MCP: ProjectList wrapper has py-[10px] */}
                  <ProjectCard
                    slug={project.slug}
                    title={project.title}
                    description={project.description}
                    badges={project.badges}
                    year={project.year}
                    videoSrc={project.media?.type === "video" ? project.media.src : undefined}
                    thumbnailSrc={project.media?.type === "image" ? project.media.src : undefined}
                    thumbnailVideoScale={project.thumbnailVideoScale}
                    fromTab="experiments"
                  />
                </div>
              ))}
            </div>
            {/* Collaboration and Connect sections inside Experiments tab so they are visible when tab is active */}
            <Collabs />
            <Footer variant="default" />
            <Footer variant="alt" />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

