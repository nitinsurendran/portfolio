type StatItem = {
  label: string;
  value: string;
  description: string;
};

type StatsBlockProps = {
  left: StatItem;
  right: StatItem;
};

export function StatsBlock({ left, right }: StatsBlockProps) {
  return (
    <div data-reveal="stats" className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 py-8 min-w-0">
      <div className="flex flex-col gap-2">
        <p className="font-sans text-base font-normal leading-6 text-muted-foreground">
          {left.label}
        </p>
        <p className="font-sans text-2xl md:text-3xl font-semibold leading-tight text-foreground">
          {left.value}
        </p>
        <p className="font-sans text-base font-normal leading-6 text-muted-foreground">
          {left.description}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-sans text-base font-normal leading-6 text-muted-foreground">
          {right.label}
        </p>
        <p className="font-sans text-2xl md:text-3xl font-semibold leading-tight text-foreground">
          {right.value}
        </p>
        <p className="font-sans text-base font-normal leading-6 text-muted-foreground">
          {right.description}
        </p>
      </div>
    </div>
  );
}
