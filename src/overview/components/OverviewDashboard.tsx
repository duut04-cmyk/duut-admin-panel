"use client";

import { useCallback, useMemo, useState } from "react";
import { useLoadedAsync } from "@/lib/useLoadedAsync";
import { useExclusiveAsync } from "@/lib/useExclusiveAsync";
import AdminLoadErrorCallout from "@/components/AdminLoadErrorCallout";
import {
  resolveReportingWindow,
  type ReportingDateRangeKey,
} from "@/lib/reportingDateRange";
import type {
  RecentActivityItem,
  RecentDeliveryItem,
  ReportingSummary,
} from "@/data/reportingTypes";
import type { DateRangeKey } from "@/data/orchestrationMetrics";
import {
  fetchRecentActivity,
  fetchRecentDeliveries,
  fetchReportingSummary,
} from "@/reporting/api";
import AdminContainer from "@/components/AdminContainer";
import AdminShell from "@/components/AdminShell";
import { ADMIN_DASHBOARD_RAIL_GRID } from "@/components/layout";
import { OverviewPageSkeleton } from "@/components/loading/skeletonSections";
import AdminEmptyState from "@/ui/AdminEmptyState";
import DashboardPageHeader from "./DashboardPageHeader";
import DecisionSpeedReporting from "./DecisionSpeedReporting";
import DeliveryFunnel from "./DeliveryFunnel";
import OverviewRecentActivityFeed from "./OverviewRecentActivityFeed";
import PlatformMetrics from "./PlatformMetrics";
import RecentDeliveriesReportingTable from "./RecentDeliveriesReportingTable";
import TopServicesWidget from "./rightRail/TopServicesWidget";
import {
  mapPackageDistributionToTopServices,
  mapRecentDeliveryItems,
  mapSummaryToDashboardMetrics,
  mapSummaryToFunnelMetrics,
} from "@/overview/liveOverviewMappers";

async function loadSecondaryOverviewData(window: { from: string; to: string }) {
  const [recentDeliveriesResult, activityResult] = await Promise.all([
    fetchRecentDeliveries({ from: window.from, to: window.to, limit: 8 }),
    fetchRecentActivity({ limit: 12, hours: 24 }),
  ]);

  return {
    recentDeliveries: recentDeliveriesResult.success
      ? (recentDeliveriesResult.data?.items ?? [])
      : [],
    recentActivity: activityResult.success ? (activityResult.data?.items ?? []) : [],
    activityHours: activityResult.data?.hours ?? 24,
    partialErrors: [
      !recentDeliveriesResult.success ? recentDeliveriesResult.error : null,
      !activityResult.success ? activityResult.error : null,
    ].filter(Boolean) as string[],
  };
}

