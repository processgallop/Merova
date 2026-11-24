import { CtaBand, FaqList, PageHero } from "@/components/ui/blocks";
import { JsonLd } from "@/components/seo/JsonLd";
import { SUB_CONTENT } from "@/data/product-content";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "FAQs | Packaging Materials, Printing, Quotes | Merova Printpack", description: "Answers to common questions on packaging materials, printing, artwork, samples, quotations, food contact, compostability and India's plastic rules.", path: "/resources/faqs/" });

const GENERAL = [
  { q: "What does Merova Printpack supply?", a: "Printing and packaging across four materials: paper products (cartons, rigid boxes, foodservice, bags, labels, print), plastic products and films, compostable products, and corrugated and fluted products." },
  { q: "How do I get a quotation?", a: "Add products to your enquiry from any product or industry page, then send the enquiry with approximate quantities. You can also describe a custom requirement. The team replies with a recommended specification and a quotation." },
  { q: "Do you publish prices?", a: "No. Price depends on size, material, print, finish and quantity, so every requirement is quoted." },
  { q: "Are the specifications on the website final?", a: "Values marked 'Indicative' are typical ranges for the format. Your exact specification is confirmed at quotation and on the approved sample." },
  { q: "Can I get samples?", a: "Yes. Samples are produced for fit, handling and print approval before production. Sampling terms are confirmed with the quotation." },
  { q: "What artwork do you need?", a: "Print-ready vector files (PDF, AI or EPS) on our dieline, with fonts outlined and 3 mm bleed. We supply dielines on request." },
  { q: "Do you supply single-use plastic cups, plates or cutlery?", a: "No. These items have been prohibited in India since 1 July 2022. We offer paper and certified compostable alternatives." },
  { q: "How are compostable products certified?", a: "Each compostable product is published with its certification (industrial or home compostable) and, in India, its CPCB certificate number for the grade supplied." },
];
const SECTIONS = [["General", GENERAL], ["Cartons & rigid boxes", [...(SUB_CONTENT["PA-A"].faqs ?? []), ...(SUB_CONTENT["PA-B"].faqs ?? [])]], ["Foodservice", SUB_CONTENT["PA-C"].faqs ?? []], ["Films & flexible packaging", [...(SUB_CONTENT["PL-A"].faqs ?? []), ...(SUB_CONTENT["PL-D"].faqs ?? [])]], ["Compostable", [...(SUB_CONTENT["CO-A"].faqs ?? []), ...(SUB_CONTENT["CO-D"].faqs ?? [])]], ["Corrugated", SUB_CONTENT["CR-A"].faqs ?? []]] as const;

export default function Page() {
  return (
    <>
      <JsonLd data={faqJsonLd(GENERAL)} />
      <PageHero crumbs={[{ name: "Resources", href: "/resources/" }, { name: "FAQs", href: "/resources/faqs/" }]} eyebrow="FAQs" title="Answers, by topic." />
      <section className="section-tight">
        <div className="wrap wrap-wide grid gap-14">{SECTIONS.map(([t, f]) => <div key={t} className="grid gap-8 lg:grid-cols-[0.6fr_1.4fr]"><h2 className="h3">{t}</h2><FaqList faqs={[...f]} /></div>)}</div>
      </section>
      <CtaBand title="Didn't find your answer?" text="Ask Mira, message us on WhatsApp, or send your question to the team." primary={{ label: "Contact the team", href: "/contact/" }} />
    </>
  );
}
