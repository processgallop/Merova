import Link from "next/link";
import { categories, products } from "@/data/catalog";

/** Index of printable documents; scripts/generate-pdfs.mjs renders every link with data-pdf. */
export default function PrintIndex() {
  const docs = [
    { href: "/print/catalogue/", file: "merova-product-catalogue.pdf", name: "Master catalogue" },
    { href: "/print/profile/", file: "merova-company-profile.pdf", name: "Company profile" },
    ...categories.map((c) => ({ href: `/print/brochure/${c.slug}/`, file: `merova-${c.slug}-brochure.pdf`, name: `${c.name} brochure` })),
    ...products.map((p) => ({ href: `/print/flyer/${p.slug}/`, file: `flyers/merova-${p.slug}.pdf`, name: `${p.name} flyer` })),
  ];
  return (
    <div style={{ background: "#fff", padding: 32, width: 720, borderRadius: 16 }}>
      <h1 style={{ fontFamily: "var(--font-sora)" }}>Printable documents ({docs.length})</h1>
      <ul>{docs.map((d) => <li key={d.file}><Link href={d.href} data-pdf={d.file}>{d.name}</Link></li>)}</ul>
    </div>
  );
}
