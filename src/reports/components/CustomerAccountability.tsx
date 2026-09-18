"use client";

import Link from "next/link";
import type { CustomerAccountabilityRow } from "@/reports/accountability";
import AdminEmptyState from "@/ui/AdminEmptyState";
import CustomerStatusPill from "@/customers/components/CustomerStatusPill";

type CustomerAccountabilityProps = {
  rows: CustomerAccountabilityRow[];
  atRiskRows: CustomerAccountabilityRow[];
  loading?: boolean;
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function CustomerAccountability({
  rows,
  atRiskRows,
  loading = false,
}: CustomerAccountabilityProps) {
  if (loading) {
    return <p className="text-small text-muted-foreground">Loading customers…</p>;
  }

  if (rows.length === 0) {
    return (
      <AdminEmptyState
        title="No customers found"
        description="Customer accountability will appear once accounts are registered."
      />
    );
  }

  const active = rows.filter((row) => row.status === "ACTIVE").length;
  const suspended = rows.filter((row) => row.status === "SUSPENDED").length;
  const verified = rows.filter((row) => row.emailVerified).length;
  const withDeliveries = rows.filter((row) => row.totalDeliveries > 0).length;

  return (
    <div className="space-y-4">
      <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total", value: rows.length },
          { label: "Active", value: active },
          { label: "Verified", value: verified },
          { label: "With deliveries", value: withDeliveries },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-card border border-border/60 bg-background p-4"
          >
            <p className="text-caption text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-body font-semibold tabular-nums">{item.value}</p>
          </div>
        ))}
      </div>

      {suspended > 0 ? (
        <p className="text-small text-muted-foreground">
          {suspended} suspended account{suspended === 1 ? "" : "s"} require review.
        </p>
      ) : null}

      <article className="min-w-0 overflow-hidden rounded-card border border-border/60 bg-background shadow-sm">
        <div className="border-b border-border px-4 py-4 sm:px-5">
          <h3 className="text-small font-semibold text-foreground">
            At-risk customers
          </h3>
          <p className="mt-1 text-caption text-muted-foreground">
            Suspended accounts or unverified users with delivery activity.
          </p>
        </div>

        {atRiskRows.length === 0 ? (
          <p className="p-4 text-small text-muted-foreground sm:p-5">
            No at-risk customers detected.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-small">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                    Status
                  </th>
                  <th className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                    Deliveries
                  </th>
                  <th className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                    Last activity
                  </th>
                  <th className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                    Note
                  </th>
                </tr>
              </thead>
              <tbody>
                {atRiskRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border/60 last:border-b-0"
                  >
                    <td className="px-4 py-3 md:px-5">
                      <Link
                        href={`/customers/${row.id}`}
                        className="font-medium text-accent hover:underline"
                      >
                        {row.name}
                      </Link>
                      <p className="text-caption text-muted-foreground">{row.email}</p>
                    </td>
                    <td className="px-4 py-3 md:px-5">
                      <CustomerStatusPill status={row.status} />
                    </td>
                    <td className="px-4 py-3 tabular-nums md:px-5">
                      {row.totalDeliveries}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground md:px-5">
                      {formatDate(row.lastDeliveryAt)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground md:px-5">
                      {row.riskNote}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </div>
  );
}
