"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteEntityAction } from "@/app/admin/(panel)/entity-actions";
import { toast } from "./Toast";

/** Safe deletion of a segment that still contains products: move them first. */
export function SegmentReassign({ segments }: { segments: { id: number; name: string; count: number }[] }) {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [pending, start] = useTransition();
  const src = segments.find((s) => String(s.id) === from);
  return (
    <section className="rounded-[3px] border border-line bg-white p-5">
      <h2 className="font-display text-lg font-bold">Reassign products &amp; delete a segment</h2>
      <p className="mt-1 text-sm">A segment that contains products cannot be deleted directly. Choose where its products should move; the segment is then removed. Product pages move to the new segment&apos;s URL.</p>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="text-sm"><span className="field-label">Delete segment</span><select className="field !min-h-10" value={from} onChange={(e) => setFrom(e.target.value)}><option value="">Choose…</option>{segments.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.count})</option>)}</select></label>
        <label className="text-sm"><span className="field-label">Move its products to</span><select className="field !min-h-10" value={to} onChange={(e) => setTo(e.target.value)}><option value="">Choose…</option>{segments.filter((s) => String(s.id) !== from).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
        <button
          type="button"
          className="btn btn-sm !bg-red"
          disabled={!from || (!to && Boolean(src?.count)) || pending}
          onClick={() => {
            if (!window.confirm(`Delete “${src?.name}”${src?.count ? ` and move its ${src.count} products` : ""}? This cannot be undone.`)) return;
            start(async () => {
              const r = await deleteEntityAction("segment", Number(from), to ? Number(to) : undefined);
              toast(r.ok ? "Segment deleted." : r.error, r.ok ? "ok" : "error");
              if (r.ok) { setFrom(""); setTo(""); router.refresh(); }
            });
          }}
        ><span>Reassign &amp; delete</span></button>
      </div>
    </section>
  );
}
