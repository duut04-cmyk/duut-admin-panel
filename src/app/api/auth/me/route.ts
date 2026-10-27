import { NextResponse } from "next/server";
import { backendFetch, parseBackendJson } from "@/lib/backendClient";
import {
  applyClearAdminSessionCookie,
  shouldClearAdminSessionOnBackendResponse,
} from "@/lib/auth/sessionFromBackend";
import type { AdminAccount } from "@/data/settingsTypes";

type BackendMeResponse = {
  success: boolean;
  data?: {
    user: AdminAccount;
  };
  error?: { message?: string; code?: string };
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
    if (shouldClearAdminSessionOnBackendResponse(response, data)) {
      applyClearAdminSessionCookie(res);
    }
    return res;
  }

  if (data.data.user.role !== "ADMIN") {
    const res = NextResponse.json(
      { success: false, error: "Admin access required." },
      { status: 403 },
    );
    applyClearAdminSessionCookie(res);
    return res;
  }

  return NextResponse.json({
    success: true,
    data: data.data.user,
  });
}
