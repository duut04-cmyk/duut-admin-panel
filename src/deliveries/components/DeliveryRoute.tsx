import type { DeliveryHistoryDetail } from "@/data/deliveryApiTypes";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import { formatDeliveryPhone } from "../deliveryMappers";
import DeliveryDetailCard from "./DeliveryDetailCard";

type DeliveryRouteProps = {
  pickup: DeliveryHistoryDetail["pickup"];
  drop: DeliveryHistoryDetail["drop"];
};

function LocationBlock({
  title,
  location,
}: {
  title: string;
  location: DeliveryHistoryDetail["pickup"];
}) {
  return (
    <div className="min-w-0">
      <h3 className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <p className="mt-1.5 text-small font-medium text-foreground">
        {location.addressText}
      </p>
      {location.instructions ? (
        <p className="mt-1 text-small text-muted-foreground">{location.instructions}</p>
      ) : null}
      <p className="mt-1.5 text-small text-muted-foreground">
        {location.contactName} · {formatDeliveryPhone(location.contactPhone)}
      </p>
    </div>
  );
}

export default function DeliveryRoute({ pickup, drop }: DeliveryRouteProps) {
  return (
    <section aria-labelledby="delivery-route-heading">
      <AdminSectionHeader title="Route" />

      <DeliveryDetailCard className="mt-3 space-y-3 p-4">
        <LocationBlock title="Pickup" location={pickup} />
        <div
          className="flex items-center gap-3 text-muted-foreground/60"
          aria-hidden="true"
        >
          <span className="h-px flex-1 bg-border/60" />
          <svg
            className="h-4 w-4 shrink-0"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
          >
            <path
              d="M10 4v12M6 14l4 4 4-4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="h-px flex-1 bg-border/60" />
        </div>
        <LocationBlock title="Drop" location={drop} />
      </DeliveryDetailCard>
    </section>
  );
}
