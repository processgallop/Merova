import { PageHero, SectionHeading } from "@/components/ui/blocks";
import { EmbeddedContact } from "@/components/forms/EmbeddedContact";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Careers at Merova Printpack | Packaging Manufacturing Jobs",
  description: "Build better packaging and your career with Merova — production, quality, design, technical, sales and customer service roles. Apply or send your CV.",
  path: "/company/careers",
});

const AREAS = [
  { k: "Production & operations", v: "Run, set up and improve converting and finishing operations to the approved specification." },
  { k: "Quality", v: "Inspection, testing, records and corrective action across every stage." },
  { k: "Design & pre-press", v: "Structural design, dielines, artwork preparation and proofing." },
  { k: "Technical", v: "Materials, constructions, sampling and trials with customers." },
  { k: "Sales & business development", v: "Understand customer applications and recommend the right packaging." },
  { k: "Customer service", v: "Coordinate samples, orders and dispatch with customers day to day." },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build Better Packaging. Build Your Career With Merova."
        intro="Packaging is a precise, practical craft. If you like solving real problems — on the shop floor, at the design desk or with customers — we'd like to hear from you."
        crumbs={[{ name: "Company", href: "/company" }, { name: "Careers", href: "/company/careers" }]}
      />
      <section className="py-14 lg:py-20">
        <div className="container-x">
          <SectionHeading eyebrow="Culture" title="How we work together" intro="Clear specifications, written processes and ownership of outcomes. We value people who check their work, speak up early and keep learning." />
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {AREAS.map((a) => (
              <li key={a.k} className="rounded-sm border border-line bg-white p-6">
                <h2 className="font-display text-lg font-semibold text-char-950">{a.k}</h2>
                <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-2">{a.v}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section id="apply" className="border-t border-line bg-white py-14 lg:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading eyebrow="Open positions" title="Apply or register your interest" intro="No specific vacancies are listed right now. Send your CV and the area you're interested in, and we'll be in touch when a suitable role opens." />
          <EmbeddedContact topic="careers" />
        </div>
      </section>
    </>
  );
}
