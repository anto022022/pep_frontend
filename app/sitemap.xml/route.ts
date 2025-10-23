import { NextResponse } from "next/server";
import { generateSitemaps as generateProductSitemaps } from "@/app/(sitemaps)/sitemap-product/sitemap"; // adjust path if needed

const BASE = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://sandbox.pepagora.org"
).replace(/\/$/, "");

export async function GET() {
  try {
    let productSitemapIds = [{ id: 1 }];
    try {
      productSitemapIds = await generateProductSitemaps();
    } catch (err) {
      console.warn(
        "[sitemap.index] product sitemap generation failed, falling back to 1 page",
        err
      );
      productSitemapIds = [{ id: 1 }];
    }

    const files = [
      `${BASE}/sitemap-static/sitemap.xml`,
      `${BASE}/sitemap-category/sitemap.xml`,
      `${BASE}/sitemap-subcategory/sitemap.xml`,
      `${BASE}/sitemap-product-category/sitemap.xml`,
    ];

    for (const item of productSitemapIds) {
      const id = item?.id ?? item;
      files.push(`${BASE}/sitemap-product/sitemap/${id}.xml`);
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${files
  .map(
    (f) => `  <sitemap>
    <loc>${f}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
  )
  .join("\n")}
</sitemapindex>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=0, s-maxage=3600",
      },
    });
  } catch (err) {
    console.error("[sitemap.index] error", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
export const revalidate = 86400; // seconds (here = 1 day)
