"use client";

import type { AdminAccount } from "@/data/settingsTypes";
import Button from "@/common/components/Button";
import AdminBadge from "@/ui/AdminBadge";
import AdminSkeleton from "@/ui/AdminSkeleton";
import ReportsSection from "@/reports/components/ReportsSection";
import { getInitials } from "./formatters";

type AccountSectionProps = {
  account: AdminAccount | null;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  retrying?: boolean;
};

export default function AccountSection({
  account,
  loading,
  error,
  onRetry,
  retrying = false,
}: AccountSectionProps) {
  return (
    <ReportsSection
      id="settings-account"
      title="Admin account"
      description="Signed-in profile"
    >
      {loading ? (
        <AdminSkeleton variant="card" className="h-24" aria-hidden="true" />
      ) : null}

      {error ? (
        <div className="space-y-3">
          <p className="text-small text-muted-foreground">{error}</p>
          {onRetry ? (
            <Button
              type="button"
              onClick={onRetry}
              disabled={retrying}
              aria-busy={retrying}
            >
              {retrying ? "Retrying…" : "Retry"}
            </Button>
          ) : null}
        </div>
      ) : null}

      {!loading && account ? (
        <article className="flex flex-col gap-3 rounded-card border border-border/60 bg-background p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-small font-bold text-accent-foreground"
              aria-hidden="true"
            >
              {getInitials(account.name)}
            </span>
            <div className="min-w-0">
              <p className="text-body font-semibold text-foreground">{account.name}</p>
              <p className="text-small text-muted-foreground">{account.email}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <AdminBadge variant="accent">{account.role}</AdminBadge>
                <AdminBadge variant={account.emailVerified ? "success" : "warning"}>
                  {account.emailVerified ? "Verified" : "Unverified"}
                </AdminBadge>
                <AdminBadge variant="neutral">{account.status}</AdminBadge>
              </div>
            </div>
          </div>
          <p className="text-caption text-muted-foreground sm:text-right">
            Password / user admin not available
          </p>
        </article>
      ) : null}
    </ReportsSection>
  );
}
