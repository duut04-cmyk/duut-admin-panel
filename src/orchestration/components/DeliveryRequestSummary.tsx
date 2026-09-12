import type { ReactNode } from "react";
import type { DeliveryRequest } from "@/data/orchestrationTypes";
import AdminCard from "@/ui/AdminCard";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import { formatTimestamp } from "./utils";

type DeliveryRequestSummaryProps = {
  deliveryRequest: DeliveryRequest;
};

function InfoGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <dl className="mt-3 space-y-2.5 text-small">{children}</dl>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
      <dt className="shrink-0 text-muted-foreground sm:w-36">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}

export default function DeliveryRequestSummary({
  deliveryRequest,
}: DeliveryRequestSummaryProps) {
  const { pickup, drop, package: pkg, requirements } = deliveryRequest;
  const dimensions = `${pkg.lengthCm} × ${pkg.widthCm} × ${pkg.heightCm} cm`;

  return (
    <section aria-labelledby="delivery-request-heading">
      <AdminSectionHeader
        title="Delivery request"
        description="The request that entered the orchestration engine."
      />

      <AdminCard className="mt-4 space-y-6 p-5 md:p-6">
        <InfoGroup title="Route">
          <InfoRow label="Pickup" value={`${pickup.address}, ${pickup.city}`} />
          <InfoRow
            label="Pickup contact"
            value={`${pickup.contactName} · ${pickup.contactPhone}`}
          />
          <InfoRow label="Drop" value={`${drop.address}, ${drop.city}`} />
          <InfoRow
            label="Drop contact"
            value={`${drop.contactName} · ${drop.contactPhone}`}
          />
        </InfoGroup>

        <InfoGroup title="Package">
          <InfoRow label="Type" value={pkg.type} />
          <InfoRow label="Dimensions" value={dimensions} />
          <InfoRow label="Weight" value={`${pkg.weightKg} kg`} />
          <InfoRow label="Volume" value={`${pkg.volumeCm3.toLocaleString()} cm³`} />
        </InfoGroup>

        <InfoGroup title="Requirements">
          <InfoRow
            label="Delivery type"
            value={
              requirements.deliveryType.charAt(0).toUpperCase() +
              requirements.deliveryType.slice(1)
            }
          />
          <InfoRow
            label="Requested timing"
            value={formatTimestamp(requirements.requestedTime)}
          />
          {requirements.specialRequirements.length > 0 && (
            <InfoRow
              label="Special requirements"
              value={requirements.specialRequirements.join(", ")}
            />
          )}
          {requirements.instructions && (
            <InfoRow label="Instructions" value={requirements.instructions} />
          )}
        </InfoGroup>
      </AdminCard>
    </section>
  );
}
