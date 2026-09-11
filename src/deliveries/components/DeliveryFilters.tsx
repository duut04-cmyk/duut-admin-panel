"use client";

import Input from "@/common/components/Input";
import type { BookingStatus, DeliveryRequestStatus } from "@/data/orchestrationTypes";
import type { DateRangeKey } from "@/data/orchestrationMetrics";
import AdminCustomSelect from "@/ui/AdminCustomSelect";
import AdminDateRange from "@/ui/AdminDateRange";
import type { OutcomeFilter } from "./utils";

export type DeliveryFilterState = {
  search: string;
  deliveryStatus: DeliveryRequestStatus | "all";
  bookingStatus: BookingStatus | "all";
  dateRange: DateRangeKey;
  outcome: OutcomeFilter;
};

const deliveryStatusOptions = [
  { value: "all", label: "All" },
  { value: "delivered", label: "Delivered" },
  { value: "in_transit", label: "In transit" },
  { value: "booked", label: "Booked" },
  { value: "failed", label: "Failed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "orchestrating", label: "Orchestrating" },
  { value: "pending_orchestration", label: "Pending" },
];

const bookingStatusOptions = [
  { value: "all", label: "All" },
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

type DeliveryFiltersProps = {
  filters: DeliveryFilterState;
  onChange: (filters: DeliveryFilterState) => void;
  resultCount: number;
};

export default function DeliveryFilters({
  filters,
  onChange,
  resultCount,
}: DeliveryFiltersProps) {
  const update = (partial: Partial<DeliveryFilterState>) => {
    onChange({ ...filters, ...partial });
  };

  return (
    <section aria-labelledby="delivery-filters-heading">
      <div>
        <h2
          id="delivery-filters-heading"
          className="text-body font-semibold text-foreground"
        >
          Filters
        </h2>
        <p className="mt-0.5 text-small text-muted-foreground">
          {resultCount} deliver{resultCount === 1 ? "y" : "ies"} matching
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-1">
          <label
            htmlFor="delivery-search"
            className="mb-1.5 block text-caption font-medium text-muted-foreground"
          >
            Search
          </label>
          <Input
            id="delivery-search"
            type="search"
            placeholder="DOOT-1042"
            value={filters.search}
            onChange={(event) => update({ search: event.target.value })}
            aria-label="Search by delivery ID"
          />
        </div>

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

        <AdminDateRange
          label="Period"
          value={filters.dateRange}
          onChange={(value) => update({ dateRange: value as DateRangeKey })}
        />

        <AdminCustomSelect
          label="Outcome"
          value={filters.outcome}
          options={outcomeOptions}
          onChange={(value) =>
            update({ outcome: value as OutcomeFilter })
          }
        />
      </div>
    </section>
  );
}
