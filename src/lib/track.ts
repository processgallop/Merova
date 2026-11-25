/**
 * Analytics events (see docs/TRACKING-PLAN.md). Events go to the GTM
 * dataLayer and, when GA4 is loaded directly, to gtag. Both load only after
 * cookie consent, so nothing leaves the browser before the visitor agrees.
 */
type Params = Record<string, string | number | boolean | undefined>;

export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void };
  const payload = { ...params, page_path: window.location.pathname };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...payload });
  if (typeof w.gtag === "function") w.gtag("event", event, payload);
}
