"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const CursorLayer = dynamic(
  () => import("@/components/motion/CursorLayer").then((m) => ({ default: m.CursorLayer })),
  { ssr: false }
);

const OverflowDebug = dynamic(
  () => import("@/components/dev/OverflowDebug").then((m) => ({ default: m.OverflowDebug })),
  { ssr: false }
);

const DEBUG_UI_STORAGE_KEY = "debug-ui";

function useDebugUIEnabled(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const query = new URLSearchParams(window.location.search);
    const debugParam = query.get("debug");

    if (debugParam === "1") {
      window.sessionStorage.setItem(DEBUG_UI_STORAGE_KEY, "1");
    } else if (debugParam === "0") {
      window.sessionStorage.removeItem(DEBUG_UI_STORAGE_KEY);
    }

    const fromStorage = window.sessionStorage.getItem(DEBUG_UI_STORAGE_KEY) === "1";
    const fromQuery = debugParam === "1";
    const fromEnv =
      process.env.NODE_ENV !== "production" ||
      process.env.NEXT_PUBLIC_DEBUG_UI === "1";

    setEnabled(fromEnv || fromStorage || fromQuery);
  }, []);

  return enabled;
}

export default function ClientProviders({
  children,
}: {
  children: ReactNode;
}) {
  const debugUIEnabled = useDebugUIEnabled();

  return (
    <>
      {children}
      <CursorLayer />
      {debugUIEnabled && <OverflowDebug />}
    </>
  );
}

