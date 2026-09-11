import type { ServicePerformance } from "@/data/orchestrationMetrics";
import { formatPercent } from "@/data/orchestrationMetrics";
import AdminCard from "@/ui/AdminCard";
import AdminDataRow from "@/ui/AdminDataRow";
import AdminSectionHeader from "@/ui/AdminSectionHeader";

type ServiceAvailabilityProps = {
  services: ServicePerformance[];
};

export default function ServiceAvailability({
  services,
}: ServiceAvailabilityProps) {
  return (
    <section aria-labelledby="service-availability-heading">
      <AdminSectionHeader
        title="Service availability"
        description="Fictional delivery services evaluated by Doot orchestration."
      />

      <AdminCard className="mt-4 px-4 md:px-5">
        {services.length === 0 ? (
          <p className="py-4 text-small text-muted-foreground">
            No service evaluations in the selected period.
          </p>
        ) : (
          services.map((service) => (
            <AdminDataRow
              key={service.serviceId}
              primary={service.serviceName}
              secondary={`${service.timesEvaluated} evaluated · ${service.timesSelected} selected`}
              metadata={
                <span className="block sm:text-right">
                  {formatPercent(service.availabilityRate)} available
                  <span className="hidden sm:inline"> · </span>
                  <span className="block sm:inline">
                    {formatPercent(service.selectionRate)} selection rate
                  </span>
                </span>
              }
            />
          ))
        )}
      </AdminCard>
    </section>
  );
}
