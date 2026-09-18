import { NextResponse } from "next/server";
import { backendFetch, parseBackendJson } from "@/lib/backendClient";
import type { CustomerDetail, UpdateCustomerInput } from "@/data/customerTypes";

type BackendDetailResponse = {
  success: boolean;
  data?: CustomerDetail;
  error?: { message?: string };
};

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const response = await backendFetch(`/api/v1/admin/customers/${id}`);
  const data = await parseBackendJson<BackendDetailResponse>(response);

  if (!response.ok || !data.success) {
    return NextResponse.json(
      { success: false, error: data.error?.message ?? "Failed to load customer." },
      { status: response.status || 500 },
    );
  }

  return NextResponse.json({ success: true, data: data.data });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json()) as UpdateCustomerInput;

  const response = await backendFetch(`/api/v1/admin/customers/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

  const data = await parseBackendJson<BackendDetailResponse>(response);

  if (!response.ok || !data.success) {
    return NextResponse.json(
      { success: false, error: data.error?.message ?? "Failed to update customer." },
      { status: response.status || 500 },
    );
  }

  return NextResponse.json({ success: true, data: data.data });
}
