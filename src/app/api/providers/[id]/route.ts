import { NextResponse } from "next/server";
import { backendFetch, parseBackendJson } from "@/lib/backendClient";
import type { ProviderDetail, UpdateProviderInput } from "@/data/providerTypes";

type BackendDetailResponse = {
  success: boolean;
  data?: ProviderDetail;
  error?: { message?: string };
};

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json()) as UpdateProviderInput;

  const response = await backendFetch(`/api/v1/admin/providers/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

  const data = await parseBackendJson<BackendDetailResponse>(response);

  if (!response.ok || !data.success) {
    return NextResponse.json(
      { success: false, error: data.error?.message ?? "Failed to update provider." },
      { status: response.status || 500 },
    );
  }

  return NextResponse.json({ success: true, data: data.data });
}
