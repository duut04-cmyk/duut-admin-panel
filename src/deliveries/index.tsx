"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { filterRecordsByDateRange, getAllOrchestrations } from "@/data";
import AdminContainer from "@/components/AdminContainer";
import { ADMIN_LIST_PAGE_FILTERS_SECTION } from "@/components/layout";
import AdminShell from "@/components/AdminShell";
import DeliveryFilters, {
  DEFAULT_DELIVERY_FILTERS,
  type DeliveryFilterState,
} from "./components/DeliveryFilters";
import DeliveryList from "./components/DeliveryList";
import DeliveryListSummary from "./components/DeliveryListSummary";
import DeliveryPageHeader from "./components/DeliveryPageHeader";
import { getDeliveryMetrics, matchesOutcome } from "./components/utils";

export default function DeliveriesPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";
  const [filters, setFilters] = useState<DeliveryFilterState>({
    ...DEFAULT_DELIVERY_FILTERS,
    search: initialSearch,
  });

  const allRecords = useMemo(() => getAllOrchestrations(), []);

  const filteredRecords = useMemo(() => {
    const byDate = filterRecordsByDateRange(allRecords, filters.dateRange);
    const query = filters.search.trim().toLowerCase();

    return byDate
      .filter((record) => {
        if (!query) return true;
        return record.deliveryRequest.deliveryId.toLowerCase().includes(query);
      })
      .filter((record) => {
        if (filters.deliveryStatus === "all") return true;
        return record.deliveryRequest.status === filters.deliveryStatus;
      })
      .filter((record) => {
        if (filters.bookingStatus === "all") return true;
        return record.booking.status === filters.bookingStatus;
      })
      .filter((record) => matchesOutcome(record, filters.outcome))
      .sort(
        (a, b) =>
          new Date(b.deliveryRequest.createdAt).getTime() -
          new Date(a.deliveryRequest.createdAt).getTime(),
      );
  }, [allRecords, filters]);

  const metrics = useMemo(() => getDeliveryMetrics(filteredRecords), [filteredRecords]);

  return (
    <AdminShell
      mainClassName="bg-background"
      customHeader={
        <DeliveryPageHeader
          dateRange={filters.dateRange}
          onDateRangeChange={(dateRange) =>
            setFilters((current) => ({ ...current, dateRange }))
          }
        />
      }
    >
      <AdminContainer flushTop className="space-y-6 pb-10">
        <DeliveryListSummary metrics={metrics} records={filteredRecords} />
        <div className={ADMIN_LIST_PAGE_FILTERS_SECTION}>
          <DeliveryFilters
            filters={filters}
            onChange={setFilters}
            resultCount={filteredRecords.length}
            periodInHeader
          />
          <DeliveryList records={filteredRecords} />
        </div>
      </AdminContainer>
    </AdminShell>
  );
}
