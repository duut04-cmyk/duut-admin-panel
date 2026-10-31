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
      <AdminSectionHeader title="Schedule" />

      <DeliveryDetailCard className="mt-3 space-y-2.5 p-4 text-small">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-muted-foreground">Mode</span>
          <span className="font-medium text-foreground">{schedule.mode}</span>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-muted-foreground">Timing</span>
          <span className="text-right font-medium text-foreground">{timingLabel}</span>
        </div>
        {schedule.timezone ? (
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-muted-foreground">Timezone</span>
            <span className="font-medium text-foreground">{schedule.timezone}</span>
          </div>
        ) : null}
        {specialInstructions ? (
          <div className="border-t border-border/60 pt-2.5">
            <p className="text-caption text-muted-foreground">Instructions</p>
            <p className="mt-1 text-foreground">{specialInstructions}</p>
          </div>
        ) : null}
      </DeliveryDetailCard>
    </section>
  );
}
