import { NextResponse } from "next/server";
import { backendFetch, parseBackendJson } from "@/lib/backendClient";
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
    return NextResponse.json(
      {
        success: false,
        error: data.error?.message ?? "Failed to load account.",
      },
      { status: response.status || 500 },
    );
  }

  return NextResponse.json({
    success: true,
    data: data.data.user,
  });
}
