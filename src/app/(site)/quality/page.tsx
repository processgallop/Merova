import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand, PageHero, Pending, SectionHeading } from "@/components/ui/blocks";
import { QUALITY_STAGES } from "@/data/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Quality Assurance | Inspection, Testing & Traceability | Merova Printpack",
  description: "Incoming material inspection, production quality control, dimensional accuracy, print quality, testing, traceability and corrective action at Merova Printpack.",
  path: "/quality",
});

export default function QualityPage() {
  return (
    <>
      <PageHero
        eyebrow="Quality assurance"
        title="Quality Is Not a Final Inspection. It Is Built Into Every Stage."
        intro="Every order is checked against one reference: the approved sample and specification. Checks start with incoming material and end only when the goods are released."
        crumbs={[{ name: "Quality", href: "/quality" }]}
      />
      <section className="py-14 lg:py-20">
        <div className="container-x">
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {QUALITY_STAGES.map((q, i) => (
              <li key={q.name} className="rounded-sm border border-line bg-white p-6">
                <span className="font-display text-2xl font-semibold text-red-500">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mt-2 font-display text-[1.08rem] font-semibold text-char-950">{q.name}</h2>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-2">{q.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section id="certifications" className="scroll-mt-24 border-y border-line bg-white py-14 lg:py-20">
        <div className="container-x grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading eyebrow="Certifications & compliance" title="Only current, verifiable certifications." />
          <div className="grid gap-4">
            <p className="leading-relaxed text-ink-2">Merova displays certification marks only for schemes it currently holds, with certificate numbers and scope. Food-contact and material documentation is provided per material at quotation.</p>
            <Pending>No certifications are listed yet. Certificates, numbers, scopes and validity dates are to be supplied by Merova management.</Pending>
            <Link href="/contact?topic=technical" className="link-arrow">Request compliance documentation <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </div>
        </div>
      </section>
      <CtaBand title="Have a quality requirement for your packaging?" text="Share your specification, tests and inspection requirements with your enquiry." secondary={{ label: "Our process", href: "/process" }} />
    </>
  );
}
