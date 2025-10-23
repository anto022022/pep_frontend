import { NextResponse } from "next/server";

export async function GET() {
  const authUrl = new URL("https://www.linkedin.com/oauth/v2/authorization");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", process.env.NEXT_LINKEDIN_CLIENT_ID);
  authUrl.searchParams.set(
    "redirect_uri",
    `${process.env.NEXT_LINKEDIN_CALLBACK_URL}/api/auth/linkedin/callback`
  );
  authUrl.searchParams.set("scope", "openid profile email");

  return NextResponse.redirect(authUrl.toString());
}
