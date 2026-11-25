"use client";
import Script from "next/script";
import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "merova:consent";

/** Cookie consent. GA4 / GTM load only after the visitor accepts analytics cookies. */
export function Consent({ gaId, gtmId, enabled }: { gaId: string; gtmId: string; enabled: boolean }) {
  const [choice, setChoice] = useState<"granted" | "denied" | null | "unset">("unset");
  useEffect(() => {
    let v: string | null = null;
    try { v = localStorage.getItem(KEY); } catch { /* storage blocked */ }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChoice(v === "granted" || v === "denied" ? v : null);
    const open = (e: Event) => {
      if ((e.target as HTMLElement)?.closest?.("[data-cookie-settings]")) setChoice(null);
    };
    document.addEventListener("click", open);
    return () => document.removeEventListener("click", open);
  }, []);
  const decide = (v: "granted" | "denied") => {
    try { localStorage.setItem(KEY, v); } catch { /* ignore */ }
    setChoice(v);
  };
  const hasAnalytics = Boolean(gaId || gtmId);
  return (
    <>
      {choice === "granted" && gtmId ? (
        <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId.replace(/[^\w-]/g, "")}');`}</Script>
      ) : null}
      {choice === "granted" && gaId && !gtmId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId.replace(/[^\w-]/g, "")}`} strategy="afterInteractive" />
          <Script id="ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId.replace(/[^\w-]/g, "")}');`}</Script>
        </>
      ) : null}
      {enabled && hasAnalytics && choice === null ? (
        <div className="fixed bottom-4 left-4 z-[55] max-w-sm border border-line bg-surface p-5 shadow-2xl" role="dialog" aria-label="Cookie preferences">
          <p className="text-sm text-heading">We use analytics cookies, only with your consent, to understand how visitors find packaging on this site. <Link href="/privacy-policy" className="underline">Privacy policy</Link></p>
          <div className="mt-4 flex gap-2">
            <button type="button" className="btn btn-sm" onClick={() => decide("granted")}><span>Accept analytics</span></button>
            <button type="button" className="btn btn-sm btn-outline" onClick={() => decide("denied")}><span>Decline</span></button>
          </div>
        </div>
      ) : null}
    </>
  );
}
