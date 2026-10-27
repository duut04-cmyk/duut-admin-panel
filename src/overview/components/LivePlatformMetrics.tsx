"use client";

import type { ReportingSummary } from "@/data/reportingTypes";
import {
  formatDecisionTime,
  formatPercent,
  trendFromChangePercent,
} from "../reportingUi";
import OverviewMetricCard, {
  DeliveredIcon,
  InProgressIcon,
  PackageIcon,
  StopwatchIcon,
  TicketIcon,
} from "./OverviewMetricCard";

type LivePlatformMetricsProps = {
  summary: ReportingSummary;
};

export default function LivePlatformMetrics({ summary }: LivePlatformMetricsProps) {
  const { deliveriesCreated, booking, orchestrationRuns, trends } = summary;

  return (
    <section aria-labelledby="platform-metrics-heading">
      <h2 id="platform-metrics-heading" className="sr-only">
        Platform metrics
      </h2>
      <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 md:[&>*:last-child]:col-span-1 xl:grid-cols-5 [&>*:last-child]:col-span-2">
        <OverviewMetricCard
          title="Deliveries created"
          value={deliveriesCreated.total.toLocaleString()}
          trend={trendFromChangePercent(trends.deliveriesCreated.changePercent)}
          theme="orange"
          icon={<PackageIcon />}
        />
        <OverviewMetricCard
          title="Currently delivered"
          value={deliveriesCreated.deliveredCurrentStatus.toLocaleString()}
          trend={trendFromChangePercent(trends.deliveredCurrentStatus.changePercent)}
          theme="green"
          icon={<DeliveredIcon />}
        />
        <OverviewMetricCard
          title="In progress"
          value={deliveriesCreated.inProgress.toLocaleString()}
          trend={{ value: "—", direction: "neutral" }}
          theme="blue"
          icon={<InProgressIcon />}
        />
        <OverviewMetricCard
          title="Booking success rate"
          value={formatPercent(booking.successRatePercent)}
          trend={trendFromChangePercent(trends.bookingSuccessRatePercent.changePercent)}
          theme="purple"
          icon={<TicketIcon />}
        />
        <OverviewMetricCard
          title="Avg orchestration time"
          value={formatDecisionTime(orchestrationRuns.averageDurationMs)}
          trend={trendFromChangePercent(
            trends.averageOrchestrationDurationMs.changePercent,
            true,
          )}
          theme="pink"
          icon={<StopwatchIcon />}
        />
      </div>
    </section>
  );
}
