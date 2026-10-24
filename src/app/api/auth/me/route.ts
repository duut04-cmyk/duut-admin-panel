import { NextResponse } from "next/server";
import { backendFetch, parseBackendJson } from "@/lib/backendClient";
import { ACCESS_TOKEN_COOKIE, clearAccessTokenCookieOptions } from "@/lib/backendAuth";
import type { AdminAccount } from "@/data/settingsTypes";

type BackendMeResponse = {
  success: boolean;
  data?: {
    user: AdminAccount;
  };
  error?: { message?: string };
};

export async function GET() {
  const response = await backendFetch("/api/v1/auth/me");
  const data = await parseBackendJson<BackendMeResponse>(response);

  if (!response.ok || !data.success || !data.data?.user) {
    const status = response.status === 401 ? 401 : response.status || 500;
    const res = NextResponse.json(
      {
        success: false,
        error: data.error?.message ?? "Failed to load account.",
      },
      { status },
    );
    if (status === 401) {
      res.cookies.set(ACCESS_TOKEN_COOKIE, "", clearAccessTokenCookieOptions());
    }
    return res;
  }

  if (data.data.user.role !== "ADMIN") {
    const res = NextResponse.json(
      { success: false, error: "Admin access required." },
      { status: 403 },
    );
    res.cookies.set(ACCESS_TOKEN_COOKIE, "", clearAccessTokenCookieOptions());
    return res;
  }

  return NextResponse.json({
    success: true,
    data: data.data.user,
  });
}
