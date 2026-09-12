import type { DeliveryEvent } from "@/data/orchestrationTypes";
import AdminCard from "@/ui/AdminCard";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import AdminStatus from "@/ui/AdminStatus";
import { EVENT_LABELS, formatTimestamp } from "./utils";

type OrchestrationTimelineProps = {
  events: DeliveryEvent[];
};

function eventVariant(
  type: DeliveryEvent["type"],
): "success" | "failed" | "active" | "pending" | "cancelled" {
  switch (type) {
    case "delivered":
    case "booking_confirmed":
      return "success";
    case "failed":
      return "failed";
    case "cancelled":
      return "cancelled";
    case "in_transit":
    case "picked_up":
    case "driver_assigned":
      return "active";
    default:
      return "pending";
  }
}

export default function OrchestrationTimeline({ events }: OrchestrationTimelineProps) {
  const sorted = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  return (
    <section aria-labelledby="orchestration-timeline-heading">
      <AdminSectionHeader
        title="Orchestration timeline"
        description="Full lifecycle from request to outcome."
      />

      <AdminCard className="mt-4 p-5 md:p-6">
        <ol className="relative space-y-0">
          {sorted.map((event, index) => {
            const isLast = index === sorted.length - 1;
            return (
              <li key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
                {!isLast && (
                  <span
                    className="absolute left-[7px] top-4 h-full w-px bg-border"
                    aria-hidden="true"
                  />
                )}
                <span
                  className="relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-background bg-accent ring-2 ring-accent/20"
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-medium text-foreground">
                      {EVENT_LABELS[event.type]}
                    </p>
                    <time
                      dateTime={event.timestamp}
                      className="text-caption tabular-nums text-muted-foreground"
                    >
                      {formatTimestamp(event.timestamp)}
                    </time>
                  </div>
                  <AdminStatus
                    variant={eventVariant(event.type)}
                    label={event.type.replace(/_/g, " ")}
                    className="mt-1.5"
                  />
                  {event.description && (
                    <p className="mt-2 text-small text-muted-foreground">
                      {event.description}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </AdminCard>
    </section>
  );
}
