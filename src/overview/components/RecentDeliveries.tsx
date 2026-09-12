import Link from "next/link";
import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import AdminCard from "@/ui/AdminCard";
import AdminDataRow from "@/ui/AdminDataRow";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import AdminStatus from "@/ui/AdminStatus";
import { deliveryStatusLabel, deliveryStatusVariant, formatCreatedTime } from "./utils";

type RecentDeliveriesProps = {
  records: OrchestrationRecord[];
};

export default function RecentDeliveries({ records }: RecentDeliveriesProps) {
  return (
    <section aria-labelledby="recent-deliveries-heading">
      <AdminSectionHeader
        title="Recent deliveries"
        description="Latest delivery requests and selected services."
        action={
          <Link
            href="/deliveries"
            className="text-small font-medium text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            View all →
          </Link>
        }
      />

      <AdminCard className="mt-4 px-4 md:px-5">
        {records.length === 0 ? (
          <p className="py-4 text-small text-muted-foreground">
            No deliveries in the selected period.
          </p>
        ) : (
          records.map((record) => {
            const { deliveryRequest, decision } = record;
            const status = deliveryRequest.status;

            return (
              <Link
                key={deliveryRequest.deliveryId}
                href={`/deliveries/${deliveryRequest.deliveryId}`}
                className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <AdminDataRow
                  primary={deliveryRequest.deliveryId}
                  secondary={`${deliveryRequest.pickup.city} → ${deliveryRequest.drop.city}`}
                  metadata={`${deliveryRequest.package.weightKg} kg · ${decision.selectedServiceName}`}
                  status={
                    <AdminStatus
                      variant={deliveryStatusVariant(status)}
                      label={deliveryStatusLabel(status)}
                    />
                  }
                  trailing={
                    <span className="text-caption text-muted-foreground">
                      {formatCreatedTime(deliveryRequest.createdAt)}
                    </span>
                  }
                />
              </Link>
            );
          })
        )}
      </AdminCard>
    </section>
  );
}
