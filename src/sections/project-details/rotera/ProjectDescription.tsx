import { Badge } from "@/components/ui/badge";
import { Activity, Clock, Cuboid, Cpu, FlaskConical, Layers, Sparkles } from "lucide-react";
import { ComponentType } from "react";
import type { BadgeItem } from "@/data/projects";

// Icon map: string identifier -> Lucide icon component (matches ProjectCard / HeaderBlock)
const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  activity: Activity,
  clock: Clock,
  sparkles: Sparkles,
  cuboid: Cuboid,
  layers: Layers,
  cpu: Cpu,
  flaskConical: FlaskConical,
};

type ProjectDescriptionProps = {
  description?: string;
  badges?: BadgeItem[];
};

export function ProjectDescription({ description, badges = [] }: ProjectDescriptionProps) {
  return (
    <div data-reveal="projectDescription" className="flex flex-col gap-6 h-[113px] py-[10px]">
      {/* Figma: ProjectDescription - text-xl (20px), regular, leading-7 (28px), text-foreground */}
      {description && (
        <p className="font-sans text-xl font-normal leading-[28px] text-foreground w-[856px]">
          {description}
        </p>
      )}
      {/* Badges row - uses same badges as homepage card */}
      {badges.length > 0 && (
        <div className="flex gap-[10px]">
          {badges.map((badge) => {
            const Icon = badge.icon ? ICONS[badge.icon] : null;
            return (
              <Badge
                key={badge.label}
                variant="outline"
                className="gap-1 h-[22px] px-2 py-[2px]"
              >
                {Icon && <Icon className="h-3 w-3" aria-hidden="true" />}
                <span className="text-xs font-medium leading-4">{badge.label}</span>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}

