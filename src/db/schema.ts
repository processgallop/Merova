/**
 * Merova Printpack — relational data model.
 *
 * One product = one record (`products`). Industries relate to products through
 * the `product_industries` join table (many-to-many), so the same product can
 * appear on any number of industry pages without being duplicated.
 */
import { relations, sql } from "drizzle-orm";
import {
  boolean,
  customType,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import type { Faq, ImageRef, PostBlockSection, Section, SeoMeta, SpecRow } from "./types";

const bytea = customType<{ data: Buffer; driverData: Buffer | Uint8Array }>({
  dataType: () => "bytea",
  fromDriver: (v) => (Buffer.isBuffer(v) ? v : Buffer.from(v)),
});

const created = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updated = () => timestamp("updated_at", { withTimezone: true }).notNull().defaultNow();

/* ── Enums ─────────────────────────────────────────────────────────── */

export const roleEnum = pgEnum("role", ["super_admin", "content_admin", "product_admin", "sales_admin", "read_only"]);
export const statusEnum = pgEnum("content_status", ["draft", "pending_review", "approved", "published", "archived"]);
export const availabilityEnum = pgEnum("availability", ["offered", "manufactured", "sourced", "custom", "pending"]);
export const verificationEnum = pgEnum("verification", ["verified", "unverified"]);
export const enquiryStatusEnum = pgEnum("enquiry_status", [
  "new",
  "contacted",
  "under_review",
  "quotation_in_progress",
  "quotation_sent",
  "negotiation",
  "converted",
  "closed_lost",
]);

/* ── Users, sessions, audit ────────────────────────────────────────── */

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull().default("read_only"),
  active: boolean("active").notNull().default(true),
  mustChangePassword: boolean("must_change_password").notNull().default(false),
  mfaSecret: text("mfa_secret"),
  mfaEnabled: boolean("mfa_enabled").notNull().default(false),
  failedLogins: integer("failed_logins").notNull().default(0),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: created(),
  updatedAt: updated(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(), // sha256 of the cookie token
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    mfaPassed: boolean("mfa_passed").notNull().default(false),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ip: text("ip"),
    userAgent: text("user_agent"),
    createdAt: created(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    userEmail: text("user_email"),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id"),
    summary: text("summary"),
    ip: text("ip"),
    createdAt: created(),
  },
  (t) => [index("audit_created_idx").on(t.createdAt)],
);

export const revisions = pgTable(
  "revisions",
  {
    id: serial("id").primaryKey(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    data: jsonb("data").notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    userEmail: text("user_email"),
    note: text("note"),
    createdAt: created(),
  },
  (t) => [index("revisions_entity_idx").on(t.entityType, t.entityId)],
);

/* ── Media ─────────────────────────────────────────────────────────── */

export const media = pgTable(
  "media",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    filename: text("filename").notNull(),
    mime: text("mime").notNull(),
    size: integer("size").notNull().default(0),
    width: integer("width"),
    height: integer("height"),
    /** Binary content for uploaded files (null for static/seeded assets). */
    data: bytea("data"),
    /** Public path for static assets bundled with the site. */
    path: text("path"),
    folder: text("folder").notNull().default("general"),
    title: text("title"),
    alt: text("alt"),
    description: text("description"),
    credit: text("credit"),
    sourceUrl: text("source_url"),
    license: text("license"),
    isStock: boolean("is_stock").notNull().default(false),
    /** Private files (enquiry attachments) are served only to signed-in staff. */
    isPrivate: boolean("is_private").notNull().default(false),
    uploadedBy: uuid("uploaded_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: created(),
    updatedAt: updated(),
  },
  (t) => [index("media_folder_idx").on(t.folder)],
);

/* ── Catalogue ─────────────────────────────────────────────────────── */

export const segments = pgTable("segments", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(), // A–E
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  navName: text("nav_name").notNull(),
  headline: text("headline").notNull().default(""),
  intro: text("intro").notNull().default(""),
  description: text("description").notNull().default(""),
  technologies: jsonb("technologies").$type<{ name: string; text: string }[]>().notNull().default([]),
  families: jsonb("families").$type<{ code: string; name: string }[]>().notNull().default([]),
  image: jsonb("image").$type<ImageRef | null>(),
  banner: jsonb("banner").$type<ImageRef | null>(),
  faqs: jsonb("faqs").$type<Faq[]>().notNull().default([]),
  seo: jsonb("seo").$type<SeoMeta>().notNull().default({}),
  sortOrder: integer("sort_order").notNull().default(0),
  status: statusEnum("status").notNull().default("draft"),
  createdAt: created(),
  updatedAt: updated(),
});

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    code: text("code").notNull().unique(), // canonical product ID, e.g. MRV-A1-001
    slug: text("slug").notNull().unique(),
    segmentId: integer("segment_id").notNull().references(() => segments.id, { onDelete: "restrict" }),
    family: text("family").notNull().default(""),
    name: text("name").notNull(),
    shortName: text("short_name"),
    headline: text("headline").notNull().default(""),
    summary: text("summary").notNull().default(""),
    overview: jsonb("overview").$type<string[]>().notNull().default([]),
    highlights: jsonb("highlights").$type<string[]>().notNull().default([]),
    applications: jsonb("applications").$type<string[]>().notNull().default([]),
    formats: jsonb("formats").$type<string[]>().notNull().default([]),
    materials: jsonb("materials").$type<string[]>().notNull().default([]),
    specs: jsonb("specs").$type<SpecRow[]>().notNull().default([]),
    printing: jsonb("printing").$type<string[]>().notNull().default([]),
    customisation: jsonb("customisation").$type<string[]>().notNull().default([]),
    quality: jsonb("quality").$type<string[]>().notNull().default([]),
    faqs: jsonb("faqs").$type<Faq[]>().notNull().default([]),
    images: jsonb("images").$type<ImageRef[]>().notNull().default([]),
    videoUrl: text("video_url"),
    flyer: jsonb("flyer").$type<{ url: string; mediaId?: string; updatedAt?: string } | null>(),
    quoteProfile: text("quote_profile").notNull().default("custom"),
    availability: availabilityEnum("availability").notNull().default("offered"),
    verification: verificationEnum("verification").notNull().default("unverified"),
    moq: text("moq"),
    leadTime: text("lead_time"),
    specNote: text("spec_note"),
    keywords: jsonb("keywords").$type<string[]>().notNull().default([]),
    seo: jsonb("seo").$type<SeoMeta>().notNull().default({}),
    sortOrder: integer("sort_order").notNull().default(0),
    status: statusEnum("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: created(),
    updatedAt: updated(),
  },
  (t) => [index("products_segment_idx").on(t.segmentId), index("products_status_idx").on(t.status)],
);

