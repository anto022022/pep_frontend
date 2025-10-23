// lib/middleware/handlers/cors.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * Handle CORS preflight OPTIONS requests.
 * Returns a NextResponse when it handles the request, otherwise undefined.
 */
export function handleCors(request: NextRequest): NextResponse | undefined {
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With, Accept, Origin",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "86400",
      },
    });
  }
  return undefined;
}
