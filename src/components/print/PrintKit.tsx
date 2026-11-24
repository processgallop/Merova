/* eslint-disable @next/next/no-img-element */
import QRCode from "qrcode";
import { site, absoluteUrl } from "@/lib/site";
import type { ProductImage, SpecRow } from "@/data/types";

const LOGO = {
  primary: { src: "/assets/brand/merova-logo-primary.svg", ratio: 843.66 / 375.16 },
  reverse: { src: "/assets/brand/merova-logo-reverse.svg", ratio: 703.69 / 344.39 },
  "mark-red": { src: "/assets/brand/merova-mark-red.svg", ratio: 703.69 / 344.39 },
  "mark-cream": { src: "/assets/brand/merova-mark-cream.svg", ratio: 703.69 / 344.39 },
};

/** Official Merova artwork (unaltered), sized by height in mm. */
export function PLogo({ variant = "primary", h = 14 }: { variant?: keyof typeof LOGO; h?: number }) {
  const l = LOGO[variant];
  return <img src={l.src} alt="Merova" style={{ height: `${h}mm`, width: `${h * l.ratio}mm`, display: "block" }} />;
}

/** Print-optimised JPEG for raster images (scripts/print-images.mjs, scripts/process-renders.mjs). */
export const printSrc = (src: string) => {
  if (src.includes("/products/renders/")) return src.replace("/products/renders/", "/print/renders/").replace(/\.webp$/, ".jpg");
  if (src.endsWith(".webp")) return `/assets/print/${src.split("/").pop()!.replace(/\.webp$/, ".jpg")}`;
  return src;
};

export function PImg({ image, style, caption = true }: { image: ProductImage | { src: string; alt: string; kind: ProductImage["kind"] }; style?: React.CSSProperties; caption?: boolean }) {
  return (
    <div className="pp-img" style={style}>
      <img src={printSrc(image.src)} alt={image.alt} />
      {caption && <span className="pp-cap">{image.kind === "render" ? "Product visualisation" : image.kind === "illustration" ? "Illustration" : "Representative image"}</span>}
    </div>
  );
}

export function PFooter({ label, page, total, red = false }: { label: string; page?: number; total?: number; red?: boolean }) {
  return (
    <div className={`pp-foot ${red ? "pp-foot-red" : ""}`}>
      <span><b>Merova Printpack</b> · Packaging, Perfected.</span>
      <span>{label}</span>
      <span style={{ display: "flex", alignItems: "center", gap: "4mm" }}>
        <a href={site.url}>{site.url.replace(/^https?:\/\//, "")}</a>
        {page !== undefined && <span className="pp-num">{String(page).padStart(2, "0")}{total ? ` / ${String(total).padStart(2, "0")}` : ""}</span>}
      </span>
    </div>
  );
}

export async function QR({ url, size = 24, dark = "#282525" }: { url: string; size?: number; dark?: string }) {
  const svg = await QRCode.toString(url, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark, light: "#ffffff" } });
  return <span style={{ display: "block", width: `${size}mm`, height: `${size}mm` }} dangerouslySetInnerHTML={{ __html: svg.replace("<svg", `<svg width="100%" height="100%"`) }} />;
}

const TAG: Record<string, [string, string]> = { option: ["Option", "pp-tag"], reference: ["Industry reference", "pp-tag"], confirm: ["Confirmed at quotation", "pp-tag pp-tag-c"] };

export function PSpecTable({ rows }: { rows: SpecRow[] }) {
  return (
    <table>
      <thead><tr><th>Parameter</th><th>Specification</th><th style={{ width: "26%" }}>Status</th></tr></thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label}>
            <th>{r.label}</th>
            <td>{r.value}</td>
            <td>{r.status && <span className={TAG[r.status][1]}>{TAG[r.status][0]}</span>}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Contact lines: only verified details from configuration, plus working web links. */
export function ContactLines({ light = false }: { light?: boolean }) {
  const c = site.contact;
  const color = light ? "var(--cloud)" : "var(--ink2)";
  const lines: [string, string | undefined, string][] = [
    ["Phone", c.phone, c.phone ? `tel:${c.phone.replace(/[^\d+]/g, "")}` : ""],
    ["WhatsApp", c.whatsapp ? `+${c.whatsapp}` : undefined, c.whatsapp ? `https://wa.me/${c.whatsapp}` : ""],
    ["Email", c.email, c.email ? `mailto:${c.email}` : ""],
  ];
  const site_ = site.url.replace(/^https?:\/\//, "");
  return (
    <div style={{ color, fontSize: "8pt", lineHeight: 1.65 }}>
      {lines.filter(([, v]) => v).map(([k, v, href]) => (
        <div key={k}><b>{k}</b>&nbsp; <a href={href}>{v}</a></div>
      ))}
      {c.officeAddress && <div>{c.officeAddress}</div>}
      <div><b>Quotations</b>&nbsp; <a href={absoluteUrl("/request-a-quote")}>{site_}/request-a-quote</a></div>
      <div><b>Enquiries</b>&nbsp; <a href={absoluteUrl("/contact")}>{site_}/contact</a></div>
    </div>
  );
}

export const IMG_NOTE = "Product visuals are studio visualisations or representative imagery. Specifications marked “Confirmed at quotation” are confirmed in writing for each order.";
