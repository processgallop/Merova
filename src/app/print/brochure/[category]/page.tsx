import { notFound } from "next/navigation";
import { BackPage, Contents, Cover, Divider, ProductPages } from "@/components/print/Spreads";
import { categories, categoryBySlug, industries, subcategoriesOf } from "@/data/catalog";
import { SUB_CONTENT } from "@/data/product-content";
import { RunningHead } from "@/components/print/Kit";

export const dynamicParams = false;
export const generateStaticParams = () => categories.map((c) => ({ category: c.slug }));

export default async function Brochure({ params }: { params: Promise<{ category: string }> }) {
  const c = categoryBySlug((await params).category);
  if (!c) notFound();
  const subs = subcategoriesOf(c.id);
  // page plan: 1 cover, 2 contents, then per sub: divider + ceil(n/3) product pages, then index, back
  let folio = 3; const plan = subs.map((s) => { const start = folio; folio += 1 + Math.ceil(s.products.length / 3); return { s, start }; });
  const indexPage = folio;
  const all = subs.flatMap((s) => s.products.map((p) => p.id));
  const inds = industries.map((i) => ({ i, ops: i.operators.filter((o) => o.primary.some((id) => all.includes(id))) })).filter((x) => x.ops.length);
  return (
    <>
      <Cover kicker={`${c.name} · Category brochure`} title={c.promise} sub={c.intro} image={c.image} />
      <Contents folio={2} items={[...plan.map(({ s, start }) => ({ title: s.name, sub: s.products.map((p) => p.name).join(" · "), page: start })), { title: "By industry", page: indexPage }]} />
      {plan.map(({ s, start }, k) => (
        <div key={s.id} style={{ display: "contents" }}>
          <Divider eyebrow={c.name} title={s.name} text={SUB_CONTENT[s.id]?.overview ?? ""} count={`${s.products.length} product${s.products.length > 1 ? "s" : ""}`} tone={k % 2 ? "red" : "graphite"} folio={start} />
          <ProductPages list={s.products} label={`${c.short} · ${s.name}`} startFolio={start + 1} />
        </div>
      ))}
      <div className="page">
        <RunningHead label="By industry" folio={indexPage} />
        <div style={{ padding: "30mm 14mm 0" }}>
          <h2 className="pd" style={{ fontSize: "26pt", fontWeight: 700, margin: 0 }}>Who uses {c.short.toLowerCase()} packaging</h2>
          <div style={{ columns: 2, columnGap: "10mm", marginTop: "8mm" }}>
            {inds.map(({ i, ops }) => <div key={i.id} style={{ breakInside: "avoid", marginBottom: "6mm" }}><p className="p-eyebrow" style={{ color: "#d52b1e", margin: 0 }}>{i.name}</p>{ops.map((o) => <p key={o.id} className="p-body" style={{ margin: "1.5mm 0 0" }}><b>{o.name}:</b> {o.primary.filter((id) => all.includes(id)).length} products</p>)}</div>)}
          </div>
        </div>
      </div>
      <BackPage title={`Specify your ${c.short.toLowerCase()} packaging.`} />
    </>
  );
}
