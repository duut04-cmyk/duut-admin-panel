"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { DeliveryLocation, OrchestrationRecord } from "@/data/orchestrationTypes";
import { formatCurrency, getRecordAmount } from "@/data/dashboardMetrics";
import ServiceLogo from "@/components/ServiceLogo";

type RecentDeliveriesTableProps = {
  records: OrchestrationRecord[];
};

type DisplayStatus =
  "Delivered" | "In Progress" | "Picked Up" | "Cancelled" | "Failed" | "Booked";

const statusStyles: Record<DisplayStatus, { pill: string; dot: string }> = {
  Delivered: {
    pill: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  "In Progress": {
    pill: "bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
  },
  "Picked Up": {
    pill: "bg-violet-50 text-violet-700",
    dot: "bg-violet-500",
  },
  Cancelled: {
    pill: "bg-red-50 text-red-700",
    dot: "bg-red-500",
  },
  Failed: {
    pill: "bg-red-50 text-red-700",
    dot: "bg-red-500",
  },
  Booked: {
    pill: "bg-sky-50 text-sky-700",
    dot: "bg-sky-500",
  },
};

const TABLE_COLUMNS = [
  { key: "id", label: "Delivery ID", className: "w-[11%]" },
  { key: "pickup", label: "Pickup Location", className: "w-[17%]" },
  { key: "dropoff", label: "Drop-off Location", className: "w-[17%]" },
  { key: "service", label: "Service", className: "w-[14%]" },
  { key: "status", label: "Status", className: "w-[12%]" },
  { key: "eta", label: "ETA / Delivered", className: "w-[11%]" },
  { key: "amount", label: "Amount", className: "w-[10%]" },
  { key: "actions", label: "Actions", className: "w-[8%] text-right" },
] as const;

function getDisplayStatus(record: OrchestrationRecord): DisplayStatus {
  const status = record.deliveryRequest.status;
  if (status === "cancelled") return "Cancelled";
  if (status === "failed") return "Failed";
  if (status === "delivered") return "Delivered";
  if (record.events.some((event) => event.type === "picked_up")) {
    return "Picked Up";
  }
  if (status === "in_transit" || status === "orchestrating" || status === "booking") {
    return "In Progress";
  }
  return "Booked";
}

function formatLocationLabel(location: DeliveryLocation): {
  label: string;
  title: string;
} {
  const title = location.address;
  const label =
    location.city || location.address.split(",")[0]?.trim() || location.address;

  return { label, title };
}

function getEtaOrDelivered(record: OrchestrationRecord): string {
  const status = record.deliveryRequest.status;
  if (status === "delivered") {
    const delivered = record.events.find((event) => event.type === "delivered");
    if (delivered) {
      return new Date(delivered.timestamp).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      });
    }
    return "Delivered";
  }
  const selected = record.evaluations.find(
    (evaluation) => evaluation.serviceId === record.decision.selectedServiceId,
  );
  if (selected?.totalEtaMinutes != null) {
    return `ETA ${selected.totalEtaMinutes} min`;
  }
  return "—";
}

function StatusPill({ status }: { status: DisplayStatus }) {
  const styles = statusStyles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill px-2.5 py-0.5 text-caption font-medium ${styles.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} aria-hidden="true" />
      {status}
    </span>
  );
}

const CANCELLABLE_STATUSES = new Set<DisplayStatus>([
  "In Progress",
  "Picked Up",
  "Booked",
]);

function HorizontalMoreIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <circle cx="3" cy="8" r="1.25" />
      <circle cx="8" cy="8" r="1.25" />
      <circle cx="13" cy="8" r="1.25" />
    </svg>
  );
}

const menuItemClassName =
  "flex w-full cursor-pointer px-4 py-2.5 text-left text-small text-foreground transition-colors hover:bg-surface focus-visible:bg-surface focus-visible:outline-none";

type RowActionsMenuProps = {
  deliveryId: string;
  status: DisplayStatus;
};

