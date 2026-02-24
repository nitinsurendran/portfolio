"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolled down more than 400px
      setIsVisible(window.scrollY > 400);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed right-[2px] bottom-px px-[38px] py-[12px] z-50">
      <button
        onClick={scrollToTop}
        className="flex items-center justify-center p-[44px] hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring cursor-pointer"
        aria-label="Scroll to top"
      >
        <div className="relative size-[48px]">
          <div className="absolute inset-0 rounded-full border-2 border-foreground/20 flex items-center justify-center">
            <ArrowUp className="h-5 w-5 text-foreground" aria-hidden="true" />
          </div>
        </div>
      </button>
    </div>
  );
}

