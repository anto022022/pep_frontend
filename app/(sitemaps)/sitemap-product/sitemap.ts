import type { MetadataRoute } from "next";

const BASE = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://sandbox.pepagora.org"
).replace(/\/$/, "");
const DEFAULT_LOCALE = "en";
const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL_AG ?? "https://api.sandbox.pepagora.org"
).replace(/\/$/, "");
const LOCALES = ["en", "ar", "hi", "ta"];

const PAGE_SIZE = (() => {
  const v = process.env.NEXT_PUBLIC_PRODUCT_SITEMAP_LIMIT;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 40000;
})();

const bucket = (
  process.env.NEXT_PUBLIC_BUCKET_URL ??
  "https://pepupload.s3.ap-southeast-1.amazonaws.com"
).replace(/\/$/, "");

function safeUrl(u: string) {
  try {
    const parsed = new URL(u);
    parsed.pathname = parsed.pathname
      .split("/")
      .map((seg) => (seg ? encodeURIComponent(decodeURIComponent(seg)) : ""))
      .join("/");
    return parsed.toString();
  } catch {
    return encodeURI(u);
  }
}

function encodeSlugSegment(segment: string) {
  return encodeURIComponent(String(segment)).replace(/%2F/g, "/");
}

function buildAlternates(path: string, alternatesFromApi?: any) {
  if (alternatesFromApi && typeof alternatesFromApi === "object") {
    if (
      alternatesFromApi.languages &&
      typeof alternatesFromApi.languages === "object"
    ) {
      // ensure each URL is safe
      const obj: Record<string, string> = {};
      for (const [k, v] of Object.entries(alternatesFromApi.languages)) {
        if (typeof v === "string") obj[k] = safeUrl(v);
      }
      return obj;
    }
    const obj: Record<string, string> = {};
    for (const [k, v] of Object.entries(alternatesFromApi)) {
      if (typeof v === "string") obj[k] = safeUrl(v);
    }
    if (Object.keys(obj).length) return obj;
  }
  return Object.fromEntries(
    LOCALES.map((l) => [l, safeUrl(`${BASE}/${l}${path}`)])
  );
}

export async function generateSitemaps() {
  try {
    const countResp = await fetch(`${API_BASE}/get-products-count`);
    if (!countResp.ok) {
      console.warn("[sitemaps/products] count API non-OK", countResp.status);
      return [{ id: 1 }];
    }

    const json = await countResp.json().catch(() => null);
    if (!json) return [{ id: 1 }];
    const total = json?.data ?? 0;

    const t = Number(total) || 0;
    const pages = Math.max(1, Math.ceil(t / PAGE_SIZE));
    return Array.from({ length: pages }, (_, i) => ({ id: i + 1 }));
  } catch (err) {
    console.error("[sitemaps/products] generateSitemaps error", err);
    return [{ id: 1 }];
  }
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const offset = (id - 1) * PAGE_SIZE;
  const url = `${API_BASE}/get-product-sitemap-data?skip=${offset}&limit=${PAGE_SIZE}`;
  try {
    const resp = await fetch(url, {
      headers: { "Content-Type": "application/json" },
    });

    if (!resp.ok) {
      console.warn("[sitemaps/products] API non-OK", resp.status);
      return [];
    }

    const json = await resp.json().catch(() => null);
    const raw =
      (Array.isArray(json?.data) && json.data) ||
      (Array.isArray(json) && json) ||
      (Array.isArray(json?.products) && json.products) ||
      [];

    if (!Array.isArray(raw) || raw.length === 0) return [];

    const entries: MetadataRoute.Sitemap = raw
      .filter((p: any) => !!p?.liveUrl)
      .map((p: any) => {
        const slug = encodeSlugSegment(String(p.liveUrl));
        const path = `/p/${slug}`;
        const canonical = `${BASE}/${DEFAULT_LOCALE}${path}`;
        const alternatesObj = buildAlternates(
          path,
          p.alternates ?? p.alternateUrls ?? null
        );
        const rawImage =
          p.image ??
          p.thumbnail ??
          (Array.isArray(p.images) && p.images[0]) ??
          "";
        const imageUrl = rawImage
          ? safeUrl(`${bucket}/${String(rawImage).replace(/^\/+/, "")}`)
          : undefined;

        return {
          url: safeUrl(canonical),
          lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
          changeFrequency: "daily",
          priority: 0.7,
          alternates: { languages: alternatesObj },
          images: imageUrl ? [imageUrl] : undefined,
        } as MetadataRoute.Sitemap[number];
      });

    return entries;
  } catch (err) {
    console.error("[sitemaps/products] sitemap page error", err);
    return [];
  }
}
export const revalidate = 604800;
