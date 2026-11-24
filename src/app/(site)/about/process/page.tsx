import { CtaBand, PageHero, SectionHead } from "@/components/ui/blocks";
import { PROCESS_STEPS } from "@/data/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Process Excellence | From Requirement to Delivery | Merova", description: "Consultation, design, engineering, sampling, approval, manufacturing, inspection, dispatch and client support: how a Merova order runs.", path: "/about/process/" });

export default function Page() {
  return (
    <>
      <PageHero tone="red" crumbs={[{ name: "About Merova", href: "/about/" }, { name: "Process excellence", href: "/about/process/" }]} eyebrow="Process excellence" title="Nine steps from requirement to repeat order." intro="The same controlled sequence for every order, whatever the material. The approved sample is the reference for production and for every repeat." image="/assets/renders/scenes/process.webp" imageAlt="Die-cut box" />
      <section className="section">
        <div className="wrap wrap-wide">
          <SectionHead eyebrow="The sequence" title="What happens, and what you approve." />
          <ol className="relative mt-12 grid gap-4 lg:grid-cols-3">
            {PROCESS_STEPS.map((s, i) => <li key={s.name} className={`reveal rounded-[28px] p-7 ${i === 4 ? "bg-red text-white" : "border border-line bg-white"}`} style={{ ["--i" as string]: i % 3 }}><span className={`font-display text-4xl font-semibold tnum ${i === 4 ? "text-white/80" : "text-red"}`}>{String(i + 1).padStart(2, "0")}</span><h3 className="mt-6 h3">{s.name}</h3><p className={`mt-3 text-[15.5px] leading-relaxed ${i === 4 ? "text-white/90" : "text-stone"}`}>{s.detail}</p></li>)}
          </ol>
        </div>
      </section>
      <CtaBand title="Start with step one." text="Tell us what you pack. We'll take it from consultation to a quotation." />
    </>
  );
}
