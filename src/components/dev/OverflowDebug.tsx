"use client";

import { useEffect } from "react";

/**
 * Dev-only: outlines elements that exceed viewport width (overflow debug).
 * Remove in production; no runtime overhead when NODE_ENV !== "development".
 */
export function OverflowDebug() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const style = document.createElement("style");
    style.textContent = `
      [data-overflow-debug] {
        outline: 2px solid rgba(255, 0, 0, 0.6) !important;
        outline-offset: -2px;
      }
    `;
    document.head.appendChild(style);

    const check = () => {
      const vw = window.innerWidth;
      document.querySelectorAll("[data-overflow-debug]").forEach((el) => el.removeAttribute("data-overflow-debug"));
      document.querySelectorAll("body *").forEach((el) => {
        if (!(el instanceof HTMLElement)) return;
        const rect = el.getBoundingClientRect();
        if (rect.right > vw + 1) el.setAttribute("data-overflow-debug", "true");
      });
    };

    check();
    const ro = new ResizeObserver(check);
    ro.observe(document.body);
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("resize", check);
      ro.disconnect();
      style.remove();
    };
  }, []);

  return null;
}
