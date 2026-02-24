"use client";

import type { ReactNode } from "react";
import { CursorLayer } from "@/components/motion/CursorLayer";
import { OverflowDebug } from "@/components/dev/OverflowDebug";

export default function ClientProviders({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
      <CursorLayer />
      <OverflowDebug />
    </>
  );
}

