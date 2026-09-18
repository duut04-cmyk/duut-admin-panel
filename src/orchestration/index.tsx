"use client";

import { useMemo, useState } from "react";
import {
  filterRecordsByDateRange,
  getAllOrchestrations,
  getPlatformMetrics,
} from "@/data";
import AdminContainer from "@/components/AdminContainer";
import { ADMIN_LIST_PAGE_FILTERS_SECTION } from "@/components/layout";
import AdminShell from "@/components/AdminShell";
import OrchestrationFilters, {
  DEFAULT_ORCHESTRATION_FILTERS,
  type OrchestrationFilterState,
} from "./components/OrchestrationFilters";
import OrchestrationList from "./components/OrchestrationList";
import OrchestrationListSummary from "./components/OrchestrationListSummary";
import OrchestrationPageHeader from "./components/OrchestrationPageHeader";
import { matchesOutcome } from "./components/utils";

export default function OrchestrationPage() {
  const [filters, setFilters] = useState<OrchestrationFilterState>(
    DEFAULT_ORCHESTRATION_FILTERS,
  );

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
      mainClassName="bg-background"
      customHeader={
        <OrchestrationPageHeader
          dateRange={filters.dateRange}
          onDateRangeChange={(dateRange) =>
            setFilters((current) => ({ ...current, dateRange }))
          }
        />
      }
    >
      <AdminContainer flushTop className="space-y-6 pb-10">
        <OrchestrationListSummary metrics={metrics} records={filteredRecords} />
        <div className={ADMIN_LIST_PAGE_FILTERS_SECTION}>
          <OrchestrationFilters
            filters={filters}
            onChange={setFilters}
            resultCount={filteredRecords.length}
            periodInHeader
          />
          <OrchestrationList records={filteredRecords} />
        </div>
      </AdminContainer>
    </AdminShell>
  );
}
