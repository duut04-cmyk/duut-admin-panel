"use client";

import { useMemo, useState } from "react";
import { getAllOrchestrations } from "@/data";
import {
  getDashboardMetrics,
  getDeliveryFunnelMetrics,
  getTopServiceCategories,
} from "@/data/dashboardMetrics";
import { filterRecordsByDateRange } from "@/data/orchestrationMetrics";
import type { DateRangeKey } from "@/data/orchestrationMetrics";
import AdminContainer from "@/components/AdminContainer";
import AdminShell from "@/components/AdminShell";
import { ADMIN_DASHBOARD_RAIL_GRID } from "@/components/layout";
import AdminEmptyState from "@/ui/AdminEmptyState";
import DashboardPageHeader from "./DashboardPageHeader";
import DecisionSpeed from "./DecisionSpeed";
import DeliveryFunnel from "./DeliveryFunnel";
import LiveActivityFeed from "./rightRail/LiveActivityFeed";
import TopServicesWidget from "./rightRail/TopServicesWidget";
import PlatformMetrics from "./PlatformMetrics";
import RecentDeliveriesTable from "./RecentDeliveriesTable";

export default function OverviewDashboard() {
  const [dateRange, setDateRange] = useState<DateRangeKey>("30d");

  const allRecords = useMemo(() => getAllOrchestrations(), []);

  const records = useMemo(
    () => filterRecordsByDateRange(allRecords, dateRange),
    [allRecords, dateRange],
  );

  const metrics = useMemo(
    () => getDashboardMetrics(allRecords, dateRange),
    [allRecords, dateRange],
  );

  const funnel = useMemo(() => getDeliveryFunnelMetrics(records), [records]);

  const topServices = useMemo(() => getTopServiceCategories(records), [records]);

  const recentRecords = useMemo(
    () =>
      [...records]
        .sort(
          (a, b) =>
            new Date(b.deliveryRequest.createdAt).getTime() -
            new Date(a.deliveryRequest.createdAt).getTime(),
        )
        .slice(0, 8),
    [records],
  );

  return (
    <AdminShell
      mainClassName="bg-background"
      customHeader={
        <DashboardPageHeader dateRange={dateRange} onDateRangeChange={setDateRange} />
      }
    >
      <AdminContainer className="min-w-0 space-y-6 overflow-x-hidden bg-background pb-10 pt-0 lg:space-y-6">
        {records.length === 0 ? (
          <AdminEmptyState
            title="No data for this period"
            description="Adjust the date range to view delivery activity."
          />
        ) : (
          <>
            <div className={`grid min-w-0 gap-6 ${ADMIN_DASHBOARD_RAIL_GRID}`}>
              <div className="min-w-0 space-y-6">
                <PlatformMetrics metrics={metrics} records={records} />

                <div className="grid min-w-0 gap-6 xl:grid-cols-2 xl:items-start">
                  <DeliveryFunnel
                    funnel={funnel}
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                  />
                  <DecisionSpeed metrics={metrics} records={records} />
                </div>

                <RecentDeliveriesTable records={recentRecords} />
              </div>

              <aside className="grid min-w-0 grid-cols-1 items-stretch gap-4 md:grid-cols-2 xl:grid-cols-1 xl:flex xl:flex-col xl:gap-6 xl:sticky xl:top-20 xl:self-start">
                <div className="flex min-w-0 flex-col">
                  <LiveActivityFeed />
                </div>
                <div className="flex min-w-0 flex-col">
                  <TopServicesWidget
                    categories={topServices}
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                  />
                </div>
              </aside>
            </div>
          </>
        )}
      </AdminContainer>
    </AdminShell>
  );
}
