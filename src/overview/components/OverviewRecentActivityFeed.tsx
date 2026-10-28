"use client";

import Link from "next/link";
import type { RecentActivityItem } from "@/data/reportingTypes";

type OverviewRecentActivityFeedProps = {
  items: RecentActivityItem[];
  hours: number;
};

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.max(1, Math.round(diffMs / 60_000));
  if (minutes < 60) return `${minutes}m ago`;
  const hourCount = Math.round(minutes / 60);
  if (hourCount < 48) return `${hourCount}h ago`;
  return new Date(iso).toLocaleString();
}

export default function OverviewRecentActivityFeed({
  items,
  hours,
}: OverviewRecentActivityFeedProps) {
  return (
    <article className="flex h-full min-w-0 flex-col rounded-card border border-border/60 bg-background p-3 shadow-sm sm:p-4">
      <h2 className="text-subheading font-semibold leading-snug text-foreground">
        Live Activity
      </h2>
      <p className="mt-1 text-small text-muted-foreground">
        Status events from the last {hours} hours.
      </p>

      <div className="mt-4 min-h-0 flex-1 space-y-3">
        {items.length === 0 ? (
          <p className="text-small text-muted-foreground">No recent status events.</p>
        ) : (
          items.map((event) => (
            <div
              key={event.eventId}
              className="flex gap-3 rounded-lg border border-border/60 px-3 py-2.5"
            >
              <span
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600"
                aria-hidden="true"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M4 2h5l3 3v9H4z" strokeLinejoin="round" />
                  <path d="M9 2v3h3" strokeLinecap="round" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-small font-medium text-foreground">
                  {event.summary}
                </p>
                <p className="mt-0.5 text-caption text-muted-foreground">
                  {formatRelativeTime(event.occurredAt)} ·{" "}
                  <Link
                    href={`/deliveries/${event.deliveryId}`}
                    className="font-medium text-link hover:underline"
                  >
                    {event.deliveryReference}
                  </Link>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </article>
  );
}
