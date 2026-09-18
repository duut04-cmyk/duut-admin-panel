import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import AdminEmptyState from "@/ui/AdminEmptyState";
import DeliveryRow from "./DeliveryRow";

type DeliveryListProps = {
  records: OrchestrationRecord[];
};

export default function DeliveryList({ records }: DeliveryListProps) {
  if (records.length === 0) {
    return (
      <AdminEmptyState
        title="No deliveries found"
        description="Adjust filters or search to find delivery records."
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
            Operational view of all delivery requests and their current status.
          </p>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {records.map((record) => (
            <DeliveryRow
              key={record.deliveryRequest.deliveryId}
              record={record}
              variant="card"
            />
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[900px] text-left text-small">
            <caption className="sr-only">Delivery records</caption>
            <thead>
              <tr className="border-b border-border">
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5"
                >
                  Delivery
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
                  Service
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5"
                >
                  Booking
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
              {records.map((record) => (
                <DeliveryRow
                  key={record.deliveryRequest.deliveryId}
                  record={record}
                  variant="table"
                />
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
