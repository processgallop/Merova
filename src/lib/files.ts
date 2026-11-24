import "server-only";
import { readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";

/** Human-readable sizes for the PDFs in public/assets/downloads (computed at build time). */
export function pdfSizes(): Record<string, string> {
  const out: Record<string, string> = {};
  const base = path.join(process.cwd(), "public", "assets", "downloads");
  if (!existsSync(base)) return out;
  for (const f of readdirSync(base)) {
    if (!f.endsWith(".pdf")) continue;
    const kb = statSync(path.join(base, f)).size / 1024;
    out[`/assets/downloads/${f}`] = kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
  }
  return out;
}
