import type { Metadata } from "next";
import { absoluteUrl, site } from "./site";

export const DEFAULT_OG = "/assets/brand/og-default.png";

export function pageMetadata({
  title,
  description,
  path,
  image,
  noindex,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
  type?: "website" | "article";
}): Metadata {
  const url = absoluteUrl(path);
  const img = image ?? DEFAULT_OG;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: site.name,
      locale: site.locale,
      images: [{ url: img, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [img] },
  };
}

export function organizationJsonLd() {
  const c = site.contact;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    legalName: c.legalName,
    url: site.url,
    logo: absoluteUrl("/assets/brand/merova-logo-512.png"),
    slogan: site.tagline,
    description: site.description,
    ...(c.email ? { email: c.email } : {}),
    ...(c.phone ? { telephone: c.phone } : {}),
    ...(c.officeAddress ? { address: { "@type": "PostalAddress", streetAddress: c.officeAddress } } : {}),
    sameAs: [site.social.linkedin, site.social.instagram].filter(Boolean),
  };
}

export function breadcrumbJsonLd(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.href) })),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}
