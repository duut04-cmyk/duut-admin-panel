import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import type { MetricTrend } from "@/data/dashboardMetrics";
import OverviewMetricCard, {
  CancelledIcon,
  DeliveredIcon,
  FailedIcon,
  InProgressIcon,
  PackageIcon,
} from "@/overview/components/OverviewMetricCard";
import {
  getCumulativeDeliverySparkline,
  getCumulativeDeliveredSparkline,
  getCumulativeStatusSparkline,
} from "@/overview/components/sparklineUtils";
import type { DeliveryMetrics } from "./utils";

const deliveryTrends: Record<keyof DeliveryMetrics, MetricTrend> = {
  total: { value: "12%", direction: "positive" },
  inTransit: { value: "8%", direction: "positive" },
  delivered: { value: "15%", direction: "positive" },
  failed: { value: "4%", direction: "negative" },
  cancelled: { value: "2%", direction: "negative" },
};

type DeliveryListSummaryProps = {
  metrics: DeliveryMetrics;
  records: OrchestrationRecord[];
  className?: string;
};

export default function DeliveryListSummary({
  metrics,
  records,
  className = "",
}: DeliveryListSummaryProps) {
  return (
    <section aria-labelledby="delivery-summary-heading" className={className}>
      <h2 id="delivery-summary-heading" className="sr-only">
        Delivery summary
      </h2>
      <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 md:[&>*:last-child]:col-span-1 xl:grid-cols-5 [&>*:last-child]:col-span-2">
        <OverviewMetricCard
          title="Total Deliveries"
          value={metrics.total.toLocaleString()}
          trend={deliveryTrends.total}
          theme="orange"
          icon={<PackageIcon />}
          sparklineValues={getCumulativeDeliverySparkline(records)}
        />
        <OverviewMetricCard
          title="In Transit"
          value={metrics.inTransit.toLocaleString()}
          trend={deliveryTrends.inTransit}
          theme="blue"
          icon={<InProgressIcon />}
          sparklineValues={getCumulativeStatusSparkline(records, "in_transit")}
        />
        <OverviewMetricCard
          title="Delivered"
          value={metrics.delivered.toLocaleString()}
          trend={deliveryTrends.delivered}
          theme="green"
          icon={<DeliveredIcon />}
          sparklineValues={getCumulativeDeliveredSparkline(records)}
        />
        <OverviewMetricCard
          title="Failed"
          value={metrics.failed.toLocaleString()}
          trend={deliveryTrends.failed}
          theme="red"
          icon={<FailedIcon />}
          sparklineValues={getCumulativeStatusSparkline(records, "failed")}
        />
        <OverviewMetricCard
          title="Cancelled"
          value={metrics.cancelled.toLocaleString()}
          trend={deliveryTrends.cancelled}
          theme="slate"
          icon={<CancelledIcon />}
          sparklineValues={getCumulativeStatusSparkline(records, "cancelled")}
        />
      </div>
    </section>
  );
}
