"use client";

import Link from "next/link";
import { getOrchestrationByDeliveryId } from "@/data";
import AdminContainer from "@/components/AdminContainer";
import { ADMIN_DETAIL_RAIL_GRID } from "@/components/layout";
import AdminShell from "@/components/AdminShell";
import AdminEmptyState from "@/ui/AdminEmptyState";
import DecisionBreakdown from "../components/DecisionBreakdown";
import DeliveryRequestCompact from "../components/DeliveryRequestCompact";
import LifecyclePanel from "../components/LifecyclePanel";
import OrchestrationDetailPageHeader from "../components/OrchestrationDetailPageHeader";
import OrchestrationHeroMetrics from "../components/OrchestrationHeroMetrics";
import OutcomeCard from "../components/OutcomeCard";
import SelectionReasonBanner from "../components/SelectionReasonBanner";
import ServiceEvaluationTable from "../components/ServiceEvaluationTable";

type OrchestrationDetailProps = {
  deliveryId: string;
};

export default function OrchestrationDetail({ deliveryId }: OrchestrationDetailProps) {
  const record = getOrchestrationByDeliveryId(deliveryId);

  if (!record) {
    return (
      <AdminShell
        customHeader={
          <header className="bg-background px-4 pb-4 pt-4 sm:px-6 lg:px-8 lg:pb-5 lg:pt-5">
            <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-heading-md">
              Orchestration
            </h1>
            <p className="mt-1 text-small text-muted-foreground">
              Orchestration not found
            </p>
          </header>
        }
      >
        <AdminContainer flushTop className="pb-10">
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
      mainClassName="bg-background"
      customHeader={<OrchestrationDetailPageHeader record={record} />}
    >
      <AdminContainer flushTop className="space-y-6 pb-10 lg:space-y-8">
        <OrchestrationHeroMetrics record={record} />
        <SelectionReasonBanner
          reason={decision.selectionReason}
          selectedServiceName={decision.selectedServiceName}
        />

        <div className={`grid min-w-0 gap-6 ${ADMIN_DETAIL_RAIL_GRID} xl:items-start`}>
          <aside className="min-w-0 space-y-6 xl:order-2 xl:sticky xl:top-6 xl:self-start">
            <DeliveryRequestCompact deliveryRequest={deliveryRequest} />
            <OutcomeCard booking={booking} />
          </aside>

          <div className="min-w-0 space-y-6 xl:order-1">
            <ServiceEvaluationTable evaluations={evaluations} decision={decision} />
            <DecisionBreakdown
              decisionScore={decision.decisionScore}
              selectedServiceName={decision.selectedServiceName}
            />
          </div>
        </div>

        <LifecyclePanel events={events} />

        <nav
          aria-label="Orchestration actions"
          className="flex flex-wrap gap-4 border-t border-border/60 pt-6"
        >
          <Link
            href="/orchestration"
            className="text-small font-medium text-accent transition-colors hover:text-accent/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            ← Back to orchestration
          </Link>
          <Link
            href={`/deliveries/${deliveryRequest.deliveryId}`}
            className="text-small font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            View delivery →
          </Link>
        </nav>
      </AdminContainer>
    </AdminShell>
  );
}
