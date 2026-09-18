import type { DeliveryEvent } from "@/data/orchestrationTypes";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import TimelineEventPill from "@/orchestration/components/TimelineEventPill";
import { EVENT_LABELS, formatTimestamp } from "@/orchestration/components/utils";
import DeliveryDetailCard from "./DeliveryDetailCard";

type DeliveryTimelineProps = {
  events: DeliveryEvent[];
};

export default function DeliveryTimeline({ events }: DeliveryTimelineProps) {
  const sorted = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  return (
    <section aria-labelledby="delivery-timeline-heading">
      <AdminSectionHeader
        title="Delivery timeline"
        description="Lifecycle events for this delivery."
      />

      <DeliveryDetailCard className="mt-4 p-5 md:p-6">
        <div className="max-w-3xl">
          <ol className="relative space-y-0">
            {sorted.map((event, index) => {
              const isLast = index === sorted.length - 1;
              return (
                <li key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
                  {!isLast && (
                    <span
                      className="absolute left-[7px] top-4 h-full w-px bg-border/60"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className="relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-background bg-orange-500 ring-2 ring-orange-500/20"
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1">
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
                    <TimelineEventPill eventType={event.type} className="mt-1.5" />
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
        </div>
      </DeliveryDetailCard>
    </section>
  );
}
