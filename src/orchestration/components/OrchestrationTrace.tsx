import type { DeliveryEvent } from "@/data/orchestrationTypes";
import AdminCard from "@/ui/AdminCard";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import { EVENT_LABELS, formatTraceTimestamp } from "./utils";

type OrchestrationTraceProps = {
  events: DeliveryEvent[];
};

const TRACE_LABEL_OVERRIDES: Partial<Record<DeliveryEvent["type"], string>> = {
  created: "REQUEST RECEIVED",
  orchestration_started: "SERVICES EVALUATED",
  orchestration_completed: "DECISION",
  booking_requested: "BOOKING REQUEST",
  booking_confirmed: "BOOKING CONFIRMED",
  failed: "BOOKING FAILED",
};

export default function OrchestrationTrace({ events }: OrchestrationTraceProps) {
  const sorted = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  return (
    <section aria-labelledby="orchestration-trace-heading">
      <AdminSectionHeader
        title="Operational trace"
        description="Compact trace of orchestration steps and timestamps."
      />

      <AdminCard className="mt-4 overflow-x-auto p-4 md:p-5">
        <pre
          className="font-mono text-caption leading-relaxed text-foreground"
          aria-label="Orchestration operational trace"
        >
          {sorted.map((event, index) => {
            const label =
              TRACE_LABEL_OVERRIDES[event.type] ??
              EVENT_LABELS[event.type].toUpperCase();
            return (
              <div key={event.id} className={index > 0 ? "mt-3" : ""}>
                <span className="font-semibold">{label}</span>
                {"\n"}
                <span className="text-muted-foreground">
                  {formatTraceTimestamp(event.timestamp)}
                </span>
              </div>
            );
          })}
        </pre>
      </AdminCard>
    </section>
  );
}
