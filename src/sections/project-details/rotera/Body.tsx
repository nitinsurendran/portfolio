type BodyProps = {
  content: string;
  heading?: string;
};

export function Body({ content, heading }: BodyProps) {
  // Split content by double newlines to preserve paragraph structure
  const paragraphs = content.split("\n\n").filter(p => p.trim());
  
  return (
    <div data-reveal="body" className="py-[10px]">
      {/* Figma: Body - text content with headings and paragraphs */}
      {/* text-xl (20px), semibold for headings, regular for body, leading-7 (28px) */}
      <div className="font-sans text-xl font-normal text-foreground w-full">
        {heading && (
          <h3 className="font-semibold leading-7 mb-6">
            {heading}
          </h3>
        )}
        <div className="space-y-6 leading-7">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="leading-7">
              {paragraph.trim()}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

