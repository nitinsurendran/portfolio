"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef, useState } from "react";
import { shouldAllowHeavy3D } from "@/lib/media/bandwidth";

const viewerContainerClass =
  "flex h-40 max-w-[220px] items-center justify-center rounded-md overflow-hidden";

function ViewerPlaceholder({
  onEnable,
  allow3D,
}: {
  onEnable: () => void;
  allow3D: boolean;
}) {
  return (
    <div className="w-full h-full min-h-[10rem] flex items-center justify-center bg-muted/30 rounded-md">
      {allow3D ? (
        <button
          type="button"
          onClick={onEnable}
          className="text-sm text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
        >
          Enable 3D
        </button>
      ) : null}
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="w-full h-full min-h-[10rem] flex items-center justify-center bg-muted/30 rounded-md">
      <span className="text-sm text-muted-foreground">Loading…</span>
    </div>
  );
}

const ModelViewer = dynamic(
  () => import("@/components/three/ModelViewer").then((m) => m.default),
  { ssr: false, loading: LoadingFallback }
);

export function Description() {
  const [enabled, setEnabled] = useState(false);
  const [inView, setInView] = useState(false);
  const [allow3D, setAllow3D] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAllow3D(shouldAllowHeavy3D());
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { rootMargin: "200px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const showViewer = enabled && inView && allow3D;

  return (
    <section
      className="pt-[30px] pb-[10px]"
      data-reveal="description"
      ref={sectionRef}
    >
      {/* MCP: Description has pt-[30px], pb-[10px], and internal gap-[20px] */}
      <div className="flex flex-col gap-5">
        {/* gap-5 = 20px (MCP gap-[20px]) */}
        <div className={viewerContainerClass}>
          {!showViewer ? (
            <ViewerPlaceholder
              onEnable={() => setEnabled(true)}
              allow3D={allow3D}
            />
          ) : (
            <Suspense fallback={<LoadingFallback />}>
              <ModelViewer src="/models/portfoliochair.glb" />
            </Suspense>
          )}
        </div>
        <p className="font-sans text-xl font-normal leading-7 text-foreground">
          {/* MCP: matches Intro paragraph - text-xl (20px), leading-7 (28px), text-foreground (slate-12) */}
          {/* TODO: Insert exact current role copy from Figma */}
          Currently - <span className="text-[#78350f] dark:text-amber-200">Product Designer at IKEA</span>, where I work alongside a crew of
          prototypers, engineers, and data scientists to push the boundaries of
          what&apos;s possible with <span className="text-[#78350f] dark:text-amber-200">3D, Spatial Commerce, and AI.</span>
        </p>
        {/* TODO: Replace with chair asset / 3D later */}
        {/* TODO: Confirm exact type size/line-height from Figma (Body/UI ~20px) */}
        {/* TODO: Confirm exact spacing between chair and text from Figma */}
        {/* TODO: Confirm exact chair size from Figma (target ~220px) */}
      </div>
    </section>
  );
}
