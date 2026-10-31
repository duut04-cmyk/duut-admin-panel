"use client";

import type { CustomerSummary } from "@/data/customerTypes";
import ListPagination from "@/components/ListPagination";
import AdminEmptyState from "@/ui/AdminEmptyState";
import CustomerRow from "./CustomerRow";

type CustomerListProps = {
  customers: CustomerSummary[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

const thClass =
  "px-4 py-3 text-caption font-semibold uppercase tracking-wide text-muted-foreground md:px-5";

export default function CustomerList({
  customers,
  page,
  pageSize,
  total,
  onPageChange,
}: CustomerListProps) {
  if (customers.length === 0) {
    return (
      <AdminEmptyState
        title="No customers found"
        description="Adjust filters or search to find customer accounts."
      />
    );
  }

  return (
    <section aria-labelledby="customer-list-heading">
      <article className="min-w-0 overflow-hidden rounded-[10px] border border-border bg-white shadow-[0_8px_24px_-16px_rgba(23,23,23,0.14)]">
        <div className="border-b border-border px-4 py-4 sm:px-5 lg:px-6">
          <p className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-accent">
            Directory
          </p>
          <h2
            id="customer-list-heading"
            className="mt-0.5 text-body-lg font-bold tracking-tight text-foreground"
          >
            Customers
          </h2>
          <p className="mt-0.5 text-small text-muted-foreground">
            Registered customer accounts on the platform.
          </p>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {customers.map((customer) => (
            <CustomerRow key={customer.id} customer={customer} variant="card" />
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[980px] text-left text-small">
            <caption className="sr-only">Customer records</caption>
            <thead>
              <tr className="border-b border-border bg-[#FFFBF5]/60">
                <th scope="col" className={thClass}>
                  Customer
                </th>
                <th scope="col" className={thClass}>
                  Phone
                </th>
                <th scope="col" className={thClass}>
                  Email
                </th>
                <th scope="col" className={thClass}>
                  Status
                </th>
                <th scope="col" className={thClass}>
                  Deliveries
                </th>
                <th scope="col" className={thClass}>
                  Last activity
                </th>
                <th scope="col" className={thClass}>
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <CustomerRow key={customer.id} customer={customer} variant="table" />
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
