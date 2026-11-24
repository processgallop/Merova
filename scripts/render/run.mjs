// Renders shots defined in shots.mjs (or a subset) to PNG via headless Chromium + WebGL (SwiftShader).
// Relaunches the browser if a shot crashes it, and retries that shot once.
import { chromium } from "playwright";
import fs from "node:fs"; import path from "node:path";
import { serve } from "./server.mjs";
import { SHOTS } from "./shots.mjs";
const outDir = process.env.OUT ?? "scripts/render/_png";
const only = process.argv.slice(2);
const list = Object.entries(SHOTS).filter(([k]) => !only.length || only.includes(k));
const server = await serve(4599);
let browser, page;
async function open() {
  try { await browser?.close(); } catch {}
  browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
  page.on("pageerror", (e) => console.log("pageerror:", e.message));
  await page.goto("http://localhost:4599/scripts/render/stage.html");
  await page.waitForFunction(() => window.ready === true, null, { timeout: 60000 });
}
await open();
for (const [name, spec] of list) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const t = Date.now();
    try {
      await page.evaluate((s) => window.shot(s), spec);
      const data = await page.evaluate(() => document.querySelector("canvas").toDataURL("image/png"));
      const file = path.join(outDir, `${name}.png`); fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, Buffer.from(data.split(",")[1], "base64"));
      console.log(`${name} ${Date.now() - t}ms`); break;
    } catch (e) { console.log(`FAIL ${name} (attempt ${attempt + 1}): ${e.message.split("\n")[0]}`); await open(); }
  }
}
await browser.close(); server.close();
