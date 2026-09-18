"use client";

import { useMemo } from "react";
import Input from "@/common/components/Input";
import type { BookingStatus, DeliveryRequestStatus } from "@/data/orchestrationTypes";
import type { DateRangeKey } from "@/data/orchestrationMetrics";
import AdminCustomSelect from "@/ui/AdminCustomSelect";
import DashboardCardDateRange from "@/overview/components/DashboardCardDateRange";
import AdminFilterChip from "@/ui/AdminFilterChip";
import AdminFilterToolbar from "@/ui/AdminFilterToolbar";
import type { OutcomeFilter } from "./utils";

export type DeliveryFilterState = {
  search: string;
  deliveryStatus: DeliveryRequestStatus | "all";
  bookingStatus: BookingStatus | "all";
  dateRange: DateRangeKey;
  outcome: OutcomeFilter;
};

export const DEFAULT_DELIVERY_FILTERS: DeliveryFilterState = {
  search: "",
  deliveryStatus: "all",
  bookingStatus: "all",
  dateRange: "30d",
  outcome: "all",
};

const deliveryStatusOptions = [
  { value: "all", label: "All statuses" },
  { value: "delivered", label: "Delivered" },
  { value: "in_transit", label: "In transit" },
  { value: "booked", label: "Booked" },
  { value: "failed", label: "Failed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "orchestrating", label: "Orchestrating" },
  { value: "pending_orchestration", label: "Pending" },
];

const bookingStatusOptions = [
  { value: "all", label: "All bookings" },
  { value: "confirmed", label: "Confirmed" },
  { value: "failed", label: "Failed" },
  { value: "pending", label: "Pending" },
  { value: "cancelled", label: "Cancelled" },
];

const outcomeOptions = [
  { value: "all", label: "All outcomes" },
  { value: "booking_confirmed", label: "Booking confirmed" },
  { value: "booking_failed", label: "Booking failed" },
  { value: "delivered", label: "Delivered" },
  { value: "delivery_failed", label: "Delivery failed" },
  { value: "cancelled", label: "Cancelled" },
];

const dateRangeLabels: Record<DateRangeKey, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  month: "This month",
  custom: "Custom",
};

type DeliveryFiltersProps = {
  filters: DeliveryFilterState;
  onChange: (filters: DeliveryFilterState) => void;
  resultCount: number;
  /** When true, date range is shown only on mobile (desktop uses page header). */
  periodInHeader?: boolean;
};

function labelForOption(
  options: { value: string; label: string }[],
  value: string,
): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

function countActiveFilters(
  filters: DeliveryFilterState,
  includeDateRange: boolean,
): number {
  let count = 0;
  if (filters.search.trim()) count += 1;
  if (filters.deliveryStatus !== "all") count += 1;
  if (filters.bookingStatus !== "all") count += 1;
  if (includeDateRange && filters.dateRange !== DEFAULT_DELIVERY_FILTERS.dateRange) {
    count += 1;
  }
  if (filters.outcome !== "all") count += 1;
  return count;
}

function countSheetActiveFilters(filters: DeliveryFilterState): number {
  let count = 0;
  if (filters.deliveryStatus !== "all") count += 1;
  if (filters.bookingStatus !== "all") count += 1;
  if (filters.outcome !== "all") count += 1;
  return count;
}

export default function DeliveryFilters({
  filters,
  onChange,
  resultCount,
  periodInHeader = false,
}: DeliveryFiltersProps) {
  const update = (partial: Partial<DeliveryFilterState>) => {
    onChange({ ...filters, ...partial });
  };

  const activeFilterCount = useMemo(
    () => countActiveFilters(filters, !periodInHeader),
    [filters, periodInHeader],
  );
  const sheetActiveCount = useMemo(() => countSheetActiveFilters(filters), [filters]);
  const hasChipFilters =
    (!periodInHeader && filters.dateRange !== DEFAULT_DELIVERY_FILTERS.dateRange) ||
    filters.deliveryStatus !== "all" ||
    filters.bookingStatus !== "all" ||
    filters.outcome !== "all";

  const activeFilterChips = (
    <>
      {!periodInHeader && filters.dateRange !== DEFAULT_DELIVERY_FILTERS.dateRange ? (
        <AdminFilterChip
          label={dateRangeLabels[filters.dateRange]}
          onRemove={() => update({ dateRange: DEFAULT_DELIVERY_FILTERS.dateRange })}
        />
      ) : null}
      {filters.deliveryStatus !== "all" ? (
        <AdminFilterChip
          label={labelForOption(deliveryStatusOptions, filters.deliveryStatus)}
          onRemove={() => update({ deliveryStatus: "all" })}
        />
      ) : null}
      {filters.bookingStatus !== "all" ? (
        <AdminFilterChip
          label={labelForOption(bookingStatusOptions, filters.bookingStatus)}
          onRemove={() => update({ bookingStatus: "all" })}
        />
      ) : null}
      {filters.outcome !== "all" ? (
        <AdminFilterChip
          label={labelForOption(outcomeOptions, filters.outcome)}
          onRemove={() => update({ outcome: "all" })}
        />
      ) : null}
    </>
  );

  const periodControl = (
    <DashboardCardDateRange
      compact
      matchToolbarHeight
      iconOnlyMobile
      iconOnlyBelow="sm"
      value={filters.dateRange}
      onChange={(value) => update({ dateRange: value })}
      className={periodInHeader ? "sm:hidden" : undefined}
    />
  );

  return (
    <AdminFilterToolbar
      headingId="delivery-filters-heading"
      sheetTitle="Delivery filters"
      resultSummary={`${resultCount} deliver${resultCount === 1 ? "y" : "ies"} matching`}
      sheetActiveCount={sheetActiveCount}
      totalActiveCount={activeFilterCount}
      onClearFilters={() =>
        onChange({
          ...DEFAULT_DELIVERY_FILTERS,
          ...(periodInHeader ? { dateRange: filters.dateRange } : {}),
        })
      }
      activeFilterChips={hasChipFilters ? activeFilterChips : undefined}
      search={
        <Input
          id="delivery-search"
          type="search"
          placeholder="Search by DOOT ID"
          value={filters.search}
          onChange={(event) => update({ search: event.target.value })}
          aria-label="Search by delivery ID"
          className="border-border/60 shadow-sm"
        />
      }
      period={periodControl}
      sheetContent={
        <>
          <AdminCustomSelect
            label="Delivery status"
            value={filters.deliveryStatus}
            options={deliveryStatusOptions}
            onChange={(value) =>
              update({
                deliveryStatus: value as DeliveryRequestStatus | "all",
              })
            }
          />
          <AdminCustomSelect
            label="Booking status"
            value={filters.bookingStatus}
            options={bookingStatusOptions}
            onChange={(value) =>
              update({
                bookingStatus: value as BookingStatus | "all",
              })
            }
          />
          <AdminCustomSelect
            label="Outcome"
            value={filters.outcome}
            options={outcomeOptions}
            onChange={(value) => update({ outcome: value as OutcomeFilter })}
          />
        </>
      }
    />
  );
}
