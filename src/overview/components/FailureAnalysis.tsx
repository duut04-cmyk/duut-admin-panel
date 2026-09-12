import type { FailureAnalysisItem } from "@/data/orchestrationMetrics";
import { formatPercent } from "@/data/orchestrationMetrics";

type FailureAnalysisProps = {
  items: FailureAnalysisItem[];
  totalFailures: number;
};

export default function FailureAnalysis({
  items,
  totalFailures,
}: FailureAnalysisProps) {
  const maxCount = Math.max(...items.map((item) => item.count), 1);

  return (
    <article
      className="flex h-full flex-col rounded-xl border border-border/80 bg-background p-6 font-sans antialiased"
      aria-labelledby="top-failure-reasons-heading"
    >
      <h2
        id="top-failure-reasons-heading"
        className="text-body font-semibold tracking-tight text-foreground md:text-subheading"
      >
        Top Failure Reasons
      </h2>
      <p className="mt-1 text-small leading-relaxed text-muted-foreground">
        Why services were unavailable or bookings failed
      </p>

      <div className="mt-4 flex flex-1 flex-col">
        {totalFailures === 0 ? (
          <p className="text-small leading-relaxed text-muted-foreground">
            No failures recorded in the selected period.
          </p>
        ) : (
          <>
            <ul className="space-y-3.5">
              {items.map((item) => (
                <li key={item.key}>
                  <div className="flex items-start justify-between gap-2 text-small leading-snug">
                    <span className="min-w-0 font-medium text-foreground">
                      {item.label}
                    </span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">
                      {item.count} ({formatPercent(item.percent)})
                    </span>
                  </div>
                  <div
                    className="mt-2 h-2 overflow-hidden rounded-full bg-[#f8fafc]"
                    role="progressbar"
                    aria-valuenow={item.count}
                    aria-valuemin={0}
                    aria-valuemax={maxCount}
                    aria-label={`${item.label}: ${item.count} occurrences`}
                  >
                    <div
                      className="h-full rounded-full bg-admin-danger/85 transition-[width] duration-300 ease-out"
                      style={{
                        width: `${(item.count / maxCount) * 100}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-auto pt-4 text-right text-small text-muted-foreground">
              Total failures:{" "}
              <span className="font-semibold text-foreground">{totalFailures}</span>
            </p>
          </>
        )}
      </div>
    </article>
  );
}
