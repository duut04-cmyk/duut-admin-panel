import type { DateRangeKey } from "@/data/orchestrationMetrics";
import type {
  BackendDeliveryStatus,
  DeliveryHistoryDetail,
  DeliveryListItem,
  DeliveryPhone,
  DeliveryTimelineEntry,
  ListDeliveriesParams,
} from "@/data/deliveryApiTypes";
import type { DeliveryFilterState } from "./components/DeliveryFilters";
import type { DeliveryMetrics } from "./components/utils";

export function dateRangeToIsoBounds(range: DateRangeKey): {
  from?: string;
  to?: string;
} {
  if (range === "custom") {
    return {};
  }

  const now = new Date();
  const end = new Date(now);
  const start = new Date(now);

  if (range === "7d") {
    start.setDate(start.getDate() - 6);
  } else if (range === "30d") {
    start.setDate(start.getDate() - 29);
  } else if (range === "month") {
    start.setDate(1);
  }

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return {
    from: start.toISOString(),
    to: end.toISOString(),
  };
}

export function listParamsFromFilters(
  filters: DeliveryFilterState,
  page: number,
  limit: number,
  debouncedReference: string,
): ListDeliveriesParams {
  const { from, to } = dateRangeToIsoBounds(filters.dateRange);
  const reference = debouncedReference.trim() || undefined;

  return {
    page,
    limit,
    reference,
    from,
    to,
    status:
      filters.deliveryStatus === "all"
        ? undefined
        : (filters.deliveryStatus as BackendDeliveryStatus),
  };
}

export function formatListRoute(item: DeliveryListItem): string {
  const pickup = item.pickup.addressText.trim();
  const drop = item.drop.addressText.trim();
  if (!pickup && !drop) return "—";
  if (pickup.length <= 40 && drop.length <= 40) {
    return `${pickup} → ${drop}`;
  }
  const short = (value: string) =>
    value.length > 36 ? `${value.slice(0, 33)}…` : value;
  return `${short(pickup)} → ${short(drop)}`;
}

export function formatDeliveryPhone(phone: DeliveryPhone): string {
  if (phone.formatted?.trim()) return phone.formatted.trim();
  if (phone.e164?.trim()) return phone.e164.trim();
  if (phone.nationalNumber?.trim()) {
    const code = phone.countryCode?.trim();
    return code ? `+${code} ${phone.nationalNumber}` : phone.nationalNumber;
  }
  return "—";
}

export function mapTimeline(history: DeliveryHistoryDetail): DeliveryTimelineEntry[] {
  return history.timeline.map((event) => ({
    id: event.id,
    title: event.toStatus
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase()),
    timestamp: event.createdAt,
    description: event.reason?.trim() || event.source || null,
  }));
}

export function getDeliveryMetricsFromList(
  items: DeliveryListItem[],
  totalMatching: number,
): DeliveryMetrics {
  const countStatus = (statuses: BackendDeliveryStatus[]) =>
    items.filter((item) => statuses.includes(item.status)).length;

  return {
    total: totalMatching,
    inTransit: countStatus([
      "PICKUP_OTP_PENDING",
      "PICKED_UP",
      "IN_TRANSIT",
      "DELIVERY_OTP_PENDING",
    ]),
    delivered: countStatus(["DELIVERED"]),
    failed: countStatus(["FAILED"]),
    cancelled: countStatus(["CANCELLED"]),
  };
}

/** Simple two-point sparkline from a single count (current page slice). */
export function sparklineFromCount(count: number): number[] {
  const safe = Math.max(0, count);
  return [0, safe];
}
