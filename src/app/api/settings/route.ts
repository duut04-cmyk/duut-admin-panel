import { NextResponse } from "next/server";
import { backendFetch, parseBackendJson } from "@/lib/backendClient";
import type { SettingsSnapshot } from "@/data/settingsTypes";

type BackendSettingsResponse = {
  success: boolean;
  data?: SettingsSnapshot;
  error?: { message?: string };
};

export async function GET() {
  const response = await backendFetch("/api/v1/admin/settings");
  const data = await parseBackendJson<BackendSettingsResponse>(response);

  if (!response.ok || !data.success || !data.data) {
    return NextResponse.json(
      {
        success: false,
        error: data.error?.message ?? "Failed to load settings.",
      },
      { status: response.status || 500 },
    );
  }

  return NextResponse.json({
    success: true,
    data: data.data,
  });
}
