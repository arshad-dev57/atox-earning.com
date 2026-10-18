/**
 * Google AdSense ad unit configuration.
 *
 * The publisher ID is preserved from the existing configuration
 * (lib/ads.ts) and is NOT invented here.
 *
 * Ad unit SLOT IDs are not yet provisioned in the AdSense dashboard.
 * Obtain them from your AdSense account (Ads → By ad unit → New display ad)
 * and replace the placeholder values below. Do not fabricate slot IDs.
 */
import { ADSENSE_CLIENT_ID } from "@/lib/ads";

/** Responsive size map for ad units. Keys map to CSS breakpoint classes. */
export type AdSize = {
  /** Default (mobile) width x height. */
  default: { w: number; h: number };
  /** Tablet (md) width x height. */
  md?: { w: number; h: number };
  /** Desktop (lg) width x height. */
  lg?: { w: number; h: number };
};

/** A single ad unit definition. */
export type AdUnit = {
  /** Stable, human-readable identifier used for logging/placement tracking. */
  id: string;
  /** AdSense ad unit slot ID (data-ad-slot). Get from AdSense dashboard. */
  slot: string;
  /** Responsive dimensions. */
  sizes: AdSize;
  /** Whether this unit uses responsive auto-format (recommended). */
  responsive?: boolean;
};

/**
 * Placeholder slot IDs. Replace these with real values from your AdSense
 * account before going live. Leaving them as-is means no ads will serve.
 */
export const AD_UNIT_SLOTS: Record<string, string> = {
  HOMEPAGE_ABOVE_FOLD: "",
  HOMEPAGE_MID: "",
  HOMEPAGE_BELOW_FOLD: "",
  ABOVE_ABOUT: "",
  BELOW_ABOUT: "",
  FAQ_MID: "",
  FEES_MID: "",
  CONTACT_MID: "",
  PRIVACY_MID: "",
  RISK_MID: "",
  TERMS_MID: "",
  LEARN_HUB_MID: "",
  ARTICLE_MID: "",
  ARTICLE_END: "",
};

/** Responsive dimensions for common placements. */
export const AD_SIZES: Record<string, AdSize> = {
  leaderboard: {
    default: { w: 320, h: 100 },
    md: { w: 728, h: 90 },
    lg: { w: 970, h: 250 },
  },
  mediumRectangle: {
    default: { w: 300, h: 250 },
    md: { w: 336, h: 280 },
    lg: { w: 336, h: 280 },
  },
  largeRectangle: {
    default: { w: 300, h: 250 },
    md: { w: 600, h: 300 },
    lg: { w: 728, h: 90 },
  },
};

/** Canonical set of ad units keyed by placement id. */
export const AD_UNITS: Record<string, AdUnit> = {
  HOMEPAGE_ABOVE_FOLD: {
    id: "HOMEPAGE_ABOVE_FOLD",
    slot: AD_UNIT_SLOTS.HOMEPAGE_ABOVE_FOLD,
    sizes: AD_SIZES.leaderboard,
    responsive: true,
  },
  HOMEPAGE_MID: {
    id: "HOMEPAGE_MID",
    slot: AD_UNIT_SLOTS.HOMEPAGE_MID,
    sizes: AD_SIZES.mediumRectangle,
    responsive: true,
  },
  HOMEPAGE_BELOW_FOLD: {
    id: "HOMEPAGE_BELOW_FOLD",
    slot: AD_UNIT_SLOTS.HOMEPAGE_BELOW_FOLD,
    sizes: AD_SIZES.leaderboard,
    responsive: true,
  },
  ABOVE_ABOUT: {
    id: "ABOVE_ABOUT",
    slot: AD_UNIT_SLOTS.ABOVE_ABOUT,
    sizes: AD_SIZES.mediumRectangle,
  },
  BELOW_ABOUT: {
    id: "BELOW_ABOUT",
    slot: AD_UNIT_SLOTS.BELOW_ABOUT,
    sizes: AD_SIZES.leaderboard,
  },
  FAQ_MID: {
    id: "FAQ_MID",
    slot: AD_UNIT_SLOTS.FAQ_MID,
    sizes: AD_SIZES.mediumRectangle,
  },
  FEES_MID: {
    id: "FEES_MID",
    slot: AD_UNIT_SLOTS.FEES_MID,
    sizes: AD_SIZES.mediumRectangle,
  },
  CONTACT_MID: {
    id: "CONTACT_MID",
    slot: AD_UNIT_SLOTS.CONTACT_MID,
    sizes: AD_SIZES.mediumRectangle,
  },
  PRIVACY_MID: {
    id: "PRIVACY_MID",
    slot: AD_UNIT_SLOTS.PRIVACY_MID,
    sizes: AD_SIZES.mediumRectangle,
  },
  RISK_MID: {
    id: "RISK_MID",
    slot: AD_UNIT_SLOTS.RISK_MID,
    sizes: AD_SIZES.mediumRectangle,
  },
  TERMS_MID: {
    id: "TERMS_MID",
    slot: AD_UNIT_SLOTS.TERMS_MID,
    sizes: AD_SIZES.mediumRectangle,
  },
  LEARN_HUB_MID: {
    id: "LEARN_HUB_MID",
    slot: AD_UNIT_SLOTS.LEARN_HUB_MID,
    sizes: AD_SIZES.mediumRectangle,
  },
  ARTICLE_MID: {
    id: "ARTICLE_MID",
    slot: AD_UNIT_SLOTS.ARTICLE_MID,
    sizes: AD_SIZES.mediumRectangle,
  },
  ARTICLE_END: {
    id: "ARTICLE_END",
    slot: AD_UNIT_SLOTS.ARTICLE_END,
    sizes: AD_SIZES.leaderboard,
  },
};

/** The AdSense publisher ID (preserved from existing config). */
export const ADSENSE_PUBLISHER_ID = ADSENSE_CLIENT_ID;

/**
 * Returns the ad unit for a placement, or undefined if not configured.
 */
export function getAdUnit(placementId: string): AdUnit | undefined {
  return AD_UNITS[placementId];
}