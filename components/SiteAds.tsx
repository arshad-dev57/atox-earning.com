"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { ADS_ENABLED, ADSENSE_CLIENT_ID } from "@/lib/ads";
import { isAdEligiblePath } from "@/lib/ad-eligibility";

/**
 * The single injection point for all advertising network scripts.
 *
 * Nothing renders here — and no ad script is requested — unless:
 *  1. ads are enabled (NEXT_PUBLIC_ADS_ENABLED !== "false"), and
 *  2. the current route is on the public-content allowlist
 *     (see lib/ad-eligibility.ts).
 *
 * Login, registration, dashboard, admin, Watch and Earn, plan/redirect,
 * API and error screens never load advertising code, so ineligible screens
 * are ad-free at the network-request level, not merely hidden with CSS.
 */
export default function SiteAds() {
  const pathname = usePathname();

  if (!ADS_ENABLED || !isAdEligiblePath(pathname)) return null;

  return (
    <>
      {/* Google AdSense — Auto ads + site verification (eligible public pages only) */}
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      {/* Adsterra popunder */}
      <Script
        src="https://pl30130375.effectivecpmnetwork.com/9b/70/31/9b703119ae59c516b07fef704eede719.js"
        strategy="afterInteractive"
      />

      {/* Adsterra native unit */}
      <Script
        src="https://pl30130376.effectivecpmnetwork.com/34fe2f29c9e1aac5ce45d112f266a216/invoke.js"
        strategy="afterInteractive"
        data-cfasync="false"
      />
      <div id="container-34fe2f29c9e1aac5ce45d112f266a216" />

      {/* Adsterra native banner */}
      <Script
        src="https://pl30130378.effectivecpmnetwork.com/cd/e2/88/cde288f0e69ef76da2f9b2dadf08213d.js"
        strategy="afterInteractive"
      />

      {/* Adsterra social bar */}
      <Script
        src="https://www.effectivecpmnetwork.com/ncasjz39t2?key=e7b696d54319d28034a82ec0870d6078"
        strategy="afterInteractive"
      />
    </>
  );
}