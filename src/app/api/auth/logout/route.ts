import { NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE, clearAccessTokenCookieOptions } from "@/lib/backendAuth";
import { isSameOriginPost } from "@/lib/auth/csrf";

export async function POST(request: Request) {
  if (!isSameOriginPost(request)) {
    return NextResponse.json(
      { success: false, error: "Invalid request." },
      { status: 403 },
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ACCESS_TOKEN_COOKIE, "", clearAccessTokenCookieOptions());
  return response;
}
