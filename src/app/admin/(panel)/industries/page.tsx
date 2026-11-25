import { asc } from "drizzle-orm";
import { getDb, schema as t } from "@/db";
import { ListView } from "@/components/admin/ListView";
import { requireUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";

export const metadata = { title: "Industries" };

export default async function IndustriesAdmin() {
  const user = await requireUser("catalog.view");
  const db = await getDb();
  const [inds, sectors, links] = await Promise.all([db.select().from(t.industries).orderBy(asc(t.industries.sortOrder)), db.select().from(t.industrySectors), db.select({ industryId: t.productIndustries.industryId }).from(t.productIndustries)]);
  return (
    <ListView
      title="Industries"
      intro="Industry pages and the industry finder. Each industry's products come from the product mapping — edit an industry to add, remove or reorder its products."
      newHref="/admin/industries/new"
      newLabel="Add industry"
      columns={["Sector", "Products", "Sub-industries"]}
      filters={[{ key: "sector", label: "Sectors", options: sectors.map((s) => ({ value: String(s.id), label: s.name })) }]}
      bulkEntity="industry"
      reorderEntity="industry"
      canEdit={can(user.role, "catalog.edit")}
      canPublish={can(user.role, "catalog.publish")}
      rows={inds.map((i) => ({ id: i.id, title: i.name, subtitle: `/industries/${i.slug}`, href: `/admin/industries/${i.id}`, status: i.status, thumb: (i.image ?? i.banner)?.url ?? null, cols: [sectors.find((s) => s.id === i.sectorId)?.name ?? "—", links.filter((l) => l.industryId === i.id).length, i.subIndustries.length], filter: { sector: String(i.sectorId ?? "") }, search: `${i.name} ${i.slug} ${i.subIndustries.join(" ")}` }))}
    />
  );
}
