"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { ArrowUpDown, Plus, Search } from "lucide-react";
import { STATUS_LABEL, type ContentStatus } from "@/db/types";
import { bulkStatusAction, reorderAction } from "@/app/admin/(panel)/entity-actions";
import { Sortable } from "./fields";
import { toast } from "./Toast";

export interface Row {
  id: number;
  title: string;
  subtitle?: string;
  href: string;
  status?: ContentStatus;
  thumb?: string | null;
  cols: (string | number | React.ReactNode)[];
  filter?: Record<string, string>;
  search: string;
}

export function StatusBadge({ s }: { s: ContentStatus }) {
  const cls = { published: "bg-emerald-50 text-emerald-700 border-emerald-200", draft: "bg-stone-100 text-stone-600 border-stone-200", pending_review: "bg-amber-50 text-amber-800 border-amber-200", approved: "bg-sky-50 text-sky-800 border-sky-200", archived: "bg-stone-50 text-stone-400 border-stone-200" }[s];
  return <span className={`inline-flex whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-semibold ${cls}`}>{STATUS_LABEL[s]}</span>;
}

export function ListView({
  title,
  intro,
  rows,
  columns,
  newHref,
  newLabel = "Add new",
  filters = [],
  bulkEntity,
  reorderEntity,
  canEdit,
  canPublish,
}: {
  title: string;
  intro?: string;
  rows: Row[];
  columns: string[];
  newHref?: string;
  newLabel?: string;
  filters?: { key: string; label: string; options: { value: string; label: string }[] }[];
  bulkEntity?: "product" | "post" | "page" | "industry";
  reorderEntity?: "segment" | "industry" | "product" | "page" | "resource";
  canEdit: boolean;
  canPublish: boolean;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [f, setF] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [sel, setSel] = useState<number[]>([]);
  const [ordering, setOrdering] = useState(false);
  const [order, setOrder] = useState(rows);
  const [pending, start] = useTransition();

  const visible = useMemo(
    () => rows.filter((r) => (!q || r.search.toLowerCase().includes(q.toLowerCase())) && (!status || r.status === status) && Object.entries(f).every(([k, v]) => !v || r.filter?.[k] === v)),
    [rows, q, f, status],
  );

  const bulk = (s: ContentStatus) =>
    start(async () => {
      const r = await bulkStatusAction(bulkEntity!, sel, s);
      toast(r.ok ? r.message ?? "Updated." : r.error, r.ok ? "ok" : "error");
      if (r.ok) {
        setSel([]);
        router.refresh();
      }
    });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">{title}</h1>
          {intro ? <p className="mt-1 max-w-2xl text-sm">{intro}</p> : null}
        </div>
        <div className="flex gap-2">
          {reorderEntity && canEdit ? (
            <button type="button" className="btn btn-outline btn-sm" onClick={() => { setOrder(rows); setOrdering((v) => !v); }}><ArrowUpDown className="size-4" /><span>{ordering ? "Cancel ordering" : "Reorder"}</span></button>
          ) : null}
          {newHref && canEdit ? <Link href={newHref} className="btn btn-sm"><Plus className="size-4" /><span>{newLabel}</span></Link> : null}
        </div>
      </div>

      {ordering ? (
        <div className="rounded-[3px] border border-line bg-white p-4">
          <p className="mb-3 text-sm">Drag items (or use the arrows) to set the order shown on the website.</p>
          <Sortable items={order} onChange={setOrder} keyOf={(r) => String(r.id)} render={(r) => <span className="text-sm font-semibold text-heading">{r.title}</span>} />
          <button type="button" className="btn btn-sm mt-4" disabled={pending} onClick={() => start(async () => { const r = await reorderAction(reorderEntity!, order.map((x) => x.id)); toast(r.ok ? r.message ?? "Saved." : r.error, r.ok ? "ok" : "error"); if (r.ok) { setOrdering(false); router.refresh(); } })}><span>Save order</span></button>
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative min-w-[220px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" aria-label="Search" className="field !min-h-10 !pl-9 text-sm" />
            </div>
            {rows.some((r) => r.status) ? (
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="field !min-h-10 !w-auto text-sm" aria-label="Filter by status">
                <option value="">All statuses</option>
                {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            ) : null}
            {filters.map((fl) => (
              <select key={fl.key} value={f[fl.key] ?? ""} onChange={(e) => setF({ ...f, [fl.key]: e.target.value })} className="field !min-h-10 !w-auto text-sm" aria-label={fl.label}>
                <option value="">All {fl.label.toLowerCase()}</option>
                {fl.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ))}
          </div>
          {bulkEntity && canPublish && sel.length ? (
            <div className="mb-3 flex flex-wrap items-center gap-2 rounded-[3px] bg-ink px-4 py-2 text-sm text-white">
              <span>{sel.length} selected</span>
              <button type="button" disabled={pending} className="rounded bg-white/10 px-3 py-1 hover:bg-white/20" onClick={() => bulk("published")}>Publish</button>
              <button type="button" disabled={pending} className="rounded bg-white/10 px-3 py-1 hover:bg-white/20" onClick={() => bulk("draft")}>Unpublish (draft)</button>
              <button type="button" disabled={pending} className="rounded bg-white/10 px-3 py-1 hover:bg-white/20" onClick={() => bulk("archived")}>Archive</button>
              <button type="button" className="ml-auto text-white/70 hover:text-white" onClick={() => setSel([])}>Clear</button>
            </div>
          ) : null}
          <div className="overflow-x-auto rounded-[3px] border border-line bg-white">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="border-b border-line bg-[#faf7f3] text-left text-xs uppercase tracking-wide text-muted">
                <tr>
                  {bulkEntity && canPublish ? <th className="w-10 px-3 py-3"><input type="checkbox" aria-label="Select all" checked={visible.length > 0 && visible.every((r) => sel.includes(r.id))} onChange={(e) => setSel(e.target.checked ? visible.map((r) => r.id) : [])} className="accent-[var(--c-red)]" /></th> : null}
                  <th className="px-3 py-3 font-semibold">Name</th>
                  {columns.map((c) => <th key={c} className="px-3 py-3 font-semibold">{c}</th>)}
                  {rows.some((r) => r.status) ? <th className="px-3 py-3 font-semibold">Status</th> : null}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {visible.map((r) => (
                  <tr key={r.id} className="hover:bg-[#fbf9f6]">
                    {bulkEntity && canPublish ? <td className="px-3 py-2"><input type="checkbox" aria-label={`Select ${r.title}`} checked={sel.includes(r.id)} onChange={(e) => setSel(e.target.checked ? [...sel, r.id] : sel.filter((x) => x !== r.id))} className="accent-[var(--c-red)]" /></td> : null}
                    <td className="px-3 py-2">
                      <Link href={r.href} className="flex items-center gap-3">
                        {r.thumb !== undefined ? <span className="size-10 flex-none overflow-hidden bg-[#f5f1eb]">{r.thumb ? <img src={r.thumb} alt="" className="size-full object-cover" loading="lazy" /> : null}</span> : null}
                        <span><span className="block font-semibold text-heading hover:text-red">{r.title}</span>{r.subtitle ? <span className="block text-xs text-muted">{r.subtitle}</span> : null}</span>
                      </Link>
                    </td>
                    {r.cols.map((c, i) => <td key={i} className="px-3 py-2 text-body">{c}</td>)}
                    {r.status ? <td className="px-3 py-2"><StatusBadge s={r.status} /></td> : null}
                  </tr>
                ))}
                {!visible.length ? <tr><td colSpan={columns.length + 3} className="px-3 py-8 text-center text-muted">Nothing matches these filters.</td></tr> : null}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted">{visible.length} of {rows.length}</p>
        </>
      )}
    </div>
  );
}
