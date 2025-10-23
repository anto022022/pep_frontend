import { NextRequest, NextResponse } from "next/server";

export function handleStaticPagesAssets(
  request: NextRequest
): NextResponse | undefined {
  const pathname = request.nextUrl.pathname;
  const pathParts = pathname.split("/");
  const locale = pathParts[1] || "";
  const pathWithoutLocale = `/${pathParts.slice(2).join("/")}`;

  if (pathWithoutLocale === "/s/pricing") {
    return NextResponse.redirect(new URL(`/${locale}/pricing`, request.url));
  }

  // Match HTML page without extension: /xx/prepagora/page -> /prepagora/page.html
  const htmlMatch = pathname.match(/^\/([a-z]{2})\/prepagora\/([^/]+)$/);
  if (htmlMatch) {
    const page = htmlMatch[2];
    return NextResponse.rewrite(
      new URL(`/prepagora/${page}.html`, request.url)
    );
  }

  // Match CSS, JS, images under /prepagora
  const assetMatch = pathname.match(
    /^\/([a-z]{2})\/prepagora\/(.+\.(css|js|png|jpg|jpeg|gif|svg|webp|ico))$/
  );
  if (assetMatch) {
    return NextResponse.rewrite(
      new URL(`/prepagora/${assetMatch[2]}`, request.url)
    );
  }

  return undefined;
}
