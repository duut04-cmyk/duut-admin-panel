import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import { formatDecisionTime } from "@/data/orchestrationMetrics";
import AdminBadge from "@/ui/AdminBadge";
import AdminCard from "@/ui/AdminCard";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import {
  bookingStatusLabel,
  countEligibleServices,
} from "./utils";

type FlowStepProps = {
  value: number | string;
  label: string;
  highlight?: boolean;
};

function FlowStep({ value, label, highlight = false }: FlowStepProps) {
  return (
    <div
      className={`flex flex-col items-center rounded-lg border px-3 py-4 text-center sm:px-4 ${
        highlight
          ? "border-accent/40 bg-surface-accent"
          : "border-border bg-background"
      }`}
    >
      <p className="text-body font-bold tabular-nums text-foreground sm:text-[1.25rem]">
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
        className="h-4 w-4 rotate-90 sm:rotate-0"
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

type OrchestrationSummaryProps = {
  record: OrchestrationRecord;
};

export default function OrchestrationSummary({
  record,
}: OrchestrationSummaryProps) {
  const { decision, booking } = record;
  const eligible = countEligibleServices(record.evaluations);
  const unavailable = decision.servicesEvaluated - decision.availableOptions;

  return (
    <section aria-labelledby="orchestration-detail-summary-heading">
      <AdminSectionHeader
        title="Orchestration summary"
        description="What Dutt did for this delivery."
      />

      <AdminCard className="mt-4 space-y-6 p-5 md:p-6">
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
          <FlowStep value={decision.servicesEvaluated} label="Services evaluated" />
          <FlowArrow />
          <FlowStep value={decision.availableOptions} label="Available" />
          <FlowArrow />
          <FlowStep value={eligible} label="Eligible" />
          <FlowArrow />
          <FlowStep
            value={decision.selectedServiceName}
            label="Selected"
            highlight
          />
          <FlowArrow />
          <FlowStep
            value={bookingStatusLabel(booking.status)}
            label="Booking"
            highlight={booking.status === "confirmed"}
          />
        </div>

        <dl className="grid gap-4 border-t border-border pt-5 sm:grid-cols-3">
          <div>
            <dt className="text-caption text-muted-foreground">Unavailable</dt>
            <dd className="mt-0.5 tabular-nums font-semibold text-foreground">
              {unavailable}
            </dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Decision time</dt>
            <dd className="mt-0.5 tabular-nums font-semibold text-foreground">
              {formatDecisionTime(decision.durationMs)}
            </dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Selected service</dt>
            <dd className="mt-0.5">
              <AdminBadge variant="accent">{decision.selectedServiceName}</AdminBadge>
            </dd>
          </div>
        </dl>
      </AdminCard>
    </section>
  );
}
