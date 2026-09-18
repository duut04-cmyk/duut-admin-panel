"use client";

import type { CustomerSummary } from "@/data/customerTypes";
import AdminEmptyState from "@/ui/AdminEmptyState";
import CustomerRow from "./CustomerRow";

type CustomerListProps = {
  customers: CustomerSummary[];
};

export default function CustomerList({ customers }: CustomerListProps) {
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
      <article className="min-w-0 overflow-hidden rounded-card border border-border/60 bg-background shadow-sm">
        <div className="border-b border-border px-4 py-4 sm:px-5 lg:px-6">
          <h2
            id="customer-list-heading"
            className="text-subheading font-semibold leading-snug text-foreground"
          >
            Customers
          </h2>
          <p className="mt-1 text-small text-muted-foreground">
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
              <tr className="border-b border-border">
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5"
                >
                  Phone
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5"
                >
                  Email
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
                  Deliveries
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5"
                >
                  Last activity
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5"
                >
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
      </article>
    </section>
  );
}
