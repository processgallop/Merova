"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { ChevronDown, Copy, Eye, EyeOff, Loader2, Monitor, Plus, Save, Smartphone, Tablet, Trash2, X } from "lucide-react";
import type { ContentStatus, Section, SectionType } from "@/db/types";
import { STATUS_LABEL } from "@/db/types";
import { SECTION_DEFS } from "@/lib/sections";
import { Fields, SeoField, Sortable } from "./fields";
import { toast } from "./Toast";
import type { AdminRefs } from "./types";
import { deleteEntityAction, saveEntityAction } from "@/app/admin/(panel)/entity-actions";

interface PageData {
  slug: string;
  title: string;
  navLabel: string | null;
  template: string;
  sections: Section[];
  seo: Record<string, unknown>;
  status: ContentStatus;
  publishedAt: string;
  system?: boolean;
}

const uid = () => `s${Math.random().toString(36).slice(2, 9)}`;

/**
 * Section-based page builder. Administrators add approved blocks, edit their
 * content, reorder (drag or arrows), hide/show and preview at desktop, tablet
 * and mobile widths. Layout rules live in the components, not here.
 */
export function PageBuilder({ id, initial, refs, canEdit, canPublish }: { id: number | null; initial: PageData; refs: AdminRefs; canEdit: boolean; canPublish: boolean }) {
  const router = useRouter();
  const [page, setPage] = useState<PageData>(initial);
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const [open, setOpen] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile" | null>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [pending, start] = useTransition();
  const dirty = useMemo(() => JSON.stringify(page) !== saved, [page, saved]);
  const isHome = page.slug === "home";

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => dirty && e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const setSection = (sid: string, patch: Partial<Section>) => setPage((p) => ({ ...p, sections: p.sections.map((s) => (s.id === sid ? { ...s, ...patch } : s)) }));
  const add = (type: SectionType) => {
    const s: Section = { id: uid(), type, enabled: true, data: structuredClone(SECTION_DEFS[type].defaults) };
    setPage((p) => ({ ...p, sections: [...p.sections, s] }));
    setOpen(s.id);
    setAdding(false);
  };

  function save(status?: ContentStatus) {
    const payload = status ? { ...page, status } : page;
    start(async () => {
      const r = await saveEntityAction("page", id, payload, { redirectOld: true });
      if (!r.ok) return toast(r.fields ? Object.values(r.fields).join(" ") : r.error, "error");
      setPage(payload);
      setSaved(JSON.stringify(payload));
      setPreviewKey((k) => k + 1);
      toast(r.message ?? "Saved.");
      if (!id && r.data) router.replace(`/admin/pages/${(r.data as { id: number }).id}`);
      else router.refresh();
    });
  }

  const publicPath = isHome ? "/" : `/${page.slug}`;
  const width = device === "mobile" ? 390 : device === "tablet" ? 820 : 1280;

  return (
    <div>
      <div className="sticky top-14 z-30 -mx-4 mb-6 border-b border-line bg-[#f5f1eb]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:top-0 lg:-mx-10 lg:px-10">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1">
            <Link href="/admin/pages" className="text-xs font-semibold text-muted hover:text-red">← Pages</Link>
            <h1 className="truncate font-display text-2xl font-bold">{isHome ? "Homepage" : page.title || "New page"}</h1>
          </div>
          <select aria-label="Status" className="field !min-h-9 !w-auto !py-1 text-sm" value={page.status} disabled={!canEdit} onChange={(e) => setPage({ ...page, status: e.target.value as ContentStatus })}>
            {(canPublish ? ["draft", "pending_review", "approved", "published", "archived"] : ["draft", "pending_review"]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s as ContentStatus]}</option>)}
            {!canPublish && !["draft", "pending_review"].includes(page.status) ? <option value={page.status}>{STATUS_LABEL[page.status]}</option> : null}
          </select>
          {id ? (
            <div className="flex overflow-hidden rounded-[3px] border border-line bg-white" role="group" aria-label="Preview size">
              {([["desktop", Monitor], ["tablet", Tablet], ["mobile", Smartphone]] as const).map(([d, I]) => (
                <button key={d} type="button" onClick={() => setDevice(device === d ? null : d)} aria-pressed={device === d} className={`flex size-9 items-center justify-center ${device === d ? "bg-ink text-white" : "text-muted hover:text-heading"}`} title={`Preview ${d}`}><I className="size-4" /></button>
              ))}
            </div>
          ) : null}
          {id && page.status === "published" ? <a href={publicPath} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><span>View live</span></a> : null}
          {canEdit ? <button type="button" className="btn btn-sm" disabled={pending} onClick={() => save()}>{pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}<span>{dirty ? "Save changes" : "Saved"}</span></button> : null}
          {canEdit && canPublish && page.status !== "published" ? <button type="button" className="btn btn-dark btn-sm" disabled={pending} onClick={() => save("published")}><span>Save &amp; publish</span></button> : null}
        </div>
        {dirty ? <p className="mt-1 text-xs font-semibold text-amber-700">Unsaved changes — the preview shows the last saved version.</p> : null}
      </div>

      {device && id ? (
        <div className="mb-8 rounded-[3px] border border-line bg-[#e9e3da] p-4">
          <div className="mb-2 flex items-center justify-between text-xs text-muted"><span>{device} preview · {width}px · last saved version</span><button type="button" onClick={() => setDevice(null)} className="flex items-center gap-1"><X className="size-3.5" />Close</button></div>
          <div className="mx-auto overflow-hidden bg-white shadow-lg" style={{ width: "100%", maxWidth: width }}>
            <iframe key={previewKey} src={`/preview/page/${id}`} title="Page preview" className="block h-[75vh] w-full border-0" />
          </div>
        </div>
      ) : null}

      <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
        <div>
          {page.sections.length ? (
            <Sortable
              items={page.sections}
              disabled={!canEdit}
              onChange={(sections) => setPage({ ...page, sections })}
              keyOf={(s) => s.id}
              render={(s, i) => {
                const def = SECTION_DEFS[s.type];
                const isOpen = open === s.id;
                return (
                  <div className={s.enabled ? "" : "opacity-60"}>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setOpen(isOpen ? null : s.id)} className="flex min-w-0 flex-1 items-center gap-3 py-1.5 text-left" aria-expanded={isOpen}>
                        <span className="index-num w-6 text-sm text-red">{String(i + 1).padStart(2, "0")}</span>
                        <span className="min-w-0"><span className="block truncate text-sm font-semibold text-heading">{def?.label ?? s.type}{!s.enabled ? " · hidden" : ""}</span><span className="block truncate text-xs text-muted">{String(s.data.heading ?? s.data.eyebrow ?? def?.description ?? "")}</span></span>
                        <ChevronDown className={`ml-auto size-4 flex-none transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      {canEdit ? (
                        <>
                          <button type="button" title={s.enabled ? "Hide section" : "Show section"} aria-label={s.enabled ? "Hide section" : "Show section"} className="p-1.5 text-muted hover:text-heading" onClick={() => setSection(s.id, { enabled: !s.enabled })}>{s.enabled ? <Eye className="size-4" /> : <EyeOff className="size-4" />}</button>
                          <button type="button" title="Duplicate" aria-label="Duplicate section" className="p-1.5 text-muted hover:text-heading" onClick={() => setPage({ ...page, sections: [...page.sections.slice(0, i + 1), { ...structuredClone(s), id: uid() }, ...page.sections.slice(i + 1)] })}><Copy className="size-4" /></button>
                          <button type="button" title="Remove" aria-label="Remove section" className="p-1.5 text-muted hover:text-red" onClick={() => window.confirm("Remove this section?") && setPage({ ...page, sections: page.sections.filter((x) => x.id !== s.id) })}><Trash2 className="size-4" /></button>
                        </>
                      ) : null}
                    </div>
                    {isOpen && def ? (
                      <div className="mt-3 border-t border-line pt-4">
                        <Fields fields={def.fields} value={s.data} refs={refs} disabled={!canEdit} onChange={(data) => setSection(s.id, { data })} />
                      </div>
                    ) : null}
                  </div>
                );
              }}
            />
          ) : <p className="rounded-[3px] border border-dashed border-line p-8 text-center text-sm text-muted">This page has no sections yet.</p>}
          {canEdit ? (
            <div className="mt-4">
              {adding ? (
                <div className="rounded-[3px] border border-line bg-white p-4">
                  <div className="mb-3 flex items-center justify-between"><p className="font-semibold text-heading">Add a section</p><button type="button" onClick={() => setAdding(false)} aria-label="Close"><X className="size-4" /></button></div>
                  <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {(Object.keys(SECTION_DEFS) as SectionType[]).map((tp) => (
                      <li key={tp}><button type="button" onClick={() => add(tp)} className="h-full w-full rounded-[3px] border border-line p-3 text-left hover:border-red"><span className="block text-sm font-semibold text-heading">{SECTION_DEFS[tp].label}</span><span className="mt-0.5 block text-xs text-muted">{SECTION_DEFS[tp].description}</span></button></li>
                    ))}
                  </ul>
                </div>
              ) : <button type="button" className="btn btn-outline btn-sm" onClick={() => setAdding(true)}><Plus className="size-4" /><span>Add section</span></button>}
            </div>
          ) : null}
        </div>
        <aside className="space-y-4">
          <div className="grid gap-4 rounded-[3px] border border-line bg-white p-4">
            <p className="font-semibold text-heading">Page settings</p>
            <label className="text-sm"><span className="field-label">Title</span><input className="field !min-h-10" disabled={!canEdit} value={page.title} onChange={(e) => setPage({ ...page, title: e.target.value })} /></label>
            <label className="text-sm"><span className="field-label">Path</span><span className="flex items-center gap-1"><span className="text-muted">/</span><input className="field !min-h-10" disabled={!canEdit || page.system} value={page.slug} onChange={(e) => setPage({ ...page, slug: e.target.value.toLowerCase().replace(/[^a-z0-9/-]/g, "-") })} /></span>{page.system ? <span className="text-xs text-muted">System page — path is fixed.</span> : <span className="text-xs text-muted">Use “about/…” to nest under About Merova.</span>}</label>
            <label className="text-sm"><span className="field-label">Publish date (schedule)</span><input type="datetime-local" className="field !min-h-10" disabled={!canEdit} value={page.publishedAt ?? ""} onChange={(e) => setPage({ ...page, publishedAt: e.target.value })} /></label>
          </div>
          <details className="rounded-[3px] border border-line bg-white p-4">
            <summary className="cursor-pointer font-semibold text-heading">Search &amp; social</summary>
            <div className="mt-4 grid gap-3"><SeoField value={page.seo} disabled={!canEdit} onChange={(seo) => setPage({ ...page, seo })} /></div>
          </details>
          {id && !page.system && canPublish ? (
            <button type="button" className="btn btn-outline btn-sm w-full !text-red" onClick={() => window.confirm("Delete this page permanently?") && start(async () => { const r = await deleteEntityAction("page", id); toast(r.ok ? "Page deleted." : r.error, r.ok ? "ok" : "error"); if (r.ok) router.replace("/admin/pages"); })}><Trash2 className="size-4" /><span>Delete page</span></button>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
