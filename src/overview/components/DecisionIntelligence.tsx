import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import { formatDecisionTime } from "@/data/orchestrationMetrics";
import { countEligibleServices } from "@/orchestration/components/utils";
import AdminBadge from "@/ui/AdminBadge";
import AdminCard from "@/ui/AdminCard";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import { FlowArrow, FlowStep } from "./FlowSteps";
import { bookingStatusLabel } from "@/orchestration/components/utils";

type DecisionIntelligenceProps = {
  record: OrchestrationRecord;
};

export default function DecisionIntelligence({
  record,
}: DecisionIntelligenceProps) {
  const { deliveryRequest, decision, booking } = record;
  const eligible = countEligibleServices(record.evaluations);
  const deliveryId = deliveryRequest.deliveryId;
  const score = decision.decisionScore.totalScore;

  return (
    <section aria-labelledby="decision-intelligence-heading">
      <AdminSectionHeader
        title="How Doot makes a decision"
        description="Every delivery is evaluated against availability, compatibility, timing, price, and service performance before booking."
      />

      <AdminCard className="mt-4 space-y-6 p-5 md:p-6">
        <div>
          <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
            Representative delivery
          </p>
          <p className="mt-1 text-body font-semibold text-foreground">
            {deliveryId}
          </p>
          <p className="mt-0.5 text-small text-muted-foreground">
            {deliveryRequest.pickup.city} → {deliveryRequest.drop.city} ·{" "}
            {deliveryRequest.requirements.deliveryType} ·{" "}
            {deliveryRequest.package.weightKg} kg
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
          <FlowStep
            value={decision.servicesEvaluated}
            label="Services evaluated"
          />
          <FlowArrow />
          <FlowStep value={decision.availableOptions} label="Available" />
          <FlowArrow />
          <FlowStep value={eligible} label="Eligible scored" />
          <FlowArrow />
          <FlowStep
            value={decision.selectedServiceName}
            label="Selected"
            highlight
          />
          <FlowArrow />
          <FlowStep
            value={bookingStatusLabel(booking.status)}
            label={`Booking · ${score.toFixed(1)}/100`}
            highlight={booking.status === "confirmed"}
          />
        </div>

        {booking.bookingResponseTimeMs !== null && (
          <p className="text-center text-small text-muted-foreground">
            Booking response:{" "}
            <span className="font-medium tabular-nums text-foreground">
              {formatDecisionTime(booking.bookingResponseTimeMs)}
            </span>
          </p>
        )}

        <div className="border-t border-border pt-4 text-center">
          <AdminBadge variant="accent">{decision.selectedServiceName}</AdminBadge>
          <p className="mt-2 text-small text-muted-foreground">
            {decision.selectionReason}
          </p>
        </div>
      </AdminCard>
    </section>
  );
}
