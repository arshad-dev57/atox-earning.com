"use client";

import { ADS_ENABLED, ADSTERRA_SMARTLINK_URL } from "@/lib/ads";
import { isAdSenseAllowedRoute, getCurrentPath } from "@/lib/ads-routes";
import { useEffect, useState } from "react";

/**
 * Keeps Adsterra smartlink available in the DOM for crawlers/bots
 * and as a fallback clickable surface when ads are enabled.
 * Only loads on allowed routes to comply with ad policies.
 */
export default function AdsterraSmartlink() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const checkRoute = () => {
      const path = getCurrentPath();
      setShouldRender(ADS_ENABLED && isAdSenseAllowedRoute(path));
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

  if (!shouldRender) {
    return null;
  }

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
