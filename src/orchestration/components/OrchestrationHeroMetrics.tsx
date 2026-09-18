import type { ReactNode } from "react";
import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import { formatDecisionTime } from "@/data/orchestrationMetrics";
import ServiceLogo from "@/components/ServiceLogo";
import { BookingStatusPill } from "@/deliveries/components/DeliveryStatusPill";
import OrchestrationDetailCard from "./OrchestrationDetailCard";
import { countEligibleServices } from "./utils";

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

type OrchestrationHeroMetricsProps = {
  record: OrchestrationRecord;
};

export default function OrchestrationHeroMetrics({
  record,
}: OrchestrationHeroMetricsProps) {
  const { decision, booking, evaluations } = record;
  const eligible = countEligibleServices(evaluations);
  const score = decision.decisionScore.totalScore.toFixed(1);

  return (
    <section aria-labelledby="orchestration-hero-metrics-heading">
      <h2 id="orchestration-hero-metrics-heading" className="sr-only">
        Orchestration at a glance
      </h2>

      <OrchestrationDetailCard className="overflow-hidden">
        <div className="grid grid-cols-2 divide-border/60 sm:grid-cols-3 lg:grid-cols-7 lg:divide-x">
          <MetricCell label="Services evaluated">
            {decision.servicesEvaluated}
          </MetricCell>
          <MetricCell label="Available" className="lg:border-l lg:border-border/60">
            {decision.availableOptions}
          </MetricCell>
          <MetricCell
            label="Eligible"
            className="sm:border-l sm:border-border/60 lg:border-l-0"
          >
            {eligible}
          </MetricCell>
          <MetricCell
            label="Selected service"
            highlight
            className="col-span-2 border-t border-border/60 sm:col-span-1 sm:border-t-0 lg:border-l lg:border-border/60"
          >
            <span className="flex min-w-0 items-center gap-2">
              <ServiceLogo
                serviceName={decision.selectedServiceName}
                className="h-6 w-6 shrink-0"
              />
              <span className="truncate">{decision.selectedServiceName}</span>
            </span>
          </MetricCell>
          <MetricCell
            label="Score"
            className="border-t border-border/60 sm:border-t-0 lg:border-l lg:border-border/60"
          >
            {score}
          </MetricCell>
          <MetricCell
            label="Decision time"
            className="border-t border-border/60 sm:border-l sm:border-border/60 sm:border-t-0 lg:border-l lg:border-border/60"
          >
            {formatDecisionTime(decision.durationMs)}
          </MetricCell>
          <MetricCell
            label="Booking"
            className="col-span-2 border-t border-border/60 sm:col-span-1 sm:border-t-0 lg:col-span-1 lg:border-l lg:border-border/60"
          >
            <BookingStatusPill status={booking.status} />
          </MetricCell>
        </div>
      </OrchestrationDetailCard>
    </section>
  );
}
