"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Copy, ExternalLink, Eye, History, Loader2, RotateCcw, Save, Trash2 } from "lucide-react";
import type { ContentStatus } from "@/db/types";
import { STATUS_LABEL } from "@/db/types";
import { Fields } from "./fields";
import { toast } from "./Toast";
import type { AdminRefs, FormTab } from "./types";
import { deleteEntityAction, duplicateProductAction, revisionsAction, saveEntityAction } from "@/app/admin/(panel)/entity-actions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Obj = Record<string, any>;
export type EntityType = "segment" | "product" | "industry" | "page" | "post" | "resource";

export function EntityForm({
  entity,
  id,
  initial,
  tabs,
  refs,
  title,
  canEdit,
  canPublish,
  canDelete,
  publicHref,
  previewHref,
  listHref,
  hasStatus = true,
  slugField = "slug",
  aside,
}: {
  entity: EntityType;
  id: number | null;
  initial: Obj;
  tabs: FormTab[];
  refs?: AdminRefs;
  title: string;
  canEdit: boolean;
  canPublish: boolean;
  canDelete: boolean;
  publicHref?: string;
  previewHref?: string;
  listHref: string;
  hasStatus?: boolean;
  slugField?: string;
  aside?: React.ReactNode;
}) {
  const router = useRouter();
  const [value, setValue] = useState<Obj>(initial);
  const [saved, setSaved] = useState<string>(JSON.stringify(initial));
  const [tab, setTab] = useState(tabs[0]?.id);
  const [pending, start] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [redirectOld, setRedirectOld] = useState(true);
  const [history, setHistory] = useState<{ id: number; userEmail: string | null; createdAt: string; note: string | null; data: Obj }[] | null>(null);
  const dirty = useMemo(() => JSON.stringify(value) !== saved, [value, saved]);
  const slugChanged = id !== null && initial[slugField] && value[slugField] !== initial[slugField];

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const statuses: ContentStatus[] = canPublish ? ["draft", "pending_review", "approved", "published", "archived"] : ["draft", "pending_review"];
  const currentStatus = value.status as ContentStatus | undefined;

  function save(statusOverride?: ContentStatus) {
    const payload = statusOverride ? { ...value, status: statusOverride } : value;
    start(async () => {
      const r = await saveEntityAction(entity, id, payload, { redirectOld: Boolean(slugChanged && redirectOld) });
      if (!r.ok) {
        setErrors(r.fields ?? {});
        toast(r.error, "error");
        return;
      }
      setErrors({});
      setValue(payload);
      setSaved(JSON.stringify(payload));
      toast(r.message ?? "Saved.");
      if (id === null && r.data) router.replace(`${listHref}/${(r.data as { id: number }).id}`);
      else router.refresh();
    });
  }

  function remove() {
    if (!id) return;
    if (!window.confirm(`Delete “${title}” permanently? This cannot be undone. Consider archiving instead.`)) return;
    start(async () => {
      const r = await deleteEntityAction(entity, id);
      if (!r.ok) return toast(r.error, "error");
      toast(r.message ?? "Deleted.");
      router.replace(listHref);
    });
  }

  function duplicate() {
    if (!id) return;
    start(async () => {
      const r = await duplicateProductAction(id);
      if (!r.ok) return toast(r.error, "error");
      toast("Duplicate created as a draft.");
      router.push(`${listHref}/${(r.data as { id: number }).id}`);
    });
  }

  async function loadHistory() {
    if (!id) return;
    const r = await revisionsAction(entity, id);
    if (r.ok) setHistory(r.data as never);
    else toast(r.error, "error");
  }

  const active = tabs.find((t) => t.id === tab) ?? tabs[0];
  return (
    <div>
      <div className="sticky top-14 z-30 -mx-4 mb-6 border-b border-line bg-[#f5f1eb]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:top-0 lg:-mx-10 lg:px-10">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1">
            <Link href={listHref} className="text-xs font-semibold text-muted hover:text-red">← Back</Link>
            <h1 className="truncate font-display text-2xl font-bold">{title || "Untitled"}</h1>
          </div>
          {hasStatus && currentStatus ? (
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted">Status</span>
              <select className="field !min-h-9 !w-auto !py-1 text-sm" value={currentStatus} disabled={!canEdit} onChange={(e) => setValue({ ...value, status: e.target.value })}>
                {statuses.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                {!statuses.includes(currentStatus) ? <option value={currentStatus}>{STATUS_LABEL[currentStatus]}</option> : null}
              </select>
            </label>
          ) : null}
          {previewHref && id ? <a href={previewHref} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><Eye className="size-4" /><span>Preview</span></a> : null}
          {publicHref && currentStatus === "published" ? <a href={publicHref} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><ExternalLink className="size-4" /><span>View live</span></a> : null}
          {canEdit ? (
            <button type="button" className="btn btn-sm" disabled={pending} onClick={() => save()}>
              {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}<span>{dirty ? "Save changes" : "Saved"}</span>
            </button>
          ) : <span className="text-sm text-muted">Read-only</span>}
          {canEdit && hasStatus && canPublish && currentStatus !== "published" ? <button type="button" className="btn btn-dark btn-sm" disabled={pending} onClick={() => save("published")}><span>Save &amp; publish</span></button> : null}
          {canEdit && hasStatus && !canPublish && currentStatus === "draft" ? <button type="button" className="btn btn-dark btn-sm" disabled={pending} onClick={() => save("pending_review")}><span>Submit for review</span></button> : null}
        </div>
        {dirty ? <p className="mt-1 text-xs font-semibold text-amber-700">Unsaved changes</p> : null}
        {slugChanged ? (
          <label className="mt-2 flex items-center gap-2 text-xs text-heading">
            <input type="checkbox" checked={redirectOld} onChange={(e) => setRedirectOld(e.target.checked)} className="accent-[var(--c-red)]" />
            The URL is changing — create a 301 redirect from the old address
          </label>
        ) : null}
      </div>

      {Object.keys(errors).length ? (
        <div role="alert" className="mb-6 border-l-4 border-red bg-white p-4 text-sm">
          <p className="font-semibold text-heading">Please fix the following:</p>
          <ul className="mt-1 list-disc pl-5">{Object.entries(errors).map(([k, v]) => <li key={k}>{v}</li>)}</ul>
        </div>
      ) : null}

      <div className="grid gap-8 xl:grid-cols-[1fr_300px]">
        <div className="min-w-0">
          {tabs.length > 1 ? (
            <div role="tablist" className="mb-6 flex flex-wrap gap-1 border-b border-line">
              {tabs.map((t) => (
                <button key={t.id} type="button" role="tab" aria-selected={t.id === active.id} onClick={() => setTab(t.id)} className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold ${t.id === active.id ? "border-red text-red" : "border-transparent text-muted hover:text-heading"}`}>{t.title}</button>
              ))}
            </div>
          ) : null}
          <div className="rounded-[3px] border border-line bg-[#fbf9f6] p-5 sm:p-6">
            <Fields fields={active.fields} value={value} onChange={setValue} refs={refs} disabled={!canEdit} />
          </div>
        </div>
        <aside className="space-y-4">
          {aside}
          {id ? (
            <div className="rounded-[3px] border border-line bg-white p-4 text-sm">
              <p className="font-semibold text-heading">Actions</p>
              <div className="mt-3 grid gap-2">
                <button type="button" className="btn btn-outline btn-sm" onClick={loadHistory}><History className="size-4" /><span>Revision history</span></button>
                {entity === "product" && canEdit ? <button type="button" className="btn btn-outline btn-sm" onClick={duplicate} disabled={pending}><Copy className="size-4" /><span>Duplicate</span></button> : null}
                {canEdit && hasStatus ? <button type="button" className="btn btn-outline btn-sm" onClick={() => save("archived")} disabled={pending || !canPublish}><span>Archive</span></button> : null}
                {canDelete ? <button type="button" className="btn btn-outline btn-sm !text-red" onClick={remove} disabled={pending}><Trash2 className="size-4" /><span>Delete</span></button> : null}
              </div>
              {history ? (
                <ul className="mt-4 max-h-80 space-y-2 overflow-y-auto border-t border-line pt-3">
                  {history.length ? history.map((h) => (
                    <li key={h.id} className="flex items-start justify-between gap-2 text-xs">
                      <span><span className="block font-semibold text-heading">{new Date(h.createdAt).toLocaleString()}</span>{h.userEmail}{h.note ? ` · ${h.note}` : ""}</span>
                      {canEdit ? <button type="button" className="flex items-center gap-1 font-semibold text-red" onClick={() => { setValue({ ...value, ...h.data, status: value.status }); toast("Revision loaded into the form — review and save to restore it."); }}><RotateCcw className="size-3" />Restore</button> : null}
                    </li>
                  )) : <li className="text-xs text-muted">No earlier revisions yet.</li>}
                </ul>
              ) : null}
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
