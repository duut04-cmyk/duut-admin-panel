import type { DeliveryListItem } from "@/data/deliveryApiTypes";
import AdminEmptyState from "@/ui/AdminEmptyState";
import DeliveryRow from "./DeliveryRow";

type DeliveryListProps = {
  items: DeliveryListItem[];
};

export default function DeliveryList({ items }: DeliveryListProps) {
  if (items.length === 0) {
    return (
      <AdminEmptyState
        title="No deliveries found"
        description="Adjust filters or search by DOOT reference to find deliveries."
      />
    );
  }

  return (
    <section aria-labelledby="delivery-list-heading">
      <article className="min-w-0 overflow-hidden rounded-card border border-border/60 bg-background shadow-sm">
        <div className="border-b border-border px-4 py-4 sm:px-5 lg:px-6">
          <h2
            id="delivery-list-heading"
            className="text-subheading font-semibold leading-snug text-foreground"
          >
            Deliveries
          </h2>
          <p className="mt-1 text-small text-muted-foreground">
            Operational view of delivery requests and their current status.
          </p>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {items.map((item) => (
            <DeliveryRow key={item.id} item={item} variant="card" />
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[720px] text-left text-small">
            <caption className="sr-only">Delivery records</caption>
            <thead>
              <tr className="border-b border-border">
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5"
                >
                  Reference
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5"
                >
                  Route
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5"
                >
                  Package
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5"
                >
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <DeliveryRow key={item.id} item={item} variant="table" />
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
