"use client";

import Link from "next/link";
import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import { ADMIN_SHELL_CONTENT_PADDING } from "@/components/layout";
import { DeliveryStatusPill } from "./DeliveryStatusPill";
import { formatRoute } from "./utils";

type DeliveryDetailPageHeaderProps = {
  record: OrchestrationRecord;
};

export default function DeliveryDetailPageHeader({
  record,
}: DeliveryDetailPageHeaderProps) {
  const { deliveryRequest } = record;

  return (
    <header
      className={`bg-background pb-4 pt-4 lg:pb-5 lg:pt-5 ${ADMIN_SHELL_CONTENT_PADDING}`}
    >
      <Link
        href="/deliveries"
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
        Back to deliveries
      </Link>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-heading-md">
            {deliveryRequest.deliveryId}
          </h1>
          <p className="mt-1 text-small text-muted-foreground">
            {formatRoute(record)} · Delivery
          </p>
        </div>
        <DeliveryStatusPill
          status={deliveryRequest.status}
          className="self-start sm:shrink-0"
        />
      </div>
    </header>
  );
}
