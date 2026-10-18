/**
 * Centralized ad-eligibility rules (allowlist).
 *
 * Advertising code (Google AdSense + Adsterra network units) may only be
 * initialized on routes whose primary purpose is public publisher content.
 * Authentication screens, dashboards, admin, transactional flows, loading
 * screens, redirect stubs, API routes and error pages are always ineligible —
 * on those routes no ad script is ever requested at the network level.
 *
 * Anything not explicitly listed here (including 404s, query variants and
 * any future unfinished page) is ineligible by default.
 */

/** Exact public routes where ads may appear. */
const EXACT_PUBLIC_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/faq",
  "/fees",
  "/privacy",
  "/risk-disclosure",
  "/terms",
];

/** Public route prefixes where ads may appear (section hubs + articles). */
const PUBLIC_ROUTE_PREFIXES = ["/learn"];

/** Normalize a pathname: strip query/hash and trailing slashes. */
function normalizePath(pathname: string): string {
  const clean = pathname.split(/[?#]/)[0].replace(/\/+$/, "");
  return clean === "" ? "/" : clean;
}

/**
 * Returns true only for routes on the public-content allowlist.
 * Ineligible routes must never initialize or request advertisements.
 */
export function isAdEligiblePath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  const path = normalizePath(pathname);
  if (EXACT_PUBLIC_ROUTES.includes(path)) return true;
  return PUBLIC_ROUTE_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );
}