"use client";

import Link from "next/link";
import { getOrchestrationByDeliveryId } from "@/data";
import AdminContainer from "@/components/AdminContainer";
import { ADMIN_DETAIL_RAIL_GRID } from "@/components/layout";
import AdminShell from "@/components/AdminShell";
import AdminEmptyState from "@/ui/AdminEmptyState";
import DeliveryBooking from "../components/DeliveryBooking";
import DeliveryDetailPageHeader from "../components/DeliveryDetailPageHeader";
import DeliveryHeroMetrics from "../components/DeliveryHeroMetrics";
import DeliveryOrchestrationLink from "../components/DeliveryOrchestrationLink";
import DeliveryPackage from "../components/DeliveryPackage";
import DeliveryRequirements from "../components/DeliveryRequirements";
import DeliveryRoute from "../components/DeliveryRoute";
import DeliveryTimeline from "../components/DeliveryTimeline";

type DeliveryDetailProps = {
  deliveryId: string;
};

export default function DeliveryDetail({ deliveryId }: DeliveryDetailProps) {
  const record = getOrchestrationByDeliveryId(deliveryId);

  if (!record) {
    return (
      <AdminShell
        customHeader={
          <header className="bg-background px-4 pb-4 pt-4 sm:px-6 lg:px-8 lg:pb-5 lg:pt-5">
            <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-heading-md">
              Deliveries
            </h1>
            <p className="mt-1 text-small text-muted-foreground">Delivery not found</p>
          </header>
        }
      >
        <AdminContainer flushTop className="pb-10">
          <AdminEmptyState
            title="Delivery not found"
            description={`No delivery record exists for ID "${deliveryId}".`}
            action={
              <Link
                href="/deliveries"
                className="text-small font-medium text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Back to deliveries
              </Link>
            }
          />
        </AdminContainer>
      </AdminShell>
    );
  }

  const { deliveryRequest, booking, events } = record;

  return (
    <AdminShell
      mainClassName="bg-background"
      customHeader={<DeliveryDetailPageHeader record={record} />}
    >
      <AdminContainer flushTop className="space-y-6 pb-10 lg:space-y-8">
        <DeliveryHeroMetrics record={record} />

        <div className={`grid min-w-0 gap-6 ${ADMIN_DETAIL_RAIL_GRID} xl:items-start`}>
          <aside className="min-w-0 space-y-6 xl:order-2 xl:sticky xl:top-6 xl:self-start">
            <DeliveryRequirements requirements={deliveryRequest.requirements} />
            <DeliveryBooking booking={booking} />
          </aside>

          <div className="min-w-0 space-y-6 xl:order-1">
            <DeliveryRoute deliveryRequest={deliveryRequest} />
            <DeliveryPackage package={deliveryRequest.package} />
            <DeliveryTimeline events={events} />
          </div>
        </div>

        <DeliveryOrchestrationLink record={record} />
      </AdminContainer>
    </AdminShell>
  );
}
