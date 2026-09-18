import Link from "next/link";
import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import { formatDecisionTime } from "@/data/orchestrationMetrics";
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

      <aside className="mt-4 rounded-lg border border-accent/20 bg-orange-50/60 px-4 py-3.5">
        <p className="text-small leading-snug text-foreground">
          <span className="font-semibold">{decision.selectedServiceName}</span>
          <span className="mx-1.5 text-muted-foreground" aria-hidden="true">
            —
          </span>
          <span className="text-muted-foreground">
            {decision.servicesEvaluated} services evaluated ·{" "}
            {decision.availableOptions} available · {score.toFixed(1)}/100 · Booking{" "}
            {bookingStatusLabel(booking.status).toLowerCase()} · Decision in{" "}
            {formatDecisionTime(decision.durationMs)}
          </span>
        </p>
        <Link
          href={`/orchestration/${deliveryId}`}
          className="mt-2.5 inline-flex text-small font-semibold text-accent transition-colors hover:text-accent/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          View orchestration decision →
        </Link>
      </aside>
    </section>
  );
}
