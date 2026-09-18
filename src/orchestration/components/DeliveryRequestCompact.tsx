import type { ReactNode } from "react";
import type { DeliveryRequest } from "@/data/orchestrationTypes";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import OrchestrationDetailCard from "./OrchestrationDetailCard";
import { formatTimestamp } from "./utils";

type DeliveryRequestCompactProps = {
  deliveryRequest: DeliveryRequest;
};

function InfoGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <dl className="mt-2 space-y-2 text-small">{children}</dl>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 xl:flex-row xl:gap-3">
      <dt className="shrink-0 text-muted-foreground xl:w-28">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}

export default function DeliveryRequestCompact({
  deliveryRequest,
}: DeliveryRequestCompactProps) {
  const { pickup, drop, package: pkg, requirements } = deliveryRequest;
  const dimensions = `${pkg.lengthCm} × ${pkg.widthCm} × ${pkg.heightCm} cm`;

  return (
    <section aria-labelledby="delivery-request-compact-heading">
      <AdminSectionHeader
        title="Delivery request"
        description="The request that entered the orchestration engine."
      />

      <OrchestrationDetailCard className="mt-4 p-4 md:p-5">
        <div className="grid gap-4 lg:grid-cols-3 lg:gap-6 xl:grid-cols-1 xl:gap-4">
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
        </div>
      </OrchestrationDetailCard>
    </section>
  );
}
