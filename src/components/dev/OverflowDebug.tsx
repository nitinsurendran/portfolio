"use client";

import { useEffect } from "react";

/**
 * Outlines elements that exceed viewport width (overflow debug).
 * Only mounted when debug UI is enabled (dev or NEXT_PUBLIC_DEBUG_UI / ?debug=1 in prod).
 * When disabled, this component is not rendered (no overhead).
 */
export function OverflowDebug() {
  useEffect(() => {
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
