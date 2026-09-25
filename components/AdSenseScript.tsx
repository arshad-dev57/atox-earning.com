"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { ADS_ENABLED, ADSENSE_CLIENT_ID } from "@/lib/ads";
import { isAdSenseAllowedRoute, getCurrentPath } from "@/lib/ads-routes";

/**
 * AdSense Script Component
 * 
 * This component conditionally loads the Google AdSense script only on allowed routes.
 * It prevents AdSense from loading on authentication, dashboard, and other functional pages
 * that would violate Google's "ads on screens without publisher-content" policy.
 */
export default function AdSenseScript() {
  const [shouldLoadAds, setShouldLoadAds] = useState(false);

  useEffect(() => {
    // Check if ads should be loaded on the current path
    const checkAdsAllowed = () => {
      const path = getCurrentPath();
      setShouldLoadAds(ADS_ENABLED && isAdSenseAllowedRoute(path));
    };

    // Initial check
    checkAdsAllowed();

    // Listen for route changes
    const handleRouteChange = () => {
      checkAdsAllowed();
    };

    // Listen for popstate events (back/forward navigation)
    window.addEventListener("popstate", handleRouteChange);
    
    // Also listen for pushState/replaceState (SPA navigation)
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

  if (!shouldLoadAds) {
    return null;
  }

  return (
    <>
      {/* Google AdSense — must be in <head> for site-ready checks */}
      <Script
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </>
  );
}