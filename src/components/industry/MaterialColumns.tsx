import Image from "next/image";
import Link from "next/link";
import { AddToEnquiry } from "@/components/basket/Basket";
import { categories, productById } from "@/data/catalog";

/** Products for an operator, kept visually separate by the four material categories. */
export function MaterialColumns({ primary, secondary }: { primary: string[]; secondary: string[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {categories.map((c, ci) => {
        const pr = primary.map((id) => productById[id]).filter((p) => p?.category === c.id);
        const se = secondary.map((id) => productById[id]).filter((p) => p?.category === c.id);
        return (
          <section key={c.id} aria-label={c.name} className="reveal mat-rule rounded-[24px] border border-line bg-white p-5" style={{ ["--mat" as string]: c.accent, ["--i" as string]: ci }}>
            <h3 className="flex items-center gap-2 font-display text-[17px] font-semibold"><span className="mat-dot" style={{ ["--mat" as string]: c.accent }} />{c.name}</h3>
            {pr.length + se.length === 0 && <p className="mt-4 text-sm text-stone">Not typically needed for this business.</p>}
            {pr.length > 0 && <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-stone">Core</p>}
            <ul className="mt-2 grid gap-2">
              {pr.map((p) => (
                <li key={p.id} className="group flex items-center gap-3 rounded-2xl bg-cloud p-1.5 pr-2">
                  <Image src={p.image} alt="" width={96} height={72} className="h-12 w-16 flex-none rounded-xl object-cover" />
                  <Link href={p.url} className="min-w-0 flex-1 text-[14.5px] font-medium leading-tight group-hover:text-red">{p.name}</Link>
                  <AddToEnquiry id={p.id} name={p.name} compact />
                </li>
              ))}
            </ul>
            {se.length > 0 && (
              <>
                <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-stone">Optional</p>
                <ul className="mt-2 grid gap-1.5">{se.map((p) => <li key={p.id}><Link href={p.url} className="text-[14px] text-charcoal hover:text-red">{p.name}</Link></li>)}</ul>
              </>
            )}
          </section>
        );
      })}
    </div>
  );
}
