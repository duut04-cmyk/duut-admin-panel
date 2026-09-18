"use client";

import type { CustomerDetail } from "@/data/customerTypes";
import AdminToggle from "@/ui/AdminToggle";
import CustomerDetailCard from "./CustomerDetailCard";
import CustomerStatusPill from "./CustomerStatusPill";
import { formatCustomerDate, formatPhone, signInMethods } from "./utils";

type CustomerAccountCardProps = {
  customer: CustomerDetail;
  updatingStatus: boolean;
  onStatusChange: (active: boolean) => void;
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 py-3 last:border-b-0">
      <dt className="text-caption text-muted-foreground">{label}</dt>
      <dd className="max-w-[60%] text-right text-small font-medium text-foreground">
        {value}
      </dd>
    </div>
  );
}

export default function CustomerAccountCard({
  customer,
  updatingStatus,
  onStatusChange,
}: CustomerAccountCardProps) {
  const isActive = customer.status === "ACTIVE";

  return (
    <CustomerDetailCard title="Account" description="Profile and access details.">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-body font-semibold text-foreground">{customer.name}</p>
          <p className="mt-0.5 truncate text-small text-muted-foreground">
            {customer.email}
          </p>
        </div>
        <CustomerStatusPill status={customer.status} />
      </div>

      <dl>
        <DetailRow label="Phone" value={formatPhone(customer.phone)} />
        <DetailRow
          label="Email verified"
          value={customer.emailVerified ? "Yes" : "No"}
        />
        <DetailRow label="Sign-in methods" value={signInMethods(customer)} />
        <DetailRow
          label="Member since"
          value={formatCustomerDate(customer.createdAt)}
        />
        {customer.averageRating != null ? (
          <DetailRow
            label="Average rating"
            value={`${customer.averageRating.toFixed(1)} / 5`}
          />
        ) : null}
      </dl>

      <div className="mt-5 border-t border-border/60 pt-5">
        <AdminToggle
          checked={isActive}
          label={isActive ? "Account active" : "Account suspended"}
          description={
            isActive
              ? "Customer can sign in and create deliveries."
              : "Customer is suspended and cannot access the platform."
          }
          onCheckedChange={onStatusChange}
          disabled={updatingStatus}
        />
      </div>
    </CustomerDetailCard>
  );
}
