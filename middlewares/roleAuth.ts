import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import {
  APP_SALES,
  APP_SOURCE,
  APP_COMMON,
} from "@/app/[locale]/_models/rolesModel";

export function handleRoleAuth(request: NextRequest): NextResponse | undefined {
  const pathname = request.nextUrl.pathname;
  const parts = pathname.split("/").filter(Boolean);
  const idx = parts.indexOf("app");
  if (idx === -1) return undefined;
  if (idx === parts.length - 1) return undefined;

  const relativePath = parts
    .slice(idx + 1)
    .join("/")
    .toLowerCase();
  if (!relativePath) return undefined;

  const rawJwt = request.cookies.get("userSession")?.value ?? "";
  if (!rawJwt) {
    const url = request.nextUrl.clone();
    url.pathname = `/authenticate`;
    return NextResponse.redirect(url);
  }

  let payload: any;
  try {
    payload = jwtDecode(rawJwt);
  } catch {
    const url = request.nextUrl.clone();
    url.pathname = `/authenticate`;
    return NextResponse.redirect(url);
  }

  const roleClaim =
    (typeof payload?.role === "string" && payload.role) ||
    (typeof payload?.userType === "string" && payload.userType) ||
    (typeof payload?.type === "string" && payload.type) ||
    "";
  const role = String(roleClaim).toLowerCase().trim();
  const normalizedRole = role === "supplier" ? "seller" : role;

  if (normalizedRole === "both") return undefined;

  let allowedList: string[] = [];
  if (normalizedRole === "buyer") allowedList = [...APP_SOURCE, ...APP_COMMON];
  else if (normalizedRole === "seller")
    allowedList = [...APP_SALES, ...APP_COMMON];
  else {
    const url = request.nextUrl.clone();
    url.pathname = `/authenticate`;
    return NextResponse.redirect(url);
  }

  if (allowedList.includes(relativePath)) return undefined;

  const segments = relativePath.split("/");
  for (let i = segments.length; i >= 1; i--) {
    const prefix = segments.slice(0, i).join("/");
    if (allowedList.includes(prefix)) return undefined;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/app`;
  return NextResponse.redirect(url);
}
