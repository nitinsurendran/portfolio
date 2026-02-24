import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Page Container component
 * MCP-derived from ProjectList1 frame (7059:2282):
 * - Content width: 923px (ProjectList inner frame width)
 * - Horizontal padding: 240px left and right
 * - Total frame width: 1403px (240 + 923 + 240)
 */
export default function Container({ children, className }: ContainerProps) {
  return (
    <div 
      className={cn("mx-auto w-full max-w-[1080px] px-6 md:px-10 lg:px-[60px]", className)}
      data-container="shared"
    >
      {/* Updated: max-w-[1080px] to accommodate 960px media with 60px padding on each side */}
      {/* Responsive padding px-6 (mobile) md:px-10 (tablet) lg:px-[60px] (desktop) */}
      {/* Mobile: w-full ensures responsive behavior, max-w constrains desktop */}
      {children}
    </div>
  );
}

