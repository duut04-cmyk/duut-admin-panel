/** Allowed query keys for admin orchestration list (matches backend listOrchestrationsQuerySchema). */
export const ORCHESTRATION_LIST_QUERY_KEYS = [
  "page",
  "limit",
  "from",
  "to",
  "reference",
  "deliveryId",
  "orchestrationStatus",
  "deliveryStatus",
  "bookingStatus",
] as const;

export type OrchestrationListQueryKey = (typeof ORCHESTRATION_LIST_QUERY_KEYS)[number];

export function isValidOrchestrationRequestId(orchestrationRequestId: string): boolean {
  const trimmed = orchestrationRequestId.trim();
  if (trimmed !== orchestrationRequestId || trimmed.length === 0) {
    return false;
  }
  if (trimmed.includes("/") || trimmed.includes("..")) {
    return false;
  }
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    trimmed,
  );
}

export function orchestrationRunBackendPath(orchestrationRequestId: string): string {
  return `/api/v1/admin/orchestrations/${encodeURIComponent(orchestrationRequestId)}`;
}

export function buildAdminOrchestrationsListPath(
  searchParams: URLSearchParams,
): string {
  const allowed = new URLSearchParams();
  for (const key of ORCHESTRATION_LIST_QUERY_KEYS) {
    const value = searchParams.get(key);
    if (value !== null && value.trim() !== "") {
      allowed.set(key, value.trim());
    }
  }
  const query = allowed.toString();
  return query
    ? `/api/v1/admin/orchestrations?${query}`
    : "/api/v1/admin/orchestrations";
}
