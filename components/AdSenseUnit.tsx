"use client";

import { useEffect, useRef, useState } from "react";
import {
  ADSENSE_CLIENT_ID,
  ADSENSE_FEED_LAYOUT_KEY,
  ADSENSE_SLOTS,
} from "@/lib/ads";
import { isAdSenseAllowedRoute, getCurrentPath } from "@/lib/ads-routes";

export type AdSenseVariant = "display" | "feed" | "article" | "multiplex";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const UNIT = {
  display: {
    slot: ADSENSE_SLOTS.display,
    style: { display: "block" } as const,
    format: "auto",
    fullWidthResponsive: true,
  },
  feed: {
    slot: ADSENSE_SLOTS.feed,
    style: { display: "block" } as const,
    format: "fluid",
    layoutKey: ADSENSE_FEED_LAYOUT_KEY,
  },
  article: {
    slot: ADSENSE_SLOTS.article,
    style: { display: "block", textAlign: "center" } as const,
    format: "fluid",
    layout: "in-article",
  },
  multiplex: {
    slot: ADSENSE_SLOTS.multiplex,
    style: { display: "block" } as const,
    format: "autorelaxed",
  },
} as const;

export default function AdSenseUnit({
  variant,
  className = "",
}: {
  variant: AdSenseVariant;
  className?: string;
}) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const cfg = UNIT[variant];
  const [shouldRender, setShouldRender] = useState(false);

  // Check if current route allows ads
  useEffect(() => {
    const checkRoute = () => {
      const path = getCurrentPath();
      setShouldRender(isAdSenseAllowedRoute(path));
    };

    // Initial check
    checkRoute();

    // Listen for route changes
    const handleRouteChange = () => {
      checkRoute();
    };

    window.addEventListener("popstate", handleRouteChange);
    
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      handleRouteChange();
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      handleRouteChange();
    };

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  useEffect(() => {
    const ins = insRef.current;
    if (!ins || pushed.current) return;
    if (ins.getAttribute("data-adsbygoogle-status")) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // Ignore duplicate fill errors on remount
    }
  }, []);

  if (!shouldRender) {
    return null;
  }

  return (
    <aside
      className={`w-full overflow-hidden ${className}`}
      aria-label="Advertisement"
    >
      <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 text-center font-semibold">
        Advertisement
      </p>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={cfg.style}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={cfg.slot}
        data-ad-format={"format" in cfg ? cfg.format : undefined}
        data-ad-layout={"layout" in cfg ? cfg.layout : undefined}
        data-ad-layout-key={"layoutKey" in cfg ? cfg.layoutKey : undefined}
        data-full-width-responsive={
          "fullWidthResponsive" in cfg && cfg.fullWidthResponsive
            ? "true"
            : undefined
        }
      />
    </aside>
  );
}
