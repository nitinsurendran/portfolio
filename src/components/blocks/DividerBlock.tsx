import { Separator } from "@/components/ui/separator";

export function DividerBlock() {
  return (
    <div data-reveal="divider" className="flex flex-col h-[63px] items-start justify-center py-[10px]">
      <Separator className="h-px" />
    </div>
  );
}

