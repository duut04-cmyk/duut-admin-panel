"use client";

import Link from "next/link";
import { ADMIN_SHELL_CONTENT_PADDING } from "@/components/layout";

type IntegrationsPageHeaderProps = {
  checkedAt?: string | null;
};

function formatCheckedAt(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function IntegrationsPageHeader({
  checkedAt = null,
}: IntegrationsPageHeaderProps) {
  return (
    <header
      className={`bg-background pb-4 pt-4 lg:pb-5 lg:pt-5 ${ADMIN_SHELL_CONTENT_PADDING}`}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-heading-md">
            Integrations
          </h1>
          <p className="mt-1.5 max-w-xl text-small leading-snug text-muted-foreground">
            Platform services status · delivery partners live under{" "}
            <Link
              href="/providers"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              Providers
            </Link>
          </p>
        </div>
        {checkedAt ? (
          <p className="shrink-0 text-caption text-muted-foreground">
            Last checked {formatCheckedAt(checkedAt)}
          </p>
        ) : null}
      </div>
    </header>
  );
}
