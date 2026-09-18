import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import AdminEmptyState from "@/ui/AdminEmptyState";
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
      <article className="min-w-0 overflow-hidden rounded-card border border-border/60 bg-background shadow-sm">
        <div className="border-b border-border px-4 py-4 sm:px-5 lg:px-6">
          <h2
            id="orchestration-list-heading"
            className="text-subheading font-semibold leading-snug text-foreground"
          >
            Orchestration decisions
          </h2>
          <p className="mt-1 text-small text-muted-foreground">
            Each row represents one delivery evaluated across multiple services.
          </p>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {records.map((record) => (
            <OrchestrationRow
              key={record.deliveryRequest.deliveryId}
              record={record}
              variant="card"
            />
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[960px] text-left text-small">
            <caption className="sr-only">Orchestration decisions</caption>
            <thead>
              <tr className="border-b border-border">
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5"
                >
                  Delivery ID
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5"
                >
                  Route
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-caption font-semibold text-muted-foreground md:px-5"
                >
                  Evaluated
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-caption font-semibold text-muted-foreground md:px-5"
                >
                  Available
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5"
                >
                  Selected service
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-caption font-semibold text-muted-foreground md:px-5"
                >
                  Score
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-caption font-semibold text-muted-foreground md:px-5"
                >
                  Decision time
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
                  Delivery
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <OrchestrationRow
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
