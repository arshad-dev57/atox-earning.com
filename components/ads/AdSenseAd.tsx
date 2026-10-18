"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ADSENSE_CLIENT_ID } from "@/lib/ads";
import { getAdUnit } from "@/lib/ad-units";
import { isAdEligiblePath } from "@/lib/ad-eligibility";

/**
 * Props for AdSenseAd.
 */
export type AdSenseAdProps = {
  /** Placement ID matching a key in lib/ad-units.ts AD_UNITS. */
  placementId: string;
  /** ARIA label announced to assistive technologies. */
  "aria-label"?: string;
  /** Extra CSS classes applied to the outer wrapper. */
  className?: string;
  /** Children rendered when no ad is available (fallback). Defaults to nothing. */
  fallback?: ReactNode;
};

/**
 * A single responsive Google AdSense ad unit.
 *
 * Behavior:
 * - Renders nothing on ineligible routes (no container, no network request).
 * - Relies on the adsbygoogle.js script loaded once per page by
 *   components/SiteAds.tsx (route-aware, eligible pages only).
 * - Renders an <ins className="adsbygoogle"> element with data-ad-client
 *   and data-ad-slot from the configured unit.
 * - Responsive dimensions use the largest configured breakpoint as the base
 *   width; the container caps at 100% width so it shrinks on smaller screens,
 *   and AdSense responsive format (data-ad-format=auto) selects the best size.
 * - When no ad is available, AdSense collapses the <ins> to 0 height and the
 *   wrapper overflow:hidden prevents reserved blank space. An optional
 *   fallback can be rendered instead.
 * - The (adsbygoogle = window.adsbygoogle || []).push({}) call renders the
 *   unit after mount; it is safe to call before the script has loaded because
 *   the call is queued and processed when the script becomes ready.
 */
export default function AdSenseAd({
  placementId,
  "aria-label": ariaLabel = "Advertisement",
  className,
  fallback,
}: AdSenseAdProps) {
  const unit = getAdUnit(placementId);
  const containerRef = useRef<HTMLDivElement>(null);

  const eligible =
    typeof window !== "undefined" &&
    isAdEligiblePath(window.location.pathname) &&
    !!unit;

  // Base width uses the largest configured breakpoint; the wrapper caps it
  // at 100% so smaller screens scale down naturally.
  const width = unit?.sizes.lg?.w ?? unit?.sizes.md?.w ?? unit?.sizes.default.w ?? 300;
  const height = unit?.sizes.lg?.h ?? unit?.sizes.md?.h ?? unit?.sizes.default.h ?? 250;

  useEffect(() => {
    if (!eligible || !containerRef.current) return;
    const container = containerRef.current;
    if (container.dataset.adInitialized === "true") return;
    container.dataset.adInitialized = "true";

    const ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.style.display = "block";
    ins.style.width = `${width}px`;
    ins.style.height = `${height}px`;
    ins.style.margin = "0 auto";
    ins.setAttribute("data-ad-client", ADSENSE_CLIENT_ID);
    ins.setAttribute("data-ad-slot", unit!.slot);
    if (unit?.responsive) {
      ins.setAttribute("data-ad-format", "auto");
      ins.setAttribute("data-full-width-responsive", "true");
    }

    container.appendChild(ins);

    // Queue the render. Safe to call before the script loads; it is processed
    // when adsbygoogle.js becomes ready.
    const w = window as unknown as Record<string, unknown>;
    const queue = (w.adsbygoogle = w.adsbygoogle || []) as unknown[];
    queue.push({});

    return () => {
      ins.remove();
    };
  }, [eligible, unit, width, height]);

  if (!eligible) return null;

  const showFallback = !!fallback;

  return (
    <div
      ref={containerRef}
      aria-label={ariaLabel}
      className={`my-8 flex flex-col items-center overflow-hidden ${className ?? ""}`}
    >
      {!showFallback && (
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          Advertisement
        </p>
      )}
      <div
        className="w-full max-w-[970px]"
        style={{ minHeight: showFallback ? "auto" : 0 }}
      />
      {showFallback && fallback}
    </div>
  );
}

/**
 * Explicit, self-documenting wrapper around AdSenseAd.
 *
 * Use AdPlacement when you want to make eligibility intent obvious at the
 * call site. It guarantees ineligible screens stay ad-free at the
 * rendering level (no container, no request).
 */
export function AdPlacement({
  placementId,
  "aria-label": ariaLabel,
  className,
  fallback,
}: AdSenseAdProps) {
  return (
    <AdSenseAd
      placementId={placementId}
      aria-label={ariaLabel}
      className={className}
      fallback={fallback}
    />
  );
}