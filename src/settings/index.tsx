"use client";

import { useCallback, useState } from "react";
import { useLoadedAsync } from "@/lib/useLoadedAsync";
import { useExclusiveAsync } from "@/lib/useExclusiveAsync";
import type { AdminAccount, SettingsSnapshot } from "@/data/settingsTypes";
import AdminContainer from "@/components/AdminContainer";
import AdminShell from "@/components/AdminShell";
import AdminLoadErrorCallout from "@/components/AdminLoadErrorCallout";
import { SettingsPageSkeleton } from "@/components/loading/skeletonSections";
import AdminCallout from "@/ui/AdminCallout";
import AdminEmptyState from "@/ui/AdminEmptyState";
import { fetchAdminAccount, fetchSettingsSnapshot } from "./api";
import AccountSection from "./components/AccountSection";
import OperationsSection from "./components/OperationsSection";
import PlatformSection from "./components/PlatformSection";
import PoliciesSection from "./components/PoliciesSection";
import RelatedPagesSection from "./components/RelatedPagesSection";
import SettingsPageHeader from "./components/SettingsPageHeader";
import { formatCheckedAt } from "./components/formatters";

export default function SettingsPage() {
  const [snapshot, setSnapshot] = useState<SettingsSnapshot | null>(null);
  const [account, setAccount] = useState<AdminAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [accountLoading, setAccountLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [accountError, setAccountError] = useState<string | null>(null);

  const loadSnapshot = useCallback(async (isStale: () => boolean = () => false) => {
    setLoading(true);
    setLoadError(null);

    const result = await fetchSettingsSnapshot();

    if (isStale()) return;

    setLoading(false);

    if (!result.success || !result.data) {
      setSnapshot(null);
      setLoadError(result.error ?? "Failed to load settings.");
      return;
    }

    setSnapshot(result.data);
  }, []);

  const loadAccount = useCallback(async (isStale: () => boolean = () => false) => {
    setAccountLoading(true);
    setAccountError(null);

    const result = await fetchAdminAccount();

    if (isStale()) return;

    setAccountLoading(false);

    if (!result.success || !result.data) {
      setAccount(null);
      setAccountError(result.error ?? "Could not load your account.");
      return;
    }

    setAccount(result.data);
  }, []);

  useLoadedAsync(
    async (isStale) => {
      await loadSnapshot(isStale);
    },
    [loadSnapshot],
  );

  useLoadedAsync(
    async (isStale) => {
      await loadAccount(isStale);
    },
    [loadAccount],
  );

  const { run: retrySnapshot, busy: retryingSnapshot } = useExclusiveAsync(async () => {
    await loadSnapshot();
  });

  const { run: retryAccount, busy: retryingAccount } = useExclusiveAsync(async () => {
    await loadAccount();
  });

  return (
    <AdminShell mainClassName="bg-background" customHeader={<SettingsPageHeader />}>
      <AdminContainer flushTop className="space-y-8 pb-10">
        {loadError ? (
          <AdminLoadErrorCallout
            title="Unable to load settings"
            onRetry={() => void retrySnapshot()}
            retrying={retryingSnapshot}
          >
            <p>{loadError}</p>
          </AdminLoadErrorCallout>
        ) : null}

        <AccountSection
          account={account}
          loading={accountLoading}
          error={accountError}
          onRetry={() => void retryAccount()}
          retrying={retryingAccount}
        />

        {loading ? <SettingsPageSkeleton /> : null}

        {!loading && snapshot ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-caption text-muted-foreground">
                Snapshot from backend · last checked{" "}
                {formatCheckedAt(snapshot.checkedAt)}
              </p>
            </div>

            <AdminCallout variant="neutral" title="Read-only in Admin v1">
              This page shows effective platform configuration from the backend
              snapshot. URLs, auth, OTP, orchestration weights, and integration
              credentials are deployment-managed. Runtime booking and pricing policy
              editing is not available in this release.
            </AdminCallout>

            <PlatformSection platform={snapshot.platform} />
            <PoliciesSection policies={snapshot.policies} />
            <OperationsSection flags={snapshot.flags} />
            <RelatedPagesSection />
          </>
        ) : null}

        {!loading && !snapshot && !loadError ? (
          <AdminEmptyState
            title="No settings data"
            description="Platform settings could not be loaded."
          />
        ) : null}
      </AdminContainer>
    </AdminShell>
  );
}
