"use server";
import { redirect } from "next/navigation";
import { eq, sql } from "drizzle-orm";
import { getDb, schema as t } from "@/db";
import { hashPassword, passwordProblem, verifyPassword } from "@/db/password";
import { clientIp, createSession, destroySession, sessionUser } from "@/lib/auth/session";
import { verifyTotp } from "@/lib/auth/totp";
import { rateLimit } from "@/lib/rate-limit";
import { audit } from "@/lib/admin/audit";

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase().slice(0, 200);
  const password = String(form.get("password") ?? "").slice(0, 200);
  const ip = await clientIp();
  if (!rateLimit(`login:${ip}`, Number(process.env.LOGIN_RATE_LIMIT ?? 10), 10 * 60_000)) return { error: "Too many sign-in attempts. Please wait a few minutes." };
  const db = await getDb();
  const [user] = await db.select().from(t.users).where(eq(t.users.email, email)).limit(1);
  const generic = "Incorrect email or password.";
  if (!user || !user.active) {
    await verifyPassword(password, "scrypt$AAAAAAAAAAAAAAAAAAAAAA==$AAAA"); // equalise timing
    return { error: generic };
  }
  if (user.lockedUntil && user.lockedUntil > new Date()) return { error: "This account is temporarily locked after repeated failed attempts. Try again in 15 minutes or ask a Super Administrator." };
  if (!(await verifyPassword(password, user.passwordHash))) {
    const fails = user.failedLogins + 1;
    await db.update(t.users).set({ failedLogins: fails, lockedUntil: fails >= 5 ? new Date(Date.now() + 15 * 60_000) : null }).where(eq(t.users.id, user.id));
    await audit(user, "login_failed", "user", user.id);
    return { error: generic };
  }
  await db.update(t.users).set({ failedLogins: 0, lockedUntil: null, lastLoginAt: new Date() }).where(eq(t.users.id, user.id));
  await createSession(user.id, !user.mfaEnabled);
  await audit(user, "login", "user", user.id);
  redirect(user.mfaEnabled ? "/admin/login/mfa" : "/admin");
}

export async function mfaAction(_prev: LoginState, form: FormData): Promise<LoginState> {
  const u = await sessionUser();
  if (!u) redirect("/admin/login");
  const ip = await clientIp();
  if (!rateLimit(`mfa:${ip}`, 8, 5 * 60_000)) return { error: "Too many attempts. Please wait a few minutes." };
  const db = await getDb();
  const [user] = await db.select().from(t.users).where(eq(t.users.id, u.id)).limit(1);
  if (!user?.mfaSecret || !verifyTotp(user.mfaSecret, String(form.get("code") ?? ""))) return { error: "That code is not valid. Check your authenticator app and try again." };
  await db.update(t.sessions).set({ mfaPassed: true }).where(eq(t.sessions.id, u.sessionId));
  redirect("/admin");
}

export async function logoutAction() {
  const u = await sessionUser();
  if (u) await audit(u, "logout", "user", u.id);
  await destroySession();
  redirect("/admin/login");
}

export async function changePasswordAction(_prev: LoginState & { ok?: boolean }, form: FormData): Promise<LoginState & { ok?: boolean }> {
  const u = await sessionUser();
  if (!u) redirect("/admin/login");
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  if (next !== String(form.get("confirm") ?? "")) return { error: "The new passwords do not match." };
  const problem = passwordProblem(next);
  if (problem) return { error: problem };
  const db = await getDb();
  const [user] = await db.select().from(t.users).where(eq(t.users.id, u.id)).limit(1);
  if (!user || !(await verifyPassword(current, user.passwordHash))) return { error: "Your current password is incorrect." };
  await db.update(t.users).set({ passwordHash: await hashPassword(next), mustChangePassword: false, updatedAt: sql`now()` }).where(eq(t.users.id, u.id));
  // Sign out other sessions.
  await db.delete(t.sessions).where(sql`${t.sessions.userId} = ${u.id} AND ${t.sessions.id} <> ${u.sessionId}`);
  await audit(u, "password_change", "user", u.id);
  return { ok: true };
}
