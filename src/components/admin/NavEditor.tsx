"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import type { FooterSettings, NavItem } from "@/db/types";
import { saveSettingAction } from "@/app/admin/(panel)/settings-actions";
import { Fields, Sortable } from "./fields";
import { toast } from "./Toast";

const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8)}`;

/** Primary navigation (with mega-menu type and nested links) and footer link columns. */
export function NavEditor({ initial, footer }: { initial: NavItem[]; footer: FooterSettings }) {
  const router = useRouter();
  const [nav, setNav] = useState(initial);
  const [cols, setCols] = useState(footer.columns);
  const [pending, start] = useTransition();
  const set = (i: number, patch: Partial<NavItem>) => setNav(nav.map((n, j) => (j === i ? { ...n, ...patch } : n)));
  const enabledCount = nav.filter((n) => n.enabled).length;
  return (
    <div className="space-y-10">
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div><h1 className="font-display text-3xl font-bold">Navigation</h1><p className="mt-1 text-sm">The approved structure is five primary items plus the Request a Quote button. Mega menus for Products and Industries are generated from the catalogue.</p></div>
          <button type="button" className="btn btn-sm" disabled={pending} onClick={() => start(async () => { const r = await saveSettingAction("navigation", nav); toast(r.ok ? "Navigation saved." : r.error, r.ok ? "ok" : "error"); if (r.ok) router.refresh(); })}>{pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}<span>Save navigation</span></button>
        </div>
        {enabledCount > 6 ? <p className="mb-3 text-sm font-semibold text-amber-700">More than six visible items may crowd the header on smaller laptops.</p> : null}
        <Sortable items={nav} onChange={setNav} keyOf={(n) => n.id} render={(n, i) => (
          <div className="grid gap-3">
            <div className="grid gap-2 sm:grid-cols-[1fr_1fr_180px_auto]">
              <input aria-label="Label" className="field !min-h-9 text-sm" value={n.label} onChange={(e) => set(i, { label: e.target.value })} />
              <input aria-label="Link" className="field !min-h-9 text-sm" value={n.href} onChange={(e) => set(i, { href: e.target.value })} />
              <select aria-label="Menu type" className="field !min-h-9 text-sm" value={n.mega ?? ""} onChange={(e) => set(i, { mega: (e.target.value || null) as NavItem["mega"] })}>
                <option value="">Simple link</option><option value="products">Products mega menu</option><option value="industries">Industries mega menu</option><option value="about">Grouped dropdown</option><option value="resources">Resources dropdown</option>
              </select>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-xs"><input type="checkbox" checked={n.enabled} onChange={(e) => set(i, { enabled: e.target.checked })} className="accent-[var(--c-red)]" />Visible</label>
                <button type="button" aria-label="Remove item" className="p-1 text-muted hover:text-red" onClick={() => window.confirm(`Remove “${n.label}”?`) && setNav(nav.filter((_, j) => j !== i))}><Trash2 className="size-4" /></button>
              </div>
            </div>
            {n.mega === "about" || n.mega === "resources" ? (
              <details className="rounded-[3px] bg-[#faf7f3] p-3">
                <summary className="cursor-pointer text-xs font-semibold text-heading">Dropdown links ({n.children?.length ?? 0})</summary>
                <div className="mt-3">
                  <Fields fields={[{ key: "children", label: "Links", type: "pairs", addLabel: "Add link", fields: [{ key: "label", label: "Label", type: "text" }, { key: "href", label: "/path", type: "text" }, { key: "group", label: "Group heading", type: "text" }, { key: "description", label: "Description", type: "text" }, { key: "enabled", label: "Visible", type: "checkbox" }] }]} value={{ children: n.children ?? [] }} onChange={(v) => set(i, { children: (v.children as NonNullable<NavItem["children"]>).map((c) => ({ ...c, id: c.id || uid("c") })) })} />
                </div>
              </details>
            ) : null}
          </div>
        )} />
        <button type="button" className="btn btn-outline btn-sm mt-3" onClick={() => setNav([...nav, { id: uid("nav"), label: "New item", href: "/", enabled: false, mega: null }])}><Plus className="size-4" /><span>Add item</span></button>
      </section>
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div><h2 className="font-display text-2xl font-bold">Footer link columns</h2></div>
          <button type="button" className="btn btn-sm" disabled={pending} onClick={() => start(async () => { const r = await saveSettingAction("footer", { ...footer, columns: cols }); toast(r.ok ? "Footer columns saved." : r.error, r.ok ? "ok" : "error"); if (r.ok) router.refresh(); })}><Save className="size-4" /><span>Save columns</span></button>
        </div>
        <Sortable items={cols} onChange={setCols} keyOf={(c) => c.id} render={(c, i) => (
          <div className="grid gap-2">
            <div className="flex gap-2"><input aria-label="Column title" className="field !min-h-9 text-sm font-semibold" value={c.title} onChange={(e) => setCols(cols.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} /><button type="button" className="p-1 text-muted hover:text-red" aria-label="Remove column" onClick={() => setCols(cols.filter((_, j) => j !== i))}><Trash2 className="size-4" /></button></div>
            <Fields fields={[{ key: "links", label: "Links", type: "pairs", addLabel: "Add link", fields: [{ key: "label", label: "Label", type: "text" }, { key: "href", label: "/path", type: "text" }] }]} value={{ links: c.links }} onChange={(v) => setCols(cols.map((x, j) => (j === i ? { ...x, links: (v.links as typeof c.links).map((l) => ({ ...l, id: l.id || uid("l") })) } : x)))} />
          </div>
        )} />
        {cols.length < 4 ? <button type="button" className="btn btn-outline btn-sm mt-3" onClick={() => setCols([...cols, { id: uid("col"), title: "New column", links: [] }])}><Plus className="size-4" /><span>Add column</span></button> : null}
      </section>
    </div>
  );
}
