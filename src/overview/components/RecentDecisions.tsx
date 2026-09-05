import Link from "next/link";
import type { BookingStatus } from "@/data/orchestrationTypes";
import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import { formatDecisionTime } from "@/data/orchestrationMetrics";
import {
  bookingStatusLabel,
  formatRoute,
} from "@/orchestration/components/utils";

type RecentDecisionsProps = {
  records: OrchestrationRecord[];
};

function BookingBadge({ status }: { status: BookingStatus }) {
  if (status === "confirmed") {
    return (
      <span className="inline-flex rounded-pill bg-[#dcfce7] px-2.5 py-0.5 text-caption font-medium text-[#15803d]">
        Confirmed
      </span>
    );
  }

  if (status === "failed") {
    return (
      <span className="inline-flex rounded-pill bg-red-50 px-2.5 py-0.5 text-caption font-medium text-admin-danger">
        Failed
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-pill bg-surface px-2.5 py-0.5 text-caption font-medium text-muted-foreground">
      {bookingStatusLabel(status)}
    </span>
  );
}

export default function RecentDecisions({ records }: RecentDecisionsProps) {
  return (
    <article
      className="flex h-full flex-col rounded-xl border border-border/80 bg-background p-6 font-sans antialiased"
      aria-labelledby="recent-decisions-heading"
    >
      <h2
        id="recent-decisions-heading"
        className="text-body font-semibold tracking-tight text-foreground md:text-subheading"
      >
        Recent Orchestration Decisions
      </h2>
      <p className="mt-1 text-small leading-relaxed text-muted-foreground">
        Latest delivery decisions
      </p>

      <div className="mt-4 flex flex-1 flex-col">
        {records.length === 0 ? (
          <p className="text-small leading-relaxed text-muted-foreground">
            No orchestration decisions in the selected period.
          </p>
        ) : (
          <>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-small">
                <caption className="sr-only">
                  Recent orchestration decisions
                </caption>
                <thead>
                  <tr className="border-b border-border/60 text-caption font-semibold text-muted-foreground">
                    <th scope="col" className="pb-3 pr-4 font-semibold">
                      Delivery ID
                    </th>
                    <th scope="col" className="pb-3 pr-4 font-semibold">
                      Route
                    </th>
                    <th scope="col" className="pb-3 pr-4 text-right font-semibold">
                      Services Eval.
                    </th>
                    <th scope="col" className="pb-3 pr-4 font-semibold">
                      Selected Service
                    </th>
                    <th scope="col" className="pb-3 pr-4 text-right font-semibold">
                      Score
                    </th>
                    <th scope="col" className="pb-3 pr-4 text-right font-semibold">
                      Decision Time
                    </th>
                    <th scope="col" className="pb-3 font-semibold">
                      Booking
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => {
                    const { deliveryRequest, decision, booking } = record;

                    return (
                      <tr
                        key={deliveryRequest.deliveryId}
                        className="border-b border-border/60 transition-colors last:border-border hover:bg-surface/50"
                      >
                        <td className="py-3 pr-4">
                          <Link
                            href={`/orchestration/${deliveryRequest.deliveryId}`}
                            className="font-semibold text-foreground hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                          >
                            {deliveryRequest.deliveryId}
                          </Link>
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">
                          {formatRoute(record)}
                        </td>
                        <td className="py-3 pr-4 text-right tabular-nums text-foreground">
                          {decision.servicesEvaluated}
                        </td>
                        <td className="py-3 pr-4 font-semibold text-foreground">
                          {decision.selectedServiceName}
                        </td>
                        <td className="py-3 pr-4 text-right tabular-nums text-foreground">
                          {decision.decisionScore.totalScore.toFixed(1)}
                        </td>
                        <td className="py-3 pr-4 text-right tabular-nums text-muted-foreground">
                          {formatDecisionTime(decision.durationMs)}
                        </td>
                        <td className="py-3">
                          <BookingBadge status={booking.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-auto w-full pt-3 text-center">
              <Link
                href="/orchestration"
                className="text-small font-medium text-accent transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                View all decisions →
              </Link>
            </div>
          </>
        )}
      </div>
    </article>
  );
}
