"use client";

import Link from "next/link";
import type { ProviderDetail } from "@/data/providerTypes";
import { ADMIN_SHELL_CONTENT_PADDING } from "@/components/layout";
import AdminStatus from "@/ui/AdminStatus";
import ProviderEnvironmentBadge from "./ProviderEnvironmentBadge";
import {
  environmentLabel,
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
          <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-heading-md">
            {provider.name}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start">
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
      </div>

      {provider.description ? (
        <p className="mt-3 max-w-3xl text-small leading-relaxed text-muted-foreground">
          {provider.description}
        </p>
      ) : null}

      <p className="mt-2 text-caption text-muted-foreground">
        Environment: {environmentLabel(provider.environment)}
      </p>
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
