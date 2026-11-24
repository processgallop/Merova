import { Rich } from "./RichText";
import type { Block } from "@/data/blog";

export function ArticleBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p><Rich text={block.text} /></p>;
    case "h3":
      return <h3>{block.text}</h3>;
    case "ul":
      return <ul>{block.items.map((i) => <li key={i}><Rich text={i} /></li>)}</ul>;
    case "ol":
      return <ol>{block.items.map((i) => <li key={i}><Rich text={i} /></li>)}</ol>;
    case "note":
      return <p className="!mt-6 rounded-sm border-l-4 border-signal bg-paper-2 px-5 py-4 text-[0.97rem] !text-ink"><Rich text={block.text} /></p>;
    case "table":
      return (
        <div className="!mt-6 overflow-x-auto rounded-sm border border-line bg-white">
          <table className="table-spec min-w-[30rem]">
            {block.caption && <caption className="caption-bottom px-4 py-2 text-left text-xs text-muted">{block.caption}</caption>}
            <thead><tr>{block.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
            <tbody>{block.rows.map((r) => <tr key={r.join("|")}>{r.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i} className="text-ink-2">{c}</td>))}</tr>)}</tbody>
          </table>
        </div>
      );
  }
}
