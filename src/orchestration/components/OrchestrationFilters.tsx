"use client";

import { useMemo } from "react";
import Input from "@/common/components/Input";
import type {
  BackendDeliveryStatus,
  BackendProviderBookingStatus,
} from "@/data/deliveryApiTypes";
import type { BackendOrchestrationRequestStatus } from "@/data/orchestrationListApiTypes";
import type { DateRangeKey } from "@/data/orchestrationMetrics";
import { DELIVERY_STATUS_FILTER_OPTIONS } from "@/deliveries/deliveryStatus";
import AdminCustomSelect from "@/ui/AdminCustomSelect";
import DashboardCardDateRange from "@/overview/components/DashboardCardDateRange";
import AdminFilterChip from "@/ui/AdminFilterChip";
import AdminFilterToolbar from "@/ui/AdminFilterToolbar";

export type OrchestrationFilterState = {
  search: string;
  deliveryStatus: BackendDeliveryStatus | "all";
  bookingStatus: BackendProviderBookingStatus | "all";
  orchestrationStatus: BackendOrchestrationRequestStatus | "all";
  dateRange: DateRangeKey;
};

export const DEFAULT_ORCHESTRATION_FILTERS: OrchestrationFilterState = {
  search: "",
  deliveryStatus: "all",
  bookingStatus: "all",
  orchestrationStatus: "all",
  dateRange: "30d",
};

const bookingStatusOptions = [
  { value: "all", label: "All bookings" },
  { value: "BOOKED", label: "Confirmed" },
  { value: "FAILED", label: "Failed" },
  { value: "PENDING", label: "Pending" },
  { value: "BOOKING", label: "Booking" },
  { value: "UNKNOWN", label: "Unknown" },
];

const orchestrationStatusOptions = [
  { value: "all", label: "All orchestrations" },
  { value: "COMPLETED", label: "Completed" },
  { value: "RUNNING", label: "Running" },
  { value: "FAILED", label: "Failed" },
];

const dateRangeLabels: Record<DateRangeKey, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  month: "This month",
  custom: "Custom",
};

type OrchestrationFiltersProps = {
  filters: OrchestrationFilterState;
  onChange: (filters: OrchestrationFilterState) => void;
  resultCount: number;
  periodInHeader?: boolean;
};

function labelForOption(
  options: { value: string; label: string }[],
  value: string,
): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

function countActiveFilters(
  filters: OrchestrationFilterState,
  includeDateRange: boolean,
): number {
  let count = 0;
  if (filters.search.trim()) count += 1;
  if (filters.deliveryStatus !== "all") count += 1;
  if (filters.bookingStatus !== "all") count += 1;
  if (filters.orchestrationStatus !== "all") count += 1;
  if (
    includeDateRange &&
    filters.dateRange !== DEFAULT_ORCHESTRATION_FILTERS.dateRange
  ) {
    count += 1;
  }
  return count;
}

function countSheetActiveFilters(filters: OrchestrationFilterState): number {
  let count = 0;
  if (filters.deliveryStatus !== "all") count += 1;
  if (filters.bookingStatus !== "all") count += 1;
  if (filters.orchestrationStatus !== "all") count += 1;
  return count;
}

export default function OrchestrationFilters({
  filters,
  onChange,
  resultCount,
  periodInHeader = false,
}: OrchestrationFiltersProps) {
  const update = (partial: Partial<OrchestrationFilterState>) => {
    onChange({ ...filters, ...partial });
  };

  const activeFilterCount = useMemo(
    () => countActiveFilters(filters, !periodInHeader),
    [filters, periodInHeader],
  );
  const sheetActiveCount = useMemo(() => countSheetActiveFilters(filters), [filters]);
  const hasChipFilters =
    (!periodInHeader &&
      filters.dateRange !== DEFAULT_ORCHESTRATION_FILTERS.dateRange) ||
    filters.deliveryStatus !== "all" ||
    filters.bookingStatus !== "all" ||
    filters.orchestrationStatus !== "all";

  const activeFilterChips = (
    <>
      {!periodInHeader &&
      filters.dateRange !== DEFAULT_ORCHESTRATION_FILTERS.dateRange ? (
        <AdminFilterChip
          label={dateRangeLabels[filters.dateRange]}
          onRemove={() =>
            update({ dateRange: DEFAULT_ORCHESTRATION_FILTERS.dateRange })
          }
        />
      ) : null}
      {filters.deliveryStatus !== "all" ? (
        <AdminFilterChip
          label={
            DELIVERY_STATUS_FILTER_OPTIONS.find(
              (option) => option.value === filters.deliveryStatus,
            )?.label ?? filters.deliveryStatus
          }
          onRemove={() => update({ deliveryStatus: "all" })}
        />
      ) : null}
      {filters.bookingStatus !== "all" ? (
        <AdminFilterChip
          label={labelForOption(bookingStatusOptions, filters.bookingStatus)}
          onRemove={() => update({ bookingStatus: "all" })}
        />
      ) : null}
      {filters.orchestrationStatus !== "all" ? (
        <AdminFilterChip
          label={labelForOption(
            orchestrationStatusOptions,
            filters.orchestrationStatus,
          )}
          onRemove={() => update({ orchestrationStatus: "all" })}
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
      headingId="orchestration-filters-heading"
      sheetTitle="Orchestration filters"
      resultSummary={`${resultCount} orchestration${resultCount === 1 ? "" : "s"} matching`}
      sheetActiveCount={sheetActiveCount}
      totalActiveCount={activeFilterCount}
      onClearFilters={() =>
        onChange({
          ...DEFAULT_ORCHESTRATION_FILTERS,
          ...(periodInHeader ? { dateRange: filters.dateRange } : {}),
        })
      }
      activeFilterChips={hasChipFilters ? activeFilterChips : undefined}
      search={
        <Input
          id="orchestration-search"
          type="search"
          placeholder="Search by DOOT reference or delivery UUID"
          value={filters.search}
          onChange={(event) => update({ search: event.target.value })}
          aria-label="Search orchestrations"
          className="border-border/60 shadow-sm"
        />
      }
      period={periodControl}
      sheetContent={
        <>
          <AdminCustomSelect
            label="Delivery status"
            value={filters.deliveryStatus}
            options={DELIVERY_STATUS_FILTER_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            onChange={(value) =>
              update({
                deliveryStatus: value as BackendDeliveryStatus | "all",
              })
            }
          />
          <AdminCustomSelect
            label="Booking status"
            value={filters.bookingStatus}
            options={bookingStatusOptions}
            onChange={(value) =>
              update({
                bookingStatus: value as BackendProviderBookingStatus | "all",
              })
            }
          />
          <AdminCustomSelect
            label="Orchestration status"
            value={filters.orchestrationStatus}
            options={orchestrationStatusOptions}
            onChange={(value) =>
              update({
                orchestrationStatus: value as BackendOrchestrationRequestStatus | "all",
              })
            }
          />
        </>
      }
    />
  );
}
