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

  const funnel = useMemo(
    () => getDeliveryFunnelMetrics(records),
    [records],
  );

  const topServices = useMemo(
    () => getTopServiceCategories(records),
    [records],
  );

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
        <DashboardPageHeader
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      }
    >
      <AdminContainer className="space-y-6 bg-background pb-10 pt-0 lg:space-y-6">
        {records.length === 0 ? (
          <AdminEmptyState
            title="No data for this period"
            description="Adjust the date range to view delivery activity."
          />
        ) : (
          <>
            <div className={`grid gap-6 ${ADMIN_DASHBOARD_RAIL_GRID}`}>
              <div className="min-w-0 space-y-6">
                <PlatformMetrics metrics={metrics} records={records} />

                <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
                  <DeliveryFunnel
                    funnel={funnel}
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                  />
                  <DecisionSpeed metrics={metrics} records={records} />
                </div>

                <RecentDeliveriesTable records={recentRecords} />
              </div>

              <aside className="hidden flex-col gap-6 xl:flex">
                <LiveActivityFeed />
                <TopServicesWidget
                  categories={topServices}
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                />
              </aside>
            </div>

            <div className="space-y-6 xl:hidden">
              <LiveActivityFeed />
              <TopServicesWidget
                categories={topServices}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
            </div>
          </>
        )}
      </AdminContainer>
    </AdminShell>
  );
}
