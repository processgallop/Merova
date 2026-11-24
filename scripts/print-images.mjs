/**
 * Creates print-optimised JPEG derivatives of raster images for the PDFs.
 * Chromium passes JPEG data straight into PDFs, whereas WebP is re-encoded
 * losslessly (and makes files several times larger).
 * Run: node scripts/print-images.mjs
 */
import sharp from "sharp";
import { mkdirSync, readdirSync } from "node:fs";
import path from "node:path";

const OUT = "public/assets/print";
mkdirSync(OUT, { recursive: true });
for (const dir of ["public/assets/products", "public/assets/manufacturing"]) {
  for (const f of readdirSync(dir).filter((x) => x.endsWith(".webp"))) {
    const target = path.join(OUT, f.replace(/\.webp$/, ".jpg"));
    await sharp(path.join(dir, f)).resize({ width: 1400, withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toFile(target);
    console.log("wrote", target);
  }
}
