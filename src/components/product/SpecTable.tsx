import type { SpecRow } from "@/data/types";

const LABEL: Record<NonNullable<SpecRow["status"]>, { text: string; cls: string }> = {
  option: { text: "Option", cls: "chip" },
  reference: { text: "Industry reference", cls: "chip" },
  confirm: { text: "Confirmed at quotation", cls: "chip chip-confirm" },
};

export function SpecTable({ rows, caption }: { rows: SpecRow[]; caption: string }) {
  return (
    <div className="overflow-x-auto rounded-sm border border-line bg-white">
      <table className="table-spec min-w-[34rem]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Parameter</th>
            <th scope="col">Specification</th>
            <th scope="col" className="w-52">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              <td className="text-ink-2">{r.value}</td>
              <td>{r.status && <span className={LABEL[r.status].cls}>{LABEL[r.status].text}</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SpecLegend() {
  return (
    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[0.8rem] text-muted">
      <li><span className="font-semibold text-ink-2">Option</span> — a format or option Merova can specify</li>
      <li><span className="font-semibold text-ink-2">Industry reference</span> — general technical information, not a Merova guarantee</li>
      <li><span className="font-semibold text-ink-2">Confirmed at quotation</span> — Merova-specific value confirmed for your order</li>
    </ul>
  );
}
