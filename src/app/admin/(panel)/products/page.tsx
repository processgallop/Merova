import { asc } from "drizzle-orm";
import { getDb, schema as t } from "@/db";
import { AVAILABILITY_LABEL } from "@/db/types";
import { ListView } from "@/components/admin/ListView";
import { requireUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";

export const metadata = { title: "Products" };

export default async function ProductsAdmin() {
  const user = await requireUser("catalog.view");
  const db = await getDb();
  const [products, segments, links] = await Promise.all([
    db.select().from(t.products).orderBy(asc(t.products.sortOrder), asc(t.products.id)),
    db.select().from(t.segments).orderBy(asc(t.segments.sortOrder)),
    db.select({ productId: t.productIndustries.productId }).from(t.productIndustries),
  ]);
  const count = (id: number) => links.filter((l) => l.productId === id).length;
  return (
    <ListView
      title="Products"
      intro="One record per product. Industry pages, segment pages, search, MIRA and flyers all read from these records."
      newHref="/admin/products/new"
      newLabel="Add product"
      columns={["Segment", "Family", "Industries", "Availability"]}
      filters={[
        { key: "segment", label: "Segments", options: segments.map((s) => ({ value: String(s.id), label: s.name })) },
        { key: "verification", label: "Verification", options: [{ value: "verified", label: "Verified" }, { value: "unverified", label: "Unverified" }] },
      ]}
      bulkEntity="product"
      reorderEntity="product"
      canEdit={can(user.role, "catalog.edit")}
      canPublish={can(user.role, "catalog.publish")}
      rows={products.map((p) => {
        const s = segments.find((x) => x.id === p.segmentId);
        return {
          id: p.id,
          title: p.name,
          subtitle: `${p.code} · /${s?.slug}/${p.slug}`,
          href: `/admin/products/${p.id}`,
          status: p.status,
          thumb: p.images[0]?.url ?? null,
          cols: [s ? `${s.code} · ${s.navName}` : "—", p.family || "—", count(p.id), AVAILABILITY_LABEL[p.availability].split(" ·")[0]],
          filter: { segment: String(p.segmentId), verification: p.verification },
          search: `${p.name} ${p.code} ${p.slug} ${p.family}`,
        };
      })}
    />
  );
}
