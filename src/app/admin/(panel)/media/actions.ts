"use server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema as t } from "@/db";
import { authorize, AuthError } from "@/lib/auth/session";
import { audit, refreshSite, type ActionResult } from "@/lib/admin/audit";
import { mediaUrl, replaceReferences, usagesOf } from "@/lib/admin/media";

const meta = z.object({ title: z.string().max(200), alt: z.string().max(300), description: z.string().max(1000), credit: z.string().max(200), sourceUrl: z.string().max(500), license: z.string().max(200), folder: z.string().max(40), isStock: z.boolean() });

export async function updateMediaAction(id: string, data: unknown): Promise<ActionResult> {
  try {
    const user = await authorize("media.edit");
    const d = meta.parse(data);
    const db = await getDb();
    await db.update(t.media).set({ ...d, folder: d.folder.replace(/[^\w-]/g, "") || "general", updatedAt: new Date() }).where(eq(t.media.id, id));
    await audit(user, "update", "media", id, d.title);
    return { ok: true, message: "Details saved." };
  } catch (e) {
    return { ok: false, error: e instanceof AuthError ? e.message : "Could not save details." };
  }
}

export async function mediaUsageAction(id: string): Promise<ActionResult<string[]>> {
  try {
    await authorize("media.edit");
    const db = await getDb();
    const [m] = await db.select().from(t.media).where(eq(t.media.id, id));
    if (!m) return { ok: false, error: "Not found." };
    return { ok: true, data: await usagesOf(mediaUrl(m)) };
  } catch (e) {
    return { ok: false, error: e instanceof AuthError ? e.message : "Could not check usage." };
  }
}

export async function deleteMediaAction(id: string): Promise<ActionResult> {
  try {
    const user = await authorize("media.edit");
    const db = await getDb();
    const [m] = await db.select().from(t.media).where(eq(t.media.id, id));
    if (!m) return { ok: false, error: "Not found." };
    const used = await usagesOf(mediaUrl(m));
    if (used.length) return { ok: false, error: `This file is in use (${used.slice(0, 3).join("; ")}${used.length > 3 ? "…" : ""}). Replace it instead, or remove it from those places first.` };
    await db.delete(t.media).where(eq(t.media.id, id));
    await audit(user, "delete", "media", id, m.filename);
    return { ok: true, message: "Deleted." };
  } catch (e) {
    return { ok: false, error: e instanceof AuthError ? e.message : "Delete failed." };
  }
}

/** Points every reference of one asset at another (replacing bundled/stock images with authentic photography). */
export async function swapMediaAction(fromId: string, toId: string): Promise<ActionResult> {
  try {
    const user = await authorize("media.edit");
    const db = await getDb();
    const [a] = await db.select().from(t.media).where(eq(t.media.id, fromId));
    const [b] = await db.select().from(t.media).where(eq(t.media.id, toId));
    if (!a || !b) return { ok: false, error: "Media not found." };
    await replaceReferences(mediaUrl(a), mediaUrl(b));
    await audit(user, "replace_references", "media", fromId, `${a.filename} → ${b.filename}`);
    refreshSite();
    return { ok: true, message: "Every use of the old image now shows the new one." };
  } catch (e) {
    return { ok: false, error: e instanceof AuthError ? e.message : "Replace failed." };
  }
}
