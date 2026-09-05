import type { DeliveryRequest } from "@/data/orchestrationTypes";
import AdminCard from "@/ui/AdminCard";
import AdminSectionHeader from "@/ui/AdminSectionHeader";

type DeliveryRouteProps = {
  deliveryRequest: DeliveryRequest;
};

function LocationBlock({
  title,
  address,
  city,
  contactName,
  contactPhone,
}: {
  title: string;
  address: string;
  city: string;
  contactName: string;
  contactPhone: string;
}) {
  return (
    <div>
      <h3 className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <p className="mt-2 text-small font-medium text-foreground">
        {address}
      </p>
      <p className="mt-0.5 text-small text-muted-foreground">{city}</p>
      <p className="mt-3 text-small text-muted-foreground">
        {contactName} · {contactPhone}
      </p>
    </div>
  );
}

export default function DeliveryRoute({ deliveryRequest }: DeliveryRouteProps) {
  const { pickup, drop } = deliveryRequest;

  return (
    <section aria-labelledby="delivery-route-heading">
      <AdminSectionHeader
        title="Route"
        description="Pickup and drop locations for this delivery."
      />

      <AdminCard className="mt-4 space-y-6 p-5 md:p-6">
        <LocationBlock
          title="Pickup"
          address={pickup.address}
          city={pickup.city}
          contactName={pickup.contactName}
          contactPhone={pickup.contactPhone}
        />

        <div className="flex justify-center text-muted-foreground" aria-hidden="true">
          <svg
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
          >
            <path d="M10 4v12M6 14l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <LocationBlock
          title="Drop"
          address={drop.address}
          city={drop.city}
          contactName={drop.contactName}
          contactPhone={drop.contactPhone}
        />
      </AdminCard>
    </section>
  );
}
