import { NextResponse } from "next/server";
import { and, desc, ilike, like, or, eq } from "drizzle-orm";
import { getDb, schema as t } from "@/db";
import { currentUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";
import { processUpload, toItem } from "@/lib/admin/media";
import { audit } from "@/lib/admin/audit";

const canUpload = (role: Parameters<typeof can>[0]) => can(role, "media.edit") || can(role, "catalog.edit") || can(role, "content.edit") || can(role, "theme.edit");

export async function GET(req: Request) {
  const user = await currentUser();
  if (!user || !(canUpload(user.role) || can(user.role, "content.view"))) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").slice(0, 100);
  const type = url.searchParams.get("type") ?? "any";
  const db = await getDb();
  const conds = [eq(t.media.isPrivate, false)];
  if (q) conds.push(or(ilike(t.media.filename, `%${q}%`), ilike(t.media.title, `%${q}%`), ilike(t.media.alt, `%${q}%`))!);
  if (type === "image") conds.push(like(t.media.mime, "image/%"));
  if (type === "pdf") conds.push(eq(t.media.mime, "application/pdf"));
  const rows = await db.select().from(t.media).where(and(...conds)).orderBy(desc(t.media.createdAt)).limit(200);
  return NextResponse.json({ items: rows.map(toItem) });
}

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user || !canUpload(user.role)) return NextResponse.json({ error: "You do not have permission to upload." }, { status: 403 });
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.headers.get("host")) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Upload could not be read (files must be under 4 MB)." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File) || !file.size) return NextResponse.json({ error: "No file received." }, { status: 400 });
  try {
    const p = await processUpload(file);
    const folder = String(form.get("folder") ?? "general").replace(/[^\w-]/g, "").slice(0, 40) || "general";
    const alt = String(form.get("alt") ?? "").slice(0, 300);
    const db = await getDb();
    const replaceId = String(form.get("replaceId") ?? "");
    if (replaceId && /^[0-9a-f-]{36}$/.test(replaceId)) {
      const [m] = await db.update(t.media).set({ data: p.data, mime: p.mime, size: p.size, width: p.width, height: p.height, updatedAt: new Date() }).where(eq(t.media.id, replaceId)).returning();
      if (!m) return NextResponse.json({ error: "Original file not found." }, { status: 404 });
      await audit(user, "replace", "media", m.id, m.filename);
      return NextResponse.json({ item: toItem(m) });
    }
    const [m] = await db.insert(t.media).values({ filename: p.filename, mime: p.mime, size: p.size, width: p.width, height: p.height, data: p.data, folder, alt, title: alt || p.filename, uploadedBy: user.id }).returning();
    await audit(user, "upload", "media", m.id, m.filename);
    return NextResponse.json({ item: toItem(m) });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Upload failed." }, { status: 422 });
  }
}
