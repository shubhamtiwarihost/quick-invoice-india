import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/invoice", "/about", "/privacy", "/terms"],
      disallow: [
        "/admin",
        "/pos",
        "/inventory",
        "/customers",
        "/settings",
        "/api/",
      ],
    },
    sitemap: "https://swiftgst.in/sitemap.xml",
  };
}

