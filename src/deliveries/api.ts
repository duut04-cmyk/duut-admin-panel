import type {
  DeliveryHistoryDetail,
  ListDeliveriesParams,
  PaginatedDeliveries,
} from "@/data/deliveryApiTypes";
import { adminApiFetch } from "@/lib/adminApiFetch";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

function extractErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message?: unknown }).message ?? "Request failed.");
  }
  return "Request failed.";
}

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = (await response.json()) as ApiResponse<T> & {
    error?: string | { message?: string };
  };

  if (!response.ok || !data.success) {
    return { success: false, error: extractErrorMessage(data.error) };
  }

  return { success: true, data: data.data };
}

function buildListQuery(params: ListDeliveriesParams): string {
  const searchParams = new URLSearchParams();
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
  if (params.status) searchParams.set("status", params.status);
  if (params.from) searchParams.set("from", params.from);
  if (params.to) searchParams.set("to", params.to);
  if (params.reference?.trim()) searchParams.set("reference", params.reference.trim());
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function fetchDeliveries(
  params: ListDeliveriesParams = {},
): Promise<ApiResponse<PaginatedDeliveries>> {
  const response = await adminApiFetch(`/api/deliveries${buildListQuery(params)}`, {
    cache: "no-store",
  });
  return parseResponse<PaginatedDeliveries>(response);
}

export async function fetchDeliveryHistory(
  deliveryId: string,
): Promise<ApiResponse<DeliveryHistoryDetail>> {
  const response = await adminApiFetch(
    `/api/deliveries/${encodeURIComponent(deliveryId)}/history`,
    {
      cache: "no-store",
    },
  );
  return parseResponse<DeliveryHistoryDetail>(response);
}
