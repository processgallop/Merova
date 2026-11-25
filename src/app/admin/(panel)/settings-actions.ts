"use server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema as t } from "@/db";
import { DEFAULT_FOOTER, DEFAULT_NAV, DEFAULT_SEO, DEFAULT_SITE, DEFAULT_THEME } from "@/db/defaults";
import { authorize, AuthError } from "@/lib/auth/session";
import type { Perm } from "@/lib/auth/rbac";
import { audit, refreshSite, snapshot, type ActionResult } from "@/lib/admin/audit";

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a 6-digit HEX colour, e.g. #D52B1E.");
const href = z.string().trim().max(500).refine((v) => /^(\/|https?:\/\/|mailto:|tel:|#)/.test(v), "Links must start with /, https://, mailto: or tel:.");
const id = z.string().max(60).optional().transform((v) => v || Math.random().toString(36).slice(2, 9));

const SCHEMAS = {
  theme: z.object({
    primary: hex, primaryDeep: hex, charcoal: hex, ink: hex, background: hex, surface: hex, heading: hex, body: hex, border: hex, buttonBg: hex, buttonText: hex, footerBg: hex, footerText: hex,
    fontPair: z.enum(["manrope-inter", "sora-inter", "jakarta-inter", "dmsans-inter"]),
    baseSize: z.coerce.number().refine((n) => [15, 16, 17, 18].includes(n)),
    headingWeight: z.coerce.number().refine((n) => [600, 700, 800].includes(n)),
    radius: z.enum(["sharp", "soft", "round"]),
    container: z.enum(["standard", "wide"]),
    spacing: z.enum(["compact", "standard", "airy"]),
    headerStyle: z.enum(["solid", "transparent"]),
    buttonStyle: z.enum(["solid", "outline-hover"]),
    logoUrl: z.string().max(500), logoReverseUrl: z.string().max(500), markUrl: z.string().max(500), faviconUrl: z.string().max(500),
  }),
  navigation: z.array(z.object({ id, label: z.string().trim().min(1).max(60), href, enabled: z.boolean(), mega: z.enum(["products", "industries", "about", "resources"]).nullish(), children: z.array(z.object({ id, label: z.string().trim().min(1).max(80), href, group: z.string().max(60).optional(), description: z.string().max(200).optional(), enabled: z.boolean() })).max(40).optional() })).max(8),
  footer: z.object({ statement: z.string().max(600), showSegments: z.boolean(), showIndustries: z.boolean(), columns: z.array(z.object({ id, title: z.string().max(60), links: z.array(z.object({ id, label: z.string().max(80), href })).max(20) })).max(4), legal: z.array(z.object({ id, label: z.string().max(80), href })).max(8) }),
  site: z.object({
    companyName: z.string().trim().min(1).max(120), legalName: z.string().max(200), tagline: z.string().max(120), proposition: z.string().max(200), description: z.string().max(600),
    email: z.union([z.literal(""), z.string().email()]), salesEmail: z.union([z.literal(""), z.string().email()]), phone: z.string().max(40), whatsapp: z.string().max(20).transform((v) => v.replace(/\D/g, "")), whatsappMessage: z.string().max(300),
    officeAddress: z.string().max(400), plantAddress: z.string().max(400), mapUrl: z.string().max(1000), hours: z.string().max(120), gstin: z.string().max(30),
    social: z.array(z.object({ label: z.string().max(40), url: z.string().url() })).max(10),
    enquiryRecipients: z.string().max(500), notifyOnEnquiry: z.boolean(),
    analytics: z.object({ gaId: z.string().max(30).regex(/^(G-[A-Z0-9]+)?$/, "GA4 IDs look like G-XXXXXXX."), gtmId: z.string().max(30).regex(/^(GTM-[A-Z0-9]+)?$/, "GTM IDs look like GTM-XXXXXXX."), gscVerification: z.string().max(100) }),
    cookieBanner: z.boolean(),
  }),
  seo: z.object({ titleTemplate: z.string().max(120).refine((v) => v.includes("%s"), "The template must contain %s."), defaultTitle: z.string().max(160), defaultDescription: z.string().max(300), ogImage: z.string().max(500), robotsDisallow: z.array(z.string().max(200)).max(30), allowIndexing: z.boolean() }),
} as const;

export type SettingKey = keyof typeof SCHEMAS;
const PERM: Record<SettingKey, Perm> = { theme: "theme.edit", navigation: "navigation.edit", footer: "navigation.edit", site: "settings.edit", seo: "seo.edit" };
const DEFAULTS = { theme: DEFAULT_THEME, navigation: DEFAULT_NAV, footer: DEFAULT_FOOTER, site: DEFAULT_SITE(), seo: DEFAULT_SEO };

export async function saveSettingAction(key: SettingKey, value: unknown): Promise<ActionResult> {
  try {
    const user = await authorize(PERM[key]);
    const parsed = SCHEMAS[key].safeParse(value);
    if (!parsed.success) return { ok: false, error: parsed.error.issues.map((i) => `${i.path.join(" › ")}: ${i.message}`).slice(0, 4).join(" · ") };
    const db = await getDb();
    const [old] = await db.select().from(t.settings).where(eq(t.settings.key, key));
    if (old) await snapshot(user, `settings:${key}`, key, old.value, "Before change");
    await db.insert(t.settings).values({ key, value: parsed.data, updatedBy: user.email }).onConflictDoUpdate({ target: t.settings.key, set: { value: parsed.data, updatedBy: user.email, updatedAt: new Date() } });
    await audit(user, "update", "settings", key);
    refreshSite();
    return { ok: true, message: "Saved — the website has been updated." };
  } catch (e) {
    return { ok: false, error: e instanceof AuthError ? e.message : "Could not save settings." };
  }
}

export async function restoreDefaultAction(key: SettingKey): Promise<ActionResult> {
  return saveSettingAction(key, DEFAULTS[key]);
}
