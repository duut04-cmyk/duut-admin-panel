import type { ProviderMetrics } from "@/data/providerTypes";
import OverviewMetricCard, {
  DeliveredIcon,
  FailedIcon,
  InProgressIcon,
  PackageIcon,
} from "@/overview/components/OverviewMetricCard";

type ProviderListSummaryProps = {
  metrics: ProviderMetrics;
  className?: string;
};

export default function ProviderListSummary({
  metrics,
  className = "",
}: ProviderListSummaryProps) {
  return (
    <section aria-labelledby="provider-summary-heading" className={className}>
      <h2 id="provider-summary-heading" className="sr-only">
        Provider summary
      </h2>
      <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
        <OverviewMetricCard
          title="Total Providers"
          value={metrics.total.toLocaleString()}
          theme="orange"
          icon={<PackageIcon />}
          sparklineValues={[metrics.total]}
        />
        <OverviewMetricCard
          title="Enabled"
          value={metrics.enabled.toLocaleString()}
          theme="green"
          icon={<DeliveredIcon />}
          sparklineValues={[metrics.enabled]}
        />
        <OverviewMetricCard
          title="Orchestration"
          value={metrics.orchestrationEnabled.toLocaleString()}
          theme="blue"
          icon={<InProgressIcon />}
          sparklineValues={[metrics.orchestrationEnabled]}
        />
        <OverviewMetricCard
          title="Healthy"
          value={metrics.healthy.toLocaleString()}
          theme="slate"
          icon={<FailedIcon />}
          sparklineValues={[metrics.healthy]}
        />
      </div>
    </section>
  );
}
