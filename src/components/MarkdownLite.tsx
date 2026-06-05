// Tiny markdown renderer for blog body. Supports ## H2, ### H3, paragraphs,
// - bullet lists, and **bold** within text. No HTML injection.

function renderBold(text: string, key: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (/^\*\*[^*]+\*\*$/.test(p)) {
      return (
        <strong key={`${key}-${i}`} className="font-semibold text-foreground">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <span key={`${key}-${i}`}>{p}</span>;
  });
}

function renderInline(text: string, key: string) {
  const linkParts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return linkParts.map((part, index) => {
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const linkText = linkMatch[1];
      const url = linkMatch[2];
      return (
        <a key={`${key}-${index}`} href={url} className="text-magenta-brand hover:underline font-bold">
          {renderBold(linkText, `${key}-${index}-link`)}
        </a>
      );
    }
    return <span key={`${key}-${index}`}>{renderBold(part, `${key}-${index}-text`)}</span>;
  });
}

export function MarkdownLite({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("### ")) {
      blocks.push(
        <h3 key={key++} className="font-display text-2xl mt-8 mb-3">
          {line.slice(4)}
        </h3>,
      );
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={key++} className="font-display text-3xl mt-12 mb-4 border-b-2 border-ink pb-2">
          {line.slice(3)}
        </h2>,
      );
      i++;
      continue;
    }
    const imgMatch = line.match(/^!\[([^\]]*)\]\((.*?)\)$/);
    if (imgMatch) {
      blocks.push(
        <div key={key++} className="my-8 rounded-2xl overflow-hidden shadow-lg border border-border">
          <img src={imgMatch[2]} alt={imgMatch[1]} className="w-full h-auto object-cover" />
        </div>
      );
      i++;
      continue;
    }
    if (line.startsWith("---")) {
      blocks.push(<hr key={key++} className="my-10 border-border" />);
      i++;
      continue;
    }
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      blocks.push(
        <ul key={key++} className="list-disc pl-6 space-y-2 my-4 text-foreground/90">
          {items.map((it, idx) => (
            <li key={idx}>{renderInline(it, `${key}-li-${idx}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }
    if (line.trim() === "") {
      i++;
      continue;
    }
    blocks.push(
      <p key={key++} className="my-4 leading-relaxed text-foreground/90">
        {renderInline(line, `${key}-p`)}
      </p>,
    );
    i++;
  }

  return <div>{blocks}</div>;
}