function RowActionsMenu({ deliveryId, status }: RowActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const [copyLabel, setCopyLabel] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const canCancel = CANCELLABLE_STATUSES.has(status);

  const openMenu = () => {
    const button = buttonRef.current;
    if (button) {
      const rect = button.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 4,
        left: rect.right - 192,
      });
    }
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!copyLabel) return;
    const timer = window.setTimeout(() => setCopyLabel(null), 1500);
    return () => window.clearTimeout(timer);
  }, [copyLabel]);

  const closeMenu = () => setOpen(false);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(deliveryId);
      setCopyLabel("Copied!");
    } catch {
      setCopyLabel("Copy failed");
    }
    closeMenu();
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Actions for ${deliveryId}`}
        onClick={() => (open ? setOpen(false) : openMenu())}
        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-control text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
      >
        <HorizontalMoreIcon />
      </button>
      {copyLabel && (
        <span className="sr-only" aria-live="polite">
          {copyLabel}
        </span>
      )}
      {open && (
        <div
          role="menu"
          aria-label={`Actions for ${deliveryId}`}
          className="fixed z-50 w-48 rounded-card border border-border bg-background py-1 shadow-md"
          style={{ top: menuPosition.top, left: menuPosition.left }}
        >
          <Link
            href={`/deliveries/${deliveryId}`}
            role="menuitem"
            className={menuItemClassName}
            onClick={closeMenu}
          >
            View delivery
          </Link>
          <Link
            href={`/orchestration/${deliveryId}`}
            role="menuitem"
            className={menuItemClassName}
            onClick={closeMenu}
          >
            View orchestration
          </Link>
          <div className="my-1 border-t border-border" role="separator" />
          <button
            type="button"
            role="menuitem"
            className={menuItemClassName}
            onClick={handleCopyId}
          >
            Copy delivery ID
          </button>
          {canCancel && (
            <>
              <div className="my-1 border-t border-border" role="separator" />
              <button
                type="button"
                role="menuitem"
                className={`${menuItemClassName} text-admin-danger hover:bg-red-50 focus-visible:bg-red-50`}
                onClick={closeMenu}
              >
                Cancel delivery
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function LocationCell({ location }: { location: DeliveryLocation }) {
  const { label, title } = formatLocationLabel(location);

  return (
    <span className="block truncate text-muted-foreground" title={title}>
      {label}
    </span>
  );
}

function RecentDeliveryCard({ record }: { record: OrchestrationRecord }) {
  const { deliveryRequest, decision } = record;
  const displayStatus = getDisplayStatus(record);
  const pickup = formatLocationLabel(deliveryRequest.pickup);
  const dropoff = formatLocationLabel(deliveryRequest.drop);

  return (
    <article className="min-w-0 rounded-card border border-border/60 bg-background p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            href={`/deliveries/${deliveryRequest.deliveryId}`}
            className="block truncate font-semibold text-foreground hover:text-link focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
          >
            {deliveryRequest.deliveryId}
          </Link>
          <p className="mt-1 line-clamp-2 text-small text-muted-foreground">
            {pickup.label} → {dropoff.label}
          </p>
        </div>
        <StatusPill status={displayStatus} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-small">
        <div>
          <dt className="text-caption text-muted-foreground">Service</dt>
          <dd className="mt-0.5 flex min-w-0 items-center gap-2 font-medium text-foreground">
            <ServiceLogo serviceName={decision.selectedServiceName} />
            <span className="truncate">{decision.selectedServiceName}</span>
          </dd>
        </div>
        <div>
          <dt className="text-caption text-muted-foreground">ETA / Delivered</dt>
          <dd className="mt-0.5 text-muted-foreground">{getEtaOrDelivered(record)}</dd>
        </div>
        <div>
          <dt className="text-caption text-muted-foreground">Amount</dt>
          <dd className="mt-0.5 font-semibold text-foreground">
            {formatCurrency(getRecordAmount(record))}
          </dd>
        </div>
        <div className="flex items-end justify-end">
          <RowActionsMenu
            deliveryId={deliveryRequest.deliveryId}
            status={displayStatus}
          />
        </div>
      </dl>
    </article>
  );
}

export default function RecentDeliveriesTable({ records }: RecentDeliveriesTableProps) {
  return (
    <section aria-labelledby="recent-deliveries-table-heading">
      <article className="min-w-0 overflow-hidden rounded-card border border-border/60 bg-background shadow-sm">
        <div className="flex flex-col gap-2 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5 lg:px-6">
          <h2
            id="recent-deliveries-table-heading"
            className="min-w-0 text-body font-semibold text-foreground lg:text-subheading"
          >
            Recent Deliveries
          </h2>
          <Link
            href="/deliveries"
            className="shrink-0 text-small font-medium text-link hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
          >
            View all deliveries →
          </Link>
        </div>

        {records.length === 0 ? (
          <p className="px-5 py-10 text-center text-small text-muted-foreground md:px-6">
            No deliveries in the selected period.
          </p>
        ) : (
          <>
            <div className="space-y-3 p-4 lg:hidden">
              {records.map((record) => (
                <RecentDeliveryCard
                  key={record.deliveryRequest.deliveryId}
                  record={record}
                />
              ))}
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[960px] table-fixed text-left text-small">
                <thead>
                  <tr className="border-b border-border">
                    {TABLE_COLUMNS.map((column) => (
                      <th
                        key={column.key}
                        scope="col"
                        className={`px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5 ${column.className}`}
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => {
                    const { deliveryRequest, decision } = record;
                    const displayStatus = getDisplayStatus(record);

                    return (
                      <tr
                        key={deliveryRequest.deliveryId}
                        className="border-b border-border last:border-b-0 transition-colors hover:bg-surface/30"
                      >
                        <td className="px-4 py-3.5 md:px-5">
                          <Link
                            href={`/deliveries/${deliveryRequest.deliveryId}`}
                            className="block truncate font-semibold text-foreground hover:text-link focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
                          >
                            {deliveryRequest.deliveryId}
                          </Link>
                        </td>
                        <td className="px-4 py-3.5 md:px-5">
                          <LocationCell location={deliveryRequest.pickup} />
                        </td>
                        <td className="px-4 py-3.5 md:px-5">
                          <LocationCell location={deliveryRequest.drop} />
                        </td>
                        <td className="px-4 py-3.5 md:px-5">
                          <div className="flex min-w-0 items-center gap-2">
                            <ServiceLogo serviceName={decision.selectedServiceName} />
                            <span className="truncate text-foreground">
                              {decision.selectedServiceName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 md:px-5">
                          <StatusPill status={displayStatus} />
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground md:px-5">
                          {getEtaOrDelivered(record)}
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-foreground md:px-5">
                          {formatCurrency(getRecordAmount(record))}
                        </td>
                        <td className="px-4 py-3.5 text-right md:px-5">
                          <div className="flex justify-end">
                            <RowActionsMenu
                              deliveryId={deliveryRequest.deliveryId}
                              status={displayStatus}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </article>
    </section>
  );
}
