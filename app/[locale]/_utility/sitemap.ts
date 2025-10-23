// === File: app/[locale]/_utility/sitemap.ts ===
// Standardized sitemap generator + renderers for multilingual site

export type Locale = "en" | "ar" | "hi" | "ta";
export const LOCALES: Locale[] = ["en", "ar", "hi", "ta"];

export interface SitemapEntry {
  url: string; // canonical url (usually default locale)
  lastModified?: Date | string;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number; // 0.0 - 1.0
  alternates?: { href: string; hreflang: string }[]; // hreflang grouped alternates
}

export interface CategoryData {
  uniqueId: string;
  name: string;
  liveUrl: string; // slug
  updatedAt?: string;
}
export interface SubCategoryData {
  uniqueId: string;
  name: string;
  liveUrl: string;
  parentCategoryId: string;
  updatedAt?: string;
}
export interface ProductData {
  uniqueId: string;
  name: string;
  liveUrl: string; // slug
  categoryId: string;
  subCategoryId?: string;
  updatedAt?: string;
  published?: boolean;
}

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://sandbox.pepagora.org"
).replace(/\/$/, "");
const DEFAULT_LOCALE: Locale = "en";

function normalizePath(path: string) {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

function buildLocaleUrl(locale: string | null, path: string) {
  const p = normalizePath(path);
  if (!locale) return `${BASE_URL}${p}`; // no-locale canonical
  return `${BASE_URL}/${locale}${p}`;
}

// Helpers to create an entry that groups all locale alternates
function makeStaticEntry(
  path: string,
  opts: {
    lastModified?: Date | string;
    changefreq?: SitemapEntry["changeFrequency"];
    priority?: number;
  }
): SitemapEntry {
  const alternates = LOCALES.map((l) => ({
    hreflang: l,
    href: buildLocaleUrl(l, path),
  }));
  const canonical = buildLocaleUrl(DEFAULT_LOCALE, path);
  return {
    url: canonical,
    lastModified: opts.lastModified,
    changeFrequency: opts.changefreq,
    priority: opts.priority,
    alternates,
  };
}

function makeCategoryEntry(category: CategoryData): SitemapEntry | null {
  if (!category || !category.liveUrl) return null;
  const path = `/c/${category.liveUrl}`;
  const alternates = LOCALES.map((l) => ({
    hreflang: l,
    href: buildLocaleUrl(l, path),
  }));
  const canonical = buildLocaleUrl(DEFAULT_LOCALE, path);
  return {
    url: canonical,
    lastModified: category.updatedAt
      ? new Date(category.updatedAt)
      : new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
    alternates,
  };
}

function makeSubCategoryEntry(sub: SubCategoryData): SitemapEntry | null {
  if (!sub || !sub.liveUrl) return null;
  const path = `/s/${sub.liveUrl}`;
  const alternates = LOCALES.map((l) => ({
    hreflang: l,
    href: buildLocaleUrl(l, path),
  }));
  const canonical = buildLocaleUrl(DEFAULT_LOCALE, path);
  return {
    url: canonical,
    lastModified: sub.updatedAt ? new Date(sub.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
    alternates,
  };
}

function makeProductEntry(product: ProductData): SitemapEntry | null {
  if (!product || !product.liveUrl) return null;
  // skip unpublished or removed products
  if (product.published === false) return null;
  const path = `/p/${product.liveUrl}`;
  const alternates = LOCALES.map((l) => ({
    hreflang: l,
    href: buildLocaleUrl(l, path),
  }));
  const canonical = buildLocaleUrl(DEFAULT_LOCALE, path);
  return {
    url: canonical,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: "daily",
    priority: 0.7,
    alternates,
  };
}

export function chunkArray<T>(arr: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// Render a sitemap xml string from entries. Each <url> includes xhtml:link alternates if present.
export function renderSitemapXml(entries: SitemapEntry[]) {
  const urlEntries = entries
    .map((e) => {
      const lastmod = e.lastModified
        ? `<lastmod>${(e.lastModified instanceof Date
            ? e.lastModified
            : new Date(e.lastModified)
          ).toISOString()}</lastmod>`
        : "";
      const changefreq = e.changeFrequency
        ? `<changefreq>${e.changeFrequency}</changefreq>`
        : "";
      const priority =
        typeof e.priority === "number"
          ? `<priority>${e.priority.toFixed(1)}</priority>`
          : "";

      const alternates = (e.alternates || [])
        .map(
          (a) =>
            `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`
        )
        .join("\n");

      return `  <url>\n    <loc>${e.url}</loc>\n${
        alternates ? alternates + "\n" : ""
      }    ${lastmod}\n    ${changefreq}\n    ${priority}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urlEntries}\n</urlset>`;
}

// Render sitemap index
export function renderSitemapIndex(
  files: { loc: string; lastmod?: Date | string }[]
) {
  const entries = files
    .map(
      (f) =>
        `  <sitemap>\n    <loc>${f.loc}</loc>\n${
          f.lastmod
            ? `    <lastmod>${(f.lastmod instanceof Date
                ? f.lastmod
                : new Date(f.lastmod)
              ).toISOString()}</lastmod>\n`
            : ""
        }  </sitemap>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>`;
}

// High level generator functions
export function generateSitemapEntries(
  categories: CategoryData[] = [],
  subCategories: SubCategoryData[] = [],
  products: ProductData[] = [],
  options?: { productLimit?: number }
): SitemapEntry[] {
  const entries: SitemapEntry[] = [];

  // static pages
  const staticPages = [
    { path: "/", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/about-us", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/contact-us", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/pricing", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/trust", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/impact", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/leadership", priority: 0.5, changeFrequency: "monthly" as const },
    {
      path: "/partnership",
      priority: 0.7,
      changeFrequency: "monthly" as const,
    },
    { path: "/legal", priority: 0.4, changeFrequency: "yearly" as const },
  ];

  staticPages.forEach((p) =>
    entries.push(
      makeStaticEntry(p.path, {
        lastModified: new Date(),
        changefreq: p.changeFrequency,
        priority: p.priority,
      })
    )
  );

  categories.forEach((c) => {
    const e = makeCategoryEntry(c);
    if (e) entries.push(e);
  });

  subCategories.forEach((s) => {
    const e = makeSubCategoryEntry(s);
    if (e) entries.push(e);
  });

  // const productLimit = options?.productLimit ?? 10000;
  // products.slice(0, productLimit).forEach((p) => {
  //   const e = makeProductEntry(p);
  //   if (e) entries.push(e);
  // });

  return entries;
}

export function generateLanguageSitemapEntries(
  locale: string,
  categories: CategoryData[] = [],
  subCategories: SubCategoryData[] = [],
  products: ProductData[] = [],
  options?: { productLimit?: number }
) {
  // This returns entries where url is specific to the locale (no alternates), useful for /sitemap-en.xml style files
  const entries: SitemapEntry[] = [];

  const staticPages = [
    { path: "/", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/about-us", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/contact-us", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/pricing", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/trust", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/impact", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/leadership", priority: 0.5, changeFrequency: "monthly" as const },
    {
      path: "/partnership",
      priority: 0.7,
      changeFrequency: "monthly" as const,
    },
    { path: "/legal", priority: 0.4, changeFrequency: "yearly" as const },
  ];

  staticPages.forEach((p) =>
    entries.push({
      url: buildLocaleUrl(locale, p.path),
      lastModified: new Date(),
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    })
  );

  categories.forEach((c) =>
    entries.push({
      url: buildLocaleUrl(locale, `/c/${c.liveUrl}`),
      lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    })
  );

  subCategories.forEach((s) =>
    entries.push({
      url: buildLocaleUrl(locale, `/s/${s.liveUrl}`),
      lastModified: s.updatedAt ? new Date(s.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  const productLimit = options?.productLimit ?? 10000;
  products.slice(0, productLimit).forEach((p) =>
    entries.push({
      url: buildLocaleUrl(locale, `/p/${p.liveUrl}`),
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    })
  );

  return entries;
}

// === End of utility file ===

// === Example route handler that uses the utility ===
// File: app/sitemap.xml/route.ts (replace your existing handler with this)

/*
import { NextResponse } from 'next/server';
import { generateSitemapEntries, renderSitemapXml, renderSitemapIndex, chunkArray, generateLanguageSitemapEntries } from './_utility/sitemap';
import type { CategoryData, SubCategoryData, ProductData } from './_utility/sitemap';

const DOMAIN = BASE_URL; // already in utility

export async function GET() {
  try {
    // fetch data from your sitemap API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL_AG ?? 'https://api.sandbox.pepagora.org'}get-sitemap-data`;
    const r = await fetch(apiUrl, { headers: { 'Content-Type': 'application/json' } });
    if (!r.ok) console.error('sitemap fetch failed', r.status);
    const json = await r.json();

    // Expecting json.categories, json.subCategories, json.products (adjust according to API)
    const categories: CategoryData[] = json.categories ?? [];
    const subCategories: SubCategoryData[] = json.subCategories ?? [];
    const products: ProductData[] = json.products ?? [];

    // Build entries with alternates (grouped per logical page)
    const allEntries = generateSitemapEntries(categories, subCategories, products, { productLimit: 10000 });

    // If site is small you can return a single sitemap
    // For larger site, split products into chunks and expose index - example below returns sitemap index

    // Simple approach: always return sitemap index that references language-specific sitemaps
    const sitemapFiles = [
      { loc: `${DOMAIN}/sitemap.xml` },
    ];

    // Add language specific sitemaps
    for (const locale of LOCALES) {
      sitemapFiles.push({ loc: `${DOMAIN}/sitemap-${locale}.xml`, lastmod: new Date() });
    }

    const xml = renderSitemapIndex(sitemapFiles);

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        // Cache at CDN for 1 day, allow stale-while-revalidate
        'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=3600'
      }
    });
  } catch (err) {
    console.error('Error generating sitemap index', err);
    return new Response('Error generating sitemap', { status: 500 });
  }
}
*/

// === Example dynamic sitemap file handler ===
// File: app/sitemap/[file]/route.ts
/*
import { NextRequest } from 'next/server';
import { renderSitemapXml, chunkArray, generateLanguageSitemapEntries, generateSitemapEntries } from './_utility/sitemap';

export async function GET(req: NextRequest, { params }: { params: { file: string[] } }) {
  try {
    const name = params.file.join('/'); // e.g. sitemap-en.xml or products-1.xml

    // If language sitemap (sitemap-en.xml)
    const m = name.match(/^sitemap-([a-z]{2})\.xml$/i);
    if (m) {
      const locale = m[1];

      // fetch data
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL_AG ?? 'https://api.sandbox.pepagora.org'}get-sitemap-data`;
      const r = await fetch(apiUrl, { headers: { 'Content-Type': 'application/json' } });
      const json = await r.json();
      const categories = json.categories ?? [];
      const subCategories = json.subCategories ?? [];
      const products = json.products ?? [];

      const entries = generateLanguageSitemapEntries(locale, categories, subCategories, products, { productLimit: 40000 });
      const xml = renderSitemapXml(entries);

      return new Response(xml, { headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=3600' } });
    }

    // Fallback: return 404
    return new Response('Not found', { status: 404 });
  } catch (err) {
    console.error('Error generating sitemap file', err);
    return new Response('Error', { status: 500 });
  }
}
*/

// === Notes ===
// - Replace fetch JSON field names if your API returns different keys.
// - For very large product catalogs: instead of fetching all products at once, paginate on the server and generate per-chunk sitemaps (e.g. products-1.xml, products-2.xml).
// - Ensure your middleware excludes /sitemap.xml and /sitemap-* from locale redirects.
// - Update robots.txt to include: "Sitemap: https://yourdomain.com/sitemap.xml"

// === End of file ===
