"use client";

import { useEffect, useId, useRef, useState } from "react";
import AdminLoadErrorCallout from "@/components/AdminLoadErrorCallout";
import type { PaymentListItem } from "@/data/financeTypes";
import { formatInrAmount } from "../lib/formatMoney";
import PaymentStatusPill from "./PaymentStatusPill";

const STATUS_FILTERS = [
  { value: "", label: "All statuses" },
  { value: "PAID", label: "Paid" },
  { value: "PARTIALLY_REFUNDED", label: "Partially refunded" },
  { value: "REFUNDED", label: "Refunded" },
  { value: "PENDING", label: "Pending" },
  { value: "FAILED", label: "Failed" },
  { value: "EXPIRED", label: "Expired" },
] as const;

type RecentPaymentsTableProps = {
  items: PaymentListItem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onViewDetails: (paymentId: string) => void;
};

function displayPaymentId(id: string): string {
  const compact = id.replace(/-/g, "").slice(0, 8);
  return compact ? `PAY-${compact}` : id;
}

function formatPaidAt(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function pageNumbers(page: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1]);
  const sorted = [...pages]
    .filter((n) => n >= 1 && n <= totalPages)
    .sort((a, b) => a - b);
  const result: Array<number | "ellipsis"> = [];
  for (let i = 0; i < sorted.length; i += 1) {
    if (i > 0 && sorted[i]! - sorted[i - 1]! > 1) {
      result.push("ellipsis");
    }
    result.push(sorted[i]!);
  }
  return result;
}

function SearchIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-muted-foreground"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5L14 14" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M3 5h14M5 10h10M8 15h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ViewDetailsIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path
        d="M3 11L11 3M11 3H5.5M11 3V8.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M10 4l-4 4 4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function RecentPaymentsTable({
  items,
  loading,
  error,
  onRetry,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onViewDetails,
}: RecentPaymentsTableProps) {
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const effectiveTotalPages = Math.max(totalPages, 1);

  useEffect(() => {
    if (!filtersOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!filtersRef.current?.contains(event.target as Node)) {
        setFiltersOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFiltersOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [filtersOpen]);

  const activeStatusLabel =
    STATUS_FILTERS.find((option) => option.value === statusFilter)?.label ??
    "All statuses";

  return (
    <section className="flex h-full flex-col rounded-card border border-border/60 bg-background p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground">Recent Payments</h2>
        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2 sm:max-w-xl">
          <div className="relative min-w-[12rem] flex-1 sm:max-w-md">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <SearchIcon />
            </span>
            <input
              type="search"
              placeholder="Search by payment ID, order ID…"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              className="h-10 w-full rounded-[4px] border border-border bg-background py-2 pl-9 pr-3 text-small shadow-sm outline-none transition-colors focus-visible:border-link/40 focus-visible:ring-2 focus-visible:ring-link/20"
            />
          </div>
          <div ref={filtersRef} className="relative shrink-0">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={filtersOpen}
              aria-controls={listboxId}
              onClick={() => setFiltersOpen((current) => !current)}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[4px] border border-border bg-background px-3 text-small font-medium text-foreground shadow-sm transition-colors hover:border-foreground/20"
            >
              <FilterIcon />
              <span>Filters</span>
              {statusFilter ? (
                <span className="hidden rounded-full bg-sky-50 px-1.5 py-0.5 text-caption font-semibold text-sky-700 sm:inline">
                  1
                </span>
              ) : null}
              <ChevronDownIcon open={filtersOpen} />
            </button>
            {filtersOpen ? (
              <div className="absolute right-0 top-full z-30 mt-1.5 w-52 rounded-lg border border-border bg-background py-2 shadow-md">
                <p className="px-3 pb-1 text-caption font-medium text-muted-foreground">
                  Status
                </p>
                <ul id={listboxId} role="listbox" aria-label="Payment status">
                  {STATUS_FILTERS.map((option) => (
                    <li key={option.value || "all"} role="presentation">
                      <button
                        type="button"
                        role="option"
                        aria-selected={statusFilter === option.value}
                        onClick={() => {
                          onStatusFilterChange(option.value);
                          setFiltersOpen(false);
                        }}
                        className={`flex w-full cursor-pointer px-3 py-2 text-left text-small transition-colors hover:bg-slate-50 ${
                          statusFilter === option.value
                            ? "bg-sky-50/80 font-medium text-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
                {statusFilter ? (
                  <p className="mt-1 border-t border-border px-3 pt-2 text-caption text-muted-foreground">
                    Active: {activeStatusLabel}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {error ? (
        <div className="mt-4">
          <AdminLoadErrorCallout title="Could not load payments" onRetry={onRetry}>
            {error}
          </AdminLoadErrorCallout>
        </div>
      ) : (
        <div className="mt-4 min-w-0 flex-1 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-small">
            <thead>
              <tr className="bg-sky-50/60 text-muted-foreground">
                <th className="rounded-tl-md px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                  Payment ID
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                  Order ID
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                  Customer
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                  Amount
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                  Status
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                  Paid At
                </th>
                <th className="rounded-tr-md px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-muted-foreground">
                    Loading…
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-muted-foreground">
                    No payments in this period.
                  </td>
                </tr>
              ) : (
                items.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-t border-border/70 transition-colors hover:bg-slate-50/80"
                  >
                    <td className="px-3 py-3.5 font-mono text-xs tabular-nums text-foreground">
                      {displayPaymentId(payment.id)}
                    </td>
                    <td className="px-3 py-3.5 font-medium text-foreground">
                      {payment.deliveryReference}
                    </td>
                    <td className="px-3 py-3.5 text-foreground">
                      {payment.customerName?.trim() || "—"}
                    </td>
                    <td className="px-3 py-3.5 tabular-nums font-medium text-foreground">
                      {formatInrAmount(payment.amount)}
                    </td>
                    <td className="px-3 py-3.5">
                      <PaymentStatusPill status={payment.status} />
                    </td>
                    <td className="px-3 py-3.5 text-muted-foreground">
                      {formatPaidAt(payment.paidAt)}
                    </td>
                    <td className="px-3 py-3.5">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-small font-medium text-link hover:underline"
                        onClick={() => onViewDetails(payment.id)}
                      >
                        View Details
                        <ViewDetailsIcon />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {!loading && total > 0 ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
              <p className="text-small text-muted-foreground">
                Showing {from}–{to} of {total} payments
              </p>
              <div className="flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => onPageChange(page - 1)}
                  aria-label="Previous page"
                  className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeftIcon />
                </button>
                {pageNumbers(page, effectiveTotalPages).map((item, index) =>
                  item === "ellipsis" ? (
                    <span
                      key={`e-${index}`}
                      className="px-1 text-small text-muted-foreground"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => onPageChange(item)}
                      className={`flex h-8 w-8 items-center justify-center rounded-[4px] text-small font-medium transition-colors ${
                        item === page
                          ? "bg-link text-white shadow-sm"
                          : "border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                      }`}
                    >
                      {item}
                    </button>
                  ),
                )}
                <button
                  type="button"
                  disabled={page >= effectiveTotalPages}
                  onClick={() => onPageChange(page + 1)}
                  aria-label="Next page"
                  className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRightIcon />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
