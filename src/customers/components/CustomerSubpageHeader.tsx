"use client";

import Link from "next/link";
import type { CustomerDetail } from "@/data/customerTypes";
import { ADMIN_SHELL_CONTENT_PADDING } from "@/components/layout";

type CustomerSubpageHeaderProps = {
  customer: CustomerDetail;
  title: string;
  description?: string;
};

export default function CustomerSubpageHeader({
  customer,
  title,
  description,
}: CustomerSubpageHeaderProps) {
  return (
    <header
      className={`bg-background pb-4 pt-4 lg:pb-5 lg:pt-5 ${ADMIN_SHELL_CONTENT_PADDING}`}
    >
      <Link
        href={`/customers/${customer.id}`}
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
        Back to {customer.name}
      </Link>

      <h1 className="mt-3 text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-heading-md">
        {title}
      </h1>
      {description ? (
        <p className="mt-1.5 max-w-2xl text-small leading-snug text-muted-foreground">
          {description}
        </p>
      ) : null}
    </header>
  );
}
