import AdminMetricCard from "@/ui/AdminMetricCard";
import type { DeliveryMetrics } from "./utils";

type DeliveryListSummaryProps = {
  metrics: DeliveryMetrics;
};

export default function DeliveryListSummary({
  metrics,
}: DeliveryListSummaryProps) {
  return (
    <section aria-labelledby="delivery-summary-heading">
      <h2 id="delivery-summary-heading" className="sr-only">
        Delivery summary
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
        <AdminMetricCard
          label="Total deliveries"
          value={metrics.total}
          className="p-4 md:p-5"
        />
        <AdminMetricCard
          label="In transit"
          value={metrics.inTransit}
          className="p-4 md:p-5"
        />
        <AdminMetricCard
          label="Delivered"
          value={metrics.delivered}
          className="p-4 md:p-5"
        />
        <AdminMetricCard
          label="Failed"
          value={metrics.failed}
          className="p-4 md:p-5"
        />
        <AdminMetricCard
          label="Cancelled"
          value={metrics.cancelled}
          className="col-span-2 p-4 sm:col-span-1 md:p-5"
        />
      </div>
    </section>
  );
}
