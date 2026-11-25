import type { Role } from "@/db/types";

export type Perm =
  | "dashboard.view"
  | "catalog.view"
  | "catalog.edit"
  | "catalog.publish"
  | "content.view"
  | "content.edit"
  | "content.publish"
  | "media.edit"
  | "enquiries.view"
  | "enquiries.edit"
  | "enquiries.export"
  | "enquiries.delete"
  | "navigation.edit"
  | "seo.edit"
  | "theme.edit"
  | "settings.edit"
  | "users.manage"
  | "audit.view";

const ALL: Perm[] = [
  "dashboard.view", "catalog.view", "catalog.edit", "catalog.publish", "content.view", "content.edit", "content.publish", "media.edit",
  "enquiries.view", "enquiries.edit", "enquiries.export", "enquiries.delete", "navigation.edit", "seo.edit", "theme.edit", "settings.edit", "users.manage", "audit.view",
];

export const ROLE_PERMS: Record<Role, Perm[]> = {
  super_admin: ALL,
  content_admin: ["dashboard.view", "catalog.view", "content.view", "content.edit", "content.publish", "media.edit", "navigation.edit", "seo.edit"],
  product_admin: ["dashboard.view", "catalog.view", "catalog.edit", "catalog.publish", "content.view", "media.edit"],
  sales_admin: ["dashboard.view", "catalog.view", "content.view", "enquiries.view", "enquiries.edit", "enquiries.export"],
  read_only: ["dashboard.view", "catalog.view", "content.view"],
};

export const ROLE_LABEL: Record<Role, string> = {
  super_admin: "Super Administrator",
  content_admin: "Content Administrator",
  product_admin: "Product Administrator",
  sales_admin: "Sales Administrator",
  read_only: "Read-Only User",
};

export const can = (role: Role | undefined, perm: Perm) => Boolean(role && ROLE_PERMS[role]?.includes(perm));
