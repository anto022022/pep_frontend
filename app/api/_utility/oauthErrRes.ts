import { NextResponse } from "next/server";

export async function errorResponse(cookieName: string, message: string) {
  const response = new NextResponse(null, { status: 307 });
  const date = new Date();
  date.setTime(date.getTime() + 3 * 1000);
  const expires = `; expires=${date.toUTCString()}`;
  response.headers.set(
    "Set-Cookie",
    `${cookieName}=${message}; Path=/; Max-Age=${expires}`
  );
  response.headers.set("Location", `/authenticate`);
  return response;
}
