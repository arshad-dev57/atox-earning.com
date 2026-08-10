"use client";

import { ADS_ENABLED, ADSTERRA_SMARTLINK_URL } from "@/lib/ads";

/**
 * Keeps Adsterra smartlink available in the DOM for crawlers/bots
 * and as a fallback clickable surface when ads are enabled.
 */
export default function AdsterraSmartlink() {
  if (!ADS_ENABLED) return null;

  return (
    <a
      href={ADSTERRA_SMARTLINK_URL}
      target="_blank"
      rel="noopener noreferrer sponsored"
      aria-hidden="true"
      tabIndex={-1}
      className="sr-only"
      data-adsterra-smartlink="30356717"
    >
      Sponsored
    </a>
  );
}
