import { Download } from "lucide-react";
import { CtaBand, PageHero, Pending, SectionHeading } from "@/components/ui/blocks";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { CLAIM_DEFINITIONS, SUSTAINABILITY_TOPICS } from "@/data/company";
import { DOWNLOADS } from "@/data/catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Sustainable Packaging & Responsible Manufacturing | Merova Printpack",
  description: "Recycled paper, responsible sourcing, waste reduction, material optimisation, recyclable formats and certified-compostable options — with every claim stated per material.",
  path: "/sustainability",
});

export default function SustainabilityPage() {
  return (
    <>
      <PageHero
        eyebrow="Sustainability"
        title="Better Packaging Decisions Begin With Better Material Choices."
        intro="Most of a pack's environmental footprint is decided at specification: which material, how much of it, and what happens to it after use. That is where Merova focuses — with claims stated per material, never as blanket promises."
        crumbs={[{ name: "Sustainability", href: "/sustainability" }]}
        image={{ src: "/assets/manufacturing/sustainability-material-flow.webp", alt: "Sorted paper and board offcuts ready for recycling", kind: "representative" }}
      >
        <TrackedLink href={DOWNLOADS.sustainability} download event="document_download" className="btn btn-navy"><Download className="h-4 w-4" aria-hidden /> Sustainability approach (PDF)</TrackedLink>
      </PageHero>
      <section className="py-14 lg:py-20">
        <div className="container-x">
          <SectionHeading eyebrow="Responsible manufacturing" title="What we do" />
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SUSTAINABILITY_TOPICS.map((t) => (
              <li key={t.name} className="rounded-md border border-line bg-white p-6">
                <h2 className="font-display text-[1.05rem] font-semibold text-navy-950">{t.name}</h2>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-2">{t.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="border-y border-line bg-white py-14 lg:py-20">
        <div className="container-x">
          <SectionHeading eyebrow="Claims, defined" title="Recyclable, recycled content, biodegradable and compostable are not the same." intro="We use these terms precisely so your own packaging claims stay credible." />
          <dl className="mt-8 grid gap-5 md:grid-cols-2">
            {CLAIM_DEFINITIONS.map((d) => (
              <div key={d.term} className="rounded-md border border-line p-6">
                <dt className="font-display text-lg font-semibold text-navy-950">{d.term}</dt>
                <dd className="mt-2 leading-relaxed text-ink-2">{d.text}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8"><Pending>Recycled-content figures, waste-recovery data and compostability certificates will be published per material once documented evidence is supplied.</Pending></div>
        </div>
      </section>
      <CtaBand title="Exploring lower-impact packaging?" text="Share your current packaging and goals. We'll assess alternatives against the same performance requirements." primary={{ label: "Discuss sustainable options", href: "/custom-requirement?context=sustainability" }} secondary={{ label: "Sustainable alternatives", href: "/custom-packaging/sustainable-alternatives" }} />
    </>
  );
}
