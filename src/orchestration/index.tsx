"use client";

import { useMemo, useState } from "react";
import {
  filterRecordsByDateRange,
  getAllOrchestrations,
  getPlatformMetrics,
} from "@/data";
import AdminContainer from "@/components/AdminContainer";
import AdminShell from "@/components/AdminShell";
import OrchestrationFilters, {
  type OrchestrationFilterState,
} from "./components/OrchestrationFilters";
import OrchestrationList from "./components/OrchestrationList";
import OrchestrationListSummary from "./components/OrchestrationListSummary";
import { matchesOutcome } from "./components/utils";

const defaultFilters: OrchestrationFilterState = {
  search: "",
  deliveryStatus: "all",
  bookingStatus: "all",
  dateRange: "30d",
  outcome: "all",
};

export default function OrchestrationPage() {
  const [filters, setFilters] = useState<OrchestrationFilterState>(defaultFilters);

  const allRecords = useMemo(() => getAllOrchestrations(), []);

  const filteredRecords = useMemo(() => {
    const byDate = filterRecordsByDateRange(allRecords, filters.dateRange);
    const query = filters.search.trim().toLowerCase();

    return byDate
      .filter((record) => {
        if (query) {
          return record.deliveryRequest.deliveryId.toLowerCase().includes(query);
        }
        return true;
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

  const metrics = useMemo(() => getPlatformMetrics(filteredRecords), [filteredRecords]);

  return (
    <AdminShell
      title="Orchestration"
      subtitle="Inspect how Doot evaluates, selects, and books delivery services."
    >
      <AdminContainer className="space-y-8 pb-10">
        <OrchestrationListSummary metrics={metrics} />
        <OrchestrationFilters
          filters={filters}
          onChange={setFilters}
          resultCount={filteredRecords.length}
        />
        <OrchestrationList records={filteredRecords} />
      </AdminContainer>
    </AdminShell>
  );
}
