"use client";

/**
 * Conversion tracking. Events are pushed to window.dataLayer (GTM) and gtag
 * (GA4) only when analytics has been enabled by consent; otherwise they are
 * queued in memory and dropped. Event names are documented in
 * docs/TRACKING-PLAN.md.
 */
export type TrackEvent =
  | "quote_submit"
  | "quote_step"
  | "enquiry_submit"
  | "whatsapp_click"
  | "phone_click"
  | "email_click"
  | "flyer_download"
  | "catalogue_download"
  | "profile_download"
  | "document_download"
  | "mira_open"
  | "mira_message"
  | "mira_handoff"
  | "industry_select"
  | "cta_click";

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
