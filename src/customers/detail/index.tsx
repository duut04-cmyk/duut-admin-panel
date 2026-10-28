"use client";

import { ADMIN_DETAIL_RAIL_GRID } from "@/components/layout";
import CustomerAccountCard from "../components/CustomerAccountCard";
import CustomerDeliveryHistory from "../components/CustomerDeliveryHistory";
import CustomerDetailPageHeader from "../components/CustomerDetailPageHeader";
import CustomerHeroMetrics from "../components/CustomerHeroMetrics";
import CustomerDetailRouteShell from "./CustomerDetailRouteShell";
import { useCustomerDetail } from "./useCustomerDetail";

type CustomerDetailPageProps = {
  customerId: string;
};

export default function CustomerDetailPage({ customerId }: CustomerDetailPageProps) {
  const { customer, loading, loadError, retryLoad, retrying } =
    useCustomerDetail(customerId);

  return (
    <CustomerDetailRouteShell
      customerId={customerId}
      loading={loading}
      customer={customer}
      loadError={loadError}
      retryLoad={() => void retryLoad()}
      retrying={retrying}
      mainClassName="bg-background"
      containerClassName="space-y-6 pb-10 lg:space-y-8"
      customHeader={
        customer ? <CustomerDetailPageHeader customer={customer} /> : undefined
      }
    >
      {(loaded) => (
        <>
          <CustomerHeroMetrics customer={loaded} />

          <div
            className={`grid min-w-0 gap-6 ${ADMIN_DETAIL_RAIL_GRID} xl:items-start`}
          >
            <aside className="min-w-0 space-y-6 xl:order-2 xl:sticky xl:top-6 xl:self-start">
              <CustomerAccountCard mode="view" customer={loaded} />
            </aside>

            <div className="min-w-0 xl:order-1">
              <CustomerDeliveryHistory deliveries={loaded.recentDeliveries} />
            </div>
          </div>
        </>
      )}
    </CustomerDetailRouteShell>
  );
}
