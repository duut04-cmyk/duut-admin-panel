import type { IntegrationSummary } from "@/data/integrationTypes";
import OverviewMetricCard, {
  DeliveredIcon,
  FailedIcon,
  InProgressIcon,
} from "@/overview/components/OverviewMetricCard";

type IntegrationsSummaryProps = {
  summary: IntegrationSummary;
  checkedAt: string;
};

function formatCheckedAt(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function IntegrationsSummary({
  summary,
  checkedAt,
}: IntegrationsSummaryProps) {
  return (
    <section aria-labelledby="integrations-summary-heading" className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 id="integrations-summary-heading" className="sr-only">
          Integrations summary
        </h2>
        <p className="text-caption text-muted-foreground">
          Last checked {formatCheckedAt(checkedAt)}
        </p>
      </div>

      <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3">
        <OverviewMetricCard
          title="Connected"
          value={`${summary.connected}/${summary.total}`}
          theme="green"
          icon={<DeliveredIcon />}
          sparklineValues={[summary.connected]}
        />
        <OverviewMetricCard
          title="Needs attention"
          value={summary.needsAttention.toLocaleString()}
          theme="orange"
          icon={<FailedIcon />}
          sparklineValues={[summary.needsAttention]}
        />
        <OverviewMetricCard
          title="Platform services"
          value={summary.total.toLocaleString()}
          theme="blue"
          icon={<InProgressIcon />}
          sparklineValues={[summary.total]}
        />
      </div>
    </section>
  );
}
