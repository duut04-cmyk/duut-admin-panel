import Link from "next/link";
import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import { formatDecisionTime } from "@/data/orchestrationMetrics";
import ServiceLogo from "@/components/ServiceLogo";
import {
  BookingStatusPill,
  DeliveryStatusPill,
} from "@/deliveries/components/DeliveryStatusPill";
import { formatRoute } from "./utils";

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
        className="block rounded-card border border-border/60 bg-background p-4 shadow-sm transition-colors hover:border-foreground/20 hover:bg-surface/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-label={`Open orchestration ${deliveryId}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-semibold text-foreground">{deliveryId}</p>
            <p className="mt-0.5 text-small text-muted-foreground">
              {formatRoute(record)}
            </p>
          </div>
          <DeliveryStatusPill status={deliveryRequest.status} />
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-small">
          <div>
            <dt className="text-caption text-muted-foreground">Evaluated</dt>
            <dd className="mt-0.5 tabular-nums font-medium">
              {decision.servicesEvaluated}
            </dd>
          </div>
          <div className="text-right">
            <dt className="text-caption text-muted-foreground">Available</dt>
            <dd className="mt-0.5 tabular-nums font-medium">
              {decision.availableOptions}
            </dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Selected</dt>
            <dd className="mt-0.5 flex min-w-0 items-center gap-2 font-medium text-foreground">
              <ServiceLogo
                serviceName={decision.selectedServiceName}
                className="h-7 w-7"
              />
              <span className="truncate">{decision.selectedServiceName}</span>
            </dd>
          </div>
          <div className="text-right">
            <dt className="text-caption text-muted-foreground">Score</dt>
            <dd className="mt-0.5 tabular-nums font-medium">{score.toFixed(1)}</dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Decision time</dt>
            <dd className="mt-0.5 tabular-nums">
              {formatDecisionTime(decision.durationMs)}
            </dd>
          </div>
          <div className="text-right">
            <dt className="text-caption text-muted-foreground">Booking</dt>
            <dd className="mt-0.5 flex justify-end">
              <BookingStatusPill status={booking.status} />
            </dd>
          </div>
        </dl>
      </Link>
    );
  }

  return (
    <tr className="border-b border-border last:border-b-0 transition-colors hover:bg-surface/30">
      <td className="whitespace-nowrap px-4 py-3.5 md:px-5">
        <Link
          href={href}
          className="font-semibold text-foreground hover:text-link focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
        >
          {deliveryId}
        </Link>
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-small text-muted-foreground md:px-5">
        {formatRoute(record)}
      </td>
      <td className="px-4 py-3.5 text-right tabular-nums text-small md:px-5">
        {decision.servicesEvaluated}
      </td>
      <td className="px-4 py-3.5 text-right tabular-nums text-small md:px-5">
        {decision.availableOptions}
      </td>
      <td className="px-4 py-3.5 md:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <ServiceLogo serviceName={decision.selectedServiceName} />
          <span className="truncate text-small text-foreground">
            {decision.selectedServiceName}
          </span>
        </div>
      </td>
      <td className="px-4 py-3.5 text-right tabular-nums text-small font-medium md:px-5">
        {score.toFixed(1)}
      </td>
      <td className="px-4 py-3.5 text-right tabular-nums text-small text-muted-foreground md:px-5">
        {formatDecisionTime(decision.durationMs)}
      </td>
      <td className="px-4 py-3.5 md:px-5">
        <BookingStatusPill status={booking.status} />
      </td>
      <td className="px-4 py-3.5 md:px-5">
        <DeliveryStatusPill status={deliveryRequest.status} />
      </td>
    </tr>
  );
}
