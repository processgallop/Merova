import { PageHero, SectionHeading } from "@/components/ui/blocks";
import { EmbeddedContact } from "@/components/forms/EmbeddedContact";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Business & Strategic Partnerships | Merova Printpack",
  description: "Strategic partnerships, distribution opportunities, institutional enquiries and business collaborations with Merova Printpack.",
  path: "/company/partnerships",
});

const TYPES = [
  { k: "Strategic partnerships", v: "Long-term collaborations with brands, converters and technology providers." },
  { k: "Distribution", v: "Regional distribution and resale of Merova packaging ranges." },
  { k: "Institutional enquiries", v: "Enquiries from institutions, associations and public bodies." },
  { k: "Business collaborations", v: "Joint development of formats, materials or services." },
];

export default function PartnershipsPage() {
  return (
    <>
      <PageHero
        eyebrow="Business partnerships"
        title="Grow with Merova."
        intro="We're open to partnerships that bring better packaging to more customers. Tell us about your business and the collaboration you have in mind."
        crumbs={[{ name: "Company", href: "/company" }, { name: "Business Partnerships", href: "/company/partnerships" }]}
      />
      <section className="py-14 lg:py-20">
        <ul className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TYPES.map((t) => (
            <li key={t.k} className="rounded-sm border border-line bg-white p-6">
              <h2 className="font-display text-lg font-semibold text-char-950">{t.k}</h2>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-2">{t.v}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="border-t border-line bg-white py-14 lg:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading eyebrow="Get in touch" title="Start a partnership conversation" intro="Merova Printpack is a privately held business; this channel is for commercial partnerships, not investment solicitation." />
          <EmbeddedContact topic="partnerships" />
        </div>
      </section>
    </>
  );
}
