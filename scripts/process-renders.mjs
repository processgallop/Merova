/**
 * Converts Blender renders (PNG) into web and print assets:
 *   public/assets/products/renders/<name>.webp  (full width, q84 — Next.js serves AVIF/WebP sizes from it)
 *   public/assets/print/renders/<name>.jpg      (1400px, q82 — passed through to PDFs without re-encoding)
 * Usage: node scripts/process-renders.mjs <render-dir>
 */
import sharp from "sharp";
import { mkdirSync, readdirSync } from "node:fs";
import path from "node:path";

const src = process.argv[2];
const WEB = "public/assets/products/renders";
const PRINT = "public/assets/print/renders";
mkdirSync(WEB, { recursive: true });
mkdirSync(PRINT, { recursive: true });
for (const f of readdirSync(src).filter((x) => x.endsWith(".png"))) {
  const name = f.replace(/\.png$/, "");
  const img = sharp(path.join(src, f));
  await img.clone().webp({ quality: 84, effort: 5 }).toFile(path.join(WEB, `${name}.webp`));
  await img.clone().resize({ width: 1400 }).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(PRINT, `${name}.jpg`));
  console.log("processed", name);
}
