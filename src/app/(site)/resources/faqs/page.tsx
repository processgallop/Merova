import { Crumbs, Faqs } from "@/components/ui/blocks";
import { Cta } from "@/components/sections/Sections";
import { JsonLd, faqLd } from "@/components/seo/JsonLd";
import { getSegments } from "@/lib/content";
import { meta } from "@/lib/meta";

export const revalidate = 3600;
export const metadata = meta({ title: "Packaging FAQs", description: "Answers on quotations, customisation, quality, materials and sustainability at Merova Printpack.", path: "/resources/faqs" });

const GENERAL = [
  { q: "How do I request a quotation?", a: "Use Request a Quote. Select one or several products, add whatever specifications you know, attach drawings or artwork, and submit. You receive a reference immediately and the relevant team follows up." },
  { q: "Can I request several different products in one enquiry?", a: "Yes. Use “Enquire” on product cards or industry pages to build a selection, then send one consolidated request. Each product keeps its own specification fields." },
  { q: "Do you publish prices, minimum quantities or lead times?", a: "No. They depend on the specification, print, quantity and delivery location, so they are confirmed in a written quotation." },
  { q: "Are product images photographs of Merova products?", a: "Product images are studio visualisations of the packaging format, and some sector images are representative stock photography. Each is labelled. Physical samples are provided during development." },
  { q: "Do you hold certifications?", a: "Merova lists only certifications that are current and verifiable. Ask the team for documentation relevant to your requirement, such as food-contact declarations for a specific material." },
  { q: "What does “Confirmed at quotation” mean on a specification table?", a: "It marks a value — such as board strength or tolerance — that is agreed for each order and approved on a sample, rather than published as a fixed guarantee." },
  { q: "Who is MIRA?", a: "MIRA is Merova's AI requirements assistant. It answers from approved product information, helps you find products and flyers, and hands over to the team for anything binding." },
];

export default async function FaqPage() {
  const segments = await getSegments();
  const all = [...GENERAL, ...segments.flatMap((s) => s.faqs)];
  return (
    <>
      <section className="border-b border-line">
        <div className="wrap pb-14 pt-10">
          <Crumbs items={[{ name: "Resources", href: "/resources" }, { name: "FAQs", href: "/resources/faqs" }]} />
          <p className="eyebrow mt-10">FAQs</p>
          <h1 className="t-display mt-5">Questions buyers ask us.</h1>
        </div>
      </section>
      <section className="section">
        <div className="wrap grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4"><p className="font-display text-2xl font-bold text-heading">Working with Merova</p></div>
          <div className="lg:col-span-8"><Faqs items={GENERAL} /></div>
          {segments.filter((s) => s.faqs.length).map((s) => (
            <div key={s.id} className="contents">
              <div className="lg:col-span-4"><p className="font-display text-2xl font-bold text-heading"><span className="index-num mr-2 text-red">{s.code}</span>{s.name}</p></div>
              <div className="lg:col-span-8"><Faqs items={s.faqs} /></div>
            </div>
          ))}
        </div>
      </section>
      <Cta data={{ variant: "charcoal", heading: "Question not answered?", text: "Ask MIRA, or reach the team directly.", primary: { label: "Contact Merova", href: "/contact" } }} />
      <JsonLd data={faqLd(all)} />
    </>
  );
}
