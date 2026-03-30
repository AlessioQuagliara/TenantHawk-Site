import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://tenanthawk.alessioquagliara.com/sitemap.xml",
    host: "https://tenanthawk.alessioquagliara.com",
  };
}
