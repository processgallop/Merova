import { ShieldCheck } from "lucide-react";
import { CtaBand, PageHero, SampleBadge, SectionHead } from "@/components/ui/blocks";
import { QUALITY_STAGES, SAMPLE_FACILITY } from "@/data/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Quality Assurance | Merova Printpack", description: "Incoming material inspection, in-process checks, dimensional and print verification, testing, final inspection, traceability and corrective action.", path: "/about/quality/" });

export default function Page() {
  return (
    <>
      <PageHero crumbs={[{ name: "About Merova", href: "/about/" }, { name: "Quality assurance", href: "/about/quality/" }]} eyebrow="Quality assurance" title="Checked at every stage, against the approved sample." intro="Quality is defined by the signed sample and specification. Every check refers back to them." image="/assets/renders/scenes/quality.webp" imageAlt="Corrugated partitions holding bottles" />
      <section className="section bg-sand">
        <div className="wrap wrap-wide">
          <SectionHead eyebrow="Quality stages" title="Eight controls from material to release." />
          <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{QUALITY_STAGES.map((q, i) => <li key={q.name} className="reveal rounded-[24px] bg-white p-6" style={{ ["--i" as string]: i % 4 }}><ShieldCheck className="h-6 w-6 text-red" /><h3 className="mt-4 h4">{q.name}</h3><p className="mt-2 text-[15px] text-stone">{q.text}</p></li>)}</ol>
        </div>
      </section>
      <section className="section">
        <div className="wrap wrap-wide grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div><div className="flex items-center gap-3"><p className="eyebrow">Certifications</p><SampleBadge /></div><h2 className="h2 mt-4">Published with evidence.</h2><p className="lede mt-5">Certificates are listed with their scope and validity once Merova supplies them. Logos are not shown without a current certificate.</p></div>
          <ul className="grid gap-3">{SAMPLE_FACILITY.certifications.map((c) => <li key={c.name} className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-white p-5"><span className="font-semibold">{c.name}</span><span className="text-right text-sm text-stone">{c.status}</span></li>)}</ul>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
