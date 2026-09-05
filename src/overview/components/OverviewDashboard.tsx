"use client";

import { useMemo, useState } from "react";
import {
  filterRecordsByDateRange,
  getAllOrchestrations,
  getTopFailureReasons,
  getPlatformMetrics,
  getServicePerformance,
} from "@/data";
import AdminContainer from "@/components/AdminContainer";
import AdminShell from "@/components/AdminShell";
import { ADMIN_SHELL_CONTENT_PADDING } from "@/components/layout";
import AdminEmptyState from "@/ui/AdminEmptyState";
import type { DateRangeKey } from "@/data/orchestrationMetrics";
import BookingOutcomesChart from "./BookingOutcomesChart";
import DecisionSpeed from "./DecisionSpeed";
import DeliveriesOverTime from "./DeliveriesOverTime";
import FailureAnalysis from "./FailureAnalysis";
import OrchestrationExplanation from "./OrchestrationExplanation";
import OrchestrationFunnel from "./OrchestrationFunnel";
import { OverviewToolbar } from "./OverviewPageHeader";
import PlatformMetrics from "./PlatformMetrics";
import RecentDecisions from "./RecentDecisions";
import SelectedServicesDistribution from "./SelectedServicesDistribution";
import ServicePerformanceSection from "./ServicePerformanceSection";

export default function OverviewDashboard() {
  const [dateRange, setDateRange] = useState<DateRangeKey>("30d");
  const [refreshing, setRefreshing] = useState(false);

  const allRecords = useMemo(() => getAllOrchestrations(), []);

  const records = useMemo(
    () => filterRecordsByDateRange(allRecords, dateRange),
    [allRecords, dateRange],
  );

  const metrics = useMemo(() => getPlatformMetrics(records), [records]);
  const services = useMemo(() => getServicePerformance(records), [records]);
  const failureReasons = useMemo(() => getTopFailureReasons(records), [records]);
  const recent = useMemo(
    () =>
      [...records]
        .sort(
          (a, b) =>
            new Date(b.deliveryRequest.createdAt).getTime() -
            new Date(a.deliveryRequest.createdAt).getTime(),
        )
        .slice(0, 5),
    [records],
  );

  const handleRefresh = () => {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 400);
  };

  return (
    <AdminShell
      mainClassName="bg-background"
      customHeader={({ onMenuClick }) => (
        <div
          className={`bg-background pt-6 lg:pt-8 ${ADMIN_SHELL_CONTENT_PADDING}`}
        >
          <OverviewToolbar
            onMenuClick={onMenuClick}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        </div>
      )}
    >
      <AdminContainer className="space-y-10 pb-10 pt-5">
        {records.length === 0 ? (
          <AdminEmptyState
            title="No data for this period"
            description="Adjust the date range to view orchestration activity."
          />
        ) : (
          <>
            <PlatformMetrics metrics={metrics} records={records} />

            <div className="grid gap-6 lg:grid-cols-2">
              <OrchestrationFunnel metrics={metrics} records={records} />
              <DecisionSpeed metrics={metrics} records={records} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
              <DeliveriesOverTime metrics={metrics} records={records} />
              <BookingOutcomesChart metrics={metrics} records={records} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
              <ServicePerformanceSection services={services} />
              <SelectedServicesDistribution services={services} />
            </div>

            <div className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-[7fr_13fr] lg:items-stretch">
                <FailureAnalysis
                  items={failureReasons.items}
                  totalFailures={failureReasons.totalFailures}
                />
                <RecentDecisions records={recent} />
              </div>

              <OrchestrationExplanation />
            </div>
          </>
        )}
      </AdminContainer>
    </AdminShell>
  );
}
