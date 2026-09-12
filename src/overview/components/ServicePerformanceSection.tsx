"use client";

import { useMemo } from "react";
import type { ServicePerformance } from "@/data/orchestrationMetrics";
import { formatPercent } from "@/data/orchestrationMetrics";

type ServicePerformanceSectionProps = {
  services: ServicePerformance[];
};

const SERVICE_ORDER = ["flashdrop", "cityfleet", "movex", "swiftgo", "quickroute"];

const SERVICE_COLORS: Record<string, string> = {
  flashdrop: "#f97316",
  cityfleet: "#15803d",
  movex: "#eab308",
  swiftgo: "#3b82f6",
  quickroute: "#475569",
};

const BOOKING_SUCCESS_THRESHOLD = 75;

function sortServices(services: ServicePerformance[]): ServicePerformance[] {
  return [...services].sort((a, b) => {
    const aIndex = SERVICE_ORDER.indexOf(a.serviceId);
    const bIndex = SERVICE_ORDER.indexOf(b.serviceId);
    const aOrder = aIndex === -1 ? SERVICE_ORDER.length : aIndex;
    const bOrder = bIndex === -1 ? SERVICE_ORDER.length : bIndex;
    return aOrder - bOrder;
  });
}

function MetricBar({ value, fillClassName }: { value: number; fillClassName: string }) {
  const clamped = Math.min(Math.max(value, 0), 100);

  return (
    <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-[#f1f5f9]">
      <div
        className={`h-full rounded-full ${fillClassName}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

function ServiceIcon({ serviceId }: { serviceId: string }) {
  const color = SERVICE_COLORS[serviceId] ?? "#94a3b8";

  return (
    <span
      className="inline-block h-3.5 w-3.5 shrink-0 rounded-sm"
      style={{ backgroundColor: color }}
      aria-hidden="true"
    />
  );
}

export default function ServicePerformanceSection({
  services,
}: ServicePerformanceSectionProps) {
  const rows = sortServices(services);

  const maxSelectionRate = useMemo(
    () => Math.max(...rows.map((service) => service.selectionRate), 0),
    [rows],
  );

  return (
    <article
      className="flex h-full flex-col rounded-xl border border-border/80 bg-background p-6 font-sans"
      aria-labelledby="service-performance-heading"
    >
      <h2
        id="service-performance-heading"
        className="text-body font-semibold text-foreground md:text-subheading"
      >
        Service Performance
      </h2>
      <p className="mt-1 text-small text-muted-foreground">
        Availability and booking success by service
      </p>

      <div className="mt-6 flex-1 overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-small">
          <caption className="sr-only">Service performance comparison</caption>
          <thead>
            <tr className="border-b border-border/60 text-caption font-semibold text-muted-foreground">
              <th scope="col" className="pb-3.5 pr-4 font-semibold">
                Service
              </th>
              <th scope="col" className="pb-3.5 pr-4 text-center font-semibold">
                Evaluated
              </th>
              <th scope="col" className="pb-3.5 pr-4 font-semibold">
                Availability
              </th>
              <th scope="col" className="pb-3.5 pr-4 font-semibold">
                Selection Rate
              </th>
              <th scope="col" className="pb-3.5 font-semibold">
                Booking Success
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((service) => {
              const isTopSelectionRate =
                service.selectionRate > 0 && service.selectionRate === maxSelectionRate;
              const bookingSuccessFill =
                service.bookingSuccessRate >= BOOKING_SUCCESS_THRESHOLD
                  ? "bg-[#15803d]"
                  : "bg-muted-foreground/30";

              return (
                <tr
                  key={service.serviceId}
                  className="border-b border-border/60 last:border-b-0"
                >
                  <td className="py-4 pr-4">
                    <span className="flex items-center gap-2.5 font-semibold text-foreground">
                      <ServiceIcon serviceId={service.serviceId} />
                      {service.serviceName}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-center tabular-nums font-semibold text-foreground">
                    {service.timesEvaluated}
                  </td>
                  <td className="py-4 pr-4">
                    <div className="font-semibold tabular-nums text-foreground">
                      {formatPercent(service.availabilityRate)}
                    </div>
                    <MetricBar
                      value={service.availabilityRate}
                      fillClassName="bg-[#f97316]"
                    />
                  </td>
                  <td className="py-4 pr-4">
                    <div className="font-semibold tabular-nums text-foreground">
                      {formatPercent(service.selectionRate)}
                    </div>
                    <MetricBar
                      value={service.selectionRate}
                      fillClassName={
                        isTopSelectionRate ? "bg-[#f97316]" : "bg-muted-foreground/30"
                      }
                    />
                  </td>
                  <td className="py-4">
                    <div className="font-semibold tabular-nums text-foreground">
                      {formatPercent(service.bookingSuccessRate)}
                    </div>
                    <MetricBar
                      value={service.bookingSuccessRate}
                      fillClassName={bookingSuccessFill}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </article>
  );
}
