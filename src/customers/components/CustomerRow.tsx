"use client";

import Link from "next/link";
import type { CustomerSummary } from "@/data/customerTypes";
import AdminStatus from "@/ui/AdminStatus";
import CustomerStatusPill from "./CustomerStatusPill";
import {
  customerStatusLabel,
  customerStatusVariant,
  formatCustomerDate,
  formatPhone,
} from "./utils";

type CustomerRowProps = {
  customer: CustomerSummary;
  variant?: "table" | "card";
};

function VerifiedBadge({ verified }: { verified: boolean }) {
  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 text-caption font-semibold ${
        verified ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
      }`}
    >
      {verified ? "Verified" : "Unverified"}
    </span>
  );
}

export default function CustomerRow({ customer, variant = "table" }: CustomerRowProps) {
  const href = `/customers/${customer.id}`;

  if (variant === "card") {
    return (
      <Link
        href={href}
        className="block rounded-card border border-border/60 bg-background p-4 shadow-sm transition-colors hover:border-foreground/20 hover:bg-surface/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-label={`Open customer ${customer.name}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-semibold text-foreground">{customer.name}</p>
            <p className="mt-0.5 truncate text-small text-muted-foreground">
              {customer.email}
            </p>
          </div>
          <CustomerStatusPill status={customer.status} />
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-small">
          <div>
            <dt className="text-caption text-muted-foreground">Phone</dt>
            <dd className="mt-0.5">{formatPhone(customer.phone)}</dd>
          </div>
          <div className="text-right">
            <dt className="text-caption text-muted-foreground">Email</dt>
            <dd className="mt-0.5 flex justify-end">
              <VerifiedBadge verified={customer.emailVerified} />
            </dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Deliveries</dt>
            <dd className="mt-0.5 tabular-nums font-medium">
              {customer.stats.totalDeliveries}
            </dd>
          </div>
          <div className="text-right">
            <dt className="text-caption text-muted-foreground">Last activity</dt>
            <dd className="mt-0.5 tabular-nums">
              {formatCustomerDate(customer.stats.lastDeliveryAt)}
            </dd>
          </div>
        </dl>
      </Link>
    );
  }

  return (
    <tr className="border-b border-border/60 transition-colors last:border-b-0 hover:bg-surface/30">
      <td className="px-4 py-4 align-top md:px-5">
        <Link
          href={href}
          className="block min-w-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <p className="font-semibold text-foreground">{customer.name}</p>
          <p className="mt-0.5 text-caption text-muted-foreground">{customer.email}</p>
        </Link>
      </td>
      <td className="px-4 py-4 align-top text-small text-muted-foreground md:px-5">
        {formatPhone(customer.phone)}
      </td>
      <td className="px-4 py-4 align-top md:px-5">
        <VerifiedBadge verified={customer.emailVerified} />
      </td>
      <td className="px-4 py-4 align-top md:px-5">
        <AdminStatus
          variant={customerStatusVariant(customer.status)}
          label={customerStatusLabel(customer.status)}
        />
      </td>
      <td className="px-4 py-4 align-top tabular-nums text-foreground md:px-5">
        {customer.stats.totalDeliveries}
      </td>
      <td className="px-4 py-4 align-top tabular-nums text-muted-foreground md:px-5">
        {formatCustomerDate(customer.stats.lastDeliveryAt)}
      </td>
      <td className="px-4 py-4 align-top tabular-nums text-muted-foreground md:px-5">
        {formatCustomerDate(customer.createdAt)}
      </td>
    </tr>
  );
}
