"use server";
import { randomBytes } from "node:crypto";
import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema as t } from "@/db";
import { hashPassword } from "@/db/password";
import { authorize, AuthError } from "@/lib/auth/session";
import { audit, type ActionResult } from "@/lib/admin/audit";

const ROLE = z.enum(["super_admin", "content_admin", "product_admin", "sales_admin", "read_only"]);
const tempPassword = () => `${randomBytes(9).toString("base64url")}9a`;

export async function createUserAction(data: { name: string; email: string; role: string }): Promise<ActionResult<{ password: string }>> {
  try {
    const user = await authorize("users.manage");
    const d = z.object({ name: z.string().trim().min(2).max(120), email: z.string().trim().toLowerCase().email(), role: ROLE }).parse(data);
    const db = await getDb();
    if ((await db.select({ id: t.users.id }).from(t.users).where(eq(t.users.email, d.email))).length) return { ok: false, error: "A user with this email already exists." };
    const password = tempPassword();
    const [u] = await db.insert(t.users).values({ ...d, passwordHash: await hashPassword(password), mustChangePassword: true }).returning({ id: t.users.id });
    await audit(user, "create", "user", u.id, `${d.email} (${d.role})`);
    return { ok: true, data: { password }, message: "User created." };
  } catch (e) {
    return { ok: false, error: e instanceof AuthError ? e.message : e instanceof z.ZodError ? "Enter a name, a valid email and a role." : "Could not create user." };
  }
}

export async function updateUserAction(id: string, patch: { role?: string; active?: boolean; name?: string }): Promise<ActionResult> {
  try {
    const user = await authorize("users.manage");
    const db = await getDb();
    const [target] = await db.select().from(t.users).where(eq(t.users.id, id));
    if (!target) return { ok: false, error: "User not found." };
    const role = patch.role ? ROLE.parse(patch.role) : undefined;
    const demoting = target.role === "super_admin" && ((role && role !== "super_admin") || patch.active === false);
    if (demoting) {
      const others = await db.select({ id: t.users.id }).from(t.users).where(and(eq(t.users.role, "super_admin"), eq(t.users.active, true), ne(t.users.id, id)));
      if (!others.length) return { ok: false, error: "At least one active Super Administrator is required." };
    }
    if (id === user.id && patch.active === false) return { ok: false, error: "You cannot deactivate your own account." };
    await db.update(t.users).set({ ...(role ? { role } : {}), ...(patch.active !== undefined ? { active: patch.active } : {}), ...(patch.name ? { name: patch.name.slice(0, 120) } : {}), updatedAt: new Date() }).where(eq(t.users.id, id));
    if (patch.active === false || role) await db.delete(t.sessions).where(eq(t.sessions.userId, id));
    await audit(user, "update", "user", id, JSON.stringify(patch));
    return { ok: true, message: "User updated." };
  } catch (e) {
    return { ok: false, error: e instanceof AuthError ? e.message : "Update failed." };
  }
}

export async function resetPasswordAction(id: string): Promise<ActionResult<{ password: string }>> {
  try {
    const user = await authorize("users.manage");
    const db = await getDb();
    const password = tempPassword();
    await db.update(t.users).set({ passwordHash: await hashPassword(password), mustChangePassword: true, failedLogins: 0, lockedUntil: null, updatedAt: new Date() }).where(eq(t.users.id, id));
    await db.delete(t.sessions).where(eq(t.sessions.userId, id));
    await audit(user, "reset_password", "user", id);
    return { ok: true, data: { password }, message: "Temporary password generated." };
  } catch (e) {
    return { ok: false, error: e instanceof AuthError ? e.message : "Reset failed." };
  }
}

export async function resetMfaAction(id: string): Promise<ActionResult> {
  try {
    const user = await authorize("users.manage");
    const db = await getDb();
    await db.update(t.users).set({ mfaEnabled: false, mfaSecret: null }).where(eq(t.users.id, id));
    await audit(user, "reset_mfa", "user", id);
    return { ok: true, message: "Two-step verification removed for this user." };
  } catch (e) {
    return { ok: false, error: e instanceof AuthError ? e.message : "Reset failed." };
  }
}
