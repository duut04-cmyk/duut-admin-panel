/** Allowed query keys for admin delivery list (matches backend listDeliveriesQuerySchema). */
export const DELIVERY_LIST_QUERY_KEYS = [
  "page",
  "limit",
  "status",
  "from",
  "to",
  "reference",
] as const;

export type DeliveryListQueryKey = (typeof DELIVERY_LIST_QUERY_KEYS)[number];

const DELIVERY_ID_UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidDeliveryId(deliveryId: string): boolean {
  const trimmed = deliveryId.trim();
  if (trimmed !== deliveryId || trimmed.length === 0) {
    return false;
  }
  if (trimmed.includes("/") || trimmed.includes("..")) {
    return false;
  }
  return DELIVERY_ID_UUID_PATTERN.test(trimmed);
}

export function buildAdminDeliveriesListPath(searchParams: URLSearchParams): string {
  const allowed = new URLSearchParams();
  for (const key of DELIVERY_LIST_QUERY_KEYS) {
    const value = searchParams.get(key);
    if (value !== null && value.trim() !== "") {
      allowed.set(key, value.trim());
    }
  }
  const query = allowed.toString();
  return query ? `/api/v1/admin/deliveries?${query}` : "/api/v1/admin/deliveries";
}

export function deliveryDetailBackendPath(deliveryId: string): string {
  return `/api/v1/deliveries/${encodeURIComponent(deliveryId)}`;
}

export function deliveryHistoryBackendPath(deliveryId: string): string {
  return `/api/v1/admin/deliveries/${encodeURIComponent(deliveryId)}/history`;
}

export function deliveryOrchestrationBackendPath(deliveryId: string): string {
  return `/api/v1/deliveries/${encodeURIComponent(deliveryId)}/orchestration`;
}
