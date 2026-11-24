/**
 * Renders every printable document to a real PDF in public/assets/downloads.
 *
 * Usage:
 *   npm run build && npx next start -p 3100 &
 *   PDF_BASE=http://localhost:3100 node scripts/generate-pdfs.mjs
 *
 * Re-run whenever product data changes, then commit the PDFs. QR codes and
 * links inside the PDFs point to NEXT_PUBLIC_SITE_URL (set it before building).
 */
import { chromium } from "@playwright/test";
import { mkdirSync, statSync } from "node:fs";
import path from "node:path";

const BASE = process.env.PDF_BASE ?? "http://localhost:3100";
const OUT = path.resolve("public/assets/downloads");

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`${BASE}/print`, { waitUntil: "networkidle" });
const docs = await page.$$eval("a[data-pdf]", (as) => as.map((a) => ({ href: a.getAttribute("href"), file: a.dataset.pdf })));
if (!docs.length) throw new Error("No printable documents found at /print");

let failures = 0;
for (const { href, file } of docs) {
  const target = path.join(OUT, file);
  mkdirSync(path.dirname(target), { recursive: true });
  const res = await page.goto(`${BASE}${href}`, { waitUntil: "networkidle" });
  if (!res || !res.ok()) {
    console.error(`FAIL ${href}: HTTP ${res?.status()}`);
    failures++;
    continue;
  }
  await page.evaluate(() => document.fonts.ready);
  // wait for all images to decode so nothing is missing from the PDF
  await page.evaluate(async () => {
    await Promise.all(Array.from(document.images).map((img) => (img.complete ? Promise.resolve() : new Promise((r) => { img.onload = img.onerror = r; }))));
  });
  const broken = await page.$$eval("img", (imgs) => imgs.filter((i) => !i.naturalWidth).map((i) => i.src));
  if (broken.length) {
    console.error(`FAIL ${href}: broken images ${broken.join(", ")}`);
    failures++;
    continue;
  }
  // Layout QA: nothing may overflow its A4 page, and the body must not clip content.
  const layout = await page.evaluate(() => {
    const issues = [];
    document.querySelectorAll("section.pp").forEach((pp, n) => {
      const box = pp.getBoundingClientRect();
      for (const el of pp.querySelectorAll("*")) {
        if (el.closest(".pp-watermark") || el.classList.contains("pp-watermark")) continue;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        if (r.bottom > box.bottom + 1 || r.right > box.right + 1 || r.left < box.left - 1) {
          issues.push(`page ${n + 1}: <${el.tagName.toLowerCase()} class="${el.className}"> overflows the page`);
          break;
        }
      }
      pp.querySelectorAll(".pp-body").forEach((b) => {
        if (b.scrollHeight > b.clientHeight + 2) issues.push(`page ${n + 1}: body content clipped by ${b.scrollHeight - b.clientHeight}px`);
      });
    });
    return { issues, pages: document.querySelectorAll("section.pp").length };
  });
  if (layout.issues.length) {
    console.error(`FAIL ${href}:\n  ${layout.issues.join("\n  ")}`);
    failures++;
    continue;
  }
  await page.emulateMedia({ media: "print" });
  await page.pdf({ path: target, format: "A4", printBackground: true, preferCSSPageSize: true });
  await page.emulateMedia({ media: "screen" });
  console.log(`ok   ${file} (${layout.pages} pages, ${Math.round(statSync(target).size / 1024)} KB)`);
}
await browser.close();
if (failures) {
  console.error(`${failures} document(s) failed`);
  process.exit(1);
}
console.log(`${docs.length} PDFs written to ${OUT}`);
