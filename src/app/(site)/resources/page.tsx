import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { Crumbs, SectionHead } from "@/components/ui/blocks";
import { DownloadList } from "@/components/sections/Sections";
import { getCatalog, getResources } from "@/lib/content";
import { meta } from "@/lib/meta";

export const revalidate = 3600;
export const metadata = meta({ title: "Resources & Downloads", description: "Merova product catalogue, company profile, technical documents and a downloadable flyer for every product.", path: "/resources" });

export default async function ResourcesPage() {
  const [resources, { segments, cards }] = await Promise.all([getResources(), getCatalog()]);
  const catalogue = resources.find((r) => r.kind === "catalogue");
  const profile = resources.find((r) => r.kind === "profile");
  return (
    <>
      <section className="border-b border-line">
        <div className="wrap pb-14 pt-10">
          <Crumbs items={[{ name: "Resources", href: "/resources" }]} />
          <p className="eyebrow mt-10">Resources</p>
          <h1 className="t-display mt-5 max-w-4xl">Documentation for confident packaging decisions.</h1>
          <p className="t-lead mt-5 max-w-2xl">Catalogue, company profile, technical brochures and a flyer for every product — plus technical guides in the knowledge centre.</p>
        </div>
      </section>

      <section id="catalogue" className="section-tight">
        <div className="wrap grid gap-px bg-line md:grid-cols-2">
          {catalogue ? (
            <a href={catalogue.fileUrl} data-track-download="catalogue" className="surface-red group relative overflow-hidden p-8 sm:p-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/75">Complete portfolio</p>
              <p className="mt-4 font-display text-3xl font-bold text-white">{catalogue.title}</p>
              <p className="mt-3 max-w-md text-white/85">{catalogue.description}</p>
              <span className="mt-8 inline-flex items-center gap-2 font-semibold text-white"><Download className="size-4" /> Download PDF</span>
            </a>
          ) : null}
          {profile ? (
            <a id="company" href={profile.fileUrl} data-track-download="company_profile" className="surface-ink group p-8 sm:p-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/60">Corporate</p>
              <p className="mt-4 font-display text-3xl font-bold text-white">{profile.title}</p>
              <p className="mt-3 max-w-md text-white/75">{profile.description}</p>
              <span className="mt-8 inline-flex items-center gap-2 font-semibold text-white"><Download className="size-4" /> Download PDF</span>
            </a>
          ) : null}
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <SectionHead eyebrow="Technical documents" title="Brochures and technical documents" className="mb-10" />
          <DownloadList items={resources.filter((r) => r.kind !== "catalogue" && r.kind !== "profile")} />
        </div>
      </section>

      <section id="flyers" className="section surface-paper">
        <div className="wrap">
          <SectionHead align="split" eyebrow="Product flyers" title={`${cards.filter((c) => c.flyer).length} product flyers.`} intro="A one-page technical flyer for every published product, with a QR code back to its page." />
          <div className="mt-12 space-y-10">
            {segments.map((s) => (
              <div key={s.id}>
                <p className="mb-3 flex items-baseline gap-3 border-b border-heading pb-2 font-display font-bold text-heading"><span className="index-num text-red">{s.code}</span>{s.name}</p>
                <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
                  {cards.filter((c) => c.segment.id === s.id && c.flyer).map((c) => (
                    <li key={c.id} className="border-b border-line">
                      <a href={c.flyer!} data-track-download={`flyer:${c.slug}`} className="group flex items-center gap-3 py-3 text-sm">
                        <Download className="size-4 flex-none text-red" />
                        <span className="flex-1 font-medium text-heading group-hover:text-red">{c.name}</span>
                        <span className="text-xs text-muted">PDF</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap grid gap-px bg-line md:grid-cols-2">
          <Link href="/knowledge" className="group bg-cloud p-8 transition-colors hover:bg-surface">
            <p className="font-display text-2xl font-bold text-heading group-hover:text-red">Packaging Knowledge Centre</p>
            <p className="mt-2">Technical guides on board, flutes, films, cups, food contact and procurement.</p>
            <span className="link link-red mt-6">Read the guides <ArrowRight className="size-4" /></span>
          </Link>
          <Link href="/resources/faqs" className="group bg-cloud p-8 transition-colors hover:bg-surface">
            <p className="font-display text-2xl font-bold text-heading group-hover:text-red">Frequently asked questions</p>
            <p className="mt-2">Quotations, customisation, quality, materials and sustainability.</p>
            <span className="link link-red mt-6">View FAQs <ArrowRight className="size-4" /></span>
          </Link>
        </div>
      </section>
    </>
  );
}
