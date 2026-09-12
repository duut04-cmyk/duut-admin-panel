"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { filterRecordsByDateRange, getAllOrchestrations } from "@/data";
import AdminContainer from "@/components/AdminContainer";
import AdminShell from "@/components/AdminShell";
import DeliveryFilters, {
  type DeliveryFilterState,
} from "./components/DeliveryFilters";
import DeliveryList from "./components/DeliveryList";
import DeliveryListSummary from "./components/DeliveryListSummary";
import { getDeliveryMetrics, matchesOutcome } from "./components/utils";

const defaultFilters: DeliveryFilterState = {
  search: "",
  deliveryStatus: "all",
  bookingStatus: "all",
  dateRange: "30d",
  outcome: "all",
};

export default function DeliveriesPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";
  const [filters, setFilters] = useState<DeliveryFilterState>({
    ...defaultFilters,
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
      title="Deliveries"
      subtitle="Monitor delivery activity, status, bookings, and outcomes."
    >
      <AdminContainer className="space-y-8 pb-10">
        <DeliveryListSummary metrics={metrics} />
        <DeliveryFilters
          filters={filters}
          onChange={setFilters}
          resultCount={filteredRecords.length}
        />
        <DeliveryList records={filteredRecords} />
      </AdminContainer>
    </AdminShell>
  );
}
