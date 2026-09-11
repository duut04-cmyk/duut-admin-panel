import Link from "next/link";
import {
  formatRelativeTime,
  mockLiveActivity,
  type LiveActivityType,
} from "@/data/mockLiveActivity";

const iconStyles: Record<
  LiveActivityType,
  { bg: string; text: string }
> = {
  completed: { bg: "bg-emerald-100", text: "text-emerald-600" },
  created: { bg: "bg-blue-100", text: "text-blue-600" },
  assigned: { bg: "bg-orange-100", text: "text-orange-600" },
  in_progress: { bg: "bg-violet-100", text: "text-violet-600" },
  request_received: { bg: "bg-slate-100", text: "text-slate-600" },
};

function ActivityIcon({ type }: { type: LiveActivityType }) {
  const styles = iconStyles[type];
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${styles.bg} ${styles.text}`}
      aria-hidden="true"
    >
      <svg
        className="h-4 w-4"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        {type === "completed" && (
          <path d="M4 8l2.5 2.5L12 5" strokeLinecap="round" strokeLinejoin="round" />
        )}
        {type === "created" && (
          <>
            <path d="M3 5h8l1.5 3v4H4.5L3 9V5z" strokeLinejoin="round" />
            <path d="M3 5l1-2h5l1 2" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
        {type === "assigned" && (
          <>
            <circle cx="5" cy="11" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="11" cy="11" r="1.5" fill="currentColor" stroke="none" />
            <path
              d="M4 9l2-4h4l2 4M6 9h4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}
        {type === "in_progress" && (
          <path
            d="M3 6h8v7H3zM5 6V4h6v2M8 10v2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {type === "request_received" && (
          <>
            <path d="M4 2h5l3 3v9H4z" strokeLinejoin="round" />
            <path d="M9 2v3h3M6 8h4M6 10.5h3" strokeLinecap="round" />
          </>
        )}
      </svg>
    </span>
  );
}

export default function LiveActivityFeed() {
  return (
    <article
      className="flex flex-col rounded-card border border-border/60 bg-background shadow-sm"
      aria-labelledby="live-activity-heading"
    >
      <div className="flex items-center justify-between px-5 pb-2 pt-4">
        <h2
          id="live-activity-heading"
          className="text-body font-semibold text-foreground"
        >
          Live Activity
        </h2>
        <span className="inline-flex items-center gap-1.5 rounded-pill bg-emerald-50 px-2.5 py-0.5 text-caption font-medium text-admin-success">
          <span className="h-1.5 w-1.5 rounded-full bg-admin-success" aria-hidden="true" />
          Live
        </span>
      </div>

      <ul className="space-y-1 px-5 pb-2 pt-1">
        {mockLiveActivity.map((event) => (
          <li
            key={event.id}
            className="flex items-start gap-3 py-3"
          >
            <ActivityIcon type={event.type} />
            <div className="min-w-0 flex-1">
              <p className="text-small font-medium text-foreground">
                {event.message}
              </p>
              <p className="mt-0.5 text-caption text-muted-foreground">
                {event.deliveryId} • {event.category}
              </p>
            </div>
            <span className="shrink-0 pt-0.5 text-caption text-muted-foreground">
              {formatRelativeTime(event.timestamp)}
            </span>
          </li>
        ))}
      </ul>

      <div className="border-t border-border/25 px-5 py-3.5">
        <Link
          href="/deliveries"
          className="text-small font-medium text-link hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
        >
          View all activity →
        </Link>
      </div>
    </article>
  );
}
