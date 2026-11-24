import { CtaBand, FaqList, PageHero } from "@/components/ui/blocks";
import { verticals, industries } from "@/data/catalog";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "Packaging FAQs | Merova Printpack",
  description: "Frequently asked questions about Merova's packaging products, quotations, customisation, quality, food contact and sustainability.",
  path: "/resources/faqs",
});

const GENERAL = [
  { q: "How do I request a quotation?", a: "Use the Request a Quote form. Choose your product and the form asks for the details that matter for it — dimensions, materials, printing and quantity — and lets you attach drawings, artwork or photographs." },
  { q: "What happens after I submit an enquiry?", a: "You receive a reference number, and the enquiry is routed to the team responsible for your product. A specialist reviews it and contacts you to confirm details, recommend a specification and arrange samples or a quotation." },
  { q: "Do you supply samples?", a: "Sampling is part of the development process for new and custom packaging. Sampling terms are confirmed with each quotation." },
  { q: "What are your minimum order quantities and lead times?", a: "They depend on the product, specification and print. The team confirms them with your quotation — share your volumes and timeline in the quote form." },
  { q: "Is my information confidential?", a: "Yes. Enquiry details and files are used only to assess and respond to your requirement. Mention it if you need a non-disclosure agreement." },
  { q: "Are the product images photographs of Merova products?", a: "No. Product visuals are studio visualisations — computer-generated renders of each packaging format — or representative imagery, and are captioned as such. They show the type of packaging; your packaging is specified and sampled to your requirement." },
  { q: "What does 'confirmed at quotation' mean on a specification?", a: "It marks a Merova-specific value — such as board grade, GSM, micron or tolerance — that is confirmed in writing for your order rather than published as a general figure." },
];

export default function FaqsPage() {
  const groups = [
    { title: "General", faqs: GENERAL },
    ...verticals.map((v) => ({ title: v.name, faqs: v.faqs })),
    { title: "Industries", faqs: industries.flatMap((i) => i.faqs).slice(0, 8) },
  ];
  const all = groups.flatMap((g) => g.faqs);
  return (
    <>
      <PageHero eyebrow="FAQs" title="Frequently asked questions" intro="Can't find your answer? Ask Mira, or contact the team." crumbs={[{ name: "Resources", href: "/resources" }, { name: "FAQs", href: "/resources/faqs" }]} />
      <section className="py-14 lg:py-20">
        <div className="container-x grid gap-12">
          {groups.map((g) => (
            <div key={g.title} className="grid gap-6 lg:grid-cols-[1fr_2fr]">
              <h2 className="t-3">{g.title}</h2>
              <FaqList faqs={g.faqs} schema={false} />
            </div>
          ))}
        </div>
      </section>
      <JsonLd data={faqJsonLd(all)} />
      <CtaBand title="Still have a question?" text="Send it to the team and the right specialist will reply." primary={{ label: "Contact Us", href: "/contact" }} secondary={{ label: "Request a Quote", href: "/request-a-quote" }} />
    </>
  );
}
