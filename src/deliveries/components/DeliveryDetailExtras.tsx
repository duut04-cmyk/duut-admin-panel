import type { DeliveryHistoryDetail } from "@/data/deliveryApiTypes";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import DeliveryDetailCard from "./DeliveryDetailCard";
import { formatTimestamp } from "./utils";

type DeliveryDetailExtrasProps = {
  history: DeliveryHistoryDetail;
};

export default function DeliveryDetailExtras({ history }: DeliveryDetailExtrasProps) {
  const { cancellation, tracking, rating, feedback } = history;
  const hasContent = cancellation || tracking.latest || rating || feedback?.comment;

  if (!hasContent) {
    return null;
  }

  return (
    <section aria-labelledby="delivery-extras-heading">
      <AdminSectionHeader
        title="Additional records"
        description="Cancellation, tracking, and customer feedback when persisted."
      />

      <DeliveryDetailCard className="mt-4 space-y-4 p-4 md:p-5 text-small">
        {cancellation ? (
          <div>
            <h3 className="text-caption font-semibold text-muted-foreground">
              Cancellation
            </h3>
            <p className="mt-1 font-medium">{cancellation.status}</p>
            <p className="text-muted-foreground">
              {cancellation.reasonCode}
              {cancellation.reasonMessage ? ` — ${cancellation.reasonMessage}` : ""}
            </p>
            <p className="mt-1 text-caption text-muted-foreground">
              Requested {formatTimestamp(cancellation.requestedAt)}
              {cancellation.cancelledAt
                ? ` · Cancelled ${formatTimestamp(cancellation.cancelledAt)}`
                : ""}
            </p>
            {cancellation.refund ? (
              <div className="mt-3 rounded-md border border-border/60 bg-surface/30 px-3 py-2.5">
                <p className="text-caption font-semibold text-muted-foreground">
                  Refund (prepaid cancellation)
                </p>
                <p className="mt-1 tabular-nums font-medium">
                  {cancellation.refund.currency} {cancellation.refund.amount.toFixed(2)}{" "}
                  · {cancellation.refund.status}
                </p>
                <p className="mt-1 text-caption text-muted-foreground">
                  Policy: full remaining prepaid balance (no platform retention fee).
                </p>
                {cancellation.refund.gatewayRefundId ? (
                  <p className="mt-1 break-all font-mono text-caption text-muted-foreground">
                    Gateway refund: {cancellation.refund.gatewayRefundId}
                  </p>
                ) : null}
                <p className="mt-1 text-caption text-muted-foreground">
                  Requested {formatTimestamp(cancellation.refund.requestedAt)}
                  {cancellation.refund.processedAt
                    ? ` · Processed ${formatTimestamp(cancellation.refund.processedAt)}`
                    : ""}
                </p>
              </div>
            ) : cancellation.status === "CANCELLED" ? (
              <p className="mt-2 text-caption text-muted-foreground">
                No prepaid refund record (payment may be unpaid or already fully
                refunded).
              </p>
            ) : null}
          </div>
        ) : null}

        {tracking.latest ? (
          <div>
            <h3 className="text-caption font-semibold text-muted-foreground">
              Latest tracking
            </h3>
            <p className="mt-1 font-medium">
              {tracking.latest.normalizedStatus ??
                tracking.latest.providerStatus ??
                "Unknown"}
            </p>
            <p className="text-caption text-muted-foreground">
              Updated {formatTimestamp(tracking.latest.lastUpdatedAt)}
            </p>
            {tracking.latest.trackingUrl ? (
              <p className="mt-1 truncate font-mono text-caption">
                {tracking.latest.trackingUrl}
              </p>
            ) : null}
          </div>
        ) : null}

        {rating ? (
          <div>
            <h3 className="text-caption font-semibold text-muted-foreground">Rating</h3>
            <p className="mt-1">
              Driver {rating.driverRating}/5
              {rating.platformRating !== null
                ? ` · Platform ${rating.platformRating}/5`
                : ""}
            </p>
            <p className="text-caption text-muted-foreground">
              Submitted {formatTimestamp(rating.submittedAt)}
            </p>
          </div>
        ) : null}

        {feedback?.comment ? (
          <div>
            <h3 className="text-caption font-semibold text-muted-foreground">
              Feedback
            </h3>
            <p className="mt-1 text-muted-foreground">{feedback.comment}</p>
          </div>
        ) : null}
      </DeliveryDetailCard>
    </section>
  );
}
