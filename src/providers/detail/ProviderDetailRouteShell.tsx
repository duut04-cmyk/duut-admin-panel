"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { ProviderDetail } from "@/data/providerTypes";
import AdminContainer from "@/components/AdminContainer";
import AdminShell from "@/components/AdminShell";
import AdminLoadErrorCallout from "@/components/AdminLoadErrorCallout";
import { ProviderDetailSkeleton } from "@/components/loading/skeletonSections";
import AdminEmptyState from "@/ui/AdminEmptyState";
import {
  ProviderDetailErrorHeader,
  ProviderDetailLoadingHeader,
} from "../components/ProviderDetailPageHeader";
import { isProviderNotFoundError } from "../components/detailFormatting";

type ProviderDetailRouteShellProps = {
  providerId: string;
  invalidId: boolean;
  loading: boolean;
  provider: ProviderDetail | null;
  loadError: string | null;
  retryLoad: () => void;
  retrying: boolean;
  customHeader?: ReactNode;
  loadingFallback?: ReactNode;
  mainClassName?: string;
  containerClassName?: string;
  children: (provider: ProviderDetail) => ReactNode;
};

export default function ProviderDetailRouteShell({
  providerId,
  invalidId,
  loading,
  provider,
  loadError,
  retryLoad,
  retrying,
  customHeader,
  loadingFallback,
  mainClassName,
  containerClassName = "pb-10",
  children,
}: ProviderDetailRouteShellProps) {
  if (invalidId) {
    return (
      <AdminShell customHeader={<ProviderDetailErrorHeader />}>
        <AdminContainer flushTop className="pb-10">
          <AdminEmptyState
            title="Invalid provider id"
            description="Open a provider from the providers list."
            action={
              <Link
                href="/providers"
                className="text-small font-medium text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Back to providers
              </Link>
            }
          />
        </AdminContainer>
      </AdminShell>
    );
  }

  if (loading) {
    return (
      <AdminShell customHeader={customHeader ?? <ProviderDetailLoadingHeader />}>
        <AdminContainer flushTop className="pb-10">
          {loadingFallback ?? <ProviderDetailSkeleton />}
        </AdminContainer>
      </AdminShell>
    );
  }

  if (!provider) {
    const notFound = isProviderNotFoundError(loadError ?? undefined);
    return (
      <AdminShell customHeader={<ProviderDetailErrorHeader notFound={notFound} />}>
        <AdminContainer flushTop className="pb-10">
          {loadError && !notFound ? (
            <AdminLoadErrorCallout
              title="Unable to load provider"
              onRetry={() => void retryLoad()}
              retrying={retrying}
            >
              <p>{loadError}</p>
            </AdminLoadErrorCallout>
          ) : (
            <AdminEmptyState
              title="Provider not found"
              description={
                notFound
                  ? `No provider exists for ID "${providerId}".`
                  : "This provider could not be loaded."
              }
              action={
                <Link
                  href="/providers"
                  className="text-small font-medium text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Back to providers
                </Link>
              }
            />
          )}
        </AdminContainer>
      </AdminShell>
    );
  }

  return (
    <AdminShell mainClassName={mainClassName} customHeader={customHeader}>
      <AdminContainer flushTop className={containerClassName}>
        {children(provider)}
      </AdminContainer>
    </AdminShell>
  );
}
