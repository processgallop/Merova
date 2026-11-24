import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Download } from "lucide-react";
import { CtaBand, PageHero, Pending, SectionHeading } from "@/components/ui/blocks";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { DOWNLOADS, productsInVertical, verticals } from "@/data/catalog";
import { MANUFACTURING_PROCESSES } from "@/data/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Packaging Manufacturing | Processes & Production Approach | Merova Printpack",
  description: "How Merova produces packaging: material preparation, printing, corrugation and conversion, cutting and creasing, finishing, forming, film conversion, inspection and dispatch.",
  path: "/manufacturing",
});

export default function ManufacturingPage() {
  return (
    <>
      <PageHero
        eyebrow="Manufacturing"
        title="The Right Infrastructure. The Right Processes. The Right Packaging Outcome."
        intro="Packaging quality is decided by the processes behind it. Here is how Merova takes a job from material to dispatch, and how each step is controlled against the approved specification."
        crumbs={[{ name: "Manufacturing", href: "/manufacturing" }]}
      >
        <Link href="/manufacturing/capabilities" className="btn btn-navy">View capabilities</Link>
        <TrackedLink href={DOWNLOADS.capabilities} download event="document_download" className="btn btn-outline"><Download className="h-4 w-4" aria-hidden /> Capabilities brochure (PDF)</TrackedLink>
      </PageHero>

      <section className="py-14 lg:py-20">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm lg:sticky lg:top-28">
            <Image src="/assets/manufacturing/capabilities-press-hall.webp" alt="Packaging press hall with converting equipment" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
            <span className="absolute bottom-2 left-2 rounded-sm bg-white/85 px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-char-600">Representative image — not a Merova facility</span>
          </div>
          <div>
            <SectionHeading eyebrow="Production journey" title="From material to dispatch" />
            <ol className="mt-8 grid gap-px overflow-hidden rounded-sm border border-line bg-line">
              {MANUFACTURING_PROCESSES.map((p, i) => (
                <li key={p.name} className="grid grid-cols-[3rem_1fr] gap-3 bg-white p-5">
                  <span className="font-display text-lg font-semibold text-red-500">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display font-semibold text-char-950">{p.name}</h3>
                    <p className="mt-1 text-[0.92rem] leading-relaxed text-ink-2">{p.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white py-14 lg:py-20">
        <div className="container-x">
          <SectionHeading eyebrow="Product formats" title="Formats across five material verticals" intro="Each vertical has its own production route and quality checks." />
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {verticals.map((v) => (
              <li key={v.id}>
                <Link href={`/${v.slug}`} className="block h-full rounded-sm border border-line p-5 hover:border-red-500">
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-red-600">{productsInVertical(v.id).length} formats</p>
                  <p className="mt-2 font-display font-semibold text-char-950">{v.name}</p>
                  <span className="link-arrow mt-3 text-[0.85rem]">View <ArrowRight className="h-3.5 w-3.5" aria-hidden /></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="container-x grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading eyebrow="Infrastructure" title="Machinery and facility" />
          <div className="grid gap-4">
            <p className="leading-relaxed text-ink-2">
              Merova publishes equipment, facility and capacity information only once it has been confirmed, so that what you read here is what you can rely on when planning production.
            </p>
            <Pending>Machinery list, plant location and size, production capacity and authentic facility photographs are to be supplied by Merova management.</Pending>
            <Link href="/contact?topic=technical" className="link-arrow">Ask about a specific capability <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </div>
        </div>
      </section>

      <CtaBand eyebrow="Explore Manufacturing" title="Have a production requirement to discuss?" text="Share your format, specification and volumes and the team will confirm how it can be produced." secondary={{ label: "Quality Assurance", href: "/quality" }} />
    </>
  );
}
