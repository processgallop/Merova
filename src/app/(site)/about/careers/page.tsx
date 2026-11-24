import { PageHero } from "@/components/ui/blocks";
import { ContactForm } from "@/components/forms/SimpleForms";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Careers | Merova Printpack", description: "Work in printing and packaging at Merova: production, quality, design, technical and customer service roles.", path: "/about/careers/" });

export default function Page() {
  return (
    <>
      <PageHero tone="red" crumbs={[{ name: "About Merova", href: "/about/" }, { name: "Careers", href: "/about/careers/" }]} eyebrow="Careers" title="Build packaging people trust." intro="We look for people who care about getting the detail right: in production, quality, design, technical and customer service." />
      <section className="section-tight bg-sand">
        <div className="wrap wrap-wide grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="rounded-[28px] bg-white p-7"><h2 className="h3">Open applications</h2><p className="body mt-3">There are no advertised roles right now. Send us your CV and tell us what you'd like to work on; we keep applications on file for future openings.</p><p className="mt-5 text-sm text-stone">Email: {site.contact.careersEmail}</p></div>
          <div className="rounded-[32px] bg-cloud p-5 sm:p-8"><h2 className="h3">Apply</h2><div className="mt-6"><ContactForm defaultTopic="careers" lockTopic /></div></div>
        </div>
      </section>
    </>
  );
}
