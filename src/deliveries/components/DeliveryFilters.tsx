"use client";

import { useMemo } from "react";
import Input from "@/common/components/Input";
import type { BackendDeliveryStatus } from "@/data/deliveryApiTypes";
import type { DateRangeKey } from "@/data/orchestrationMetrics";
import { DELIVERY_STATUS_FILTER_OPTIONS } from "../deliveryStatus";
import AdminCustomSelect from "@/ui/AdminCustomSelect";
import DashboardCardDateRange from "@/overview/components/DashboardCardDateRange";
import AdminFilterChip from "@/ui/AdminFilterChip";
import AdminFilterToolbar from "@/ui/AdminFilterToolbar";

export type DeliveryFilterState = {
  search: string;
  deliveryStatus: BackendDeliveryStatus | "all";
  dateRange: DateRangeKey;
};

export const DEFAULT_DELIVERY_FILTERS: DeliveryFilterState = {
  search: "",
  deliveryStatus: "all",
  dateRange: "30d",
};

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
  periodInHeader?: boolean;
};

function countActiveFilters(
  filters: DeliveryFilterState,
  includeDateRange: boolean,
): number {
  let count = 0;
  if (filters.search.trim()) count += 1;
  if (filters.deliveryStatus !== "all") count += 1;
  if (includeDateRange && filters.dateRange !== DEFAULT_DELIVERY_FILTERS.dateRange) {
    count += 1;
  }
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

  const hasChipFilters =
    (!periodInHeader && filters.dateRange !== DEFAULT_DELIVERY_FILTERS.dateRange) ||
    filters.deliveryStatus !== "all";

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
          label={
            DELIVERY_STATUS_FILTER_OPTIONS.find(
              (o) => o.value === filters.deliveryStatus,
            )?.label ?? filters.deliveryStatus
          }
          onRemove={() => update({ deliveryStatus: "all" })}
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
      resultSummary={`${resultCount.toLocaleString()} deliver${resultCount === 1 ? "y" : "ies"} matching`}
      sheetActiveCount={filters.deliveryStatus !== "all" ? 1 : 0}
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
          placeholder="Search by DOOT reference"
          value={filters.search}
          onChange={(event) => update({ search: event.target.value })}
          aria-label="Search by delivery reference"
          className="border-border/60 shadow-sm"
        />
      }
      period={periodControl}
      sheetContent={
        <AdminCustomSelect
          variant="panel"
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
      }
    />
  );
}
