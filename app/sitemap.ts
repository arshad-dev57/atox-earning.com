import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Public, indexable content routes only. Private application routes
 * (auth, dashboard, admin, transactions) are intentionally excluded.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const publicRoutes: Array<{
    path: string;
    priority: number;
    changeFrequency: "weekly" | "monthly" | "yearly";
  }> = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" },
    { path: "/fees", priority: 0.9, changeFrequency: "weekly" },
    { path: "/faq", priority: 0.8, changeFrequency: "weekly" },
    { path: "/learn", priority: 0.8, changeFrequency: "monthly" },
    { path: "/learn/investment-basics", priority: 0.7, changeFrequency: "monthly" },
    { path: "/learn/understanding-risk", priority: 0.7, changeFrequency: "monthly" },
    { path: "/learn/avoiding-scams", priority: 0.7, changeFrequency: "monthly" },
    { path: "/risk-disclosure", priority: 0.7, changeFrequency: "monthly" },
    { path: "/terms", priority: 0.5, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.5, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  ];

  return publicRoutes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}