"use client";

import Link from "next/link";
import { getOrchestrationByDeliveryId } from "@/data";
import AdminContainer from "@/components/AdminContainer";
import AdminShell from "@/components/AdminShell";
import AdminEmptyState from "@/ui/AdminEmptyState";
import DeliveryActions from "../components/DeliveryActions";
import DeliveryBooking from "../components/DeliveryBooking";
import DeliveryDetailHeader from "../components/DeliveryDetailHeader";
import DeliveryOrchestrationLink from "../components/DeliveryOrchestrationLink";
import DeliveryOverview from "../components/DeliveryOverview";
import DeliveryPackage from "../components/DeliveryPackage";
import DeliveryRequirements from "../components/DeliveryRequirements";
import DeliveryRoute from "../components/DeliveryRoute";
import DeliveryTimeline from "../components/DeliveryTimeline";
import { formatRoute } from "../components/utils";

type DeliveryDetailProps = {
  deliveryId: string;
};

export default function DeliveryDetail({ deliveryId }: DeliveryDetailProps) {
  const record = getOrchestrationByDeliveryId(deliveryId);

  if (!record) {
    return (
      <AdminShell title="Deliveries" subtitle="Delivery not found">
        <AdminContainer className="pb-10">
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
      title={deliveryRequest.deliveryId}
      subtitle={`${formatRoute(record)} · Delivery`}
    >
      <AdminContainer className="space-y-10 pb-10">
        <DeliveryDetailHeader record={record} />

        <DeliveryOverview record={record} />

        <div className="grid gap-8 lg:grid-cols-2">
          <DeliveryRoute deliveryRequest={deliveryRequest} />
          <DeliveryPackage package={deliveryRequest.package} />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <DeliveryRequirements requirements={deliveryRequest.requirements} />
          <DeliveryBooking booking={booking} />
        </div>

        <DeliveryTimeline events={events} />

        <DeliveryOrchestrationLink record={record} />

        <DeliveryActions deliveryId={deliveryRequest.deliveryId} />
      </AdminContainer>
    </AdminShell>
  );
}
