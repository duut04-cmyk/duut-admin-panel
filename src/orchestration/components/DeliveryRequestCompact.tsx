import type { ReactNode } from "react";
import type { OrchestrationDeliveryCompact } from "../orchestrationMappers";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import OrchestrationDetailCard from "./OrchestrationDetailCard";

type DeliveryRequestCompactProps = {
  delivery: OrchestrationDeliveryCompact;
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
  delivery,
}: DeliveryRequestCompactProps) {
  return (
    <section aria-labelledby="delivery-request-compact-heading">
      <AdminSectionHeader
        title="Delivery request"
        description="Pickup, drop, and package details from delivery history."
      />

      <OrchestrationDetailCard className="mt-4 p-4 md:p-5">
        <div className="grid gap-4 lg:grid-cols-3 lg:gap-6 xl:grid-cols-1 xl:gap-4">
          <InfoGroup title="Route">
            <InfoRow label="Pickup" value={delivery.pickupAddress} />
            <InfoRow label="Pickup contact" value={delivery.pickupContact} />
            <InfoRow label="Drop" value={delivery.dropAddress} />
            <InfoRow label="Drop contact" value={delivery.dropContact} />
          </InfoGroup>

          <InfoGroup title="Package">
            <InfoRow label="Type" value={delivery.packageType} />
            <InfoRow label="Weight" value={`${delivery.packageWeightKg} kg`} />
            <InfoRow label="Schedule" value={delivery.scheduleMode} />
          </InfoGroup>

          <InfoGroup title="Requirements">
            {delivery.requirements.length > 0 ? (
              <InfoRow label="Requirements" value={delivery.requirements.join(", ")} />
            ) : null}
            {delivery.specialInstructions ? (
              <InfoRow label="Instructions" value={delivery.specialInstructions} />
            ) : null}
            {delivery.requirements.length === 0 && !delivery.specialInstructions ? (
              <InfoRow label="Notes" value="No extra requirements recorded." />
            ) : null}
          </InfoGroup>
        </div>
      </OrchestrationDetailCard>
    </section>
  );
}
