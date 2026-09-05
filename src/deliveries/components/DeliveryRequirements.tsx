import type { DeliveryRequirements as DeliveryRequirementsType } from "@/data/orchestrationTypes";
import AdminCard from "@/ui/AdminCard";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import { formatTimestamp } from "./utils";

type DeliveryRequirementsProps = {
  requirements: DeliveryRequirementsType;
};

export default function DeliveryRequirements({
  requirements,
}: DeliveryRequirementsProps) {
  return (
    <section aria-labelledby="delivery-requirements-heading">
      <AdminSectionHeader
        title="Requirements"
        description="Delivery timing and special instructions."
      />

      <AdminCard className="mt-4 p-5 md:p-6">
        <dl className="space-y-4 text-small">
          <div>
            <dt className="text-caption text-muted-foreground">Delivery timing</dt>
            <dd className="mt-0.5 font-medium capitalize">
              {requirements.deliveryType}
            </dd>
            <dd className="mt-0.5 text-muted-foreground">
              Requested: {formatTimestamp(requirements.requestedTime)}
            </dd>
          </div>

          {requirements.specialRequirements.length > 0 && (
            <div>
              <dt className="text-caption text-muted-foreground">
                Special requirements
              </dt>
              <dd className="mt-0.5">
                <ul className="list-inside list-disc space-y-1">
                  {requirements.specialRequirements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </dd>
            </div>
          )}

          {requirements.instructions && (
            <div>
              <dt className="text-caption text-muted-foreground">Instructions</dt>
              <dd className="mt-0.5 text-muted-foreground">
                {requirements.instructions}
              </dd>
            </div>
          )}
        </dl>
      </AdminCard>
    </section>
  );
}
