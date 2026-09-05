import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import AdminBadge from "@/ui/AdminBadge";
import AdminCard from "@/ui/AdminCard";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import AdminStatus from "@/ui/AdminStatus";
import {
  bookingStatusLabel,
  bookingStatusVariant,
  deliveryStatusLabel,
  deliveryStatusVariant,
  formatTimestamp,
} from "./utils";

type DeliveryOverviewProps = {
  record: OrchestrationRecord;
};

export default function DeliveryOverview({ record }: DeliveryOverviewProps) {
  const { deliveryRequest, decision, booking } = record;
  const { requirements } = deliveryRequest;

  return (
    <section aria-labelledby="delivery-overview-heading">
      <AdminSectionHeader
        title="Delivery overview"
        description="Current delivery status and key details."
      />

      <AdminCard className="mt-4 p-5 md:p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-caption text-muted-foreground">Delivery ID</dt>
            <dd className="mt-0.5 font-semibold text-foreground">
              {deliveryRequest.deliveryId}
            </dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Created</dt>
            <dd className="mt-0.5 text-small">
              {formatTimestamp(deliveryRequest.createdAt)}
            </dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Current status</dt>
            <dd className="mt-0.5">
              <AdminStatus
                variant={deliveryStatusVariant(deliveryRequest.status)}
                label={deliveryStatusLabel(deliveryRequest.status)}
              />
            </dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Booking status</dt>
            <dd className="mt-0.5">
              <AdminStatus
                variant={bookingStatusVariant(booking.status)}
                label={bookingStatusLabel(booking.status)}
              />
            </dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Selected service</dt>
            <dd className="mt-0.5">
              <AdminBadge variant="accent">{decision.selectedServiceName}</AdminBadge>
            </dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Delivery requirement</dt>
            <dd className="mt-0.5 capitalize text-small">
              {requirements.deliveryType}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-caption text-muted-foreground">Requested timing</dt>
            <dd className="mt-0.5 text-small">
              {formatTimestamp(requirements.requestedTime)}
            </dd>
          </div>
        </dl>
      </AdminCard>
    </section>
  );
}
