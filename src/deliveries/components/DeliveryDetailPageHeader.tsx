"use client";

import Link from "next/link";
import { useState } from "react";
import type { DeliveryHistoryDetail } from "@/data/deliveryApiTypes";
import { ADMIN_SHELL_CONTENT_PADDING } from "@/components/layout";
import { DeliveryStatusPill } from "./DeliveryStatusPill";
import { formatTimestamp } from "./utils";

type DeliveryDetailPageHeaderProps = {
  history: DeliveryHistoryDetail;
};

export default function DeliveryDetailPageHeader({
  history,
}: DeliveryDetailPageHeaderProps) {
  const { delivery, schedule, booking, orchestration } = history;
  const [copied, setCopied] = useState(false);
  const provider =
    booking?.providerCode ?? orchestration?.selectedOption?.providerCode ?? null;

  const metaParts = [
    provider,
    schedule.mode,
    formatTimestamp(delivery.createdAt),
  ].filter(Boolean);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(delivery.id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

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
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-heading-md">
              {delivery.reference}
            </h1>
            <DeliveryStatusPill status={delivery.status} className="shrink-0" />
          </div>
          <p className="mt-1.5 text-small text-muted-foreground">
            {metaParts.join(" · ")}
          </p>
          <button
            type="button"
            onClick={() => void copyId()}
            className="mt-1.5 inline-flex items-center gap-1.5 font-mono text-caption text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            title={delivery.id}
          >
            <span className="max-w-[14rem] truncate sm:max-w-xs">{delivery.id}</span>
            <span className="font-sans font-medium text-accent">
              {copied ? "Copied" : "Copy ID"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
