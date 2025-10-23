import type { MetadataRoute } from "next";
import { LOCALES } from "@/app/[locale]/_utility/sitemap";

const BASE = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://sandbox.pepagora.org"
).replace(/\/$/, "");
const DEFAULT_LOCALE = "en";
const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL_AG ?? "https://api.sandbox.pepagora.org"
).replace(/\/$/, "");
const FALLBACK_LOCALES =
  LOCALES && LOCALES.length ? LOCALES : ["en", "ar", "hi", "ta"];

function toAlternatesObject(obj: any, canonical: string) {
  if (!obj) {
    return Object.fromEntries(
      FALLBACK_LOCALES.map((l) => [
        l,
        `${BASE}/${l}${canonical.replace(`${BASE}/${DEFAULT_LOCALE}`, "")}`,
      ])
    );
  }
  if (obj.languages && typeof obj.languages === "object") return obj.languages;
  if (typeof obj === "object") return obj;
  return {};
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const url = `${API_BASE}/get-category-sitemap-data`; // ensure slash
    const resp = await fetch(url, {
      headers: { "Content-Type": "application/json" },
    });

    if (!resp.ok) {
      console.warn("[sitemap/categories] API non-OK", resp.status);
      return fallback();
    }

    const json = await resp.json().catch(() => null);
    if (!json) return fallback();

    const raw =
      (Array.isArray(json?.data) && json.data) ||
      (Array.isArray(json) && json) ||
      (Array.isArray(json?.categories) && json.categories) ||
      [];

    if (!raw.length) return fallback();

    const entries: MetadataRoute.Sitemap = raw
      .filter((c: any) => !!c?.liveUrl)
      .map((c: any) => {
        const path = `/c/${c.liveUrl}`;
        const canonicalPath = `${BASE}/${DEFAULT_LOCALE}${path}`;
        const alternatesObj = toAlternatesObject(
          c.alternates ?? c.alternateUrls ?? null,
          canonicalPath
        );
        return {
          url: canonicalPath,
          lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
          changeFrequency: "weekly",
          priority: 0.9,
          alternates: { languages: alternatesObj },
        } as MetadataRoute.Sitemap[number];
      });

    if (!entries.length) return fallback();

    try {
    } catch {}

    return entries;
  } catch (err) {
    return fallback();
  }
}
