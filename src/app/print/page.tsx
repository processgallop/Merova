import Link from "next/link";
import { products } from "@/data/catalog";

/** Index of every printable document; scripts/generate-pdfs.mjs reads these links. */
export default function PrintIndex() {
  const docs = [
    ["/print/catalogue", "merova-product-catalogue.pdf"],
    ["/print/profile", "merova-company-profile.pdf"],
    ["/print/capabilities", "merova-manufacturing-capabilities.pdf"],
    ["/print/sustainability", "merova-sustainability-approach.pdf"],
    ...products.map((p) => [`/print/flyer/${p.slug}`, `flyers/merova-${p.slug}-flyer.pdf`]),
  ];
  return (
    <ul style={{ background: "#fff", padding: 24, fontFamily: "sans-serif" }}>
      {docs.map(([href, file]) => <li key={href}><Link href={href} data-pdf={file}>{file}</Link></li>)}
    </ul>
  );
}
