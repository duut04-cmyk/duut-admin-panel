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
            </p>
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
