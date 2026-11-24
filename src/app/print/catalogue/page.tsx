import { BackPage, Contents, Cover, Divider, ProductPages } from "@/components/print/Spreads";
import { categories, counts, productsIn, subcategoriesOf } from "@/data/catalog";

export default async function Catalogue() {
  let folio = 3; const plan = categories.map((c) => { const start = folio; folio += 1 + Math.ceil(productsIn(c.id).length / 2); return { c, start }; });
  return (
    <>
      <Cover kicker="Master product catalogue" title="Every material has a purpose." sub={`${counts.products} packaging products across paper, plastic and film, compostable and corrugated, specified to your product and sampled before production.`} image="/assets/renders/scenes/hero.webp" />
      <Contents folio={2} items={plan.map(({ c, start }) => ({ title: c.name, sub: c.intro, page: start, children: subcategoriesOf(c.id).map((s) => `${s.name} (${s.products.length})`) }))} />
      {plan.map(({ c, start }, k) => (
        <div key={c.id} style={{ display: "contents" }}>
          <Divider eyebrow={`Section ${k + 1}`} title={c.name} text={`${c.promise} ${c.intro}`} count={`${productsIn(c.id).length} products`} tone={k % 2 ? "graphite" : "red"} folio={start} />
          <ProductPages list={productsIn(c.id)} label={c.name} startFolio={start + 1} />
        </div>
      ))}
      <BackPage />
    </>
  );
}
