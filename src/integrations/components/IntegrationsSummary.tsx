import type { IntegrationSummary } from "@/data/integrationTypes";
import OverviewMetricCard, {
  DeliveredIcon,
  FailedIcon,
  InProgressIcon,
} from "@/overview/components/OverviewMetricCard";

type IntegrationsSummaryProps = {
  summary: IntegrationSummary;
};

export default function IntegrationsSummary({ summary }: IntegrationsSummaryProps) {
  return (
    <section
      aria-labelledby="integrations-summary-heading"
      className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3"
    >
      <h2 id="integrations-summary-heading" className="sr-only">
        Integrations summary
      </h2>
      <OverviewMetricCard
        title="Connected"
        value={`${summary.connected}/${summary.total}`}
        theme="green"
        icon={<DeliveredIcon />}
      />
      <OverviewMetricCard
        title="Needs attention"
        value={summary.needsAttention.toLocaleString()}
        supportingText={
          summary.needsAttention > 0
            ? "Update env vars for items below"
            : "All active services look good"
        }
        theme="orange"
        icon={<FailedIcon />}
      />
      <OverviewMetricCard
        title="Platform services"
        value={summary.total.toLocaleString()}
        theme="blue"
        icon={<InProgressIcon />}
      />
    </section>
  );
}
