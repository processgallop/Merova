import { Clock, FileCheck2, ShieldCheck } from "lucide-react";
import { Crumbs } from "@/components/ui/blocks";
import { getCatalog } from "@/lib/content";
import { QuoteEngine, type QuoteProduct } from "./QuoteEngine";

export async function EnquiryShell({ mode, title, eyebrow, intro, searchParams }: { mode: "quote" | "custom"; title: string; eyebrow: string; intro: string; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]![0] : sp[k]) ?? "";
  const { cards, industries } = await getCatalog();
  const products: QuoteProduct[] = cards.map((c) => ({ slug: c.slug, name: c.name, segment: c.segment.navName, segmentCode: c.segment.code, profile: c.quoteProfile, image: c.image?.url }));
  const initial = [...one("products").split(","), one("product")].map((s) => s.trim()).filter(Boolean);
  const ind = one("industry");
  const industry = industries.find((i) => i.slug === ind || i.slug.startsWith(ind))?.slug ?? "";
  return (
    <section className="relative">
      <div className="wrap grid gap-12 pb-24 pt-8 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <Crumbs items={[{ name: title, href: mode === "quote" ? "/request-a-quote" : "/custom-requirement" }]} />
          <p className="eyebrow mt-10">{eyebrow}</p>
          <h1 className="t-display mt-5">{title}</h1>
          <p className="t-lead mt-5">{intro}</p>
          <ul className="mt-10 space-y-5 border-t border-line pt-8 text-sm">
            <li className="flex gap-3"><FileCheck2 className="size-5 flex-none text-red" /><span><strong className="block text-heading">Technical questions that matter</strong>Fields adapt to each product you select. Approximate values are fine.</span></li>
            <li className="flex gap-3"><Clock className="size-5 flex-none text-red" /><span><strong className="block text-heading">Routed to the right team</strong>Your enquiry is logged with a reference and passed to the relevant specialist.</span></li>
            <li className="flex gap-3"><ShieldCheck className="size-5 flex-none text-red" /><span><strong className="block text-heading">Confidential</strong>Information and files are used only to respond to your requirement.</span></li>
          </ul>
        </aside>
        <div className="lg:col-span-8">
          <div className="border border-line bg-cloud p-5 sm:p-8 lg:p-10">
            <QuoteEngine products={products} industries={industries.map((i) => ({ slug: i.slug, name: i.name }))} mode={mode} initialProducts={initial} initialIndustry={industry} />
          </div>
        </div>
      </div>
    </section>
  );
}
