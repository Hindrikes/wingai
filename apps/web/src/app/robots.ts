import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: ["/", "/login", "/register"], disallow: ["/pipeline", "/analytics", "/settings", "/import", "/conversation", "/onboarding", "/api/"] },
    sitemap: "https://wingai-umber.vercel.app/sitemap.xml",
  };
}