export const productRelations = pgTable(
  "product_relations",
  {
    productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    relatedId: integer("related_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.productId, t.relatedId] })],
);

export const industrySectors = pgTable("industry_sectors", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const industries = pgTable("industries", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull().default(""),
  sectorId: integer("sector_id").references(() => industrySectors.id, { onDelete: "set null" }),
  headline: text("headline").notNull().default(""),
  intro: text("intro").notNull().default(""),
  subIndustries: jsonb("sub_industries").$type<string[]>().notNull().default([]),
  challenges: jsonb("challenges").$type<{ title: string; text: string }[]>().notNull().default([]),
  considerations: jsonb("considerations").$type<string[]>().notNull().default([]),
  faqs: jsonb("faqs").$type<Faq[]>().notNull().default([]),
  icon: text("icon").notNull().default("Boxes"),
  image: jsonb("image").$type<ImageRef | null>(),
  banner: jsonb("banner").$type<ImageRef | null>(),
  isCatchAll: boolean("is_catch_all").notNull().default(false),
  seo: jsonb("seo").$type<SeoMeta>().notNull().default({}),
  sortOrder: integer("sort_order").notNull().default(0),
  status: statusEnum("status").notNull().default("draft"),
  createdAt: created(),
  updatedAt: updated(),
});

export const productIndustries = pgTable(
  "product_industries",
  {
    productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    industryId: integer("industry_id").notNull().references(() => industries.id, { onDelete: "cascade" }),
    /** Application context shown on the industry page, e.g. "Concession counters". */
    context: text("context"),
    relevance: text("relevance").notNull().default("primary"), // primary | secondary
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.productId, t.industryId] }), index("pi_industry_idx").on(t.industryId)],
);

/* ── CMS: pages, posts, resources ──────────────────────────────────── */

export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  /** Path without leading slash, e.g. "about" or "about/manufacturing"; "home" is the homepage. */
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  navLabel: text("nav_label"),
  template: text("template").notNull().default("standard"),
  sections: jsonb("sections").$type<Section[]>().notNull().default([]),
  seo: jsonb("seo").$type<SeoMeta>().notNull().default({}),
  status: statusEnum("status").notNull().default("draft"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  sortOrder: integer("sort_order").notNull().default(0),
  system: boolean("system").notNull().default(false),
  updatedBy: text("updated_by"),
  createdAt: created(),
  updatedAt: updated(),
});

