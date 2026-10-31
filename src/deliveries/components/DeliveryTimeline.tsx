import type { DeliveryTimelineEntry } from "@/data/deliveryApiTypes";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import { formatTimestamp } from "./utils";
import DeliveryDetailCard from "./DeliveryDetailCard";

type DeliveryTimelineProps = {
  events: DeliveryTimelineEntry[];
};

export default function DeliveryTimeline({ events }: DeliveryTimelineProps) {
  const sorted = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  return (
    <section aria-labelledby="delivery-timeline-heading">
      <AdminSectionHeader title="Timeline" />

      <DeliveryDetailCard className="mt-3 p-4">
        {sorted.length === 0 ? (
          <p className="text-small text-muted-foreground">
            No status events recorded yet.
          </p>
        ) : (
          <ol className="relative space-y-0">
            {sorted.map((event, index) => {
              const isLast = index === sorted.length - 1;
              return (
                <li key={event.id} className="relative flex gap-3 pb-4 last:pb-0">
                  {!isLast && (
                    <span
                      className="absolute left-[5px] top-3.5 h-full w-px bg-border/60"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className="relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-orange-500"
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                      <p className="text-small font-medium text-foreground">
                        {event.title}
                      </p>
                      <time
                        dateTime={event.timestamp}
                        className="text-caption tabular-nums text-muted-foreground"
                      >
                        {formatTimestamp(event.timestamp)}
                      </time>
                    </div>
                    {event.description ? (
                      <p className="mt-0.5 text-caption text-muted-foreground">
                        {event.description}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </DeliveryDetailCard>
    </section>
  );
}
