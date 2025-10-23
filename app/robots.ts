import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const BASE =
    process.env.NEXT_PUBLIC_SITE_URL || "https://sandbox.pepagora.org";

  return {
    rules: [
      {
        userAgent: "*",
        disallow: "/",
      },
    ],
    // sitemap: `${BASE}/sitemap.xml`,
  };
}
