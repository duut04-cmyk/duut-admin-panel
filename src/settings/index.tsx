"use client";

import { useState } from "react";
import { useLoadedAsync } from "@/lib/useLoadedAsync";
import type { AdminAccount, SettingsSnapshot } from "@/data/settingsTypes";
import AdminContainer from "@/components/AdminContainer";
import AdminShell from "@/components/AdminShell";
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

  useLoadedAsync(async (isStale) => {
    const result = await fetchSettingsSnapshot();

    if (isStale()) return;

    setLoading(false);
    setLoadError(null);

    if (!result.success || !result.data) {
      setSnapshot(null);
      setLoadError(result.error ?? "Failed to load settings.");
      return;
    }

    setSnapshot(result.data);
  }, []);

  useLoadedAsync(async (isStale) => {
    const result = await fetchAdminAccount();

    if (isStale()) return;

    setAccountLoading(false);
    setAccountError(null);

    if (!result.success || !result.data) {
      setAccount(null);
      setAccountError(result.error ?? "Could not load your account.");
      return;
    }

    setAccount(result.data);
  }, []);

  return (
    <AdminShell mainClassName="bg-background" customHeader={<SettingsPageHeader />}>
      <AdminContainer flushTop className="space-y-8 pb-10">
        {loadError ? (
          <AdminCallout variant="warning" title="Unable to load settings">
            {loadError}
          </AdminCallout>
        ) : null}

        <AccountSection
          account={account}
          loading={accountLoading}
          error={accountError}
        />

        {loading ? (
          <p className="text-small text-muted-foreground">Loading platform settings…</p>
        ) : null}

        {!loading && snapshot ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-caption text-muted-foreground">
                Snapshot from backend · last checked{" "}
                {formatCheckedAt(snapshot.checkedAt)}
              </p>
            </div>

            <AdminCallout variant="neutral" title="Read-only configuration">
              These values reflect server environment variables and code constants. To
              change them, update deployment configuration or source code — not this
              admin panel.
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
