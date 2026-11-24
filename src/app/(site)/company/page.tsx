import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Download } from "lucide-react";
import { CtaBand, PageHero, SectionHeading } from "@/components/ui/blocks";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { DOWNLOADS, industries, products, verticals } from "@/data/catalog";
import { companyMenu } from "@/data/navigation";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Merova Printpack | Multi-Material Packaging Partner",
  description: "Merova Printpack is a multi-material packaging solutions partner for corrugated, paperboard, foodservice, flexible and custom packaging. Our positioning, philosophy, mission and vision.",
  path: "/company",
});

const VALUES = [
  { name: "Precision", text: "A dieline is either right to the millimetre or it is scrap. Tolerances are written down, not assumed." },
  { name: "Reliability", text: "A committed date is a date. If a run is at risk, you hear it from us first." },
  { name: "Partnership", text: "We work with product, procurement and logistics together, because the pack has to satisfy all three." },
  { name: "Responsibility", text: "Lighter structures, less waste and honest claims — stated per material, never in general." },
  { name: "Practical innovation", text: "New materials and formats are tested against the same standards as everything else before they are offered." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Merova"
        title="More Than Packaging. A Manufacturing Partner Built Around Your Business."
        intro="Merova Printpack brings corrugated, paperboard, foodservice, flexible and custom packaging together under one accountable partner — so the right material is chosen for each application, and every pack is specified, sampled and checked before it reaches your line."
        crumbs={[{ name: "Company", href: "/company" }]}
      >
        <TrackedLink href={DOWNLOADS.profile} download event="profile_download" className="btn btn-navy"><Download className="h-4 w-4" aria-hidden /> Download Company Profile</TrackedLink>
        <Link href="/contact" className="btn btn-outline">Speak With Our Team</Link>
      </PageHero>

      <section className="py-14 lg:py-20">
        <div className="container-x grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <SectionHeading eyebrow="Positioning" title="A multi-material packaging solutions partner." />
            <div className="prose-merova mt-6">
              <p>Most packaging buyers work with several suppliers: one for corrugated, another for cartons, another for films. Each optimises for its own process. Merova is positioned differently — across {verticals.length} material verticals and {products.length} product formats — so recommendations start from your product and its route, not from a single machine.</p>
              <p>We work with businesses in {industries.length} industries, from pharmaceutical cartons and automotive transit packaging to cinema concession ranges and FMCG films. Where nothing standard fits, we develop custom packaging from drawings, photographs or samples.</p>
              <p><strong>Our manufacturing philosophy:</strong> prove it on a sample, write it on the specification, then run it. Nothing goes to full production on an assumption.</p>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-md">
            <Image src="/assets/manufacturing/about-production-floor.webp" alt="Packaging production floor with stacked corrugated board" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
            <span className="absolute bottom-2 left-2 rounded-sm bg-white/85 px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.08em] text-muted">Representative image</span>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white py-14 lg:py-20">
        <div className="container-x grid gap-5 md:grid-cols-3">
          {[
            { k: "Mission", v: "To supply every packaging format a customer needs through one accountable partner — on one agreed specification, to a date we have committed to." },
            { k: "Vision", v: "Packaging that is specified rather than guessed, so every pack is only as heavy, as printed and as costly as the job requires." },
            { k: "Brand promise", v: "Packaging, Perfected: engineered to protect your product, designed to perform on your line, on the shelf and in transit." },
          ].map((x) => (
            <div key={x.k} className="rounded-md border border-line p-7">
              <p className="eyebrow">{x.k}</p>
              <p className="mt-3 font-display text-[1.15rem] font-medium leading-snug text-navy-950">{x.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="container-x">
          <SectionHeading eyebrow="Values" title="How we work" />
          <dl className="mt-8 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {VALUES.map((v) => (
              <div key={v.name} className="bg-white p-6">
                <dt className="font-display font-semibold text-navy-950">{v.name}</dt>
                <dd className="mt-2 text-[0.9rem] leading-relaxed text-ink-2">{v.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t border-line bg-paper-2 py-14 lg:py-20">
        <div className="container-x">
          <h2 className="t-3">Explore the company</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...companyMenu.slice(1), { label: "Manufacturing", href: "/manufacturing" }, { label: "Quality Assurance", href: "/quality" }, { label: "Sustainability", href: "/sustainability" }].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="flex items-center justify-between rounded border border-line bg-white px-5 py-4 font-semibold text-navy-900 hover:border-navy-900">
                  {l.label} <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title="Let's talk about your packaging." text="Whether it's a single format or a full range across materials, tell us what you need and we'll recommend how to pack it." />
    </>
  );
}
