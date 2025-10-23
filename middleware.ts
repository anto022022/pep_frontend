// middleware.ts
import { handleCors } from "@/lib/cors";
import { intlMiddleware } from "@/middlewares/intl";
import { handleLocaleRedirect } from "@/middlewares/localeRedirect";
import { handleProtectedRoutes } from "@/middlewares/protectedRoutes";
import { handleRoleAuth } from "@/middlewares/roleAuth";
import { handleStaticPagesAssets } from "@/middlewares/staticPages";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // CORS preflight (OPTIONS)
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  // Static prepagora rewrite (HTML/assets)
  const pepagoraResponse = handleStaticPagesAssets(request);
  if (pepagoraResponse) return pepagoraResponse;

  // Ensure URL has locale (redirect if needed)
  const localeResponse = handleLocaleRedirect(request);
  if (localeResponse) return localeResponse;

  // Protected routes logic (onboard, authenticate, app)
  const protectedResponse = handleProtectedRoutes(request);
  if (protectedResponse) return protectedResponse;

  // Role based route protection
  const roleAuth = handleRoleAuth(request);
  if (roleAuth) return roleAuth;

  const response = intlMiddleware(request);

  try {
    const hasCountry = request.cookies.get("cr_ctry")?.value;
    const hasCity = request.cookies.get("cr_cty")?.value;
    const hasCountryCode = request.cookies.get("countryCode")?.value;
    const hasCurrency = request.cookies.get("currencyCode")?.value;
    if (!hasCountry || !hasCity || !hasCountryCode) {

      const apiKey = process.env.NEXT_IPAPI_KEY || "sXQskzXLShTIsCr5U98XaBFfzx0vWjUsLXLF1jZSRyHQgokt3V";
      
      // AWS ALB sets X-Forwarded-For with client IP as first value
      const forwardedFor = request.headers.get("x-forwarded-for");
      const ip = 
      forwardedFor?.split(",")[0]?.trim() || // AWS ALB primary method
      request.headers.get("x-real-ip") ||
      request.ip ||
      request.headers.get("cf-connecting-ip") || // Cloudflare
      request.headers.get("x-client-ip") ||
      request.headers.get("true-client-ip") || // Akamai/Cloudflare
      "8.8.8.8";
      
      console.log("[middleware] X-Forwarded-For:", forwardedFor);
      console.log("[middleware] Detected IP:", ip);

      // 🔹 Fetch location data from ipapi.co
      const res = await fetch(`https://ipapi.co/${ip}/json/?key=${apiKey}`, {
        cache: "no-store",
      });

      if (res.ok) {
        console.log("[middleware] ipapi response status:", res.status, res.statusText);
        const data = await res.json();
        console.log("[middleware] ipapi data:", data);
        const country = (data.country_name || "").trim();
        const city = (data.city || "").trim();
        const countryCode = (data.country_code || "").trim();
        const currency = (data.currency || "").trim();

        if (country) response.cookies.set("cr_ctry", btoa(country));
        if (city) response.cookies.set("cr_cty", btoa(city));
        if (countryCode) response.cookies.set("countryCode", countryCode);
        if (!hasCurrency && currency) response.cookies.set("currencyCode", currency);
        response.cookies.set("location_timestamp", Date.now().toString());
      }
    }
  } catch (e) {
    console.error('error:', e);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
