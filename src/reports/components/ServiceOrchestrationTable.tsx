import type { ServicePerformance } from "@/data/orchestrationMetrics";
import { formatPercent } from "@/data/orchestrationMetrics";
import AdminEmptyState from "@/ui/AdminEmptyState";

type ServiceOrchestrationTableProps = {
  services: ServicePerformance[];
};

export default function ServiceOrchestrationTable({
  services,
}: ServiceOrchestrationTableProps) {
  if (services.length === 0) {
    return (
      <AdminEmptyState
        title="No service evaluations"
        description="Orchestration service performance will appear once deliveries are evaluated."
      />
    );
  }

  return (
    <article className="min-w-0 overflow-hidden rounded-card border border-border/60 bg-background shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-left text-small">
          <caption className="sr-only">Service orchestration performance</caption>
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                Service
              </th>
              <th className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                Evaluated
              </th>
              <th className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                Available
              </th>
              <th className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                Selected
              </th>
              <th className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                Booking success
              </th>
              <th className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                Avg price
              </th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr
                key={service.serviceId}
                className="border-b border-border/60 last:border-b-0"
              >
                <td className="px-4 py-3 font-medium text-foreground md:px-5">
                  {service.serviceName}
                </td>
                <td className="px-4 py-3 tabular-nums md:px-5">
                  {service.timesEvaluated}
                </td>
                <td className="px-4 py-3 tabular-nums md:px-5">
                  {formatPercent(service.availabilityRate)}
                </td>
                <td className="px-4 py-3 tabular-nums md:px-5">
                  {formatPercent(service.selectionRate)}
                </td>
                <td className="px-4 py-3 tabular-nums md:px-5">
                  {formatPercent(service.bookingSuccessRate)}
                </td>
                <td className="px-4 py-3 tabular-nums text-muted-foreground md:px-5">
                  {service.averagePrice != null ? `₹${service.averagePrice}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
