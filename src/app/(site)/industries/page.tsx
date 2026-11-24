import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand, CustomRequirementBand, PageHero } from "@/components/ui/blocks";
import { IndustryIcon } from "@/components/ui/Icon";
import { industries, productsForIndustry } from "@/data/catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Packaging Solutions by Industry | Merova Printpack",
  description: "Packaging solutions for pharmaceuticals, automotive, food and beverage, retail, gifting, industrial, e-commerce, multiplexes, FMCG and electronics.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions by industry"
        title="Packaging that understands your industry."
        intro="Every industry has its own handling, regulatory and presentation demands. Choose yours to see the packaging formats that fit, the considerations that matter and a direct route to a quotation."
        crumbs={[{ name: "Industries", href: "/industries" }]}
      />
      <section className="py-14 lg:py-20">
        <ul className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((i) => (
            <li key={i.id}>
              <Link href={`/industries/${i.slug}`} className="card group flex h-full flex-col p-6 transition-shadow hover:shadow-card">
                <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-red-500 text-white">
                  <IndustryIcon name={i.icon} className="h-5 w-5" />
                </span>
                <h2 className="mt-5 font-display text-xl font-semibold text-char-950 group-hover:text-red-600">{i.name}</h2>
                <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-2">{i.intro}</p>
                <p className="mt-4 font-sans tabular-nums text-[0.7rem] uppercase tracking-[0.12em] text-muted">{productsForIndustry(i.id).length} packaging solutions</p>
                <span className="link-arrow mt-auto pt-4 text-[0.9rem]">Explore {i.shortName} <ArrowRight className="h-4 w-4" aria-hidden /></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CustomRequirementBand />
      <CtaBand title="Can't see your industry?" text="Merova's packaging is used well beyond these sectors. Tell us what you pack and we'll recommend a solution." primary={{ label: "Discuss Your Requirement", href: "/custom-requirement" }} />
    </>
  );
}
