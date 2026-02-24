type QuoteBlockProps = {
  content: string;
  /** Optional bold lead line before the main quote (e.g. key finding) */
  emphasis?: string;
  /** Quote size: default (xl), large (2xl/3xl), 4xl (36px regular, shadcn) */
  size?: "default" | "large" | "4xl";
};

export function QuoteBlock({ content, emphasis, size = "default" }: QuoteBlockProps) {
  const sizeClass =
    size === "4xl"
      ? "text-4xl font-normal leading-[2.25rem]"
      : size === "large"
        ? "text-2xl md:text-3xl leading-7"
        : "text-xl leading-7";
  return (
    <div data-reveal="quote" className="py-[10px]">
      <blockquote className="font-sans text-foreground border-l-2 border-foreground/20 pl-6 my-6">
        {emphasis && (
          <p className="font-semibold leading-7 mb-4 text-xl">{emphasis}</p>
        )}
        <p className={`text-muted-foreground italic ${sizeClass}`}>
          {content}
        </p>
      </blockquote>
    </div>
  );
}
