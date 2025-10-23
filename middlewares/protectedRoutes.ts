import { NextRequest, NextResponse } from "next/server";
const protectedRoutes = ["/app", "/authenticate", "/onboard"];

export function handleProtectedRoutes(
  request: NextRequest
): NextResponse | undefined {
  const pathname = request.nextUrl.pathname;
  const pathParts = pathname.split("/");
  const locale = pathParts[1] || "";
  const pathWithoutLocale = `/${pathParts.slice(2).join("/")}`;

  const isProtected = protectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  if (!isProtected) return undefined;

  const onboardSession = request.cookies.get("onboardSession")?.value;
  const userSession = request.cookies.get("userSession")?.value;
  const redirectionCookie = request.cookies.get("redirectTo")?.value;

  //Redirection Cookie
  if (userSession && redirectionCookie) {
    const url = Buffer.from(redirectionCookie, "base64").toString("utf8");
    const target = `/${locale}${url}`;
    const response = NextResponse.redirect(new URL(target, request.url));

    // overwrite cookie to expire immediately
    response.cookies.set({
      name: "redirectTo",
      value: "",
      maxAge: 0,
      path: "/",
    });

    return response;
  }

  // If user has onboardSession and is visiting /onboard, allow
  if (onboardSession && pathWithoutLocale.startsWith("/onboard")) {
    return undefined;
  } else if (onboardSession && !pathWithoutLocale.startsWith("/onboard")) {
    return NextResponse.redirect(new URL(`/${locale}/onboard`, request.url));
  }

  // If user has userSession and is visiting /app, allow
  if (userSession && pathWithoutLocale.startsWith("/app")) {
    return undefined;
  } else if (userSession && !pathWithoutLocale.startsWith("/app")) {
    return NextResponse.redirect(new URL(`/${locale}/app`, request.url));
  }

  // If no sessions and user is visiting /authenticate, allow
  if (
    !userSession &&
    !onboardSession &&
    pathWithoutLocale.startsWith("/authenticate")
  ) {
    return undefined;
  } else if (
    !userSession &&
    !onboardSession &&
    !pathWithoutLocale.startsWith("/authenticate")
  ) {
    return NextResponse.redirect(
      new URL(`/${locale}/authenticate`, request.url)
    );
  }

  return undefined;
}
