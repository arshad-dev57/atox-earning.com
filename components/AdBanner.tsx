"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ADS_ENABLED } from "@/lib/ads";
import { isAdEligiblePath } from "@/lib/ad-eligibility";

/**
 * In-content Adsterra banner (468×60 iframe unit, key c0886ae1…) for
 * eligible public content pages only.
 *
 * - On ineligible routes it renders nothing at all: no container is
 *   reserved and no ad request is made.
 * - No fixed-height placeholder is kept while loading or when the network
 *   returns no ad, so the box collapses instead of showing blank space.
 * - The unit script is injected once and removed on unmount.
 */
export default function AdBanner() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const eligible = ADS_ENABLED && isAdEligiblePath(pathname);

  useEffect(() => {
    if (!eligible || !containerRef.current) return;
    const container = containerRef.current;
    if (container.dataset.adLoaded === "true") return;
    container.dataset.adLoaded = "true";

    // atOptions must exist before the unit script runs.
    (window as unknown as Record<string, unknown>).atOptions = {
      key: "c0886ae1b3dd9ed31af9c5b36c6abf2f",
      format: "iframe",
      height: 60,
      width: 468,
      params: {},
    };

    const script = document.createElement("script");
    script.async = true;
    script.src =
      "https://www.highperformanceformat.com/c0886ae1b3dd9ed31af9c5b36c6abf2f/invoke.js";
    container.appendChild(script);

    return () => {
      script.remove();
    };
  }, [eligible]);

  if (!eligible) return null;

  return (
    <aside
      aria-label="Advertisement"
      className="my-8 flex flex-col items-center"
    >
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
        Advertisement
      </p>
      <div ref={containerRef} className="flex w-full justify-center" />
    </aside>
  );
}