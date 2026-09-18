"use client";

import Link from "next/link";
import { useState } from "react";
import { useLoadedAsync } from "@/lib/useLoadedAsync";
import type { CustomerDetail } from "@/data/customerTypes";
import AdminContainer from "@/components/AdminContainer";
import { ADMIN_DETAIL_RAIL_GRID } from "@/components/layout";
import AdminShell from "@/components/AdminShell";
import AdminCallout from "@/ui/AdminCallout";
import AdminEmptyState from "@/ui/AdminEmptyState";
import { fetchCustomer, updateCustomer } from "../api";
import CustomerAccountCard from "../components/CustomerAccountCard";
import CustomerDeliveryHistory from "../components/CustomerDeliveryHistory";
import CustomerDetailPageHeader from "../components/CustomerDetailPageHeader";
import CustomerHeroMetrics from "../components/CustomerHeroMetrics";

type CustomerDetailPageProps = {
  customerId: string;
};

export default function CustomerDetailPage({ customerId }: CustomerDetailPageProps) {
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useLoadedAsync(
    async (isStale) => {
      const result = await fetchCustomer(customerId);

      if (isStale()) return;

      setLoading(false);
      setLoadError(null);

      if (!result.success || !result.data) {
        setCustomer(null);
        setLoadError(result.error ?? "Customer not found.");
        return;
      }

      setCustomer(result.data);
    },
    [customerId],
  );

  const handleStatusChange = async (active: boolean) => {
    if (!customer) return;

    setUpdatingStatus(true);
    const previous = customer;
    const nextStatus = active ? "ACTIVE" : "SUSPENDED";

    setCustomer({ ...customer, status: nextStatus });

    const result = await updateCustomer(customer.id, { status: nextStatus });

    setUpdatingStatus(false);

    if (!result.success || !result.data) {
      setCustomer(previous);
      setLoadError(result.error ?? "Failed to update customer status.");
      return;
    }

    setCustomer(result.data);
  };

  if (loading) {
    return (
      <AdminShell customHeader={<CustomerPageLoadingHeader />}>
        <AdminContainer flushTop className="pb-10">
          <p className="text-small text-muted-foreground">Loading customer…</p>
        </AdminContainer>
      </AdminShell>
    );
  }

  if (!customer) {
    return (
      <AdminShell customHeader={<CustomerPageLoadingHeader notFound />}>
        <AdminContainer flushTop className="pb-10">
          <AdminEmptyState
            title="Customer not found"
            description={loadError ?? `No customer exists for ID "${customerId}".`}
            action={
              <Link
                href="/customers"
                className="text-small font-medium text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Back to customers
              </Link>
            }
          />
        </AdminContainer>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      mainClassName="bg-background"
      customHeader={<CustomerDetailPageHeader customer={customer} />}
    >
      <AdminContainer flushTop className="space-y-6 pb-10 lg:space-y-8">
        {loadError ? (
          <AdminCallout variant="warning" title="Something went wrong">
            {loadError}
          </AdminCallout>
        ) : null}

        <CustomerHeroMetrics customer={customer} />

        <div className={`grid min-w-0 gap-6 ${ADMIN_DETAIL_RAIL_GRID} xl:items-start`}>
          <aside className="min-w-0 space-y-6 xl:order-2 xl:sticky xl:top-6 xl:self-start">
            <CustomerAccountCard
              customer={customer}
              updatingStatus={updatingStatus}
              onStatusChange={(active) => void handleStatusChange(active)}
            />
          </aside>

          <div className="min-w-0 space-y-6 xl:order-1">
            <CustomerDeliveryHistory deliveries={customer.recentDeliveries} />
          </div>
        </div>
      </AdminContainer>
    </AdminShell>
  );
}

function CustomerPageLoadingHeader({ notFound = false }: { notFound?: boolean }) {
  return (
    <header className="bg-background px-4 pb-4 pt-4 sm:px-6 lg:px-8 lg:pb-5 lg:pt-5">
      <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-heading-md">
        Customers
      </h1>
      <p className="mt-1 text-small text-muted-foreground">
        {notFound ? "Customer not found" : "Loading customer…"}
      </p>
    </header>
  );
}
