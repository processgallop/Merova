// Dev utility: full-page screenshots of given paths at a given width.
// node scripts/screens.mjs <outDir> <width> <path...>
import { chromium } from "@playwright/test";
const [out, width, ...paths] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: Number(width), height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
for (const path of paths) {
  await p.goto(`http://localhost:3100${path}`, { waitUntil: "networkidle" });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(300);
  const name = (path === "/" ? "home" : path.replace(/[/?=&]/g, "_").replace(/^_/, "")) + `-${width}.png`;
  await p.screenshot({ path: `${out}/${name}`, fullPage: true });
  console.log(name);
}
await b.close();
