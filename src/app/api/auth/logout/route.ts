import { NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE, clearAccessTokenCookieOptions } from "@/lib/backendAuth";

export async function POST(_request: Request) {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ACCESS_TOKEN_COOKIE, "", clearAccessTokenCookieOptions());
  return response;
}
