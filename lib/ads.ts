/**
 * Ads are ON unless explicitly disabled.
 * Local/Vercel: set NEXT_PUBLIC_ADS_ENABLED=false to turn off.
 * (Unset or "true" = enabled — so Vercel works even if the var is missing.)
 */
export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED !== "false";

/** Adsterra Smartlink (Direct Link) ID */
export const ADSTERRA_SMARTLINK_ID = "30356717";
export const ADSTERRA_SMARTLINK_URL = `https://otieu.com/4/${ADSTERRA_SMARTLINK_ID}`;

/**
 * Video ad mode for VIP watch screen:
 * - "static" → temporary local/static MP4 + timer (current default)
 * - "vast"   → real Adsterra VAST video ads (enable when you have the key)
 *
 * .env.local:
 *   NEXT_PUBLIC_AD_VIDEO_MODE=static
 *   # later:
 *   NEXT_PUBLIC_AD_VIDEO_MODE=vast
 *   NEXT_PUBLIC_ADSTERRA_VAST_KEY=your_key
 */
export const AD_VIDEO_MODE =
  process.env.NEXT_PUBLIC_AD_VIDEO_MODE === "vast" ? "vast" : "static";

/** Local static ad video (public/ad-content.mp4) used while VAST is off */
export const STATIC_AD_VIDEO_SRC =
  process.env.NEXT_PUBLIC_STATIC_AD_VIDEO_SRC?.trim() || "/ad-content.mp4";

/**
 * Adsterra VAST / Video ad tag.
 *
 * Where to get it (Adsterra Publisher dashboard):
 * 1. Login → Websites → Add Code → Video / VAST
 * 2. Copy URL like: https://www.videosprofitnetwork.com/watch.xml?key=YOUR_KEY
 *
 *   NEXT_PUBLIC_ADSTERRA_VAST_URL=...
 *   — or —
 *   NEXT_PUBLIC_ADSTERRA_VAST_KEY=YOUR_KEY
 */
const vastFromUrl = process.env.NEXT_PUBLIC_ADSTERRA_VAST_URL?.trim() || "";
const vastKey = process.env.NEXT_PUBLIC_ADSTERRA_VAST_KEY?.trim() || "";

export const ADSTERRA_VAST_URL =
  vastFromUrl ||
  (vastKey
    ? `https://www.videosprofitnetwork.com/watch.xml?key=${vastKey}`
    : "");

/** Watch duration for static mode (and VAST safety fallback) */
export const AD_WATCH_SECONDS = Number(process.env.NEXT_PUBLIC_AD_WATCH_SECONDS || 30);

export function openAdsterraSmartlink() {
  if (typeof window === "undefined" || !ADS_ENABLED) return;
  window.open(ADSTERRA_SMARTLINK_URL, "_blank", "noopener,noreferrer");
}
