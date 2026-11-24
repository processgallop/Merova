"use client";

/**
 * Conversion tracking. Events are pushed to window.dataLayer (GTM) and gtag
 * (GA4) only when analytics has been enabled by consent; otherwise they are
 * queued in memory and dropped. Event names are documented in
 * docs/TRACKING-PLAN.md.
 */
export type TrackEvent =
  | "view_product" | "view_category" | "view_industry" | "view_operator"
  | "add_to_enquiry" | "basket_view" | "rfq_start" | "rfq_step" | "rfq_submit_success" | "rfq_submit_error"
  | "enquiry_submit" | "download" | "whatsapp_click" | "phone_click" | "email_click"
  | "mira_open" | "mira_message" | "mira_recommendation_click" | "mira_handover"
  | "search" | "search_click" | "cta_click" | "industry_select";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __merovaConsent?: boolean;
  }
}

export function track(event: TrackEvent, params: Params = {}) {
  if (typeof window === "undefined") return;
  const payload = { ...params, page_path: window.location.pathname };
  if (!window.__merovaConsent) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
  window.gtag?.("event", event, payload);
}
