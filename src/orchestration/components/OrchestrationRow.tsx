import Link from "next/link";
import ServiceLogo from "@/components/ServiceLogo";
import {
  DeliveryStatusPill,
  ProviderBookingStatusPill,
} from "@/deliveries/components/DeliveryStatusPill";
import type { OrchestrationListRowView } from "../orchestrationListMappers";

type OrchestrationRowProps = {
  row: OrchestrationListRowView;
  variant?: "table" | "card";
};

function PrimaryLabel({ row }: { row: OrchestrationListRowView }) {
  const label = row.deliveryReference.trim() || row.deliveryId;
  if (row.runHref) {
    return (
      <Link
        href={row.runHref}
        className="font-semibold text-foreground hover:text-link focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
      >
        {label}
      </Link>
    );
  }
  return <span className="font-semibold text-foreground">{label}</span>;
}

export default function OrchestrationRow({
  row,
  variant = "table",
}: OrchestrationRowProps) {
  if (variant === "card") {
    const cardInner = (
      <>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <PrimaryLabel row={row} />
            <p className="mt-0.5 text-small text-muted-foreground">{row.routeLabel}</p>
          </div>
          <DeliveryStatusPill status={row.deliveryStatus} />
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-small">
          <div>
            <dt className="text-caption text-muted-foreground">Evaluated</dt>
            <dd className="mt-0.5 tabular-nums font-medium">{row.evaluationCount}</dd>
          </div>
          <div className="text-right">
            <dt className="text-caption text-muted-foreground">Available</dt>
            <dd className="mt-0.5 tabular-nums font-medium">
              {row.availableOptionCount}
            </dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Selected</dt>
            <dd className="mt-0.5 flex min-w-0 items-center gap-2 font-medium text-foreground">
              <ServiceLogo
                serviceName={row.selectedProviderLabel}
                className="h-7 w-7"
              />
              <span className="truncate">{row.selectedProviderLabel}</span>
            </dd>
          </div>
          <div className="text-right">
            <dt className="text-caption text-muted-foreground">Score</dt>
            <dd className="mt-0.5 tabular-nums font-medium">
              {row.selectedScoreDisplay}
            </dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Duration</dt>
            <dd className="mt-0.5 tabular-nums">{row.durationDisplay}</dd>
          </div>
          <div className="text-right">
            <dt className="text-caption text-muted-foreground">Booking</dt>
            <dd className="mt-0.5 flex justify-end">
              {row.bookingStatus ? (
                <ProviderBookingStatusPill status={row.bookingStatus} />
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </dd>
          </div>
        </dl>
      </>
    );

    if (row.runHref) {
      return (
        <Link
          href={row.runHref}
          className="block rounded-card border border-border/60 bg-background p-4 shadow-sm transition-colors hover:border-foreground/20 hover:bg-surface/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label={`Open orchestration run for ${row.deliveryReference || row.deliveryId}`}
        >
          {cardInner}
        </Link>
      );
    }

    return (
      <article className="block rounded-card border border-border/60 bg-background p-4 shadow-sm">
        {cardInner}
      </article>
    );
  }

  return (
    <tr className="border-b border-border last:border-b-0 transition-colors hover:bg-surface/30">
      <td className="whitespace-nowrap px-4 py-3.5 md:px-5">
        <PrimaryLabel row={row} />
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-small text-muted-foreground md:px-5">
        {row.routeLabel}
      </td>
      <td className="px-4 py-3.5 text-right tabular-nums text-small md:px-5">
        {row.evaluationCount}
      </td>
      <td className="px-4 py-3.5 text-right tabular-nums text-small md:px-5">
        {row.availableOptionCount}
      </td>
      <td className="px-4 py-3.5 md:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <ServiceLogo serviceName={row.selectedProviderLabel} />
          <span className="truncate text-small text-foreground">
            {row.selectedProviderLabel}
          </span>
        </div>
      </td>
      <td className="px-4 py-3.5 text-right tabular-nums text-small font-medium md:px-5">
        {row.selectedScoreDisplay}
      </td>
      <td className="px-4 py-3.5 text-right tabular-nums text-small text-muted-foreground md:px-5">
        {row.durationDisplay}
      </td>
      <td className="px-4 py-3.5 md:px-5">
        {row.bookingStatus ? (
          <ProviderBookingStatusPill status={row.bookingStatus} />
        ) : (
          <span className="text-small text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-4 py-3.5 md:px-5">
        <DeliveryStatusPill status={row.deliveryStatus} />
      </td>
    </tr>
  );
}
