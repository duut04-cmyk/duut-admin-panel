import { NextResponse } from "next/server";
import { backendFetch, parseBackendJson } from "@/lib/backendClient";
import type { PaginatedCustomers } from "@/data/customerTypes";

type BackendListResponse = {
  success: boolean;
  data?: PaginatedCustomers;
  error?: { message?: string };
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.toString();
  const path = query ? `/api/v1/admin/customers?${query}` : "/api/v1/admin/customers";

  const response = await backendFetch(path);
  const data = await parseBackendJson<BackendListResponse>(response);

  if (!response.ok || !data.success) {
    return NextResponse.json(
      { success: false, error: data.error?.message ?? "Failed to load customers." },
      { status: response.status || 500 },
    );
  }

  return NextResponse.json({ success: true, data: data.data });
}
