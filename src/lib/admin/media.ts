import "server-only";
import { sql } from "drizzle-orm";
import { getDb, schema as t } from "@/db";

export const MAX_UPLOAD = 4 * 1024 * 1024;
const ALLOWED = /^(image\/(png|jpeg|webp|avif|gif|svg\+xml)|application\/pdf|video\/mp4)$/;

export function mediaUrl(m: { id: string; filename: string; path: string | null }) {
  return m.path ?? `/media/${m.id}/${encodeURIComponent(m.filename)}`;
}

export function toItem(m: typeof t.media.$inferSelect) {
  return { id: m.id, url: mediaUrl(m), filename: m.filename, mime: m.mime, alt: m.alt ?? "", title: m.title ?? "", folder: m.folder, isStock: m.isStock, credit: m.credit, size: m.size, width: m.width, height: m.height, description: m.description ?? "", sourceUrl: m.sourceUrl ?? "", license: m.license ?? "", createdAt: m.createdAt.toISOString() };
}

/** Validates and optimises an upload. Raster images become WebP (max 2400px); SVG is rejected for safety unless sanitised elsewhere. */
export async function processUpload(file: File) {
  if (file.size > MAX_UPLOAD) throw new Error("Files must be 4 MB or smaller.");
  let mime = file.type || "application/octet-stream";
  if (!ALLOWED.test(mime)) throw new Error("Unsupported file type. Upload JPG, PNG, WebP, AVIF, GIF, PDF or MP4.");
  if (mime === "image/svg+xml") throw new Error("SVG uploads are disabled for security. Upload a PNG or WebP instead.");
  let data: Buffer = Buffer.from(await file.arrayBuffer());
  let filename = file.name.replace(/[^\w.\- ]/g, "_").slice(0, 120) || "upload";
  let width: number | null = null;
  let height: number | null = null;
  if (mime === "application/pdf" && data.subarray(0, 5).toString() !== "%PDF-") throw new Error("That file is not a valid PDF.");
  if (mime.startsWith("image/") && mime !== "image/gif") {
    const sharp = (await import("sharp")).default;
    const img = sharp(data, { failOn: "error" }).rotate();
    const out = await img.resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toBuffer({ resolveWithObject: true });
    data = out.data;
    width = out.info.width;
    height = out.info.height;
    mime = "image/webp";
    filename = filename.replace(/\.[^.]+$/, "") + ".webp";
  }
  return { data, mime, filename, width, height, size: data.length };
}

/** Where a media URL is referenced (for "where used" and safe deletion). */
export async function usagesOf(url: string) {
  const db = await getDb();
  const like = `%${url.replace(/[%_]/g, "\\$&")}%`;
  const q = async (label: string, table: string, nameCol: string, cols: string[]) => {
    const where = cols.map((c) => `${c}::text LIKE $1`).join(" OR ");
    const res = (await db.execute(sql.raw(`SELECT ${nameCol} AS name FROM ${table} WHERE ${where.replace(/\$1/g, `'${like.replace(/'/g, "''")}'`)} LIMIT 50`))) as unknown;
    const rows = (Array.isArray(res) ? res : (res as { rows: unknown[] }).rows) as { name: string }[];
    return rows.map((r) => `${label}: ${r.name}`);
  };
  return [
    ...(await q("Product", "products", "name", ["images", "flyer"])),
    ...(await q("Segment", "segments", "name", ["image", "banner"])),
    ...(await q("Industry", "industries", "name", ["image", "banner"])),
    ...(await q("Page", "pages", "title", ["sections", "seo"])),
    ...(await q("Article", "posts", "title", ["cover", "body"])),
    ...(await q("Resource", "resources", "title", ["file_url"])),
    ...(await q("Settings", "settings", "key", ["value"])),
  ];
}

/** Rewrites every reference from one URL to another (used when replacing a bundled asset). */
export async function replaceReferences(oldUrl: string, newUrl: string) {
  const db = await getDb();
  const o = oldUrl.replace(/'/g, "''");
  const n = newUrl.replace(/'/g, "''");
  const j = (table: string, col: string) => db.execute(sql.raw(`UPDATE ${table} SET ${col} = replace(${col}::text, '${o}', '${n}')::jsonb WHERE ${col}::text LIKE '%${o}%'`));
  await j("products", "images");
  await j("products", "flyer");
  await j("segments", "image");
  await j("segments", "banner");
  await j("industries", "image");
  await j("industries", "banner");
  await j("pages", "sections");
  await j("posts", "cover");
  await j("posts", "body");
  await j("settings", "value");
  await db.execute(sql.raw(`UPDATE resources SET file_url = '${n}' WHERE file_url = '${o}'`));
}
