import type { ServicePerformance } from "@/data/orchestrationMetrics";
import { formatPercent } from "@/data/orchestrationMetrics";
import AdminCard from "@/ui/AdminCard";
import AdminSectionHeader from "@/ui/AdminSectionHeader";

type ServiceSelectionProps = {
  services: ServicePerformance[];
};

export default function ServiceSelection({ services }: ServiceSelectionProps) {
  const totalSelections = services.reduce(
    (sum, service) => sum + service.timesSelected,
    0,
  );

  const items = services
    .filter((service) => service.timesSelected > 0)
    .map((service) => ({
      ...service,
      share:
        totalSelections === 0
          ? 0
          : (service.timesSelected / totalSelections) * 100,
    }))
    .sort((a, b) => b.timesSelected - a.timesSelected);

  const maxShare = Math.max(...items.map((item) => item.share), 1);

  return (
    <section aria-labelledby="service-selection-heading">
      <AdminSectionHeader
        title="Selected services"
        description="How often each delivery service was chosen by the orchestration engine."
      />

      <AdminCard className="mt-4 space-y-4 p-5 md:p-6">
        {items.length === 0 ? (
          <p className="text-small text-muted-foreground">
            No service selections in the selected period.
          </p>
        ) : (
          items.map((item) => (
            <div key={item.serviceId}>
              <div className="mb-2 flex items-center justify-between gap-3 text-small">
                <span className="font-medium text-foreground">
                  {item.serviceName}
                </span>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {item.timesSelected} · {formatPercent(item.share)}
                </span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-pill bg-surface"
                role="progressbar"
                aria-valuenow={Math.round(item.share)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${item.serviceName} selected ${formatPercent(item.share)} of the time`}
              >
                <div
                  className="h-full rounded-pill bg-accent/80"
                  style={{ width: `${(item.share / maxShare) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </AdminCard>
    </section>
  );
}
