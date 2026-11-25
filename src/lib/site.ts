/** Site URL helpers (environment-driven; business details live in the database settings). */
export const siteUrl = () =>
  (process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")).replace(/\/$/, "");

export const absoluteUrl = (path = "/") => (path.startsWith("http") ? path : `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`);

export function whatsappHref(number: string, message: string) {
  const digits = number.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : undefined;
}

export const telHref = (phone?: string) => (phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : undefined);

export function quoteHref(opts: { products?: string[]; industry?: string; type?: "quote" | "custom" } = {}) {
  const q = new URLSearchParams();
  if (opts.products?.length) q.set("products", opts.products.join(","));
  if (opts.industry) q.set("industry", opts.industry);
  const base = opts.type === "custom" ? "/custom-requirement" : "/request-a-quote";
  const s = q.toString();
  return s ? `${base}?${s}` : base;
}
