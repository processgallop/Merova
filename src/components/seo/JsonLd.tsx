import type { SiteSettings } from "@/db/types";
import { absoluteUrl, siteUrl } from "@/lib/site";

export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function organizationLd(site: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.companyName,
    legalName: site.legalName,
    url: siteUrl(),
    logo: absoluteUrl("/assets/brand/merova-logo-512.png"),
    slogan: site.tagline,
    description: site.description,
    ...(site.email ? { email: site.email } : {}),
    ...(site.phone ? { telephone: site.phone } : {}),
    ...(site.officeAddress ? { address: site.officeAddress } : {}),
    sameAs: site.social.map((s) => s.url),
  };
}

export function breadcrumbLd(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", href: "/" }, ...items].map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: absoluteUrl(c.href) })),
  };
}

export function faqLd(faqs: { q: string; a: string }[]) {
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
}
