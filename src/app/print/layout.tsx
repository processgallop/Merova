import type { Metadata } from "next";
import "./print.css";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/** Print-only routes used to render the downloadable PDFs (scripts/generate-pdfs.mjs). */
export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return <div className="print-root">{children}</div>;
}
