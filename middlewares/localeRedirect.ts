import { routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

export function handleLocaleRedirect(
  request: NextRequest
): NextResponse | undefined {
  const { locales, defaultLocale } = routing;
  const pathname = request.nextUrl.pathname;

  if (
    pathname === "/robots.txt" ||
    pathname === "/llms.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/sitemap-static/") ||
    pathname.startsWith("/sitemap-category/") ||
    pathname.startsWith("/sitemap-subcategory/") ||
    pathname.startsWith("/sitemap-product-category/") ||
    pathname.startsWith("/sitemap-product/")
  ) {
    return NextResponse.next();
  }
  const hasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!hasLocale) {
    const locale =
      request.cookies.get("NEXT_LOCALE")?.value ??
      defaultLocale ??
      locales?.[0] ??
      "en";
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  return undefined;
}
