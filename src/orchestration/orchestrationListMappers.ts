import type {
  ListOrchestrationsParams,
  OrchestrationListItem,
} from "@/data/orchestrationListApiTypes";
import { dateRangeToIsoBounds } from "@/deliveries/deliveryMappers";
import { formatListRoute } from "@/deliveries/deliveryMappers";
import type { DeliveryListItem } from "@/data/deliveryApiTypes";
import { isValidOrchestrationRequestId } from "@/lib/bff/orchestrations";
import { isValidDeliveryId } from "@/lib/bff/deliveries";
import { formatProviderLabel } from "./orchestrationMappers";
import type { OrchestrationFilterState } from "./components/OrchestrationFilters";

export function listParamsFromOrchestrationFilters(
  filters: OrchestrationFilterState,
  page: number,
  limit: number,
  debouncedReference: string,
  debouncedDeliveryId?: string,
): ListOrchestrationsParams {
  const { from, to } = dateRangeToIsoBounds(filters.dateRange);
  const reference = debouncedReference.trim() || undefined;
  const deliveryId = debouncedDeliveryId?.trim() || undefined;

  return {
    page,
    limit,
    reference,
    deliveryId,
    from,
    to,
    orchestrationStatus:
      filters.orchestrationStatus === "all" ? undefined : filters.orchestrationStatus,
    deliveryStatus:
      filters.deliveryStatus === "all" ? undefined : filters.deliveryStatus,
    bookingStatus: filters.bookingStatus === "all" ? undefined : filters.bookingStatus,
  };
}

export function formatOrchestrationListRoute(item: OrchestrationListItem): string {
  const listItem: DeliveryListItem = {
    id: item.deliveryId,
    reference: item.deliveryReference,
    status: item.deliveryStatus,
    pickup: { addressText: item.pickupAddressText, contactName: "" },
    drop: { addressText: item.dropAddressText, contactName: "" },
    packageType: "FOOD",
    weightKg: 0,
    sizeTier: "MEDIUM",
    schedule: { mode: "ASAP", scheduledAt: null, timezone: "Asia/Kolkata" },
    createdAt: item.createdAt,
    updatedAt: item.createdAt,
  };
  return formatListRoute(listItem);
}

export function formatDurationMs(durationMs: number | null): string {
  if (durationMs === null) return "—";
  if (durationMs < 1000) return `${durationMs} ms`;
  return `${(durationMs / 1000).toFixed(1)} s`;
}

export type OrchestrationListRowView = {
  orchestrationId: string;
  deliveryId: string;
  deliveryReference: string;
  routeLabel: string;
  evaluationCount: number;
  availableOptionCount: number;
  selectedProviderLabel: string;
  selectedScoreDisplay: string;
  durationDisplay: string;
  deliveryStatus: string;
  bookingStatus: string | null;
  runHref: string | null;
  deliveryHref: string | null;
};

export function mapOrchestrationListRow(
  item: OrchestrationListItem,
  nameByCode?: ReadonlyMap<string, string>,
): OrchestrationListRowView {
  const selectedProviderLabel = item.selectedProviderCode
    ? formatProviderLabel(
        item.selectedProviderCode,
        item.selectedServiceCode,
        nameByCode,
      )
    : "—";

  const runHref = isValidOrchestrationRequestId(item.orchestrationId)
    ? `/orchestration/requests/${item.orchestrationId}`
    : null;
  const deliveryHref = isValidDeliveryId(item.deliveryId)
    ? `/deliveries/${item.deliveryId}`
    : null;

  return {
    orchestrationId: item.orchestrationId,
    deliveryId: item.deliveryId,
    deliveryReference: item.deliveryReference,
    routeLabel: formatOrchestrationListRoute(item),
    evaluationCount: item.evaluationCount,
    availableOptionCount: item.availableOptionCount,
    selectedProviderLabel,
    selectedScoreDisplay:
      item.selectedScore !== null ? item.selectedScore.toFixed(2) : "—",
    durationDisplay: formatDurationMs(item.durationMs),
    deliveryStatus: item.deliveryStatus,
    bookingStatus: item.booking?.status ?? null,
    runHref,
    deliveryHref,
  };
}

export type OrchestrationListMetrics = {
  totalMatching: number;
  completedOnPage: number;
  failedOnPage: number;
  withSelectionOnPage: number;
  bookedOnPage: number;
};

export function metricsFromOrchestrationListPage(
  items: OrchestrationListItem[],
  totalMatching: number,
): OrchestrationListMetrics {
  return {
    totalMatching,
    completedOnPage: items.filter((item) => item.orchestrationStatus === "COMPLETED")
      .length,
    failedOnPage: items.filter((item) => item.orchestrationStatus === "FAILED").length,
    withSelectionOnPage: items.filter((item) => item.selectedProviderCode !== null)
      .length,
    bookedOnPage: items.filter((item) => item.booking?.status === "BOOKED").length,
  };
}
