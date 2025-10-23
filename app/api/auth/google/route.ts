import { NextResponse } from "next/server";

export async function GET() {
  const authSession =
    process.env.NEXT_GOOGLE_CLIENT_ID || "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";
  const redirectUri = `${process.env.NEXT_GOOGLE_CALLBACK_URL ?? "https://sandbox.pepagora.org"
    }/api/auth/google/callback`;

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${authSession}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20profile`;

  return NextResponse.redirect(googleAuthUrl);
}
