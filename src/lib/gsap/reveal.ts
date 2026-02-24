import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Section delay map for sequential reveal feel
const SECTION_DELAYS: Record<string, number> = {
  intro: 0.1,
  description: 0.18,
  projects: 0.22,
  archives: 0.24,
  collabs: 0.26,
  footer: 0.3,
  "footer-2": 0.3,
};

/**
 * Initializes scroll reveal animations for elements with data-reveal attribute
 * Apple-like reveal: sections fade/lift in when scrolling into view
 * 
 * @param root - Root element to scope queries to (defaults to document)
 * @returns Cleanup function that reverts all GSAP contexts and kills triggers
 */
export function initReveal(root?: Element | Document): () => void {
  const rootEl = root || (typeof document !== "undefined" ? document : null);
  if (!rootEl) {
    return () => {}; // No-op if no root available
  }

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    // Set all sections, groups, and items to final state immediately (no animations)
    // Skip elements with data-reveal="none" or inside [data-reveal-skip] containers
    const allSections = rootEl.querySelectorAll<HTMLElement>("[data-reveal]");
    const allItems = rootEl.querySelectorAll<HTMLElement>("[data-reveal-item]");
    
    const sections = Array.from(allSections).filter((el) => {
      const revealValue = el.getAttribute("data-reveal");
      if (revealValue === "none") return false;
      if (el.closest("[data-reveal-skip]")) return false;
      return true;
    });
    
    const items = Array.from(allItems).filter((el) => {
      const revealItemValue = el.getAttribute("data-reveal-item");
      if (revealItemValue === "none") return false;
      if (el.closest("[data-reveal-skip]")) return false;
      return true;
    });
    
    gsap.set([...sections, ...items], {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
    });
    return () => {}; // No cleanup needed
  }

  // Track triggers for defensive cleanup
  const triggers: ScrollTrigger[] = [];
  // Track lifecycle so we don't call refresh after cleanup (prevents ScrollTrigger 'end' errors)
  let destroyed = false;
  let rafId: number | null = null;
  let loadHandler: (() => void) | null = null;

  // Create GSAP context scoped to root element for automatic cleanup
  const ctx = gsap.context(() => {
    // Handle section reveals with per-section delays
    // Query only within rootEl to prevent duplicate triggers
    // Skip elements with data-reveal="none" or inside [data-reveal-skip] containers
    const allSections = rootEl.querySelectorAll<HTMLElement>("[data-reveal]");
    const sections = Array.from(allSections).filter((element) => {
      const revealValue = element.getAttribute("data-reveal");
      // Skip if explicitly opted out
      if (revealValue === "none") {
        return false;
      }
      // Skip if inside a data-reveal-skip container
      const hasSkipParent = element.closest("[data-reveal-skip]");
      if (hasSkipParent) {
        return false;
      }
      return true;
    });

    sections.forEach((element) => {
      const revealValue = element.getAttribute("data-reveal");
      const delay = revealValue ? SECTION_DELAYS[revealValue] ?? 0 : 0;

      // Set initial hidden state ONLY immediately before creating trigger
      // This ensures we never leave elements hidden without a trigger
      gsap.set(element, {
        opacity: 0,
        y: 18,
        filter: "blur(10px)",
        willChange: "transform, opacity, filter",
      });

      // Create timeline with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "top 60%",
          toggleActions: "play none none none",
          once: true,
          invalidateOnRefresh: true, // Recalculate on layout changes
          markers: false, // Disable debug markers
        },
      });

      // Track the trigger for defensive cleanup
      const st = tl.scrollTrigger;
      if (st) {
        triggers.push(st);
      } else {
        // Safety: If trigger creation failed, make element visible immediately
        console.warn(`[GSAP Reveal] Failed to create ScrollTrigger for element with data-reveal="${revealValue}"`);
        gsap.set(element, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          clearProps: "all",
        });
        return; // Skip animation if trigger failed
      }

      // Animate to visible
      tl.to(element, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.9,
        ease: "power3.out",
        delay,
        clearProps: "willChange",
      });
    });

    // Handle individual reveal items (e.g., project cards - per-card reveal)
    // Query only within rootEl
    // Skip items with data-reveal-item="none" or inside [data-reveal-skip] containers
    const allItems = rootEl.querySelectorAll<HTMLElement>("[data-reveal-item]");
    const items = Array.from(allItems).filter((item) => {
      const revealItemValue = item.getAttribute("data-reveal-item");
      // Skip if explicitly opted out
      if (revealItemValue === "none") {
        return false;
      }
      // Skip if inside a data-reveal-skip container
      const hasSkipParent = item.closest("[data-reveal-skip]");
      if (hasSkipParent) {
        return false;
      }
      return true;
    });
    
    items.forEach((item) => {
      // Check if this item is a project card (should be handled individually)
      const isProjectCard = item.getAttribute("data-reveal-item") === "project-card";
      
      if (isProjectCard) {
        // Set initial hidden state ONLY immediately before creating trigger
        gsap.set(item, {
          opacity: 0,
          y: 10,
          filter: "blur(6px)",
          willChange: "transform, opacity, filter",
        });

        // Create ScrollTrigger with proper config (guard against plugin errors)
        let st: ScrollTrigger | null = null;
        try {
          st = ScrollTrigger.create({
            trigger: item,
            start: "top 80%",
            once: true,
            invalidateOnRefresh: true,
            markers: false,
            onEnter: () => {
              gsap.to(item, {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.85,
                ease: "power3.out",
                delay: 0.12,
                clearProps: "willChange",
              });
            },
          });
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            // eslint-disable-next-line no-console
            console.warn("[GSAP Reveal] Failed to create ScrollTrigger for project-card item", error);
          }
          // If trigger creation fails, reveal immediately and skip animation
          gsap.set(item, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            clearProps: "all",
          });
          return;
        }

        // Safety: Verify trigger was created (ScrollTrigger instance is valid until killed)
        if (st) {
          triggers.push(st);
        } else {
          // If trigger creation failed, make visible immediately
          gsap.set(item, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            clearProps: "all",
          });
        }
      }
    });

    // Handle other reveal groups (non-project-card groups, if any)
    // Query only within rootEl
    // Skip groups with data-reveal-group="none" or inside [data-reveal-skip] containers
    const allGroups = rootEl.querySelectorAll<HTMLElement>(
      "[data-reveal-group]:not([data-reveal-group='project-cards'])"
    );
    const groups = Array.from(allGroups).filter((groupElement) => {
      const revealGroupValue = groupElement.getAttribute("data-reveal-group");
      // Skip if explicitly opted out
      if (revealGroupValue === "none") {
        return false;
      }
      // Skip if inside a data-reveal-skip container
      const hasSkipParent = groupElement.closest("[data-reveal-skip]");
      if (hasSkipParent) {
        return false;
      }
      return true;
    });

    groups.forEach((groupElement) => {
      const items = groupElement.querySelectorAll<HTMLElement>(
        "[data-reveal-item]"
      );

      if (items.length === 0) return;

      // Set initial hidden state ONLY immediately before creating trigger
      gsap.set(items, {
        opacity: 0,
        y: 10,
        filter: "blur(6px)",
        willChange: "transform, opacity, filter",
      });

      // Create ScrollTrigger with proper config
      let st: ScrollTrigger | null = null;
      try {
        st = ScrollTrigger.create({
          trigger: groupElement,
          start: "top 85%",
          once: true,
          invalidateOnRefresh: true,
          markers: false,
          onEnter: () => {
            gsap.to(items, {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.8,
              ease: "power3.out",
              delay: 0.15,
              stagger: 0.14,
              clearProps: "willChange",
            });
          },
        });
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.warn("[GSAP Reveal] Failed to create ScrollTrigger for group", error);
        }
        gsap.set(items, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          clearProps: "all",
        });
        return;
      }

      // Safety: Verify trigger was created
      if (st) {
        triggers.push(st);
      } else {
        // If trigger creation failed, make visible immediately
        gsap.set(items, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          clearProps: "all",
        });
      }
    });

    // Safe refresh after fonts/images settle
    // Use requestAnimationFrame to ensure DOM is fully laid out
    rafId = requestAnimationFrame(() => {
      if (destroyed) return;
      try {
        ScrollTrigger.refresh();
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.warn("[GSAP Reveal] ScrollTrigger.refresh() failed", error);
        }
      }
      
      // Dev-only: Verify all triggers exist
      if (process.env.NODE_ENV === "development") {
        const allTriggers = ScrollTrigger.getAll();
        const footerTriggers = allTriggers.filter((st) => {
          const triggerEl = st.trigger as HTMLElement;
          return triggerEl?.getAttribute("data-reveal") === "footer" || 
                 triggerEl?.getAttribute("data-reveal") === "footer-2";
        });
        console.log("[GSAP Reveal] Footer triggers found:", footerTriggers.length, footerTriggers.map(st => {
          const el = st.trigger as HTMLElement;
          return el?.getAttribute("data-reveal");
        }));
      }
    });

    // One-time refresh on window load for images/fonts
    if (typeof window !== "undefined") {
      loadHandler = () => {
        if (destroyed) return;
        try {
          ScrollTrigger.refresh();
        } finally {
          window.removeEventListener("load", loadHandler as () => void);
        }
      };
      if (document.readyState === "complete") {
        // Already loaded, refresh immediately
        loadHandler();
      } else {
        window.addEventListener("load", loadHandler);
      }
    }
  }, rootEl);

  // Return cleanup function
  return () => {
    destroyed = true;
    if (rafId != null && typeof cancelAnimationFrame !== "undefined") {
      cancelAnimationFrame(rafId);
    }
    if (loadHandler && typeof window !== "undefined") {
      window.removeEventListener("load", loadHandler);
    }
    // Defensively kill all tracked triggers
    triggers.forEach((st) => {
      if (st) {
        st.kill();
      }
    });
    // Revert GSAP context (this should handle most cleanup automatically)
    ctx.revert();
  };
}

/**
 * @deprecated Use initReveal instead. This function is kept for backward compatibility.
 */
export function setupScrollReveal(container: HTMLElement) {
  return initReveal(container);
}

