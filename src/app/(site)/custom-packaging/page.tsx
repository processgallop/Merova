import { Check } from "lucide-react";
import { PageHero } from "@/components/ui/blocks";
import { CustomForm } from "@/components/forms/SimpleForms";
import { industries } from "@/data/catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Custom Packaging Requirement | Merova Printpack", description: "Don't know the product name? Describe what you need to pack, upload a photo of your current packaging, and Merova will propose a format and specification.", path: "/custom-packaging/" });

export default function CustomPage() {
  return (
    <>
      <PageHero tone="red" crumbs={[{ name: "Custom packaging", href: "/custom-packaging/" }]} eyebrow="Custom requirement" title="Don't know what it's called? Describe it." intro="Tell us what you pack, how it travels and what's going wrong today. Upload a photo of the current pack. We'll propose a format, material and specification." image="/assets/renders/scenes/custom.webp" imageAlt="Die-cut box being opened" />
      <section className="section-tight bg-sand">
        <div className="wrap wrap-wide grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-[32px] bg-cloud p-5 sm:p-8 lg:p-10"><h2 className="h3">Your requirement</h2><div className="mt-8"><CustomForm industries={industries.map((i) => i.name)} /></div></div>
          <aside className="grid content-start gap-4">
            <div className="rounded-[28px] bg-white p-7"><h2 className="h4">What helps us most</h2><ul className="mt-4 grid gap-3 text-[15px] text-charcoal">{["Photo of the product and the current pack", "Weight and dimensions of the product", "How it's stored, shipped and sold", "Quantities per order or per month", "Brand artwork, if printing is needed"].map((t) => <li key={t} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 flex-none text-red" />{t}</li>)}</ul></div>
            <div className="rounded-[28px] bg-graphite p-7 text-white"><h2 className="h4 text-white">What you'll get</h2><p className="mt-3 text-[15px] text-[#cfc7c0]">A recommended format across our four material families, an indicative specification, sampling where needed, and a quotation.</p></div>
          </aside>
        </div>
      </section>
    </>
  );
}
