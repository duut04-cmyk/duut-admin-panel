import type { DeliveryListItem } from "@/data/deliveryApiTypes";
import ListPagination from "@/components/ListPagination";
import AdminEmptyState from "@/ui/AdminEmptyState";
import DeliveryRow from "./DeliveryRow";

type DeliveryListProps = {
  items: DeliveryListItem[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

export default function DeliveryList({
  items,
  page,
  pageSize,
  total,
  onPageChange,
}: DeliveryListProps) {
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
      <article className="min-w-0 overflow-hidden rounded-[10px] border border-border bg-white shadow-[0_8px_24px_-16px_rgba(23,23,23,0.14)]">
        <div className="border-b border-border px-4 py-4 sm:px-5 lg:px-6">
          <p className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-accent">
            Activity
          </p>
          <h2
            id="delivery-list-heading"
            className="mt-0.5 text-body-lg font-bold tracking-tight text-foreground"
          >
            Deliveries
          </h2>
          <p className="mt-0.5 text-small text-muted-foreground">
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
              <tr className="border-b border-border bg-[#FFFBF5]/60">
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold uppercase tracking-wide text-muted-foreground md:px-5"
                >
                  Reference
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold uppercase tracking-wide text-muted-foreground md:px-5"
                >
                  Route
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold uppercase tracking-wide text-muted-foreground md:px-5"
                >
                  Package
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold uppercase tracking-wide text-muted-foreground md:px-5"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold uppercase tracking-wide text-muted-foreground md:px-5"
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

        <ListPagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
        />
      </article>
    </section>
  );
}
