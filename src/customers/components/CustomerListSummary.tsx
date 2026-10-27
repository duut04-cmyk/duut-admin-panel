import type { CustomerListSummaryMetrics } from "@/data/customerTypes";
import OverviewMetricCard, {
  DeliveredIcon,
  InProgressIcon,
  PackageIcon,
} from "@/overview/components/OverviewMetricCard";

type CustomerListSummaryProps = {
  metrics: CustomerListSummaryMetrics;
  className?: string;
};

function VerifiedIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 2l2.2 4.5 5 .7-3.6 3.5.9 5.2L10 13.8 5.5 16l.9-5.2L3 7.2l5-.7L10 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CustomerListSummary({
  metrics,
  className = "",
}: CustomerListSummaryProps) {
  const matchingDisplay =
    metrics.matchingTotal != null ? metrics.matchingTotal.toLocaleString() : "—";

  return (
    <section aria-labelledby="customer-summary-heading" className={className}>
      <h2 id="customer-summary-heading" className="sr-only">
        Customer summary
      </h2>
      <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
        <OverviewMetricCard
          title="Matching customers"
          value={matchingDisplay}
          theme="orange"
          icon={<PackageIcon />}
          supportingText="Total for current filters"
        />
        <OverviewMetricCard
          title="Active accounts"
          value={metrics.onPage.active.toLocaleString()}
          theme="green"
          icon={<DeliveredIcon />}
          supportingText="On this page"
        />
        <OverviewMetricCard
          title="Email verified"
          value={metrics.onPage.verified.toLocaleString()}
          theme="blue"
          icon={<VerifiedIcon />}
          supportingText="On this page"
        />
        <OverviewMetricCard
          title="With deliveries"
          value={metrics.onPage.withDeliveries.toLocaleString()}
          theme="slate"
          icon={<InProgressIcon />}
          supportingText="On this page"
        />
      </div>
    </section>
  );
}
