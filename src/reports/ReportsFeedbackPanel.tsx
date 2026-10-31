import Link from "next/link";
import type { FeedbackReporting } from "@/data/reportingTypes";

type ReportsFeedbackPanelProps = {
  feedback: FeedbackReporting | null;
};

function stars(rating: number): string {
  const clamped = Math.max(0, Math.min(5, Math.round(rating)));
  return "★".repeat(clamped) + "☆".repeat(5 - clamped);
}

function formatTag(tag: string): string {
  return tag.replaceAll("_", " ");
}

export function ReportsFeedbackPanel({ feedback }: ReportsFeedbackPanelProps) {
  const recent = feedback?.recentSnippets?.slice(0, 4) ?? [];
  const issueTags = feedback?.topIssueTags?.slice(0, 5) ?? [];
  const avgDelivery = feedback?.averageDeliveryRating ?? null;
  const avgDriver = feedback?.averageDriverRating ?? null;
  const total = feedback?.feedbackCount ?? 0;

  const avgLabel =
    avgDelivery != null && avgDriver != null
      ? `Delivery ${avgDelivery.toFixed(1)} · Driver ${avgDriver.toFixed(1)}`
      : avgDelivery != null
        ? `Avg delivery ${avgDelivery.toFixed(1)}`
        : avgDriver != null
          ? `Avg driver ${avgDriver.toFixed(1)}`
          : null;

  return (
    <section
      id="reports-feedback"
      aria-labelledby="reports-feedback-heading"
      className="scroll-mt-24 rounded-card border border-border/60 bg-background p-4 shadow-sm"
    >
      <div>
        <h2
          id="reports-feedback-heading"
          className="text-base font-semibold text-foreground"
        >
          Feedback quality
        </h2>
        <p className="mt-1 text-small text-muted-foreground">
          {avgLabel
            ? `${avgLabel} · ${total} reviews`
            : total > 0
              ? `${total} reviews in period`
              : "Customer ratings from this period"}
        </p>
      </div>

      {issueTags.length > 0 ? (
        <div className="mt-4">
          <p className="text-caption font-medium uppercase tracking-wide text-muted-foreground">
            Top issue tags
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {issueTags.map((tag) => (
              <li
                key={tag.tag}
                className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-caption font-medium text-red-800"
              >
                {formatTag(tag.tag)}
                <span className="tabular-nums text-red-600">{tag.count}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {recent.length === 0 ? (
        <p className="mt-4 text-small text-muted-foreground">
          No feedback in this period yet.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border border-t border-border pt-1">
          {recent.map((item) => (
            <li
              key={`${item.deliveryId}-${item.submittedAt}`}
              className="py-3 first:pt-3 last:pb-0"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-small font-medium text-foreground">
                    {item.deliveryReference || "Delivery"}
                  </p>
                  <p className="mt-0.5 text-caption text-muted-foreground">
                    {item.issueTagCount > 0
                      ? `${item.issueTagCount} issue tag${item.issueTagCount === 1 ? "" : "s"}`
                      : item.positiveTagCount > 0
                        ? `${item.positiveTagCount} positive tag${item.positiveTagCount === 1 ? "" : "s"}`
                        : "No tags"}
                  </p>
                </div>
                <span
                  className="shrink-0 text-caption tracking-tight text-amber-500"
                  aria-label={`Delivery ${item.deliveryRating} of 5, driver ${item.driverRating} of 5`}
                >
                  {stars(item.deliveryRating)}
                </span>
              </div>
              <Link
                href={`/deliveries/${item.deliveryId}`}
                className="mt-1 inline-block text-caption font-medium text-link hover:underline"
              >
                View delivery
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
