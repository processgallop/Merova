import Link from "next/link";
import { ArrowRight, BookOpen, Download, HelpCircle, Wrench } from "lucide-react";
import { CtaBand, PageHero } from "@/components/ui/blocks";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Resources | Catalogue, Brochures, Flyers, Guides | Merova Printpack", description: "Download the Merova product catalogue, category brochures, product flyers and company profile, or read technical guides and FAQs.", path: "/resources/" });

const CARDS = [
  { icon: Download, title: "Download centre", text: "Master catalogue, four category brochures, a flyer for every product, and the company profile.", href: "/resources/downloads/", tone: "tile-red" },
  { icon: Wrench, title: "Technical resources", text: "Guides to ply and flute, films and microns, cupstock, labels and compostability.", href: "/resources/technical/" },
  { icon: HelpCircle, title: "FAQs", text: "Answers on materials, printing, artwork, samples, quotations and compliance.", href: "/resources/faqs/" },
  { icon: BookOpen, title: "Insights", text: "Practical buyer guides for packaging decisions.", href: "/insights/", tone: "tile-dark" },
];

export default function Page() {
  return (
    <>
      <PageHero crumbs={[{ name: "Resources", href: "/resources/" }]} eyebrow="Resources" title="Everything you need to specify with confidence." />
      <section className="section-tight bg-sand"><div className="wrap wrap-wide grid gap-4 md:grid-cols-2">{CARDS.map(({ icon: I, title, text, href, tone }, i) => <Link key={href} href={href} className={`tile reveal p-8 ${tone ?? ""}`} style={{ ["--i" as string]: i }}><I className="h-8 w-8" /><h2 className="mt-12 font-display text-3xl font-semibold">{title}</h2><p className={`mt-2 ${tone ? "text-white/85" : "text-stone"}`}>{text}</p><span className="mt-6 inline-flex items-center gap-2 font-semibold">Open <ArrowRight className="tile-arrow h-4 w-4" /></span></Link>)}</div></section>
      <CtaBand />
    </>
  );
}
