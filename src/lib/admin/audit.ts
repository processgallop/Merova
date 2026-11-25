import "server-only";
import { revalidatePath } from "next/cache";
import { getDb, schema as t } from "@/db";
import { clientIp, type SessionUser } from "@/lib/auth/session";

export async function audit(user: Pick<SessionUser, "id" | "email">, action: string, entityType: string, entityId: string | number | null, summary?: string) {
  const db = await getDb();
  await db.insert(t.auditLogs).values({ userId: user.id, userEmail: user.email, action, entityType, entityId: entityId == null ? null : String(entityId), summary: summary?.slice(0, 500) ?? null, ip: await clientIp() });
}

export async function snapshot(user: Pick<SessionUser, "id" | "email">, entityType: string, entityId: string | number, data: unknown, note?: string) {
  const db = await getDb();
  await db.insert(t.revisions).values({ entityType, entityId: String(entityId), data: data as object, userId: user.id, userEmail: user.email, note: note ?? null });
}

/** Published content changed: refresh every public page (ISR) so the change appears immediately. */
export function refreshSite() {
  revalidatePath("/", "layout");
}

export type ActionResult<T = unknown> = { ok: true; data?: T; message?: string } | { ok: false; error: string; fields?: Record<string, string> };
