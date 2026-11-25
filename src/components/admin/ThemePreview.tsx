"use client";
/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, RotateCcw, Save } from "lucide-react";
import { DEFAULT_THEME } from "@/db/defaults";
import type { ThemeSettings } from "@/db/types";
import { themeToCss } from "@/lib/theme";
import { saveSettingAction } from "@/app/admin/(panel)/settings-actions";
import { FieldInput } from "./fields";
import { toast } from "./Toast";
import type { FieldDef } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Obj = Record<string, any>;

/** Theme editor with a live, scoped preview built from the same CSS variables the website uses. */
export function ThemePreview({ initial, groups }: { initial: Obj; groups: FieldDef[] }) {
  const router = useRouter();
  const [v, setV] = useState<Obj>(initial);
  const [pending, start] = useTransition();
  const css = themeToCss({ ...(v as ThemeSettings), baseSize: Number(v.baseSize) as 16, headingWeight: Number(v.headingWeight) as 700 }).replace(":root", ".theme-preview");
  const contrastWarn = luminance(v.buttonText) && Math.abs(luminance(v.buttonBg) - luminance(v.buttonText)) < 0.35;
  const save = (value: Obj) => start(async () => {
    const r = await saveSettingAction("theme", { ...value, baseSize: Number(value.baseSize), headingWeight: Number(value.headingWeight) });
    toast(r.ok ? r.message ?? "Saved." : r.error, r.ok ? "ok" : "error");
    if (r.ok) router.refresh();
  });
  return (
    <div>
      <div className="sticky top-14 z-30 -mx-4 mb-6 flex flex-wrap items-center gap-3 border-b border-line bg-[#f5f1eb]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:top-0 lg:-mx-10 lg:px-10">
        <div className="min-w-0 flex-1"><h1 className="font-display text-2xl font-bold">Brand &amp; appearance</h1><p className="text-sm">Colours, typography and layout presets apply site-wide through design tokens. Preview before saving.</p></div>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => setV({ ...DEFAULT_THEME, baseSize: String(DEFAULT_THEME.baseSize), headingWeight: String(DEFAULT_THEME.headingWeight) })}><RotateCcw className="size-4" /><span>Load defaults</span></button>
        <button type="button" className="btn btn-sm" disabled={pending} onClick={() => save(v)}>{pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}<span>Save &amp; apply</span></button>
      </div>
      <div className="grid gap-8 xl:grid-cols-[1fr_460px]">
        <div className="space-y-5">
          {groups.map((g) => g.type === "group" ? (
            <fieldset key={g.key} className="grid gap-4 rounded-[3px] border border-line bg-white p-5 sm:grid-cols-2">
              <legend className="px-1 text-sm font-semibold text-heading">{g.label}</legend>
              {g.hint ? <p className="text-xs text-muted sm:col-span-2">{g.hint}</p> : null}
              {g.fields.map((f) => <FieldInput key={f.key} f={f} value={v[f.key]} onChange={(x) => setV({ ...v, [f.key]: x })} />)}
            </fieldset>
          ) : null)}
          {contrastWarn ? <p className="text-sm font-semibold text-red">Button text and background may not have enough contrast.</p> : null}
        </div>
        <div className="xl:sticky xl:top-24 xl:self-start">
          <style>{css}</style>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Live preview</p>
          <div className="theme-preview overflow-hidden rounded-[3px] border border-line" style={{ background: "var(--c-bg)", color: "var(--c-body)", fontSize: "var(--base-size)", fontFamily: "var(--font-body)" }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--c-border)" }}>
              <img src={v.logoUrl?.endsWith("merova-logo-primary.svg") || !v.logoUrl ? "/assets/brand/merova-lockup-horizontal.svg" : v.logoUrl} alt="Logo" className="h-6 w-auto" />
              <span className="px-3 py-2 text-xs font-semibold" style={{ background: "var(--c-btn-bg)", color: "var(--c-btn-text)", borderRadius: "var(--radius)" }}>Request a Quote</span>
            </div>
            <div className="px-5 py-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: "var(--c-red)" }}>— Packaging, Perfected.</p>
              <p className="mt-3 text-3xl leading-tight" style={{ fontFamily: "var(--font-display)", fontWeight: "var(--heading-weight)" as unknown as number, color: "var(--c-heading)", letterSpacing: "-0.03em" }}>Packaging Solutions That Move Businesses Forward.</p>
              <p className="mt-3 text-sm">Body text uses the selected body colour and size for comfortable reading.</p>
              <div className="mt-5 flex gap-2">
                <span className="px-4 py-2.5 text-sm font-semibold" style={{ background: "var(--c-btn-bg)", color: "var(--c-btn-text)", borderRadius: "var(--radius)" }}>Primary action</span>
                <span className="px-4 py-2.5 text-sm font-semibold" style={{ border: "1.5px solid var(--c-heading)", color: "var(--c-heading)", borderRadius: "var(--radius)" }}>Secondary</span>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-px" style={{ background: "var(--c-border)" }}>
                {["Corrugated", "Foodservice"].map((x) => <div key={x} className="p-4" style={{ background: "var(--c-surface)" }}><p className="text-[10px] uppercase" style={{ color: "var(--c-red)" }}>Segment</p><p className="mt-1 font-bold" style={{ color: "var(--c-heading)", fontFamily: "var(--font-display)" }}>{x}</p></div>)}
              </div>
            </div>
            <div className="px-5 py-6" style={{ background: "var(--c-red)", color: "#fff" }}><p className="font-bold" style={{ fontFamily: "var(--font-display)" }}>Let&apos;s build the right packaging solution.</p></div>
            <div className="px-5 py-5 text-xs" style={{ background: "var(--c-footer-bg)", color: "var(--c-footer-text)" }}>Footer · Products · Industries · Resources</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function luminance(hex: string) {
  if (!/^#[0-9a-f]{6}$/i.test(hex ?? "")) return 0;
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
