import { errorResponse } from "@/app/api/_utility/oauthErrRes";
import { NextResponse } from "next/server";

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return errorResponse("ggl_err", "Failed to log in with Google");
    }
    let url = `${process.env.NEXT_PUBLIC_API_URL_IDN ||
      "https://identity-api.sandbox.pepagora.org/"
      }auth/oauthVerification`;

    const nestRes = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: code,
        type: "google",
      }),
    });
    const nestResJSON = await nestRes.json();
    if (!nestResJSON || nestResJSON?.statusCode !== 200) {
      return errorResponse("ggl_err", "Failed to log in with Google");
    }

    const date = new Date();
    date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);
    let expires = `; expires=${date.toUTCString()}`;
    const response = new NextResponse(null, { status: 307 });
    // if (nestResJSON.data?.userVerified) {}
    if (nestResJSON?.data?.onboardSession) {

      response.headers.set(
        "Set-Cookie",
        `onboardSession=${nestResJSON.data.onboardSession}; Path=/; Max-Age=${expires}`
      );
    } else if (nestResJSON?.data?.userSession) {
      response.headers.set(
        "Set-Cookie",
        `userSession=${nestResJSON.data.userSession}; Path=/; Max-Age=${expires}`
      );
    } else if (nestResJSON?.data?.clientSessionId) {
      response.headers.set(
        "Set-Cookie",
        `authSession=${nestResJSON.data.clientSessionId}; Path=/; Max-Age=${expires}`
      );
    } else {
      console.error("OAuth error");
      return errorResponse("ggl_err", "Failed to log in with Google");
    }

    response.headers.set("Location", "/authenticate");
    return response;
  } catch (error) {
    console.error("OAuth error:", error);
    return errorResponse("ggl_err", "Failed to log in with Google");
  }
}
