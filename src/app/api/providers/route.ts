import { NextResponse } from "next/server";
import { backendFetch, parseBackendJson } from "@/lib/backendClient";
import type {
  CreateProviderInput,
  ProviderDetail,
  ProviderSummary,
} from "@/data/providerTypes";

type BackendListResponse = {
  success: boolean;
  data?: ProviderSummary[];
  error?: { message?: string };
};

type BackendDetailResponse = {
  success: boolean;
  data?: ProviderDetail;
  error?: { message?: string };
};

export async function GET() {
  const response = await backendFetch("/api/v1/admin/providers");
  const data = await parseBackendJson<BackendListResponse>(response);

  if (!response.ok || !data.success) {
    return NextResponse.json(
      { success: false, error: data.error?.message ?? "Failed to load providers." },
      { status: response.status || 500 },
    );
  }

  return NextResponse.json({ success: true, data: data.data ?? [] });
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreateProviderInput;

  const response = await backendFetch("/api/v1/admin/providers", {
    method: "POST",
    body: JSON.stringify(body),
  });

  const data = await parseBackendJson<BackendDetailResponse>(response);

  if (!response.ok || !data.success) {
    return NextResponse.json(
      { success: false, error: data.error?.message ?? "Failed to create provider." },
      { status: response.status || 500 },
    );
  }

  return NextResponse.json({ success: true, data: data.data }, { status: 201 });
}
