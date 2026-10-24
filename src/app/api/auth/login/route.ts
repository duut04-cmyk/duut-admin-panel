/**
 * Admin panel login — backend ADMIN session only (no mock fallback).
 */

import { NextResponse } from "next/server";
import { accessTokenCookieOptions, ACCESS_TOKEN_COOKIE } from "@/lib/backendAuth";
import { isSameOriginPost } from "@/lib/auth/csrf";
import { getBackendApiUrl } from "@/lib/backendClient";

type BackendLoginResponse = {
  success: boolean;
  data?: {
    accessToken: string;
    expiresIn: number;
    user?: { role?: string };
  };
  error?: { message?: string; code?: string };
};

type BackendMeResponse = {
  success: boolean;
  data?: {
    user: { role: string };
  };
};

async function verifyAdminRole(accessToken: string, baseUrl: string): Promise<boolean> {
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!response.ok) {
    return false;
  }

  const data = (await response.json()) as BackendMeResponse;
  return data.success === true && data.data?.user.role === "ADMIN";
}

export async function POST(request: Request) {
  if (!isSameOriginPost(request)) {
    return NextResponse.json(
      { success: false, error: "Invalid request." },
      { status: 403 },
    );
  }

  const baseUrl = getBackendApiUrl();
  if (!baseUrl) {
    return NextResponse.json(
      {
        success: false,
        error: "Admin sign-in is unavailable. BACKEND_API_URL is not configured.",
      },
      { status: 503 },
    );
  }

  const body = (await request.json()) as {
    email?: string;
    password?: string;
  };

  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");

  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: "Email and password are required." },
      { status: 400 },
    );
  }

  const response = await fetch(
    `${baseUrl.replace(/\/$/, "")}/api/v1/auth/admin/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    },
  );

  const data = (await response.json()) as BackendLoginResponse;

  if (!response.ok || !data.success || !data.data?.accessToken) {
    return NextResponse.json(
      { success: false, error: data.error?.message ?? "Invalid email or password." },
      {
        status:
          response.status === 401 || response.status === 403
            ? 401
            : response.status || 401,
      },
    );
  }

  const isAdmin = await verifyAdminRole(data.data.accessToken, baseUrl);
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: "Invalid email or password." },
      { status: 401 },
    );
  }

  const sessionResponse = NextResponse.json({ success: true });
  sessionResponse.cookies.set(
    ACCESS_TOKEN_COOKIE,
    data.data.accessToken,
    accessTokenCookieOptions(data.data.expiresIn),
  );
  return sessionResponse;
}
