"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, RotateCcw, Save } from "lucide-react";
import { restoreDefaultAction, saveSettingAction, type SettingKey } from "@/app/admin/(panel)/settings-actions";
import { Fields } from "./fields";
import { toast } from "./Toast";
import type { FieldDef } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Obj = Record<string, any>;

/** Generic settings editor (site details, SEO defaults, footer…). */
export function SettingsForm({ settingKey, title, intro, fields, initial, preview, canEdit = true }: { settingKey: SettingKey; title: string; intro?: string; fields: FieldDef[]; initial: Obj; preview?: (v: Obj) => React.ReactNode; canEdit?: boolean }) {
  const router = useRouter();
  const [v, setV] = useState<Obj>(initial);
  const [pending, start] = useTransition();
  const dirty = JSON.stringify(v) !== JSON.stringify(initial);
  return (
    <div>
      <div className="sticky top-14 z-30 -mx-4 mb-6 flex flex-wrap items-center gap-3 border-b border-line bg-[#f5f1eb]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:top-0 lg:-mx-10 lg:px-10">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-bold">{title}</h1>
          {intro ? <p className="text-sm">{intro}</p> : null}
        </div>
        {canEdit ? (
          <>
            <button type="button" className="btn btn-outline btn-sm" disabled={pending} onClick={() => window.confirm("Restore the default values? Your current values are kept in revision history.") && start(async () => { const r = await restoreDefaultAction(settingKey); toast(r.ok ? "Defaults restored." : r.error, r.ok ? "ok" : "error"); if (r.ok) router.refresh(); })}><RotateCcw className="size-4" /><span>Restore defaults</span></button>
            <button type="button" className="btn btn-sm" disabled={pending || !dirty} onClick={() => start(async () => { const r = await saveSettingAction(settingKey, v); toast(r.ok ? r.message ?? "Saved." : r.error, r.ok ? "ok" : "error"); if (r.ok) router.refresh(); })}>{pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}<span>{dirty ? "Save changes" : "Saved"}</span></button>
          </>
        ) : null}
      </div>
      <div className={preview ? "grid gap-8 xl:grid-cols-[1fr_420px]" : ""}>
        <div className="rounded-[3px] border border-line bg-[#fbf9f6] p-5 sm:p-6"><Fields fields={fields} value={v} onChange={setV} disabled={!canEdit} /></div>
        {preview ? <div className="xl:sticky xl:top-24 xl:self-start">{preview(v)}</div> : null}
      </div>
    </div>
  );
}