export default function OverviewDashboard() {
  const [dateRange, setDateRange] = useState<ReportingDateRangeKey>("30d");
  const window = useMemo(() => resolveReportingWindow(dateRange), [dateRange]);
  const dateRangeKey = dateRange as DateRangeKey;

  const [summary, setSummary] = useState<ReportingSummary | null>(null);
  const [recentDeliveries, setRecentDeliveries] = useState<RecentDeliveryItem[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);
  const [activityHours, setActivityHours] = useState(24);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [secondaryLoading, setSecondaryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partialErrors, setPartialErrors] = useState<string[]>([]);

  const loadOverview = useCallback(async () => {
    setSummaryLoading(true);
    setSecondaryLoading(true);
    setError(null);

    const summaryResult = await fetchReportingSummary({
      from: window.from,
      to: window.to,
    });
    if (!summaryResult.success || !summaryResult.data) {
      setSummary(null);
      setRecentDeliveries([]);
      setRecentActivity([]);
      setSummaryLoading(false);
      setSecondaryLoading(false);
      return {
        success: false as const,
        error: summaryResult.error ?? "Failed to load reporting summary.",
      };
    }

    setSummary(summaryResult.data);
    setSummaryLoading(false);

    const secondary = await loadSecondaryOverviewData(window);
    setRecentDeliveries(secondary.recentDeliveries);
    setRecentActivity(secondary.recentActivity);
    setActivityHours(secondary.activityHours);
    setPartialErrors(secondary.partialErrors);
    setSecondaryLoading(false);

    return { success: true as const };
  }, [window.from, window.to]);

  const refresh = useCallback(async () => {
    const result = await loadOverview();
    if (!result.success) {
      setError(result.error);
    } else {
      setError(null);
    }
  }, [loadOverview]);

  const { run: retryOverview, busy: retryingOverview } = useExclusiveAsync(refresh);

  useLoadedAsync(
    async (isStale) => {
      const result = await loadOverview();
      if (isStale()) return;
      if (!result.success) {
        setError(result.error);
        return;
      }
      setError(null);
    },
    [loadOverview],
  );

  const metrics = useMemo(
    () => (summary ? mapSummaryToDashboardMetrics(summary) : null),
    [summary],
  );
  const funnel = useMemo(
    () => (summary ? mapSummaryToFunnelMetrics(summary) : null),
    [summary],
  );
  const topServices = useMemo(
    () => (summary ? mapPackageDistributionToTopServices(summary) : []),
    [summary],
  );
  const recentRows = useMemo(
    () => mapRecentDeliveryItems(recentDeliveries),
    [recentDeliveries],
  );

  const handleDateRangeChange = (value: DateRangeKey) => {
    if (value === "7d" || value === "30d" || value === "month") {
      setDateRange(value);
    }
  };

  const isPageLoading = (summaryLoading || secondaryLoading) && !error;

  return (
    <AdminShell
      mainClassName="bg-background"
      customHeader={
        <DashboardPageHeader
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
        />
      }
    >
      <AdminContainer className="min-w-0 space-y-6 overflow-x-hidden bg-background pb-10 pt-0 lg:space-y-6">
        {error ? (
          <AdminLoadErrorCallout
            title="Unable to load overview"
            onRetry={() => void retryOverview()}
            retrying={retryingOverview}
          >
            <p>{error}</p>
          </AdminLoadErrorCallout>
        ) : null}

        {partialErrors.length > 0 && !error ? (
          <AdminLoadErrorCallout
            title="Some overview data is unavailable"
            onRetry={() => void retryOverview()}
            retrying={retryingOverview}
          >
            <p>{partialErrors.join(" ")}</p>
          </AdminLoadErrorCallout>
        ) : null}

        {isPageLoading ? <OverviewPageSkeleton /> : null}

        {!isPageLoading && summary && metrics && funnel ? (
          summary.deliveriesCreated.total === 0 ? (
            <AdminEmptyState
              title="No data for this period"
              description="Adjust the date range to view delivery activity."
            />
          ) : (
            <div className="min-w-0 space-y-4">
              <PlatformMetrics
                metrics={metrics}
                trailing={
                  <OverviewRecentActivityFeed
                    items={recentActivity}
                    hours={activityHours}
                  />
                }
              />

              <div
                className={`grid min-w-0 items-start gap-4 ${ADMIN_DASHBOARD_RAIL_GRID}`}
              >
                <div className="min-w-0 space-y-4">
                  <div className="grid min-w-0 items-stretch gap-4 xl:grid-cols-2">
                    <DeliveryFunnel
                      funnel={funnel}
                      dateRange={dateRangeKey}
                      onDateRangeChange={handleDateRangeChange}
                    />
                    <DecisionSpeedReporting summary={summary} />
                  </div>

                  <RecentDeliveriesReportingTable rows={recentRows} />
                </div>

                <div className="min-w-0 xl:sticky xl:top-20 xl:self-start">
                  <TopServicesWidget
                    categories={topServices}
                    dateRange={dateRangeKey}
                    onDateRangeChange={handleDateRangeChange}
                  />
                </div>
              </div>
            </div>
          )
        ) : null}

        {!isPageLoading && !summary && !error ? (
          <p className="text-small text-muted-foreground">
            No reporting data available.
          </p>
        ) : null}
      </AdminContainer>
    </AdminShell>
  );
}
