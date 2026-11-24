import { Check, Factory } from "lucide-react";
import { CtaBand, PageHero, SampleBadge, SectionHead } from "@/components/ui/blocks";
import { MANUFACTURING_PROCESSES, SAMPLE_FACILITY } from "@/data/company";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Manufacturing & Infrastructure | Merova Printpack", description: "Printing, corrugation, die-cutting, finishing, film conversion and foodservice forming: the processes and equipment behind Merova packaging.", path: "/about/manufacturing/" });

export default function Page() {
  return (
    <>
      <PageHero tone="dark" crumbs={[{ name: "About Merova", href: "/about/" }, { name: "Manufacturing & infrastructure", href: "/about/manufacturing/" }]} eyebrow="Manufacturing & infrastructure" title="Built to the approved sample, run after run." intro="Printing, conversion and finishing for paper, film and corrugated packaging, with in-process checks at every stage." image="/assets/renders/scenes/quality.webp" imageAlt="Corrugated carton with partitions" />
      <section className="section">
        <div className="wrap wrap-wide">
          <SectionHead eyebrow="Processes" title="From material to dispatch." />
          <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{MANUFACTURING_PROCESSES.map((m, i) => <li key={m.name} className="reveal rounded-[24px] border border-line bg-white p-6" style={{ ["--i" as string]: i % 4 }}><span className="font-display text-sm font-semibold text-red tnum">{String(i + 1).padStart(2, "0")}</span><h3 className="mt-3 h4">{m.name}</h3><p className="mt-2 text-[15px] text-stone">{m.text}</p></li>)}</ol>
        </div>
      </section>
      <section className="section bg-sand">
        <div className="wrap wrap-wide">
          <div className="flex flex-wrap items-center gap-3"><p className="eyebrow">Equipment</p><SampleBadge /></div>
          <h2 className="h2 mt-4">Capabilities by area.</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{SAMPLE_FACILITY.equipment.map((e, i) => <div key={e.area} className="reveal rounded-[24px] bg-white p-6" style={{ ["--i" as string]: i }}><Factory className="h-6 w-6 text-red" /><h3 className="mt-4 h4">{e.area}</h3><ul className="mt-3 grid gap-2 text-[15px] text-charcoal">{e.items.map((t) => <li key={t} className="flex gap-2"><Check className="mt-1 h-4 w-4 flex-none text-red" />{t}</li>)}</ul></div>)}</div>
          <p className="mt-6 text-sm text-stone">Plant: {site.contact.plantAddress}. Facility photography and the verified equipment list will replace this sample content.</p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
