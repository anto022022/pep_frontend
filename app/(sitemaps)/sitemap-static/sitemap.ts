import type { MetadataRoute } from "next";

const BASE = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://sandbox.pepagora.org"
).replace(/\/$/, "");

const staticPages = [
  { path: "/", priority: 1.0, changeFrequency: "daily" as const },
  { path: "/about-us", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/contact-us", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/en/pricing", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/ar/pricing", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/hi/pricing", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/ta/pricing", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/trust", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/impact", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/leadership", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/partnership", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/legal", priority: 0.4, changeFrequency: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = staticPages.map((page) => {
    const url = `${BASE}${page.path === "/" ? "" : page.path}`;

    return {
      url,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    };
  });

  return entries;
}

// import type { MetadataRoute } from "next";

// const BASE = (
//   process.env.NEXT_PUBLIC_SITE_URL || "https://sandbox.pepagora.org"
// ).replace(/\/$/, "");
// const DEFAULT_LOCALE = "en";
// const LOCALES = ["en", "ar", "hi", "ta"];

// const staticPages = [
//   { path: "/", priority: 1.0, changeFrequency: "daily" as const },
//   { path: "/about-us", priority: 0.8, changeFrequency: "monthly" as const },
//   { path: "/contact-us", priority: 0.7, changeFrequency: "monthly" as const },
//   { path: "/pricing", priority: 0.8, changeFrequency: "weekly" as const },
//   { path: "/trust", priority: 0.6, changeFrequency: "monthly" as const },
//   { path: "/impact", priority: 0.6, changeFrequency: "monthly" as const },
//   { path: "/leadership", priority: 0.5, changeFrequency: "monthly" as const },
//   { path: "/partnership", priority: 0.7, changeFrequency: "monthly" as const },
//   { path: "/legal", priority: 0.4, changeFrequency: "yearly" as const },
// ];

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   const entries: MetadataRoute.Sitemap = staticPages.flatMap((page) => {
//     const canonical = `${BASE}/${DEFAULT_LOCALE}${
//       page.path === "/" ? "" : page.path
//     }`;

//     const languages = Object.fromEntries(
//       LOCALES.map((l) => [
//         l,
//         `${BASE}/${l}${page.path === "/" ? "" : page.path}`,
//       ])
//     );

//     return [
//       {
//         url: canonical,
//         lastModified: new Date(),
//         changeFrequency: page.changeFrequency,
//         priority: page.priority,
//         alternates: { languages },
//       } as MetadataRoute.Sitemap[number],
//     ];
//   });

//   return entries;
// }
