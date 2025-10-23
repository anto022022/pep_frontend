import { LOCALES } from "@/app/[locale]/_utility/sitemap";
import type { MetadataRoute } from "next";

// const BASE = "localhost:3000";
const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://sandbox.pepagora.org";
const DEFAULT_LOCALE = "en";
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL_AG ?? "https://api.sandbox.pepagora.org";
// const bucket =
//   process.env.NEXT_PUBLIC_BUCKET_URL ??
//   "https://pepupload.s3.ap-southeast-1.amazonaws.com";
const FALLBACK_LOCALES =
  LOCALES && LOCALES.length ? LOCALES : ["en", "ar", "hi", "ta"];

function buildAlternatesObject(path: string, alternatesFromApi?: any) {
  if (alternatesFromApi && typeof alternatesFromApi === "object") {
    if (
      alternatesFromApi.languages &&
      typeof alternatesFromApi.languages === "object"
    ) {
      return alternatesFromApi.languages;
    }
    return alternatesFromApi;
  }

  return Object.fromEntries(
    FALLBACK_LOCALES.map((l) => [l, `${BASE}/${l}${path}`])
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const url = `${API_BASE}get-product-category-sitemap-data`;
    const resp = await fetch(url, {
      headers: { "Content-Type": "application/json" },
    });
    if (!resp.ok) {
      return fallback();
    }

    const json = await resp.json().catch(() => null);
    if (!json) {
      console.warn("[sitemap/subcategories] invalid JSON");
      return fallback();
    }

    const raw =
      (Array.isArray(json?.data) && json.data) ||
      (Array.isArray(json) && json) ||
      (Array.isArray(json?.subCategories) && json.subCategories) ||
      (Array.isArray(json?.subCategoriesResult) && json.subCategoriesResult) ||
      [];

    if (!raw.length) return fallback();

    const entries: MetadataRoute.Sitemap = raw
      .filter((c: any) => !!c?.liveUrl)
      .map((c: any) => {
        const path = `/pc/${c.liveUrl}`;
        const canonical = `${BASE}/${DEFAULT_LOCALE}${path}`;

        const alternatesObj = buildAlternatesObject(
          path,
          c.alternates ?? c.alternateUrls ?? c.localization
        );

        // const imageUrl = `${bucket}/${c.image}`;
        // const images = imageUrl ? [imageUrl] : undefined;

        return {
          url: canonical,
          lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
          alternates: { languages: alternatesObj },
          //   images,
        } as MetadataRoute.Sitemap[number];
      });

    if (!entries.length) return fallback();
    return entries;
  } catch (err) {
    console.error("[sitemap/subcategories] error", err);
    return fallback();
  }
}

function fallback(): MetadataRoute.Sitemap {
  const langs = Object.fromEntries(
    FALLBACK_LOCALES.map((l) => [l, `${BASE}/${l}/`])
  );
  return [
    {
      url: `${BASE}/${DEFAULT_LOCALE}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
      alternates: { languages: langs },
    } as MetadataRoute.Sitemap[number],
  ];
}
export const revalidate = 604800;
