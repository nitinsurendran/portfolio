import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function BackNavigation() {
  return (
    <div data-reveal="backNavigation" className="fixed left-[2px] top-px px-[38px] py-[12px] z-[10000]">
      {/* Figma: BackNavigation frame - absolute positioned, contains circle arrow icon */}
      <Link
        href="/"
        className="flex items-center justify-center p-[44px] hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md"
        aria-label="Back to homepage"
      >
        <div className="relative size-[48px]">
          {/* Circle with arrow left icon - using lucide ArrowLeft in a circle */}
          <div className="absolute inset-0 rounded-full border-2 border-foreground/20 flex items-center justify-center">
            <ArrowLeft className="h-5 w-5 text-foreground" aria-hidden="true" />
          </div>
        </div>
      </Link>
    </div>
  );
}

