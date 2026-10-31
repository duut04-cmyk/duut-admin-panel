"use client";

import Link from "next/link";
import { useState } from "react";
import type { IntegrationItem } from "@/data/integrationTypes";
import IntegrationStatusPill from "./IntegrationStatusPill";

type IntegrationCardProps = {
  item: IntegrationItem;
};

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-border/70 bg-muted/30 px-2.5 py-1 text-caption text-muted-foreground">
      <span className="shrink-0">{label}</span>
      <span className="min-w-0 truncate font-medium text-foreground">{value}</span>
    </span>
  );
}

export default function IntegrationCard({ item }: IntegrationCardProps) {
  const [copied, setCopied] = useState(false);
  const showImpact = item.status === "not_configured" || item.status === "degraded";
  const metaChips: { label: string; value: string }[] = [];

  if (item.metadata.fromEmail) {
    metaChips.push({ label: "From", value: item.metadata.fromEmail });
  }
  if (item.metadata.clientIdHint) {
    metaChips.push({ label: "Client ID", value: item.metadata.clientIdHint });
  }
  if (item.metadata.provider) {
    metaChips.push({ label: "Provider", value: item.metadata.provider });
  }
  if (item.metadata.senderId) {
    metaChips.push({ label: "Sender", value: item.metadata.senderId });
  }
  if (item.metadata.bucket) {
    metaChips.push({ label: "Bucket", value: item.metadata.bucket });
  }

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
    <article className="flex h-full flex-col rounded-card border border-border/60 bg-background p-4 shadow-sm">
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

      <dl className="mt-4 space-y-2 border-t border-border/60 pt-3">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="shrink-0 text-caption text-muted-foreground">Used by</dt>
          <dd className="text-right text-small text-foreground">{item.usedBy}</dd>
        </div>
        {showImpact ? (
          <div className="rounded-lg border border-amber-200/80 bg-amber-50/70 px-3 py-2">
            <dt className="text-caption font-medium text-amber-800">If missing</dt>
            <dd className="mt-0.5 text-small text-amber-950">{item.impact}</dd>
          </div>
        ) : null}
      </dl>

      {metaChips.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {metaChips.map((chip) => (
            <MetaChip key={`${chip.label}-${chip.value}`} {...chip} />
          ))}
        </div>
      ) : null}

      {item.webhookUrl ? (
        <div className="mt-3 space-y-1.5 border-t border-border/60 pt-3">
          <p className="truncate text-caption text-muted-foreground">
            Webhook · <span className="text-foreground">{item.webhookUrl}</span>
          </p>
          <button
            type="button"
            onClick={() => void handleCopyWebhook()}
            className="text-caption font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {copied ? "Copied" : "Copy webhook URL"}
          </button>
        </div>
      ) : null}

      {item.manageHref ? (
        <div className="mt-auto border-t border-border/60 pt-3">
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
