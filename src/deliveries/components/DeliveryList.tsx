import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import AdminCard from "@/ui/AdminCard";
import AdminEmptyState from "@/ui/AdminEmptyState";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
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
      <AdminSectionHeader
        title="Deliveries"
        description="Operational view of all delivery requests and their current status."
      />

      <div className="mt-4 space-y-3 md:hidden">
        {records.map((record) => (
          <DeliveryRow
            key={record.deliveryRequest.deliveryId}
            record={record}
            variant="card"
          />
        ))}
      </div>

      <AdminCard className="mt-4 hidden overflow-x-auto px-4 md:block md:px-5">
        <table className="w-full min-w-[900px] text-left">
          <caption className="sr-only">Delivery records</caption>
          <thead>
            <tr className="border-b border-border text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              <th scope="col" className="py-3 pr-4 font-semibold">
                Delivery
              </th>
              <th scope="col" className="py-3 pr-4 font-semibold">
                Route
              </th>
              <th scope="col" className="py-3 pr-4 font-semibold">
                Package
              </th>
              <th scope="col" className="py-3 pr-4 font-semibold">
                Status
              </th>
              <th scope="col" className="py-3 pr-4 font-semibold">
                Service
              </th>
              <th scope="col" className="py-3 pr-4 font-semibold">
                Booking
              </th>
              <th scope="col" className="py-3 font-semibold">
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
      </AdminCard>
    </section>
  );
}
