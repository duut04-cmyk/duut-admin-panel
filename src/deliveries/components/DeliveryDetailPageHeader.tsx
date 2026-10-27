"use client";

import Link from "next/link";
import type { DeliveryHistoryDetail, DeliveryListItem } from "@/data/deliveryApiTypes";
import { ADMIN_SHELL_CONTENT_PADDING } from "@/components/layout";
import { formatListRoute } from "../deliveryMappers";
import { DeliveryStatusPill } from "./DeliveryStatusPill";

type DeliveryDetailPageHeaderProps = {
  history: DeliveryHistoryDetail;
};

function routeLabel(history: DeliveryHistoryDetail): string {
  const item: DeliveryListItem = {
    id: history.delivery.id,
    reference: history.delivery.reference,
    status: history.delivery.status,
    pickup: {
      addressText: history.pickup.addressText,
      contactName: history.pickup.contactName,
    },
    drop: {
      addressText: history.drop.addressText,
      contactName: history.drop.contactName,
    },
    packageType: history.package.packageType,
    weightKg: history.package.weightKg,
    sizeTier: history.package.sizeTier,
    schedule: history.schedule,
    createdAt: history.delivery.createdAt,
    updatedAt: history.delivery.updatedAt,
  };
  return formatListRoute(item);
}

export default function DeliveryDetailPageHeader({
  history,
}: DeliveryDetailPageHeaderProps) {
  const { delivery } = history;

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
            {delivery.reference}
          </h1>
          <p className="mt-0.5 font-mono text-caption text-muted-foreground">
            {delivery.id}
          </p>
          <p className="mt-1 text-small text-muted-foreground">
            {routeLabel(history)} · Delivery
          </p>
        </div>
        <DeliveryStatusPill
          status={delivery.status}
          className="self-start sm:shrink-0"
        />
      </div>
    </header>
  );
}
