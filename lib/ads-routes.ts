/**
 * AdSense Route Allowlist Configuration
 * 
 * This file defines which routes are allowed to display Google AdSense ads.
 * AdSense will only load on routes that are explicitly allowed in this list.
 * 
 * Policy: Google AdSense requires ads to only appear on pages with substantial,
 * meaningful publisher content. Ads must NOT appear on:
 * - Authentication pages (login, register, forgot-password)
 * - Private/authenticated areas (dashboard, admin, profile, settings)
 * - Transaction/payment pages (deposit, withdraw)
 * - Navigation-only or alert screens
 * - Loading states or error pages
 * - Pages with low-value or thin content
 */

/**
 * Routes where AdSense ads are ALLOWED
 * These are public-facing pages with substantial, meaningful content
 * STRICT LIMIT: Only routes with genuine public content should be here
 */
export const ADSENSE_ALLOWED_ROUTES = [
  "/", // Home page with marketing content
  "/about", // About page with company information
  "/faq", // FAQ page with substantial content
  "/contact", // Contact page
] as const;

/**
 * Routes where AdSense ads are BLOCKED
 * These are functional/private pages that violate AdSense policy
 * Default-deny approach: any route not in ALLOWED_ROUTES is blocked
 */
export const ADSENSE_BLOCKED_ROUTES = [
  "/login",
  "/register", 
  "/forgot-password",
  "/change-password",
  "/dashboard",
  "/admin",
  "/free-mode",
  "/plan/[productId]",
  "/privacy",
  "/terms",
] as const;

/**
 * Check if a given route path is allowed to show AdSense ads
 * @param path - The current route path (e.g., "/", "/about", "/dashboard")
 * @returns true if ads are allowed on this route, false otherwise
 */
export function isAdSenseAllowedRoute(path: string): boolean {
  // Normalize the path to handle trailing slashes
  const normalizedPath = path.replace(/\/$/, "") || "/";
  
  // Check exact matches in allowed routes
  if (ADSENSE_ALLOWED_ROUTES.includes(normalizedPath as typeof ADSENSE_ALLOWED_ROUTES[number])) {
    return true;
  }
  
  // Check if it's a dynamic route that should be blocked
  for (const blockedRoute of ADSENSE_BLOCKED_ROUTES) {
    if (blockedRoute.includes("[")) {
      // Handle dynamic routes like "/plan/[productId]"
      const routePattern = blockedRoute.replace(/\[.*?\]/g, "[^/]+");
      const regex = new RegExp(`^${routePattern}$`);
      if (regex.test(normalizedPath)) {
        return false;
      }
    } else if (normalizedPath === blockedRoute) {
      return false;
    }
  }
  
  // Default: block ads on any route not explicitly allowed
  return false;
}

/**
 * Get the current route path from the browser
 * @returns The current path or "/" if not available
 */
export function getCurrentPath(): string {
  if (typeof window === "undefined") return "/";
  return window.location.pathname;
}