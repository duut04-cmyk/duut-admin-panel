import type { DeliveryHistoryDetail } from "@/data/deliveryApiTypes";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import DeliveryDetailCard from "./DeliveryDetailCard";
import { formatTimestamp } from "./utils";

type DeliveryRequirementsProps = {
  schedule: DeliveryHistoryDetail["schedule"];
  specialInstructions: string | null;
};

export default function DeliveryRequirements({
  schedule,
  specialInstructions,
}: DeliveryRequirementsProps) {
  const timingLabel =
    schedule.mode === "ASAP"
      ? "As soon as possible"
      : schedule.scheduledAt
        ? formatTimestamp(schedule.scheduledAt)
        : schedule.mode;

  return (
    <section aria-labelledby="delivery-requirements-heading">
      <AdminSectionHeader
        title="Schedule & instructions"
        description="Timing and special instructions from the delivery request."
      />

      <DeliveryDetailCard className="mt-4 p-4 md:p-5">
        <dl className="space-y-3 text-small">
          <div>
            <dt className="text-caption text-muted-foreground">Schedule mode</dt>
            <dd className="mt-0.5 font-medium text-foreground">{schedule.mode}</dd>
            <dd className="mt-0.5 text-muted-foreground">Timing: {timingLabel}</dd>
            {schedule.timezone ? (
              <dd className="mt-0.5 text-muted-foreground">
                Timezone: {schedule.timezone}
              </dd>
            ) : null}
          </div>

          {specialInstructions ? (
            <div>
              <dt className="text-caption text-muted-foreground">
                Special instructions
              </dt>
              <dd className="mt-0.5 text-muted-foreground">{specialInstructions}</dd>
            </div>
          ) : null}
        </dl>
      </DeliveryDetailCard>
    </section>
  );
}
