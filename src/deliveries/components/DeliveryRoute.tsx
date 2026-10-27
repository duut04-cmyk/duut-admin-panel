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
    <div>
      <h3 className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <p className="mt-2 text-small font-medium text-foreground">
        {location.addressText}
      </p>
      {location.instructions ? (
        <p className="mt-1 text-small text-muted-foreground">{location.instructions}</p>
      ) : null}
      <p className="mt-2 text-small text-muted-foreground">
        {location.contactName} · {formatDeliveryPhone(location.contactPhone)}
      </p>
    </div>
  );
}

export default function DeliveryRoute({ pickup, drop }: DeliveryRouteProps) {
  return (
    <section aria-labelledby="delivery-route-heading">
      <AdminSectionHeader
        title="Route"
        description="Pickup and drop locations for this delivery."
      />

      <DeliveryDetailCard className="mt-4 space-y-4 p-4 md:p-5">
        <LocationBlock title="Pickup" location={pickup} />

        <div
          className="flex justify-center text-muted-foreground/70"
          aria-hidden="true"
        >
          <svg
            className="h-5 w-5"
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
        </div>

        <LocationBlock title="Drop" location={drop} />
      </DeliveryDetailCard>
    </section>
  );
}
