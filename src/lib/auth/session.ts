import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { forbidden, redirect } from "next/navigation";
import { and, eq, gt, lt } from "drizzle-orm";
import { cache } from "react";
import { getDb, schema as t } from "@/db";
import type { Role } from "@/db/types";
import { can, type Perm } from "./rbac";

export const SESSION_COOKIE = "mrv_session";
const TTL_MS = 12 * 60 * 60 * 1000;

const hash = (token: string) => createHash("sha256").update(token).digest("hex");

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  mustChangePassword: boolean;
  mfaEnabled: boolean;
  mfaPassed: boolean;
  sessionId: string;
}

export async function createSession(userId: string, mfaPassed: boolean) {
  const token = randomBytes(32).toString("base64url");
  const h = await headers();
  const db = await getDb();
  await db.delete(t.sessions).where(lt(t.sessions.expiresAt, new Date()));
  await db.insert(t.sessions).values({
    id: hash(token),
    userId,
    mfaPassed,
    expiresAt: new Date(Date.now() + TTL_MS),
    ip: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: h.get("user-agent")?.slice(0, 300) ?? null,
  });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TTL_MS / 1000,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    const db = await getDb();
    await db.delete(t.sessions).where(eq(t.sessions.id, hash(token)));
  }
  jar.delete(SESSION_COOKIE);
}

/** Session user, including partially authenticated (MFA pending) sessions. */
export const sessionUser = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || token.length > 100) return null;
  const db = await getDb();
  const [row] = await db
    .select({ s: t.sessions, u: t.users })
    .from(t.sessions)
    .innerJoin(t.users, eq(t.users.id, t.sessions.userId))
    .where(and(eq(t.sessions.id, hash(token)), gt(t.sessions.expiresAt, new Date())))
    .limit(1);
  if (!row || !row.u.active) return null;
  return { id: row.u.id, email: row.u.email, name: row.u.name, role: row.u.role, mustChangePassword: row.u.mustChangePassword, mfaEnabled: row.u.mfaEnabled, mfaPassed: row.s.mfaPassed, sessionId: row.s.id };
});

/** Fully authenticated user (password and, if enabled, MFA). */
export async function currentUser() {
  const u = await sessionUser();
  return u && (!u.mfaEnabled || u.mfaPassed) ? u : null;
}

/** For admin pages: redirects to login when signed out; renders 403 when the role lacks permission. */
export async function requireUser(perm?: Perm) {
  const u = await sessionUser();
  if (!u) redirect("/admin/login");
  if (u.mfaEnabled && !u.mfaPassed) redirect("/admin/login/mfa");
  if (perm && !can(u.role, perm)) forbidden();
  return u;
}

/** For server actions: every privileged mutation is authorised here, server-side. */
export async function authorize(perm: Perm) {
  const u = await currentUser();
  if (!u) throw new AuthError("Your session has expired. Please sign in again.");
  if (u.mustChangePassword && perm !== "dashboard.view") throw new AuthError("Please change your temporary password before making changes.");
  if (!can(u.role, perm)) throw new AuthError("You do not have permission to perform this action.");
  return u;
}

export class AuthError extends Error {}

export async function clientIp() {
  return (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}
