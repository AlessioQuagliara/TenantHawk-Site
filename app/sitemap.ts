import type { MetadataRoute } from "next";
import { LOCALES } from "@/app/lib/i18n";

const BASE_URL = "https://tenanthawk.alessioquagliara.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/changelog", changeFrequency: "daily", priority: 0.8 },
    { path: "/docs", changeFrequency: "weekly", priority: 0.88 },
    { path: "/features", changeFrequency: "weekly", priority: 0.9 },
    { path: "/use-cases", changeFrequency: "weekly", priority: 0.87 },
    { path: "/architecture", changeFrequency: "weekly", priority: 0.92 },
    { path: "/why", changeFrequency: "weekly", priority: 0.84 },
  ] as const;

  return routes.flatMap((route) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}${route.path}?lang=${locale}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }))
  );
}
