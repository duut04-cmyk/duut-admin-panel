import type {
  ListOrchestrationsParams,
  PaginatedOrchestrations,
} from "@/data/orchestrationListApiTypes";

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

function buildQuery(params: ListOrchestrationsParams): string {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.reference?.trim()) search.set("reference", params.reference.trim());
  if (params.deliveryId?.trim()) search.set("deliveryId", params.deliveryId.trim());
  if (params.from) search.set("from", params.from);
  if (params.to) search.set("to", params.to);
  if (params.orchestrationStatus) {
    search.set("orchestrationStatus", params.orchestrationStatus);
  }
  if (params.deliveryStatus) search.set("deliveryStatus", params.deliveryStatus);
  if (params.bookingStatus) search.set("bookingStatus", params.bookingStatus);
  return search.toString();
}

export async function fetchOrchestrations(
  params: ListOrchestrationsParams,
): Promise<ApiResponse<PaginatedOrchestrations>> {
  const query = buildQuery(params);
  const response = await fetch(`/api/orchestrations?${query}`, { cache: "no-store" });
  return parseResponse<PaginatedOrchestrations>(response);
}
