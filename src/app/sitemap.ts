import type { MetadataRoute } from "next";
import { BRAND } from "@/config/brand";

// Every indexable page (same list as the navigation and footer). The owner deploy page stays out.
export const ROUTES = ["", "/coven", "/pfp", "/token", "/docs", "/terms", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((r) => ({ url: `${BRAND.url}${r}`, lastModified: now, changeFrequency: r === "" ? "daily" : "weekly", priority: r === "" ? 1 : 0.6 }));
}
