import Link from "next/link";
import { Fragment, type ReactNode } from "react";

/**
 * Minimal inline formatter for our own content: **bold** and [label](/internal-path).
 * Only internal links are rendered as links. No HTML is ever injected.
 */
export function Rich({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[(.+?)\]\((\/[^)\s]*)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(<Fragment key={k++}>{text.slice(last, m.index)}</Fragment>);
    if (m[1]) out.push(<strong key={k++}>{m[1]}</strong>);
    else out.push(<Link key={k++} href={m[3]}>{m[2]}</Link>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(<Fragment key={k++}>{text.slice(last)}</Fragment>);
  return <>{out}</>;
}

export const plain = (text: string) => text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\[(.+?)\]\((.+?)\)/g, "$1");
