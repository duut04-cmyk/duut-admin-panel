import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import AdminCard from "@/ui/AdminCard";
import AdminEmptyState from "@/ui/AdminEmptyState";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import OrchestrationRow from "./OrchestrationRow";

type OrchestrationListProps = {
  records: OrchestrationRecord[];
};

export default function OrchestrationList({ records }: OrchestrationListProps) {
  if (records.length === 0) {
    return (
      <AdminEmptyState
        title="No orchestration records"
        description="Adjust filters or search to find orchestration decisions."
      />
    );
  }

  return (
    <section aria-labelledby="orchestration-list-heading">
      <AdminSectionHeader
        title="Orchestration decisions"
        description="Each row represents one delivery evaluated across multiple services."
      />

      <div className="mt-4 space-y-3 md:hidden">
        {records.map((record) => (
          <OrchestrationRow
            key={record.deliveryRequest.deliveryId}
            record={record}
            variant="card"
          />
        ))}
      </div>

      <AdminCard className="mt-4 hidden overflow-x-auto px-4 md:block md:px-5">
        <table className="w-full min-w-[960px] text-left">
          <caption className="sr-only">Orchestration decisions</caption>
          <thead>
            <tr className="border-b border-border text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              <th scope="col" className="py-3 pr-4 font-semibold">
                Delivery ID
              </th>
              <th scope="col" className="py-3 pr-4 font-semibold">
                Route
              </th>
              <th scope="col" className="py-3 pr-4 text-right font-semibold">
                Evaluated
              </th>
              <th scope="col" className="py-3 pr-4 text-right font-semibold">
                Available
              </th>
              <th scope="col" className="py-3 pr-4 font-semibold">
                Selected service
              </th>
              <th scope="col" className="py-3 pr-4 text-right font-semibold">
                Score
              </th>
              <th scope="col" className="py-3 pr-4 text-right font-semibold">
                Decision time
              </th>
              <th scope="col" className="py-3 pr-4 font-semibold">
                Booking
              </th>
              <th scope="col" className="py-3 font-semibold">
                Delivery
              </th>
            </tr>
          </thead>
          <tbody className="group">
            {records.map((record) => (
              <OrchestrationRow
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
