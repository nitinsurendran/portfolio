"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const viewerContainerClass =
  "flex h-40 max-w-[220px] items-center justify-center rounded-md overflow-hidden";

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
  return (
    <section className="pt-[30px] pb-[10px]" data-reveal="description">
      {/* MCP: Description has pt-[30px], pb-[10px], and internal gap-[20px] */}
      <div className="flex flex-col gap-5">
        {/* gap-5 = 20px (MCP gap-[20px]) */}
        <div className={viewerContainerClass}>
          <Suspense fallback={<LoadingFallback />}>
            <ModelViewer src="/models/portfoliochair.glb" />
          </Suspense>
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
