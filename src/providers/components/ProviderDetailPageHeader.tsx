"use client";

import Link from "next/link";
import { useState } from "react";
import type { ProviderDetail } from "@/data/providerTypes";
import { ADMIN_SHELL_CONTENT_PADDING } from "@/components/layout";
import AdminStatus from "@/ui/AdminStatus";
import ProviderEnvironmentBadge from "./ProviderEnvironmentBadge";
import {
  integrationStatusLabel,
  integrationStatusVariant,
  providerStatusLabel,
  providerStatusVariant,
} from "./utils";

type ProviderDetailPageHeaderProps = {
  provider: ProviderDetail;
};

export default function ProviderDetailPageHeader({
  provider,
}: ProviderDetailPageHeaderProps) {
  const [copied, setCopied] = useState(false);

  const metaParts = [
    provider.code,
    `Priority ${provider.priority}`,
    provider.orchestrationEnabled ? "Orchestration on" : "Orchestration off",
    provider.credentials.configured ? "Credentials set" : "Credentials incomplete",
  ];

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(provider.id);
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
        href="/providers"
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
        Back to providers
      </Link>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-heading-md">
              {provider.name}
            </h1>
            <ProviderEnvironmentBadge environment={provider.environment} />
            <AdminStatus
              variant={providerStatusVariant(provider.status)}
              label={providerStatusLabel(provider.status)}
            />
            <AdminStatus
              variant={integrationStatusVariant(provider.integrationStatus)}
              label={integrationStatusLabel(provider.integrationStatus)}
            />
          </div>
          <p className="mt-1.5 text-small text-muted-foreground">
            {metaParts.join(" · ")}
          </p>
          {provider.description ? (
            <p className="mt-2 max-w-2xl text-small text-muted-foreground">
              {provider.description}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => void copyId()}
            className="mt-1.5 inline-flex items-center gap-1.5 font-mono text-caption text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            title={provider.id}
          >
            <span className="max-w-[14rem] truncate sm:max-w-xs">{provider.id}</span>
            <span className="font-sans font-medium text-accent">
              {copied ? "Copied" : "Copy ID"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

export function ProviderDetailLoadingHeader() {
  return (
    <header
      className={`bg-background pb-4 pt-4 lg:pb-5 lg:pt-5 ${ADMIN_SHELL_CONTENT_PADDING}`}
    >
      <p className="text-small text-muted-foreground">Loading provider…</p>
      <h1 className="mt-2 text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-heading-md">
        Provider
      </h1>
    </header>
  );
}

export function ProviderDetailErrorHeader({ notFound }: { notFound?: boolean }) {
  return (
    <header
      className={`bg-background pb-4 pt-4 lg:pb-5 lg:pt-5 ${ADMIN_SHELL_CONTENT_PADDING}`}
    >
      <Link
        href="/providers"
        className="inline-flex items-center gap-1.5 text-small font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        ← Back to providers
      </Link>
      <h1 className="mt-3 text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-heading-md">
        {notFound ? "Provider not found" : "Provider unavailable"}
      </h1>
    </header>
  );
}
