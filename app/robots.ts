import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Public content pages are open to all crawlers.
 * Private application surfaces (auth, dashboard, admin, transactional,
 * Watch and Earn, plan flows and API routes) are disallowed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/dashboard",
          "/api/",
          "/free-mode",
          "/plan/",
          "/login",
          "/register",
          "/forgot-password",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}