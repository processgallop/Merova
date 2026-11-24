"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "merova-consent-v1";
type Choice = "granted" | "denied" | null;

function readChoice(): Choice {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

function saveChoice(v: Exclude<Choice, null>) {
  try {
    window.localStorage.setItem(KEY, v);
  } catch {
    /* storage blocked: choice applies to this page view only */
  }
}

/**
 * Loads GA4 and/or GTM only after explicit consent. When no analytics IDs are
 * configured the banner never renders, because nothing is tracked.
 */
export function Analytics({ gaId, gtmId }: { gaId?: string; gtmId?: string }) {
  const enabled = Boolean(gaId || gtmId);
  const [choice, setChoice] = useState<Choice>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    // Syncing from localStorage (an external store) after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChoice(readChoice());
    setReady(true);
    const reopen = () => setChoice(null);
    window.addEventListener("merova:cookie-settings", reopen);
    return () => window.removeEventListener("merova:cookie-settings", reopen);
  }, [enabled]);

  useEffect(() => {
    window.__merovaConsent = choice === "granted";
  }, [choice]);

  if (!enabled) return null;

  const decide = (v: "granted" | "denied") => {
    saveChoice(v);
    setChoice(v);
  };

  return (
    <>
      {choice === "granted" && gtmId && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      )}
      {choice === "granted" && gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {ready && choice === null && (
        <div role="dialog" aria-live="polite" aria-label="Cookie preferences" className="no-print fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-2xl rounded-md border border-line bg-white p-5 shadow-lift sm:inset-x-6">
          <p className="text-sm leading-relaxed text-ink-2">
            We use analytics cookies to understand how the site is used and improve it. They are only set if you accept.{" "}
            <Link href="/privacy-policy#cookies" className="font-semibold text-navy-800 underline underline-offset-2">Privacy policy</Link>
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn btn-navy btn-sm" onClick={() => decide("granted")}>Accept analytics</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => decide("denied")}>Decline</button>
          </div>
        </div>
      )}
    </>
  );
}

export function CookieSettingsButton() {
  return (
    <button type="button" className="hover:text-white" onClick={() => window.dispatchEvent(new Event("merova:cookie-settings"))}>
      Cookie settings
    </button>
  );
}
