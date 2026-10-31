"use client";

import Link from "next/link";
import { ADMIN_SHELL_CONTENT_PADDING } from "@/components/layout";

type SettingsPageHeaderProps = {
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

export default function SettingsPageHeader({
  checkedAt = null,
}: SettingsPageHeaderProps) {
  return (
    <header
      className={`bg-background pb-4 pt-4 lg:pb-5 lg:pt-5 ${ADMIN_SHELL_CONTENT_PADDING}`}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-heading-md">
              Settings
            </h1>
            <span className="rounded-full border border-border bg-muted/40 px-2 py-0.5 text-caption font-medium text-muted-foreground">
              Read-only
            </span>
          </div>
          <p className="mt-1.5 max-w-xl text-small leading-snug text-muted-foreground">
            Account, platform config & policies · services under{" "}
            <Link
              href="/integrations"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              Integrations
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
