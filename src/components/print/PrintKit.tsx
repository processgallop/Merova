import QRCode from "qrcode";
import { GLYPH_PATH, GLYPH_VIEWBOX } from "@/components/brand/glyph";
import { site } from "@/lib/site";
import type { SpecRow } from "@/data/types";

export function PLogo({ light = false, size = 1 }: { light?: boolean; size?: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 * size }}>
      <svg viewBox={GLYPH_VIEWBOX} style={{ width: 44 * size, height: "auto" }} aria-hidden="true"><path d={GLYPH_PATH} fill={light ? "#FFFAF3" : "#D52B1E"} /></svg>
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span style={{ fontFamily: "var(--font-sora)", fontWeight: 600, fontSize: 17 * size, letterSpacing: "-0.03em", color: light ? "#fff" : "#08162a" }}>Merova</span>
        <span style={{ fontFamily: "var(--font-plex-mono)", fontSize: 6.5 * size, letterSpacing: "0.32em", marginTop: 3 * size, color: light ? "rgba(255,255,255,.7)" : "#5b6270" }}>PRINTPACK</span>
      </span>
    </span>
  );
}

export function PFooter({ label, page }: { label: string; page?: string }) {
  return (
    <div className="pp-foot">
      <span>{site.name} · {site.tagline}</span>
      <span>{label}</span>
      <span>{site.url.replace(/^https?:\/\//, "")}{page ? ` · ${page}` : ""}</span>
    </div>
  );
}

export async function QR({ url, size = 92 }: { url: string; size?: number }) {
  const svg = await QRCode.toString(url, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#0d1f38", light: "#ffffff" } });
  return <span style={{ display: "block", width: size, height: size }} dangerouslySetInnerHTML={{ __html: svg.replace("<svg", `<svg width="${size}" height="${size}"`) }} />;
}

const TAG: Record<string, [string, string]> = { option: ["Option", "pp-tag"], reference: ["Industry reference", "pp-tag"], confirm: ["Confirmed at quotation", "pp-tag pp-tag-c"] };

export function PSpecTable({ rows }: { rows: SpecRow[] }) {
  return (
    <table>
      <thead><tr><th>Parameter</th><th>Specification</th><th style={{ width: "24%" }}>Status</th></tr></thead>
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

export function ContactBlock({ dark = false }: { dark?: boolean }) {
  const c = site.contact;
  const color = dark ? "rgba(255,255,255,.8)" : "#3a404c";
  const items = [c.phone && `Tel: ${c.phone}`, c.whatsapp && `WhatsApp: +${c.whatsapp}`, c.email && `Email: ${c.email}`, c.officeAddress].filter(Boolean) as string[];
  return (
    <div style={{ color, fontSize: "8.4pt", lineHeight: 1.6 }}>
      {items.length ? items.map((i) => <div key={i}>{i}</div>) : <div>Enquiries: {site.url.replace(/^https?:\/\//, "")}/contact</div>}
      <div>Quotations: {site.url.replace(/^https?:\/\//, "")}/request-a-quote</div>
    </div>
  );
}

export const IMG_NOTE = "Visuals are format illustrations or representative imagery. Specifications marked “Confirmed at quotation” are confirmed in writing for each order.";

/** Print-optimised JPEG for raster images (see scripts/print-images.mjs); SVG illustrations stay vector. */
export const printSrc = (src: string) =>
  src.endsWith(".webp") ? `/assets/print/${src.split("/").pop()!.replace(/\.webp$/, ".jpg")}` : src;
