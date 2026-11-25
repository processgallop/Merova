import { Suspense } from "react";
import { Emblem } from "@/components/brand/Logo";
import { Crumbs } from "@/components/ui/blocks";
import { Discovery } from "@/components/industry/Discovery";
import { Cta, IndustryGrid } from "@/components/sections/Sections";
import { getDiscoveryData } from "@/lib/discovery";
import { meta } from "@/lib/meta";

export const revalidate = 3600;
export const metadata = meta({
  title: "Packaging by Industry | What Can Merova Do for Your Industry?",
  description: "Select your industry to discover relevant corrugated, paperboard, foodservice, flexible and custom packaging from across Merova's portfolio — filter, compare and request one consolidated quote.",
  path: "/industries",
});

export default async function IndustriesPage() {
  const data = await getDiscoveryData();
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <Emblem mode="draw" strokeWidth={1.4} className="pointer-events-none absolute -right-[12%] -top-[30%] w-[70%] opacity-20" />
        <div className="wrap relative pb-14 pt-10">
          <Crumbs items={[{ name: "Industries", href: "/industries" }]} />
          <p className="eyebrow rise-in mt-10">What can Merova do for your industry?</p>
          <h1 className="t-hero rise-in mt-6 max-w-5xl" style={{ "--d": 1 } as React.CSSProperties}>Packaging Expertise Across Industries.</h1>
          <p className="t-lead rise-in mt-6 max-w-3xl" style={{ "--d": 2 } as React.CSSProperties}>
            Every industry has different packaging requirements. Select your industry to discover relevant products, materials and packaging solutions from across Merova&apos;s portfolio — then filter, compare and send one consolidated enquiry.
          </p>
          <ol className="rise-in mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-heading" style={{ "--d": 3 } as React.CSSProperties}>
            {["Select industry", "Discover products across segments", "Filter", "Explore details", "Request a quote"].map((s, i) => (
              <li key={s} className="flex items-center gap-2"><span className="flex size-6 items-center justify-center rounded-full bg-red text-[11px] text-white">{i + 1}</span>{s}</li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section surface-paper">
        <div className="wrap">
          <Suspense>
            <Discovery data={data} mode="full" />
          </Suspense>
        </div>
      </section>
      <IndustryGrid data={{ eyebrow: "Industry pages", heading: "Explore every industry pathway.", intro: "Each industry page explains typical requirements and brings mapped products together from all five segments." }} />
      <Cta data={{ variant: "red", heading: "Industry not listed? Start with what you pack.", text: "Describe your product and how it travels — our team will identify suitable formats.", primary: { label: "Discuss Your Custom Requirement", href: "/custom-requirement" }, secondary: { label: "Speak With Our Team", href: "/contact" } }} />
    </>
  );
}
