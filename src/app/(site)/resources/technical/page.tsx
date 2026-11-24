import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand, PageHero, SectionHead } from "@/components/ui/blocks";
import { articles, CATEGORIES } from "@/content/blog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Technical Resources | Packaging Specification Guides | Merova", description: "Reference guides for packaging buyers: corrugated ply and flute, packaging films and microns, paper cups, labels, food contact and compostability.", path: "/resources/technical/" });

const TABLES = [
  { title: "Corrugated construction: a starting guide", head: ["Construction", "Typical use", "Indicative load*"], rows: [["3-ply (single wall)", "Light goods, retail supply, e-commerce", "Up to ≈10 kg"], ["5-ply (double wall)", "Heavier or stacked loads, longer transit", "≈10–25 kg"], ["7-ply (triple wall)", "Heavy industrial and export", "≈25–60 kg"]], note: "*Indicative only. Actual performance depends on paper grades, box size, stacking and humidity; confirmed by test for your load." },
  { title: "Packaging films at a glance", head: ["Film", "Strength", "Typical use"], rows: [["BOPP (HST)", "Clarity, stiffness, heat-sealable", "Overwrap, FFS packing"], ["POF shrink", "Clear, tight retail shrink", "Retail packs, multipacks"], ["PE shrink", "Strong collation", "Bottle and can bundles"], ["LLDPE stretch", "Load holding", "Pallet unitising"], ["PVC cling", "Self-cling, food service", "Kitchen wrapping"]], note: "" },
];

export default function Page() {
  const groups = Object.entries(CATEGORIES).map(([id, c]) => ({ c, list: articles.filter((a) => a.category === id) })).filter((g) => g.list.length);
  return (
    <>
      <PageHero crumbs={[{ name: "Resources", href: "/resources/" }, { name: "Technical resources", href: "/resources/technical/" }]} eyebrow="Technical resources" title="Specify with confidence." intro="Reference tables and practical guides for the decisions buyers make most often." />
      <section className="section-tight bg-sand">
        <div className="wrap wrap-wide grid gap-6 lg:grid-cols-2">
          {TABLES.map((t) => <div key={t.title} className="reveal overflow-hidden rounded-[28px] bg-white"><h2 className="h4 p-6 pb-3">{t.title}</h2><div className="overflow-x-auto"><table className="w-full text-[15px]"><thead><tr className="bg-sand text-left text-xs uppercase tracking-[0.1em] text-stone">{t.head.map((h) => <th key={h} className="px-6 py-3 font-semibold">{h}</th>)}</tr></thead><tbody>{t.rows.map((r) => <tr key={r[0]} className="border-t border-line">{r.map((c, i) => <td key={i} className={`px-6 py-3 ${i === 0 ? "font-semibold" : "text-charcoal"}`}>{c}</td>)}</tr>)}</tbody></table></div>{t.note && <p className="p-6 pt-3 text-xs text-stone">{t.note}</p>}</div>)}
        </div>
      </section>
      <section className="section-tight">
        <div className="wrap wrap-wide">
          <SectionHead eyebrow="Guides" title="Read by topic." />
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">{groups.map(({ c, list }) => <div key={c.slug}><h3 className="h4">{c.name}</h3><ul className="mt-3 grid gap-1">{list.map((a) => <li key={a.slug}><Link href={a.url} className="group flex items-start justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-sand"><span className="text-[15px]">{a.title}</span><ArrowRight className="mt-1 h-4 w-4 flex-none text-red" /></Link></li>)}</ul></div>)}</div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
