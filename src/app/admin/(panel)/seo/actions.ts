"use server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema as t } from "@/db";
import { authorize, AuthError } from "@/lib/auth/session";
import { audit, refreshSite, type ActionResult } from "@/lib/admin/audit";

const path = z.string().trim().max(500).regex(/^\/[^\s]*$/, "Paths must start with / and contain no spaces.");

export async function addRedirectAction(fromPath: string, toPath: string, permanent: boolean): Promise<ActionResult> {
  try {
    const user = await authorize("seo.edit");
    const from = path.parse(fromPath).replace(/\/+$/, "") || "/";
    const to = z.union([path, z.string().url()]).parse(toPath.trim());
    if (from === to) return { ok: false, error: "A redirect cannot point to itself." };
    if (from === "/" || from.startsWith("/admin") || from.startsWith("/api")) return { ok: false, error: "That path cannot be redirected." };
    const db = await getDb();
    const loop = await db.select().from(t.redirects).where(eq(t.redirects.fromPath, to));
    if (loop.some((r) => r.toPath === from)) return { ok: false, error: "This would create a redirect loop." };
    await db.insert(t.redirects).values({ fromPath: from, toPath: to, permanent, note: `Added by ${user.email}` }).onConflictDoUpdate({ target: t.redirects.fromPath, set: { toPath: to, permanent } });
    await audit(user, "create", "redirect", from, `→ ${to}`);
    refreshSite();
    return { ok: true, message: "Redirect saved." };
  } catch (e) {
    return { ok: false, error: e instanceof AuthError ? e.message : e instanceof z.ZodError ? e.issues[0].message : "Could not save redirect." };
  }
}

export async function deleteRedirectAction(id: number): Promise<ActionResult> {
  try {
    const user = await authorize("seo.edit");
    const db = await getDb();
    await db.delete(t.redirects).where(eq(t.redirects.id, id));
    await audit(user, "delete", "redirect", id);
    return { ok: true, message: "Redirect removed." };
  } catch (e) {
    return { ok: false, error: e instanceof AuthError ? e.message : "Could not delete." };
  }
}
