import Link from "next/link";
import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import { formatDecisionTime } from "@/data/orchestrationMetrics";
import AdminCallout from "@/ui/AdminCallout";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import { bookingStatusLabel } from "./utils";

type DeliveryOrchestrationLinkProps = {
  record: OrchestrationRecord;
};

export default function DeliveryOrchestrationLink({
  record,
}: DeliveryOrchestrationLinkProps) {
  const { deliveryRequest, decision, booking } = record;
  const deliveryId = deliveryRequest.deliveryId;
  const score = decision.decisionScore.totalScore;

  return (
    <section aria-labelledby="delivery-orchestration-link-heading">
      <AdminSectionHeader
        title="Orchestration decision"
        description="How Doot evaluated and selected a service for this delivery."
      />

      <AdminCallout variant="accent" className="mt-4">
        <div className="space-y-3">
          <p className="text-small text-foreground">
            {decision.servicesEvaluated} services evaluated ·{" "}
            {decision.availableOptions} available ·{" "}
            {decision.selectedServiceName} selected ·{" "}
            {score.toFixed(1)}/100 · Booking{" "}
            {bookingStatusLabel(booking.status).toLowerCase()} · Decision in{" "}
            {formatDecisionTime(decision.durationMs)}
          </p>
          <Link
            href={`/orchestration/${deliveryId}`}
            className="inline-flex text-small font-semibold text-accent underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            View orchestration decision →
          </Link>
        </div>
      </AdminCallout>
    </section>
  );
}
