"use client";

import Link from "next/link";
import { useState } from "react";
import type { IntegrationItem } from "@/data/integrationTypes";
import IntegrationStatusPill from "./IntegrationStatusPill";

type IntegrationCardProps = {
  item: IntegrationItem;
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <dt className="text-caption text-muted-foreground">{label}</dt>
      <dd className="text-small text-foreground sm:max-w-[65%] sm:text-right">
        {value}
      </dd>
    </div>
  );
}

export default function IntegrationCard({ item }: IntegrationCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyWebhook = async () => {
    if (!item.webhookUrl) return;

    try {
      await navigator.clipboard.writeText(item.webhookUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <article className="flex h-full flex-col rounded-card border border-border/60 bg-background p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-body font-semibold text-foreground">{item.name}</h3>
          <p className="mt-1 text-small text-muted-foreground">{item.description}</p>
        </div>
        <IntegrationStatusPill
          status={item.status}
          label={item.statusLabel}
          className="shrink-0"
        />
      </div>

      <dl className="mt-4 space-y-3 border-t border-border/60 pt-4">
        <DetailRow label="Used by" value={item.usedBy} />
        <DetailRow label="If missing" value={item.impact} />
        {item.metadata.fromEmail ? (
          <DetailRow label="From address" value={item.metadata.fromEmail} />
        ) : null}
        {item.metadata.clientIdHint ? (
          <DetailRow label="Client ID" value={item.metadata.clientIdHint} />
        ) : null}
        {item.webhookUrl ? (
          <div className="space-y-2">
            <DetailRow label="Webhook URL" value={item.webhookUrl} />
            <button
              type="button"
              onClick={() => void handleCopyWebhook()}
              className="text-caption font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {copied ? "Copied" : "Copy webhook URL"}
            </button>
          </div>
        ) : null}
      </dl>

      {item.manageHref ? (
        <div className="mt-4 border-t border-border/60 pt-4">
          <Link
            href={item.manageHref}
            className="text-small font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Manage related providers →
          </Link>
        </div>
      ) : null}
    </article>
  );
}
