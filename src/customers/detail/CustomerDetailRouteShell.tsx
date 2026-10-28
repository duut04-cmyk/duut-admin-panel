"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { CustomerDetail } from "@/data/customerTypes";
import AdminContainer from "@/components/AdminContainer";
import AdminShell from "@/components/AdminShell";
import AdminLoadErrorCallout from "@/components/AdminLoadErrorCallout";
import { CustomerDetailSkeleton } from "@/components/loading/skeletonSections";
import AdminEmptyState from "@/ui/AdminEmptyState";
import { CustomerDetailLoadingHeader } from "../components/CustomerDetailPageHeader";

type CustomerDetailRouteShellProps = {
  customerId: string;
  loading: boolean;
  customer: CustomerDetail | null;
  loadError: string | null;
  retryLoad: () => void;
  retrying: boolean;
  customHeader?: ReactNode;
  mainClassName?: string;
  containerClassName?: string;
  children: (customer: CustomerDetail) => ReactNode;
};

export default function CustomerDetailRouteShell({
  customerId,
  loading,
  customer,
  loadError,
  retryLoad,
  retrying,
  customHeader,
  mainClassName,
  containerClassName = "pb-10",
  children,
}: CustomerDetailRouteShellProps) {
  if (loading) {
    return (
      <AdminShell customHeader={customHeader ?? <CustomerDetailLoadingHeader />}>
        <AdminContainer flushTop className={containerClassName}>
          <CustomerDetailSkeleton />
        </AdminContainer>
      </AdminShell>
    );
  }

  if (!customer) {
    return (
      <AdminShell customHeader={<CustomerDetailLoadingHeader notFound />}>
        <AdminContainer flushTop className={containerClassName}>
          {loadError ? (
            <AdminLoadErrorCallout
              title="Unable to load customer"
              onRetry={() => void retryLoad()}
              retrying={retrying}
            >
              <p>{loadError}</p>
            </AdminLoadErrorCallout>
          ) : (
            <AdminEmptyState
              title="Customer not found"
              description={`No customer exists for ID "${customerId}".`}
              action={
                <Link
                  href="/customers"
                  className="text-small font-medium text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Back to customers
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
        {children(customer)}
      </AdminContainer>
    </AdminShell>
  );
}
