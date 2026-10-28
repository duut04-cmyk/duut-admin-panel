"use client";

import { useState } from "react";
import AdminCallout from "@/ui/AdminCallout";
import CustomerAccountCard from "../../components/CustomerAccountCard";
import CustomerSubpageHeader from "../../components/CustomerSubpageHeader";
import { updateCustomer } from "../../api";
import CustomerDetailRouteShell from "../CustomerDetailRouteShell";
import { useCustomerDetail } from "../useCustomerDetail";

type CustomerEditPageProps = {
  customerId: string;
};

export default function CustomerEditPage({ customerId }: CustomerEditPageProps) {
  const { customer, setCustomer, loading, loadError, retryLoad, retrying } =
    useCustomerDetail(customerId);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleStatusChange = async (active: boolean) => {
    if (!customer) return;

    setUpdatingStatus(true);
    setSaveError(null);
    const previous = customer;
    const nextStatus = active ? "ACTIVE" : "SUSPENDED";

    setCustomer({ ...customer, status: nextStatus });

    const result = await updateCustomer(customer.id, { status: nextStatus });

    setUpdatingStatus(false);

    if (!result.success || !result.data) {
      setCustomer(previous);
      setSaveError(result.error ?? "Failed to update customer status.");
      return;
    }

    setCustomer(result.data);
  };

  return (
    <CustomerDetailRouteShell
      customerId={customerId}
      loading={loading}
      customer={customer}
      loadError={loadError}
      retryLoad={() => void retryLoad()}
      retrying={retrying}
      mainClassName="bg-background"
      containerClassName="max-w-2xl space-y-6 pb-10"
      customHeader={
        customer ? (
          <CustomerSubpageHeader
            customer={customer}
            title="Manage account"
            description="Suspend or reactivate customer access. Profile fields are read-only until admin profile updates are supported."
          />
        ) : undefined
      }
    >
      {(loaded) => (
        <>
          {saveError ? (
            <AdminCallout variant="warning" title="Update failed">
              {saveError}
            </AdminCallout>
          ) : null}
          <CustomerAccountCard
            mode="edit"
            customer={loaded}
            updatingStatus={updatingStatus}
            onStatusChange={(active) => void handleStatusChange(active)}
          />
        </>
      )}
    </CustomerDetailRouteShell>
  );
}
