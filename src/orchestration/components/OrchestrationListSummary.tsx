import OverviewMetricCard, {
  FailedIcon,
  InProgressIcon,
  PackageIcon,
  TicketIcon,
} from "@/overview/components/OverviewMetricCard";
import type { OrchestrationListMetrics } from "../orchestrationListMappers";
import { sparklineFromCount } from "@/deliveries/deliveryMappers";

type OrchestrationListSummaryProps = {
  metrics: OrchestrationListMetrics;
  className?: string;
};

export default function OrchestrationListSummary({
  metrics,
  className = "",
}: OrchestrationListSummaryProps) {
  return (
    <section aria-labelledby="orchestration-summary-heading" className={className}>
      <h2 id="orchestration-summary-heading" className="sr-only">
        Orchestration summary
      </h2>
      <p className="mb-3 text-caption text-muted-foreground">
        Counts below reflect the current page; total matches your filters across all
        pages.
      </p>
      <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 md:[&>*:last-child]:col-span-1 xl:grid-cols-5 [&>*:last-child]:col-span-2">
        <OverviewMetricCard
          title="Total matching"
          value={metrics.totalMatching.toLocaleString()}
          theme="orange"
          icon={<PackageIcon />}
          sparklineValues={sparklineFromCount(metrics.totalMatching)}
        />
        <OverviewMetricCard
          title="Completed (page)"
          value={metrics.completedOnPage.toLocaleString()}
          theme="purple"
          icon={<InProgressIcon />}
          sparklineValues={sparklineFromCount(metrics.completedOnPage)}
        />
        <OverviewMetricCard
          title="With selection (page)"
          value={metrics.withSelectionOnPage.toLocaleString()}
          theme="blue"
          icon={<InProgressIcon />}
          sparklineValues={sparklineFromCount(metrics.withSelectionOnPage)}
        />
        <OverviewMetricCard
          title="Booked (page)"
          value={metrics.bookedOnPage.toLocaleString()}
          theme="green"
          icon={<TicketIcon />}
          sparklineValues={sparklineFromCount(metrics.bookedOnPage)}
        />
        <OverviewMetricCard
          title="Failed (page)"
          value={metrics.failedOnPage.toLocaleString()}
          theme="pink"
          icon={<FailedIcon />}
          sparklineValues={sparklineFromCount(metrics.failedOnPage)}
        />
      </div>
    </section>
  );
}
