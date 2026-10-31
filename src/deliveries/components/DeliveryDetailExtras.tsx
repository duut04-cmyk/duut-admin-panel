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
      <AdminSectionHeader title="Ops" />

      <DeliveryDetailCard className="mt-3 space-y-3 p-4 text-small">
        {cancellation ? (
          <div>
            <p className="text-caption font-medium text-muted-foreground">
              Cancellation
            </p>
            <p className="mt-1 font-medium text-foreground">
              {cancellation.reasonCode}
              {cancellation.reasonMessage ? ` — ${cancellation.reasonMessage}` : ""}
            </p>
            <p className="mt-0.5 text-caption text-muted-foreground">
              {cancellation.status}
              {" · "}
              Requested {formatTimestamp(cancellation.requestedAt)}
              {cancellation.cancelledAt
                ? ` · Done ${formatTimestamp(cancellation.cancelledAt)}`
                : ""}
            </p>
            {cancellation.refund ? (
              <p className="mt-1.5 tabular-nums text-caption text-muted-foreground">
                Refund {cancellation.refund.currency}{" "}
                {cancellation.refund.amount.toFixed(2)} · {cancellation.refund.status}
              </p>
            ) : null}
          </div>
        ) : null}

        {tracking.latest ? (
          <div className={cancellation ? "border-t border-border/60 pt-3" : undefined}>
            <p className="text-caption font-medium text-muted-foreground">Tracking</p>
            <p className="mt-1 font-medium text-foreground">
              {tracking.latest.normalizedStatus ??
                tracking.latest.providerStatus ??
                "Unknown"}
            </p>
            <p className="mt-0.5 text-caption text-muted-foreground">
              Updated {formatTimestamp(tracking.latest.lastUpdatedAt)}
            </p>
          </div>
        ) : null}

        {rating ? (
          <div
            className={
              cancellation || tracking.latest
                ? "border-t border-border/60 pt-3"
                : undefined
            }
          >
            <p className="text-caption font-medium text-muted-foreground">Rating</p>
            <p className="mt-1 font-medium text-foreground">
              Driver {rating.driverRating}/5
              {rating.platformRating !== null
                ? ` · Platform ${rating.platformRating}/5`
                : ""}
            </p>
          </div>
        ) : null}

        {feedback?.comment ? (
          <div
            className={
              cancellation || tracking.latest || rating
                ? "border-t border-border/60 pt-3"
                : undefined
            }
          >
            <p className="text-caption font-medium text-muted-foreground">Feedback</p>
            <p className="mt-1 text-foreground">{feedback.comment}</p>
          </div>
        ) : null}
      </DeliveryDetailCard>
    </section>
  );
}