export const postCategories = pgTable("post_categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull().default(""),
    intro: text("intro").notNull().default(""),
    categoryId: integer("category_id").references(() => postCategories.id, { onDelete: "set null" }),
    tags: jsonb("tags").$type<string[]>().notNull().default([]),
    author: text("author").notNull().default("Merova Technical Team"),
    cover: jsonb("cover").$type<ImageRef | null>(),
    videoUrl: text("video_url"),
    body: jsonb("body").$type<PostBlockSection[]>().notNull().default([]),
    recommendations: jsonb("recommendations").$type<string[]>().notNull().default([]),
    faqs: jsonb("faqs").$type<Faq[]>().notNull().default([]),
    relatedProducts: jsonb("related_products").$type<string[]>().notNull().default([]),
    relatedPosts: jsonb("related_posts").$type<string[]>().notNull().default([]),
    reviewStatus: text("review_status").notNull().default("pending"),
    reviewer: text("reviewer"),
    seo: jsonb("seo").$type<SeoMeta>().notNull().default({}),
    status: statusEnum("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: created(),
    updatedAt: updated(),
  },
  (t) => [index("posts_status_idx").on(t.status, t.publishedAt)],
);

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  kind: text("kind").notNull().default("brochure"), // catalogue | profile | brochure | technical | flyer
  fileUrl: text("file_url").notNull(),
  mediaId: uuid("media_id").references(() => media.id, { onDelete: "set null" }),
  sizeLabel: text("size_label"),
  sortOrder: integer("sort_order").notNull().default(0),
  status: statusEnum("status").notNull().default("published"),
  createdAt: created(),
  updatedAt: updated(),
});

/* ── Enquiries ─────────────────────────────────────────────────────── */

export interface EnquiryProduct {
  slug: string;
  name: string;
  segment?: string;
  specs?: Record<string, string>;
}

export const enquiries = pgTable(
  "enquiries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reference: text("reference").notNull().unique(),
    type: text("type").notNull().default("quote"),
    status: enquiryStatusEnum("status").notNull().default("new"),
    name: text("name").notNull(),
    company: text("company"),
    email: text("email").notNull(),
    phone: text("phone"),
    location: text("location"),
    industry: text("industry"),
    segment: text("segment"),
    products: jsonb("products").$type<EnquiryProduct[]>().notNull().default([]),
    quantity: text("quantity"),
    delivery: text("delivery"),
    timeline: text("timeline"),
    message: text("message"),
    details: jsonb("details").$type<Record<string, string>>().notNull().default({}),
    files: jsonb("files").$type<{ mediaId: string; name: string; size: number; type: string }[]>().notNull().default([]),
    source: jsonb("source").$type<{ page?: string; referrer?: string; utm?: Record<string, string> }>().notNull().default({}),
    team: text("team"),
    deliveryLog: jsonb("delivery_log").$type<string[]>().notNull().default([]),
    assignedTo: uuid("assigned_to").references(() => users.id, { onDelete: "set null" }),
    isRead: boolean("is_read").notNull().default(false),
    consent: boolean("consent").notNull().default(false),
    createdAt: created(),
    updatedAt: updated(),
  },
  (t) => [index("enquiries_created_idx").on(t.createdAt), index("enquiries_status_idx").on(t.status)],
);

export const enquiryNotes = pgTable("enquiry_notes", {
  id: serial("id").primaryKey(),
  enquiryId: uuid("enquiry_id").notNull().references(() => enquiries.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  userName: text("user_name"),
  kind: text("kind").notNull().default("note"), // note | status | assign
  body: text("body").notNull(),
  createdAt: created(),
});

/* ── SEO + settings ────────────────────────────────────────────────── */

export const redirects = pgTable(
  "redirects",
  {
    id: serial("id").primaryKey(),
    fromPath: text("from_path").notNull(),
    toPath: text("to_path").notNull(),
    permanent: boolean("permanent").notNull().default(true),
    hits: integer("hits").notNull().default(0),
    note: text("note"),
    createdAt: created(),
  },
  (t) => [uniqueIndex("redirects_from_idx").on(t.fromPath)],
);

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedBy: text("updated_by"),
  updatedAt: updated(),
});

/* ── Relations (for relational queries) ────────────────────────────── */

export const segmentsRelations = relations(segments, ({ many }) => ({ products: many(products) }));
export const productsRelations = relations(products, ({ one, many }) => ({
  segment: one(segments, { fields: [products.segmentId], references: [segments.id] }),
  industries: many(productIndustries),
}));
export const industriesRelations = relations(industries, ({ one, many }) => ({
  sector: one(industrySectors, { fields: [industries.sectorId], references: [industrySectors.id] }),
  products: many(productIndustries),
}));
export const productIndustriesRelations = relations(productIndustries, ({ one }) => ({
  product: one(products, { fields: [productIndustries.productId], references: [products.id] }),
  industry: one(industries, { fields: [productIndustries.industryId], references: [industries.id] }),
}));
export const postsRelations = relations(posts, ({ one }) => ({
  category: one(postCategories, { fields: [posts.categoryId], references: [postCategories.id] }),
}));

export const nowSql = sql`now()`;
