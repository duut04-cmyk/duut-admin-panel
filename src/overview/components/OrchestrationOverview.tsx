import type { PlatformMetrics } from "@/data/orchestrationMetrics";
import { formatDecisionTime, formatPercent } from "@/data/orchestrationMetrics";
import AdminCallout from "@/ui/AdminCallout";
import AdminProgress from "@/ui/AdminProgress";
import AdminSectionHeader from "@/ui/AdminSectionHeader";

type FlowStepProps = {
  value: number | string;
  label: string;
};

function FlowStep({ value, label }: FlowStepProps) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-border bg-background px-4 py-5 text-center sm:px-6">
      <p className="text-[1.75rem] font-bold tracking-tight text-foreground md:text-[2rem]">
        {value}
      </p>
      <p className="mt-1 text-caption font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

function FlowArrow() {
  return (
    <div
      className="flex shrink-0 items-center justify-center text-muted-foreground"
      aria-hidden="true"
    >
      <svg
        className="h-5 w-5 rotate-90 sm:rotate-0"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      >
        <path d="M4 10h12M12 6l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

type OrchestrationOverviewProps = {
  metrics: PlatformMetrics;
};

export default function OrchestrationOverview({ metrics }: OrchestrationOverviewProps) {
  const decisionsMade = metrics.totalDeliveries;

  return (
    <section aria-labelledby="orchestration-overview-heading">
      <AdminSectionHeader
        title="Doot orchestration"
        description="Every delivery is evaluated across multiple available services before Doot selects and books the best option."
      />

      <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
        <FlowStep value={metrics.totalDeliveries} label="Deliveries" />
        <FlowArrow />
        <FlowStep value={metrics.totalServicesEvaluated} label="Services evaluated" />
        <FlowArrow />
        <FlowStep value={metrics.totalAvailableOptions} label="Available options" />
        <FlowArrow />
        <FlowStep value={decisionsMade} label="Decisions made" />
        <FlowArrow />
        <FlowStep value={metrics.successfulBookings} label="Successful bookings" />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        <AdminProgress
          label="Availability rate"
          value={metrics.availabilityRate}
          tone="success"
        />
        <AdminProgress
          label="Booking success rate"
          value={metrics.bookingSuccessRate}
          tone="default"
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface/30 px-4 py-3">
          <p className="text-caption text-muted-foreground">Average decision time</p>
          <p className="mt-1 text-body font-semibold text-foreground">
            {formatDecisionTime(metrics.averageDecisionTimeMs)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface/30 px-4 py-3">
          <p className="text-caption text-muted-foreground">
            Avg. available options per delivery
          </p>
          <p className="mt-1 text-body font-semibold text-foreground">
            {metrics.averageAvailableOptionsPerDelivery}
          </p>
        </div>
      </div>

      <AdminCallout variant="neutral" className="mt-6">
        Doot evaluated {metrics.totalServicesEvaluated} service options across{" "}
        {metrics.totalDeliveries} deliveries, with{" "}
        {formatPercent(metrics.availabilityRate)} of evaluations resulting in an
        available option.
      </AdminCallout>
    </section>
  );
}
