import type { ReactNode } from "react";
import type { BackendProviderBookingStatus } from "@/data/deliveryApiTypes";
import ServiceLogo from "@/components/ServiceLogo";
import { ProviderBookingStatusPill } from "@/deliveries/components/DeliveryStatusPill";
import type { OrchestrationDecisionView } from "../orchestrationViewTypes";
import OrchestrationDetailCard from "./OrchestrationDetailCard";
import { formatTimestamp } from "./utils";

type MetricCellProps = {
  label: string;
  children: ReactNode;
  highlight?: boolean;
  className?: string;
};

function MetricCell({
  label,
  children,
  highlight = false,
  className = "",
}: MetricCellProps) {
  return (
    <div
      className={`flex flex-col justify-center px-3 py-3 sm:px-4 sm:py-4 ${
        highlight ? "bg-orange-50/60" : ""
      } ${className}`}
    >
      <p className="min-w-0 font-semibold tabular-nums text-foreground">{children}</p>
      <p className="mt-1 text-caption text-muted-foreground">{label}</p>
    </div>
  );
}

function orchestrationStatusLabel(status: string): string {
  switch (status) {
    case "COMPLETED":
      return "Completed";
    case "FAILED":
      return "Failed";
    case "RUNNING":
      return "Running";
    default:
      return status;
  }
}

type OrchestrationHeroMetricsProps = {
  decision: OrchestrationDecisionView;
  bookingStatus: BackendProviderBookingStatus | null;
};

export default function OrchestrationHeroMetrics({
  decision,
  bookingStatus,
}: OrchestrationHeroMetricsProps) {
  const score =
    decision.selectedScore !== null ? decision.selectedScore.toFixed(2) : "—";

  return (
    <section aria-labelledby="orchestration-hero-metrics-heading">
      <h2 id="orchestration-hero-metrics-heading" className="sr-only">
        Orchestration at a glance
      </h2>

      <OrchestrationDetailCard className="overflow-hidden">
        <div className="grid grid-cols-2 divide-border/60 sm:grid-cols-4 lg:grid-cols-4 lg:divide-x xl:grid-cols-8">
          <MetricCell label="Providers evaluated">
            {decision.servicesEvaluated}
          </MetricCell>
          <MetricCell label="Available" className="lg:border-l lg:border-border/60">
            {decision.availableOptions}
          </MetricCell>
          <MetricCell
            label="Eligible"
            className="sm:border-l sm:border-border/60 lg:border-l-0"
          >
            {decision.eligibleCount}
          </MetricCell>
          <MetricCell
            label="Selected provider"
            highlight
            className="col-span-2 border-t border-border/60 sm:col-span-1 sm:border-t-0 lg:border-l lg:border-border/60"
          >
            <span className="flex min-w-0 items-center gap-2">
              <ServiceLogo
                serviceName={decision.selectedProviderLabel}
                className="h-6 w-6 shrink-0"
              />
              <span className="truncate">{decision.selectedProviderLabel}</span>
            </span>
          </MetricCell>
          <MetricCell
            label="Score"
            className="border-t border-border/60 sm:border-t-0 lg:border-l lg:border-border/60"
          >
            {score}
          </MetricCell>
          <MetricCell
            label="Orchestration"
            className="border-t border-border/60 sm:border-l sm:border-border/60 sm:border-t-0 lg:border-l lg:border-border/60"
          >
            {orchestrationStatusLabel(decision.orchestrationStatus)}
          </MetricCell>
          <MetricCell
            label="Completed at"
            className="col-span-2 border-t border-border/60 sm:col-span-1 sm:border-t-0 lg:col-span-1 lg:border-l lg:border-border/60"
          >
            {decision.completedAt ? formatTimestamp(decision.completedAt) : "—"}
          </MetricCell>
          <MetricCell
            label="Booking"
            className="col-span-2 border-t border-border/60 sm:col-span-2 sm:border-t-0 lg:col-span-2 lg:border-l lg:border-border/60"
          >
            {bookingStatus ? (
              <ProviderBookingStatusPill status={bookingStatus} />
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </MetricCell>
        </div>
      </OrchestrationDetailCard>
    </section>
  );
}
