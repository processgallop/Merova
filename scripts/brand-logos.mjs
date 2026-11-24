/**
 * Builds the Merova logo set from the master artwork (Merova_Logo.pdf, Adobe
 * Illustrator export with the Obviously glyphs embedded).
 *
 * The PDF pages were converted to SVG with `pdftocairo -svg`, which turns the
 * embedded font glyphs into exact vector outlines. This script then:
 *  1. removes ONLY the page background rectangle (artwork, colours and
 *     proportions are untouched),
 *  2. trims the viewBox to the artwork bounds plus clear space,
 *  3. exports SVG, transparent PNG (1x/2x/4x) and WebP for web and print.
 *
 * Run: node scripts/brand-logos.mjs
 */
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const SRC = "public/assets/brand/source/";
const OUT = "public/assets/brand/";
mkdirSync(OUT, { recursive: true });

const VARIANTS = [
  // name, source page, keep background?, clear-space ratio (of artwork height)
  { name: "merova-logo-primary", src: "pdf-p2-primary-lockup-on-cloud.svg", bg: false, pad: 0.12, use: "Light backgrounds (Cloud Dancer / white)" },
  { name: "merova-logo-reverse", src: "pdf-p1-reverse-lockup-on-red.svg", bg: false, pad: 0.12, use: "Merova Red or dark backgrounds" },
  { name: "merova-mark-red", src: "pdf-p4-mark-on-cloud.svg", bg: false, pad: 0.12, use: "Mark on light backgrounds" },
  { name: "merova-mark-cream", src: "pdf-p3-mark-on-red.svg", bg: false, pad: 0.12, use: "Mark on red / dark backgrounds" },
  { name: "merova-logo-primary-on-cloud", src: "pdf-p2-primary-lockup-on-cloud.svg", bg: true, use: "Original artboard" },
  { name: "merova-logo-reverse-on-red", src: "pdf-p1-reverse-lockup-on-red.svg", bg: true, use: "Original artboard" },
  { name: "merova-mark-square-red", src: "pdf-p3-mark-on-red.svg", bg: true, use: "App icon / favicon / avatar" },
];

const browser = await chromium.launch();
const page = await browser.newPage();

for (const v of VARIANTS) {
  let svg = readFileSync(SRC + v.src, "utf8");
  if (!v.bg) svg = svg.replace(/<rect x="-108"[^>]*\/>\s*/, "");
  await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
  const box = await page.evaluate(() => {
    const s = document.querySelector("svg");
    const b = s.getBBox();
    const vb = s.viewBox.baseVal;
    return { x: b.x, y: b.y, w: b.width, h: b.height, vb: { x: vb.x, y: vb.y, w: vb.width, h: vb.height } };
  });
  let vb;
  if (v.bg) {
    // Square/artboard variants keep their original artboard.
    vb = [box.vb.x, box.vb.y, box.vb.w, box.vb.h];
  } else {
    const p = box.h * v.pad;
    vb = [box.x - p, box.y - p, box.w + 2 * p, box.h + 2 * p].map((n) => Math.round(n * 100) / 100);
  }
  svg = svg
    .replace(/width="[\d.]+" height="[\d.]+" viewBox="[^"]+"/, `viewBox="${vb.join(" ")}" width="${vb[2]}" height="${vb[3]}"`)
    .replace("<svg ", `<svg role="img" aria-label="Merova" `);
  writeFileSync(`${OUT}${v.name}.svg`, svg);
  for (const [suffix, width] of [["", 600], ["@2x", 1200], ["@4x", 2400]]) {
    const w = v.bg && v.name.includes("square") ? width / 1.5 : width;
    const png = await sharp(Buffer.from(svg), { density: 600 }).resize({ width: Math.round(w) }).png().toBuffer();
    writeFileSync(`${OUT}${v.name}${suffix}.png`, png);
    if (suffix === "@2x") writeFileSync(`${OUT}${v.name}.webp`, await sharp(png).webp({ quality: 92 }).toBuffer());
  }
  console.log(`${v.name}: viewBox ${vb.join(" ")} — ${v.use}`);
}
await browser.close();
