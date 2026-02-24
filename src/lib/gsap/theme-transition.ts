import { gsap } from "gsap";

const FADE_DOWN_DURATION = 0.22;
const FADE_UP_DURATION = 0.28;
const LOW_OPACITY = 0.96;
const EASE = "power3.out";
const LOCK_MS = 550;

let animating = false;

function getRoot(): HTMLElement | null {
  const doc = typeof document !== "undefined" ? document : null;
  if (!doc) return null;
  return (
    (doc.querySelector("[data-app-root]") as HTMLElement) ||
    (doc.querySelector("main") as HTMLElement) ||
    doc.body
  );
}

/**
 * Simple fade theme transition: fade root down, switch theme, fade back up.
 * Respects prefers-reduced-motion (instant). Lock 550ms.
 */
export function animateThemeTransition({ onSwitch }: { onSwitch: () => void }) {
  if (typeof window === "undefined") {
    onSwitch();
    return;
  }

  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (reduce) {
    onSwitch();
    return;
  }

  if (animating) return;
  animating = true;
  const lockTimeout = window.setTimeout(() => {
    animating = false;
  }, LOCK_MS);

  const root = getRoot();
  const unlock = () => {
    clearTimeout(lockTimeout);
    animating = false;
  };
  if (!root) {
    onSwitch();
    unlock();
    return;
  }

  gsap.to(root, {
    opacity: LOW_OPACITY,
    duration: FADE_DOWN_DURATION,
    ease: EASE,
    onComplete: () => {
      onSwitch();
      requestAnimationFrame(() => {
        gsap.to(root, {
          opacity: 1,
          duration: FADE_UP_DURATION,
          ease: EASE,
          clearProps: "opacity",
          onComplete: unlock,
        });
      });
    },
  });
}
