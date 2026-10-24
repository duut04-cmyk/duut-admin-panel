import type { DeliveryListItem } from "@/data/deliveryApiTypes";
import OverviewMetricCard, {
  CancelledIcon,
  DeliveredIcon,
  FailedIcon,
  InProgressIcon,
  PackageIcon,
} from "@/overview/components/OverviewMetricCard";
import { getDeliveryMetricsFromList, sparklineFromCount } from "../deliveryMappers";
import type { DeliveryMetrics } from "./utils";

type DeliveryListSummaryProps = {
  items: DeliveryListItem[];
  totalMatching: number;
  className?: string;
};

export default function DeliveryListSummary({
  items,
  totalMatching,
  className = "",
}: DeliveryListSummaryProps) {
  const metrics: DeliveryMetrics = getDeliveryMetricsFromList(items, totalMatching);

  return (
    <section aria-labelledby="delivery-summary-heading" className={className}>
      <h2 id="delivery-summary-heading" className="sr-only">
        Delivery summary
      </h2>
      <p className="mb-3 text-caption text-muted-foreground">
        Status counts below reflect the current page; total matches your filters across
        all pages.
      </p>
      <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 md:[&>*:last-child]:col-span-1 xl:grid-cols-5 [&>*:last-child]:col-span-2">
        <OverviewMetricCard
          title="Total matching"
          value={metrics.total.toLocaleString()}
          theme="orange"
          icon={<PackageIcon />}
          sparklineValues={sparklineFromCount(metrics.total)}
        />
        <OverviewMetricCard
          title="In transit (page)"
          value={metrics.inTransit.toLocaleString()}
          theme="blue"
          icon={<InProgressIcon />}
          sparklineValues={sparklineFromCount(metrics.inTransit)}
        />
        <OverviewMetricCard
          title="Delivered (page)"
          value={metrics.delivered.toLocaleString()}
          theme="green"
          icon={<DeliveredIcon />}
          sparklineValues={sparklineFromCount(metrics.delivered)}
        />
        <OverviewMetricCard
          title="Failed (page)"
          value={metrics.failed.toLocaleString()}
          theme="red"
          icon={<FailedIcon />}
          sparklineValues={sparklineFromCount(metrics.failed)}
        />
        <OverviewMetricCard
          title="Cancelled (page)"
          value={metrics.cancelled.toLocaleString()}
          theme="slate"
          icon={<CancelledIcon />}
          sparklineValues={sparklineFromCount(metrics.cancelled)}
        />
      </div>
    </section>
  );
}
