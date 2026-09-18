import Link from "next/link";
import type { FeedbackQualityMetrics } from "@/reports/accountability";
import AdminEmptyState from "@/ui/AdminEmptyState";

type FeedbackQualitySectionProps = {
  metrics: FeedbackQualityMetrics;
};

function TagPill({ label, count }: { label: string; count: number }) {
  return (
    <span className="inline-flex items-center gap-2 rounded px-2.5 py-1 text-caption font-semibold bg-surface-accent text-accent">
      {label}
      <span className="tabular-nums text-muted-foreground">{count}</span>
    </span>
  );
}

function IssuePill({ label, count }: { label: string; count: number }) {
  return (
    <span className="inline-flex items-center gap-2 rounded px-2.5 py-1 text-caption font-semibold bg-red-50 text-red-700">
      {label}
      <span className="tabular-nums">{count}</span>
    </span>
  );
}

export default function FeedbackQualitySection({
  metrics,
}: FeedbackQualitySectionProps) {
  if (metrics.feedbackCount === 0) {
    return (
      <AdminEmptyState
        title="No feedback in period"
        description="Customer ratings and feedback will appear here for deliveries in the selected range."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-card border border-border/60 bg-background p-4">
          <p className="text-caption text-muted-foreground">Feedback received</p>
          <p className="mt-1 text-body font-semibold tabular-nums">
            {metrics.feedbackCount}
          </p>
        </div>
        <div className="rounded-card border border-border/60 bg-background p-4">
          <p className="text-caption text-muted-foreground">Avg driver rating</p>
          <p className="mt-1 text-body font-semibold tabular-nums">
            {metrics.avgDriverRating ?? "—"} / 5
          </p>
        </div>
        <div className="rounded-card border border-border/60 bg-background p-4">
          <p className="text-caption text-muted-foreground">Avg delivery rating</p>
          <p className="mt-1 text-body font-semibold tabular-nums">
            {metrics.avgDeliveryRating ?? "—"} / 5
          </p>
        </div>
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <div className="rounded-card border border-border/60 bg-background p-4 sm:p-5">
          <h3 className="text-small font-semibold text-foreground">Positive themes</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {metrics.topPositiveTags.length === 0 ? (
              <p className="text-small text-muted-foreground">No positive tags yet.</p>
            ) : (
              metrics.topPositiveTags.map((tag) => (
                <TagPill key={tag.tag} label={tag.label} count={tag.count} />
              ))
            )}
          </div>
        </div>

        <div className="rounded-card border border-border/60 bg-background p-4 sm:p-5">
          <h3 className="text-small font-semibold text-foreground">Issue themes</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {metrics.topIssueTags.length === 0 ? (
              <p className="text-small text-muted-foreground">
                No issue tags reported.
              </p>
            ) : (
              metrics.topIssueTags.map((tag) => (
                <IssuePill key={tag.tag} label={tag.label} count={tag.count} />
              ))
            )}
          </div>
        </div>
      </div>

      <article className="min-w-0 overflow-hidden rounded-card border border-border/60 bg-background shadow-sm">
        <div className="border-b border-border px-4 py-4 sm:px-5">
          <h3 className="text-small font-semibold text-foreground">Recent feedback</h3>
        </div>
        <ul className="divide-y divide-border/60">
          {metrics.recentFeedback.map((item) => (
            <li key={item.deliveryId} className="px-4 py-4 sm:px-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/deliveries/${item.deliveryId}`}
                    className="font-medium text-accent hover:underline"
                  >
                    {item.deliveryId}
                  </Link>
                  <p className="mt-0.5 text-caption text-muted-foreground">
                    {item.customerName}
                  </p>
                </div>
                <p className="text-small tabular-nums text-muted-foreground">
                  Driver {item.driverRating}/5 · Delivery {item.deliveryRating}/5
                </p>
              </div>
              {item.comment ? (
                <p className="mt-2 text-small text-muted-foreground">{item.comment}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
