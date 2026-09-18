/**
 * Admin login — validates against backend JWT auth when BACKEND_API_URL is set,
 * otherwise falls back to env-var mock validation for UI prototyping.
 */

import { NextResponse } from "next/server";
import { accessTokenCookieOptions, ACCESS_TOKEN_COOKIE } from "@/lib/backendAuth";
import { getBackendApiUrl } from "@/lib/backendClient";

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

type BackendLoginResponse = {
  success: boolean;
  data?: {
    accessToken: string;
    expiresIn: number;
  };
  error?: { message?: string };
};

async function loginWithBackend(email: string, password: string) {
  const baseUrl = getBackendApiUrl();
  if (!baseUrl) return null;

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  const data = (await response.json()) as BackendLoginResponse;

  if (!response.ok || !data.success || !data.data?.accessToken) {
    return {
      success: false as const,
      message: data.error?.message ?? "Invalid credentials.",
    };
  }

  return {
    success: true as const,
    accessToken: data.data.accessToken,
    expiresIn: data.data.expiresIn,
  };
}

async function loginWithMock(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return {
      success: false as const,
      message: "Admin credentials are not configured.",
    };
  }

  await delay(500);

  const success =
    email.toLowerCase() === adminEmail.toLowerCase() && password === adminPassword;

  return success
    ? { success: true as const }
    : { success: false as const, message: "Invalid credentials." };
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
  };

  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");

  const backendResult = await loginWithBackend(email, password);

  if (backendResult) {
    if (!backendResult.success) {
      return NextResponse.json(
        { success: false, error: backendResult.message },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(
      ACCESS_TOKEN_COOKIE,
      backendResult.accessToken,
      accessTokenCookieOptions(backendResult.expiresIn),
    );
    return response;
  }

  const mockResult = await loginWithMock(email, password);

  if (!mockResult.success) {
    return NextResponse.json(
      { success: false, error: mockResult.message },
      {
        status:
          mockResult.message === "Admin credentials are not configured." ? 500 : 401,
      },
    );
  }

  return NextResponse.json({ success: true });
}
