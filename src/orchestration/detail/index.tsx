"use client";

import Link from "next/link";
import { getOrchestrationByDeliveryId } from "@/data";
import AdminContainer from "@/components/AdminContainer";
import AdminShell from "@/components/AdminShell";
import AdminEmptyState from "@/ui/AdminEmptyState";
import BookingResult from "../components/BookingResult";
import DecisionDetailHeader from "../components/DecisionDetailHeader";
import DecisionFactors from "../components/DecisionFactors";
import DecisionScore from "../components/DecisionScore";
import DeliveryRequestSummary from "../components/DeliveryRequestSummary";
import OrchestrationSummary from "../components/OrchestrationSummary";
import OrchestrationTimeline from "../components/OrchestrationTimeline";
import OrchestrationTrace from "../components/OrchestrationTrace";
import SelectionReason from "../components/SelectionReason";
import ServiceEvaluationTable from "../components/ServiceEvaluationTable";

type OrchestrationDetailProps = {
  deliveryId: string;
};

export default function OrchestrationDetail({ deliveryId }: OrchestrationDetailProps) {
  const record = getOrchestrationByDeliveryId(deliveryId);

  if (!record) {
    return (
      <AdminShell title="Orchestration" subtitle="Orchestration not found">
        <AdminContainer className="pb-10">
          <AdminEmptyState
            title="Orchestration not found"
            description={`No orchestration record exists for delivery ID "${deliveryId}".`}
            action={
              <Link
                href="/orchestration"
                className="text-small font-medium text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Back to orchestration
              </Link>
            }
          />
        </AdminContainer>
      </AdminShell>
    );
  }

  const { deliveryRequest, decision, booking, evaluations, events } = record;

  return (
    <AdminShell
      title={deliveryRequest.deliveryId}
      subtitle={`${deliveryRequest.pickup.city} → ${deliveryRequest.drop.city}`}
    >
      <AdminContainer className="space-y-10 pb-10">
        <DecisionDetailHeader record={record} />

        <div className="grid gap-8 lg:grid-cols-2">
          <OrchestrationSummary record={record} />
          <DeliveryRequestSummary deliveryRequest={deliveryRequest} />
        </div>

        <ServiceEvaluationTable evaluations={evaluations} decision={decision} />

        <div className="grid gap-8 lg:grid-cols-2">
          <DecisionScore
            decisionScore={decision.decisionScore}
            selectedServiceName={decision.selectedServiceName}
          />
          <DecisionFactors decisionScore={decision.decisionScore} />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <SelectionReason
            reason={decision.selectionReason}
            selectedServiceName={decision.selectedServiceName}
          />
          <BookingResult booking={booking} />
        </div>

        <OrchestrationTimeline events={events} />

        <OrchestrationTrace events={events} />

        <nav
          aria-label="Orchestration actions"
          className="flex flex-wrap gap-4 border-t border-border pt-6"
        >
          <Link
            href="/orchestration"
            className="text-small font-medium text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            ← Back to orchestration
          </Link>
          <Link
            href={`/deliveries/${deliveryRequest.deliveryId}`}
            className="text-small font-medium text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            View delivery →
          </Link>
        </nav>
      </AdminContainer>
    </AdminShell>
  );
}
