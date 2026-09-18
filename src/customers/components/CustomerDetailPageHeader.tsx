"use client";

import Link from "next/link";
import type { CustomerDetail } from "@/data/customerTypes";
import { ADMIN_SHELL_CONTENT_PADDING } from "@/components/layout";
import CustomerStatusPill from "./CustomerStatusPill";
import { formatPhone } from "./utils";

type CustomerDetailPageHeaderProps = {
  customer: CustomerDetail;
};

export default function CustomerDetailPageHeader({
  customer,
}: CustomerDetailPageHeaderProps) {
  return (
    <header
      className={`bg-background pb-4 pt-4 lg:pb-5 lg:pt-5 ${ADMIN_SHELL_CONTENT_PADDING}`}
    >
      <Link
        href="/customers"
        className="inline-flex items-center gap-1.5 text-small font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M10 12L6 8l4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to customers
      </Link>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-heading-md">
            {customer.name}
          </h1>
          <p className="mt-1 text-small text-muted-foreground">
            {customer.email} · {formatPhone(customer.phone)}
          </p>
        </div>
        <CustomerStatusPill
          status={customer.status}
          className="self-start sm:shrink-0"
        />
      </div>
    </header>
  );
}
