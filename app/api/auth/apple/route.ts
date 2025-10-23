import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.NEXT_APPLE_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_APPLE_CALLBACK_URL}/api/auth/apple/callback`;

  const appleAuthUrl = new URL("https://appleid.apple.com/auth/authorize");
  appleAuthUrl.searchParams.set("client_id", clientId || "");
  appleAuthUrl.searchParams.set("redirect_uri", redirectUri);
  appleAuthUrl.searchParams.set("response_type", "code id_token");
  appleAuthUrl.searchParams.set("scope", "name email");
  appleAuthUrl.searchParams.set("response_mode", "form_post");

  return NextResponse.redirect(appleAuthUrl.toString());
}
