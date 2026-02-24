import React from "react";

type TextBlockProps = {
  heading?: string;
  content: string;
};

function isBulletLine(line: string): boolean {
  const t = line.trim();
  return t.startsWith("- ") || t.startsWith("• ");
}

/** Parse [text](url) into segments for inline links with underline. */
function parseInlineLinks(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) {
      out.push(text.slice(lastIndex, m.index));
    }
    out.push(
      <a
        key={m.index}
        href={m[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        {m[1]}
      </a>
    );
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) {
    out.push(text.slice(lastIndex));
  }
  return out.length ? out : [text];
}

export function TextBlock({ heading, content }: TextBlockProps) {
  // Split content by double newlines to preserve paragraph structure
  const paragraphs = content.split("\n\n").filter((p) => p.trim());

  return (
    <div data-reveal="body" className="py-[10px]">
      <div className="font-sans text-xl font-normal text-foreground w-full">
        {heading && (
          <h3 className="font-semibold leading-7 mb-6">{heading}</h3>
        )}
        <div className="space-y-6 leading-7">
          {paragraphs.map((paragraph, index) => {
            const lines = paragraph.split("\n").map((l) => l.trim()).filter(Boolean);
            const bulletItems = lines.filter((l) => isBulletLine(l));
            const otherLines = lines.filter((l) => !isBulletLine(l));
            if (bulletItems.length > 0 && otherLines.length === 0) {
              return (
                <ul key={index} className="list-disc pl-6 space-y-2 leading-7">
                  {bulletItems.map((item, i) => (
                    <li key={i}>{item.replace(/^[-•]\s*/, "")}</li>
                  ))}
                </ul>
              );
            }
            if (bulletItems.length > 0) {
              return (
                <div key={index} className="space-y-4">
                  {otherLines.map((line, i) => (
                    <p key={i} className="leading-7">{line}</p>
                  ))}
                  <ul className="list-disc pl-6 space-y-2 leading-7">
                    {bulletItems.map((item, i) => (
                      <li key={i}>{item.replace(/^[-•]\s*/, "")}</li>
                    ))}
                  </ul>
                </div>
              );
            }
            return (
              <p key={index} className="leading-7">
                {parseInlineLinks(paragraph.trim())}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}

