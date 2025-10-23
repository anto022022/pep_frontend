import { NextResponse } from "next/server";
import { errorResponse } from "@/app/api/_utility/oauthErrRes";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const code = formData.get("code")?.toString();

    if (!code) {
      return errorResponse("apple_err", "Failed to log in with Apple");
    }

    const url = `${
      process.env.NEXT_PUBLIC_API_URL_IDN ||
      "https://identity-api.sandbox.pepagora.org/"
    }auth/oauthVerification`;

    const nestRes = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        type: "apple",
      }),
    });

    const nestResJSON = await nestRes.json();
    if (!nestResJSON || nestResJSON?.statusCode !== 200) {
      return errorResponse("apple_err", "Failed to log in with Apple");
    }

    const date = new Date();
    date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);
    let expires = `; expires=${date.toUTCString()}`;
    const response = new NextResponse(null, { status: 307 });
    if (nestResJSON?.data?.userSession) {
      response.headers.set(
        "Set-Cookie",
        `userSession=${nestResJSON.data.userSession}; Path=/; Max-Age=${expires}`
      );
    } else {
      return errorResponse("apple_err", "Failed to log in with Apple");
    }

    response.headers.set("Location", "/authenticate");
    return response;
  } catch (error) {
    console.error("Apple OAuth error:", error);
    return errorResponse("apple_err", "Failed to log in with Apple");
  }
}
