// Dev utility: reports horizontal overflow (and the widest offending element) per path and width.
import { chromium } from "@playwright/test";
const widths = [360, 375, 390, 414, 430, 768, 1024, 1280, 1440, 1920, 2560];
const paths = process.argv.slice(2);
const b = await chromium.launch();
let bad = 0;
for (const w of widths) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  for (const path of paths) {
    await p.goto(`http://localhost:3100${path}`, { waitUntil: "networkidle" });
    const r = await p.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const sw = document.documentElement.scrollWidth;
      let worst = null;
      if (sw > vw) for (const el of document.querySelectorAll("body *")) { const rc = el.getBoundingClientRect(); if (rc.right > vw + 1 && (!worst || rc.right > worst.r)) worst = { r: Math.round(rc.right), tag: el.tagName, cls: String(el.className).slice(0, 80) }; }
      return { vw, sw, worst };
    });
    if (r.sw > r.vw) { bad++; console.log(`OVERFLOW ${w}px ${path}: scrollWidth ${r.sw} > ${r.vw}`, r.worst); }
  }
  await p.close();
}
await b.close();
console.log(bad ? `${bad} overflow(s)` : "no horizontal overflow");
