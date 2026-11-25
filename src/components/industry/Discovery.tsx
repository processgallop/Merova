"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Search, SlidersHorizontal, X } from "lucide-react";
import type { DiscoveryData } from "@/lib/discovery";
import { ProductCard } from "@/components/product/ProductCard";
import { Icon } from "@/components/ui/Icon";
import { track } from "@/lib/track";
import { useSelection } from "@/components/client/selection";

type Mode = "home" | "full" | "industry";

/**
 * WHAT CAN MEROVA DO FOR YOUR INDUSTRY?
 * Select industry → see relevant products from all five segments together →
 * refine by segment, product type, material, application or name → view,
 * download, or add several to one consolidated enquiry.
 */
export function Discovery({ data, mode = "full", initialIndustry, homeLimit = 8 }: { data: DiscoveryData; mode?: Mode; initialIndustry?: string; homeLimit?: number }) {
  const first = data.industries.find((i) => i.slug === initialIndustry) ?? data.industries.find((i) => !i.isCatchAll) ?? data.industries[0];
  const [industryId, setIndustryId] = useState<number>(first?.id ?? 0);
  const [segment, setSegment] = useState<number | null>(null);
  const [family, setFamily] = useState("");
  const [material, setMaterial] = useState("");
  const [application, setApplication] = useState("");
  const [q, setQ] = useState("");
  const [drawer, setDrawer] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { list } = useSelection();

  // Read deep-link filters once (full mode).
  useEffect(() => {
    if (mode !== "full") return;
    const sp = new URLSearchParams(window.location.search);
    const ind = data.industries.find((i) => i.slug === sp.get("industry"));
    /* eslint-disable react-hooks/set-state-in-effect */
    if (ind) setIndustryId(ind.id);
    const seg = data.segments.find((s) => s.code === sp.get("segment"));
    if (seg) setSegment(seg.id);
    if (sp.get("material")) setMaterial(sp.get("material")!);
    if (sp.get("application")) setApplication(sp.get("application")!);
    if (sp.get("q")) setQ(sp.get("q")!);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [mode, data]);

  const industry = data.industries.find((i) => i.id === industryId) ?? first;
  const byId = useMemo(() => new Map(data.products.map((p) => [p.id, p])), [data.products]);
  const base = useMemo(() => (industry?.products ?? []).map((x) => ({ p: byId.get(x.id)!, context: x.context })).filter((x) => x.p), [industry, byId]);

  const matches = (p: (typeof data.products)[number], skip?: "segment" | "family" | "material" | "application") =>
    (skip === "segment" || segment === null || p.segment.id === segment) &&
    (skip === "family" || !family || p.family === family) &&
    (skip === "material" || !material || p.materialGroups.includes(material)) &&
    (skip === "application" || !application || p.applicationGroups.includes(application)) &&
    (!q.trim() || q.toLowerCase().split(/\s+/).every((w) => p.search.includes(w)));

  const results = base.filter((x) => matches(x.p));
  const segCounts = new Map<number, number>();
  for (const x of base.filter((x) => matches(x.p, "segment"))) segCounts.set(x.p.segment.id, (segCounts.get(x.p.segment.id) ?? 0) + 1);
  const families = [...new Set(base.filter((x) => matches(x.p, "family")).map((x) => x.p.family))].filter(Boolean);
  const materials = data.materials.filter((m) => base.some((x) => matches(x.p, "material") && x.p.materialGroups.includes(m.id)));
  const applications = data.applications.filter((a) => base.some((x) => matches(x.p, "application") && x.p.applicationGroups.includes(a.id)));
  const activeFilters = [segment !== null, family, material, application, q.trim()].filter(Boolean).length;

  // URL sync (full mode)
  useEffect(() => {
    if (mode !== "full" || !industry) return;
    const sp = new URLSearchParams();
    sp.set("industry", industry.slug);
    const seg = data.segments.find((s) => s.id === segment);
    if (seg) sp.set("segment", seg.code);
    if (material) sp.set("material", material);
    if (application) sp.set("application", application);
    if (q.trim()) sp.set("q", q.trim());
    window.history.replaceState(null, "", `${window.location.pathname}?${sp.toString()}`);
  }, [mode, industry, segment, material, application, q, data.segments]);

  useEffect(() => {
    if (!q.trim()) return;
    const t = setTimeout(() => track("discovery_search", { query: q.trim().slice(0, 60), industry: industry?.slug }), 900);
    return () => clearTimeout(t);
  }, [q, industry?.slug]);

  const reset = () => {
    setSegment(null);
    setFamily("");
    setMaterial("");
    setApplication("");
    setQ("");
  };
  const pickIndustry = (id: number) => {
    setIndustryId(id);
    reset();
    const ind = data.industries.find((i) => i.id === id);
    track("industry_select", { industry: ind?.slug, location: mode });
    if (mode !== "home" && window.innerWidth < 1024) resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const filterTrack = (f: string, v: string) => track("filter_use", { filter: f, value: v, industry: industry?.slug });

  if (!industry) return null;

  const grouped = data.segments.map((s) => ({ s, items: results.filter((x) => x.p.segment.id === s.id) })).filter((g) => g.items.length);
  const homeItems = results.slice(0, homeLimit);

  const filters = (
    <div className="space-y-5">
      <div>
        <p className="field-label">Product segment</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="chip" aria-pressed={segment === null} onClick={() => { setSegment(null); filterTrack("segment", "all"); }}>
            All <span className="count">{[...segCounts.values()].reduce((a, b) => a + b, 0)}</span>
          </button>
          {data.segments.filter((s) => segCounts.get(s.id)).map((s) => (
            <button key={s.id} type="button" className="chip" aria-pressed={segment === s.id} onClick={() => { setSegment(segment === s.id ? null : s.id); setFamily(""); filterTrack("segment", s.code); }}>
              <span className={segment === s.id ? "text-white/70" : "text-red"}>{s.code}</span> {s.navName} <span className="count">{segCounts.get(s.id)}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="field-label">Product type</span>
          <select className="field" value={family} onChange={(e) => { setFamily(e.target.value); filterTrack("family", e.target.value); }}>
            <option value="">All product types</option>
            {families.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="field-label">Packaging material</span>
          <select className="field" value={material} onChange={(e) => { setMaterial(e.target.value); filterTrack("material", e.target.value); }}>
            <option value="">All materials</option>
            {materials.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="field-label">Application</span>
          <select className="field" value={application} onChange={(e) => { setApplication(e.target.value); filterTrack("application", e.target.value); }}>
            <option value="">All applications</option>
            {applications.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
          </select>
        </label>
      </div>
    </div>
  );

  const header = (
    <div className="relative overflow-hidden bg-ink text-white">
      {industry.image ? <img src={industry.image.url} alt="" className="absolute inset-0 size-full object-cover opacity-45" /> : null}
      <div className="absolute inset-0 bg-[linear-gradient(100deg,var(--c-ink)_25%,color-mix(in_oklab,var(--c-ink)_40%,transparent)_70%,color-mix(in_oklab,var(--c-red)_55%,transparent))]" />
      <div className="relative p-6 sm:p-8">
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/70"><Icon name={industry.icon} className="size-4 text-red" />{data.sectors.find((s) => s.id === industry.sectorId)?.name ?? "Industry"}</p>
        <h3 className="mt-3 font-display text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-tight text-white">{industry.name}</h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">{industry.intro}</p>
        {industry.sub.length ? (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Includes">
            {industry.sub.slice(0, 7).map((s) => <li key={s} className="rounded-full border border-white/25 px-2.5 py-1 text-[11px] text-white/85">{s}</li>)}
            {industry.sub.length > 7 ? <li className="px-1 py-1 text-[11px] text-white/60">+{industry.sub.length - 7} more</li> : null}
          </ul>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          {mode !== "industry" ? <Link href={industry.url} className="btn btn-light btn-sm"><span>View {industry.shortName} solutions</span><ArrowRight className="btn-arrow size-4" /></Link> : null}
          <Link href={`/request-a-quote?industry=${industry.slug}`} className="btn btn-sm" onClick={() => track("cta_click", { cta: "industry_quote", industry: industry.slug })}><span>Request a Quote</span><ArrowRight className="btn-arrow size-4" /></Link>
        </div>
      </div>
    </div>
  );

  const customCard = (
    <div className="flex flex-col justify-between bg-red-tint p-6">
      <div>
        <p className="font-display text-lg font-bold text-heading">Have a different packaging requirement?</p>
        <p className="mt-2 text-sm">Tell us what you are looking for. Share your specifications, drawings, photographs or existing samples. Our team will assess your application and help identify an appropriate packaging solution.</p>
      </div>
      <Link href={`/custom-requirement?industry=${industry.slug}`} className="btn btn-dark btn-sm mt-5 self-start" onClick={() => track("cta_click", { cta: "discovery_custom", industry: industry.slug })}>
        <span>Discuss Your Custom Requirement</span><ArrowRight className="btn-arrow size-4" />
      </Link>
    </div>
  );

  return (
    <div className={mode === "industry" ? "" : "grid gap-8 lg:grid-cols-12 lg:gap-10"}>
      {mode !== "industry" ? (
        <aside className="lg:col-span-4 xl:col-span-3" aria-label="Select your industry">
          <label className="block lg:hidden">
            <span className="field-label">Select your industry</span>
            <select className="field" value={industryId} onChange={(e) => pickIndustry(Number(e.target.value))}>
              {data.sectors.map((s) => (
                <optgroup key={s.id} label={s.name}>
                  {data.industries.filter((i) => i.sectorId === s.id).map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
                </optgroup>
              ))}
            </select>
          </label>
          <div className="hidden lg:block lg:sticky lg:top-[calc(var(--header-h)+24px)]">
            {data.sectors.map((s) => {
              const inds = data.industries.filter((i) => i.sectorId === s.id);
              if (!inds.length) return null;
              return (
                <div key={s.id} className="mb-5">
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">{s.name}</p>
                  <ul role="list">
                    {inds.map((i) => {
                      const on = i.id === industryId;
                      return (
                        <li key={i.id}>
                          <button type="button" onClick={() => pickIndustry(i.id)} aria-pressed={on} className={`group flex w-full items-center gap-3 border-l-2 py-2 pl-3 pr-2 text-left text-[15px] transition-all ${on ? "border-red bg-surface font-semibold text-red" : "border-transparent text-heading hover:border-line hover:pl-4"}`}>
                            <Icon name={i.icon} className={`size-4 flex-none ${on ? "text-red" : "text-muted"}`} />
                            <span className="flex-1 leading-snug">{i.shortName}</span>
                            <span className="text-xs tabular-nums text-muted">{i.products.length}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </aside>
      ) : null}

      <div ref={resultsRef} className={mode === "industry" ? "" : "min-w-0 lg:col-span-8 xl:col-span-9"} style={{ scrollMarginTop: "calc(var(--header-h) + 16px)" }}>
        {mode !== "industry" ? header : null}

        {mode !== "home" ? (
          <div className={`${mode === "industry" ? "" : "mt-6"} border border-line bg-surface p-5`}>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[200px] flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
                <label htmlFor={`dq-${mode}`} className="sr-only">Search products by name</label>
                <input id={`dq-${mode}`} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${industry.shortName.toLowerCase()} packaging…`} className="field !pl-10" />
              </div>
              <button type="button" className="btn btn-outline btn-sm lg:hidden" onClick={() => setDrawer(true)} aria-haspopup="dialog">
                <SlidersHorizontal className="size-4" /><span>Filters{activeFilters ? ` (${activeFilters})` : ""}</span>
              </button>
            </div>
            <div className="mt-5 hidden lg:block">{filters}</div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-sm">
              <p aria-live="polite"><strong className="text-heading">{results.length}</strong> of {base.length} products for <strong className="text-heading">{industry.name}</strong>{grouped.length > 1 ? ` across ${grouped.length} segments` : ""}</p>
              {activeFilters ? <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 font-semibold text-red hover:underline"><X className="size-4" /> Reset filters</button> : null}
            </div>
          </div>
        ) : null}

        {mode === "home" ? (
          <>
            <div className="hairline-grid mt-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
              {homeItems.map(({ p, context }) => <ProductCard key={p.id} p={p} context={context} industry={industry.slug} compact />)}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm">Showing {homeItems.length} of <strong className="text-heading">{base.length}</strong> relevant products from {new Set(base.map((x) => x.p.segment.id)).size} segments.</p>
              <div className="flex flex-wrap gap-3">
                <Link href={`/industries?industry=${industry.slug}`} className="btn btn-dark btn-sm"><span>Filter all {base.length} products</span><ArrowRight className="btn-arrow size-4" /></Link>
                <Link href={`/custom-requirement?industry=${industry.slug}`} className="btn btn-outline btn-sm"><span>Different requirement?</span></Link>
              </div>
            </div>
          </>
        ) : results.length ? (
          <div className="mt-8 space-y-12">
            {grouped.map(({ s, items }) => (
              <section key={s.id} aria-labelledby={`grp-${mode}-${s.id}`}>
                <div className="mb-4 flex items-baseline gap-4 border-b border-heading pb-3">
                  <span className="index-num text-3xl text-red">{s.code}</span>
                  <h3 id={`grp-${mode}-${s.id}`} className="font-display text-xl font-bold">{s.name}</h3>
                  <span className="ml-auto text-sm text-muted">{items.length} {items.length === 1 ? "product" : "products"}</span>
                </div>
                <div className={`hairline-grid grid-cols-1 sm:grid-cols-2 ${mode === "industry" ? "lg:grid-cols-3 xl:grid-cols-4" : "xl:grid-cols-3"}`}>
                  {items.map(({ p, context }) => <ProductCard key={p.id} p={p} context={context} industry={industry.slug} />)}
                </div>
              </section>
            ))}
            {customCard}
          </div>
        ) : (
          <div className="mt-8 grid gap-px bg-line sm:grid-cols-2">
            <div className="bg-cloud p-6">
              <p className="font-display text-lg font-bold text-heading">No products match these filters.</p>
              <p className="mt-2 text-sm">Try removing a filter, or tell us what you need and the team will advise.</p>
              <button type="button" onClick={reset} className="btn btn-outline btn-sm mt-5"><span>Reset filters</span></button>
            </div>
            {customCard}
          </div>
        )}
        {list.length > 1 && mode !== "home" ? (
          <p className="mt-6 text-sm text-muted">{list.length} products selected — use the bar at the bottom of the screen to send one consolidated enquiry.</p>
        ) : null}
      </div>

      {drawer ? (
        <div className="fixed inset-0 z-[60] bg-black/40 lg:hidden" onClick={() => setDrawer(false)}>
          <div role="dialog" aria-modal="true" aria-label="Filter products" className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto bg-cloud p-5 pb-8" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <p className="font-display text-lg font-bold text-heading">Filter products</p>
              <button type="button" onClick={() => setDrawer(false)} className="flex size-10 items-center justify-center" aria-label="Close filters"><X className="size-5" /></button>
            </div>
            {filters}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" className="btn btn-outline" onClick={reset}><span>Reset</span></button>
              <button type="button" className="btn" onClick={() => setDrawer(false)}><span>Show {results.length}</span></button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
