import Link from "next/link";
import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import { formatDecisionTime } from "@/data/orchestrationMetrics";
import AdminBadge from "@/ui/AdminBadge";
import AdminStatus from "@/ui/AdminStatus";
import {
  bookingStatusLabel,
  bookingStatusVariant,
  deliveryStatusLabel,
  deliveryStatusVariant,
  formatRoute,
} from "./utils";

type OrchestrationRowProps = {
  record: OrchestrationRecord;
  variant?: "table" | "card";
};

export default function OrchestrationRow({
  record,
  variant = "table",
}: OrchestrationRowProps) {
  const { deliveryRequest, decision, booking } = record;
  const deliveryId = deliveryRequest.deliveryId;
  const href = `/orchestration/${deliveryId}`;
  const score = decision.decisionScore.totalScore;

  if (variant === "card") {
    return (
      <Link
        href={href}
        className="block rounded-lg border border-border bg-background p-4 shadow-sm transition-colors hover:border-foreground/20 hover:bg-surface/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-foreground">{deliveryId}</p>
            <p className="mt-0.5 text-small text-muted-foreground">
              {formatRoute(record)}
            </p>
          </div>
          <AdminStatus
            variant={deliveryStatusVariant(deliveryRequest.status)}
            label={deliveryStatusLabel(deliveryRequest.status)}
          />
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-small">
          <div>
            <dt className="text-caption text-muted-foreground">Evaluated</dt>
            <dd className="mt-0.5 tabular-nums font-medium">
              {decision.servicesEvaluated}
            </dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Available</dt>
            <dd className="mt-0.5 tabular-nums font-medium">
              {decision.availableOptions}
            </dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Selected</dt>
            <dd className="mt-0.5 font-medium">{decision.selectedServiceName}</dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Score</dt>
            <dd className="mt-0.5 tabular-nums font-medium">
              {score.toFixed(1)}
            </dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Decision time</dt>
            <dd className="mt-0.5 tabular-nums">
              {formatDecisionTime(decision.durationMs)}
            </dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Booking</dt>
            <dd className="mt-0.5">
              <AdminBadge
                variant={
                  booking.status === "confirmed"
                    ? "success"
                    : booking.status === "failed"
                      ? "danger"
                      : "neutral"
                }
              >
                {bookingStatusLabel(booking.status)}
              </AdminBadge>
            </dd>
          </div>
        </dl>
      </Link>
    );
  }

  return (
    <tr className="group border-b border-border last:border-b-0">
      <td className="whitespace-nowrap py-3.5 pr-4">
        <Link
          href={href}
          className="font-medium text-foreground underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {deliveryId}
        </Link>
      </td>
      <td className="whitespace-nowrap py-3.5 pr-4 text-small text-muted-foreground">
        {formatRoute(record)}
      </td>
      <td className="py-3.5 pr-4 text-right tabular-nums text-small">
        {decision.servicesEvaluated}
      </td>
      <td className="py-3.5 pr-4 text-right tabular-nums text-small">
        {decision.availableOptions}
      </td>
      <td className="py-3.5 pr-4 text-small">{decision.selectedServiceName}</td>
      <td className="py-3.5 pr-4 text-right tabular-nums text-small font-medium">
        {score.toFixed(1)}
      </td>
      <td className="py-3.5 pr-4 text-right tabular-nums text-small text-muted-foreground">
        {formatDecisionTime(decision.durationMs)}
      </td>
      <td className="py-3.5 pr-4">
        <AdminStatus
          variant={bookingStatusVariant(booking.status)}
          label={bookingStatusLabel(booking.status)}
        />
      </td>
      <td className="py-3.5">
        <AdminStatus
          variant={deliveryStatusVariant(deliveryRequest.status)}
          label={deliveryStatusLabel(deliveryRequest.status)}
        />
      </td>
    </tr>
  );
}
