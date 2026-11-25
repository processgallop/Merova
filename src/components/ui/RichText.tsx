import Link from "next/link";
import { Fragment } from "react";

/**
 * Safe Markdown subset renderer for CMS text (no raw HTML):
 * ## / ### headings, paragraphs, - and 1. lists, **bold**, *italic*, [links](/path).
 */
export function RichText({ text, className = "prose-m" }: { text: string; className?: string }) {
  const blocks = (text || "").replace(/\r/g, "").split(/\n{2,}/);
  return (
    <div className={className}>
      {blocks.map((b, i) => {
        const lines = b.split("\n").filter((l) => l.trim());
        if (!lines.length) return null;
        if (lines[0].startsWith("### ")) return <h3 key={i}>{inline(lines[0].slice(4))}</h3>;
        if (lines[0].startsWith("## ")) {
          const rest = lines.slice(1).join(" ");
          return (
            <Fragment key={i}>
              <h2>{inline(lines[0].slice(3))}</h2>
              {rest ? <p>{inline(rest)}</p> : null}
            </Fragment>
          );
        }
        if (lines.every((l) => /^[-*] /.test(l))) return <ul key={i}>{lines.map((l, j) => <li key={j}>{inline(l.slice(2))}</li>)}</ul>;
        if (lines.every((l) => /^\d+\. /.test(l))) return <ol key={i}>{lines.map((l, j) => <li key={j}>{inline(l.replace(/^\d+\. /, ""))}</li>)}</ol>;
        if (lines[0].startsWith("> ")) return <p key={i} className="note">{inline(lines.map((l) => l.replace(/^> /, "")).join(" "))}</p>;
        return <p key={i}>{inline(lines.join(" "))}</p>;
      })}
    </div>
  );
}

export function inline(s: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    if (m[1]) out.push(<strong key={k++}>{m[1]}</strong>);
    else if (m[2]) out.push(<em key={k++}>{m[2]}</em>);
    else if (m[3]) {
      const href = m[4];
      const safe = /^(\/|https?:\/\/|mailto:|tel:|#)/.test(href) ? href : "#";
      out.push(safe.startsWith("/") ? <Link key={k++} href={safe}>{m[3]}</Link> : <a key={k++} href={safe} target={safe.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">{m[3]}</a>);
    }
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}
