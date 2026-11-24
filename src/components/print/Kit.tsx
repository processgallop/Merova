/* eslint-disable @next/next/no-img-element */
import QRCode from "qrcode";
import { absoluteUrl, site } from "@/lib/site";

export const LOCKUP_REV = "/assets/brand/master/merova-lockup-reverse-transparent.svg";
export const LOCKUP = "/assets/brand/master/merova-lockup-primary-transparent.svg";
export const MARK_REV = "/assets/brand/master/merova-mark-reverse-transparent.svg";
export const printImg = (webp: string) => webp.replace("/assets/renders/", "/assets/renders/print/").replace(/\.webp$/, ".jpg");

export async function Qr({ path, size = 64, dark = "#1e1b1b", light = "#ffffff" }: { path: string; size?: number; dark?: string; light?: string }) {
  const svg = await QRCode.toString(absoluteUrl(path), { type: "svg", margin: 1, color: { dark, light }, errorCorrectionLevel: "M" });
  return <span style={{ display: "block", width: size, height: size }} dangerouslySetInnerHTML={{ __html: svg.replace("<svg", `<svg width="${size}" height="${size}"`) }} />;
}

export function ContactStrip({ dark = true }: { dark?: boolean }) {
  const c = site.contact;
  return (
    <div style={{ display: "flex", gap: "14pt", fontSize: "7.5pt", color: dark ? "#cfc7c0" : "#454040", flexWrap: "wrap" }}>
      <span><b style={{ color: dark ? "#fff" : "#1e1b1b" }}>T</b> {c.phone}</span>
      <span><b style={{ color: dark ? "#fff" : "#1e1b1b" }}>E</b> {c.salesEmail}</span>
      <span><b style={{ color: dark ? "#fff" : "#1e1b1b" }}>W</b> {site.url.replace(/^https?:\/\//, "")}</span>
    </div>
  );
}

export function SampleNote({ dark = false }: { dark?: boolean }) {
  return site.sample ? <p style={{ fontSize: "6.5pt", color: dark ? "#cfc7c0" : "#8a7a4a", margin: 0 }}>Preview edition: contact details and specification values are sample data; product images are 3D renders with fictitious sample brands.</p> : null;
}

export function RunningHead({ label, folio }: { label: string; folio: number | string }) {
  return (
    <>
      <div style={{ position: "absolute", top: "10mm", left: "14mm", right: "14mm", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <img src={LOCKUP} alt="Merova" style={{ height: "9mm" }} />
        <span className="p-eyebrow" style={{ color: "#d52b1e" }}>{label}</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "3mm", background: "#d52b1e" }} />
      <span className="p-folio" style={{ right: "14mm" }}>{folio}</span>
      <span className="p-folio" style={{ left: "14mm" }}>Merova Printpack · Packaging, Perfected.</span>
    </>
  );
}
