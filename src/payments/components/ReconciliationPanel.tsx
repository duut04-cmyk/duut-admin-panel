import AdminLoadErrorCallout from "@/components/AdminLoadErrorCallout";
import type { FinanceReconciliation } from "@/data/financeTypes";
import { formatInrAmount } from "../lib/formatMoney";

type ReconciliationPanelProps = {
  data: FinanceReconciliation | null;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  grossCollectionsAmount?: string | null;
  checkedAt?: Date | null;
  onViewDetails?: () => void;
};

function SyncIcon() {
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 shadow-sm"
      aria-hidden="true"
    >
      <svg
        className="h-5 w-5 text-white"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
      >
        <path d="M5 10.5l3 3 7-7.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function formatCheckedAt(value: Date): string {
  const datePart = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
  const timePart = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(value);
  return `${datePart} • ${timePart}`;
}

function formatWindowLabel(window: FinanceReconciliation["window"]): string {
  if (!window) {
    return "All available records (scoped scan limit applies)";
  }
  const from = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(window.from));
  const to = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(window.toExclusive));
  return `${from} → ${to} (${window.timeZone})`;
}

function ReconciliationDetails({
  data,
  checkedLabel,
  grossCollectionsAmount,
}: {
  data: FinanceReconciliation;
  checkedLabel: string;
  grossCollectionsAmount: string | null | undefined;
}) {
  return (
    <div
      id="reconciliation-details"
      className="mt-4 space-y-3 rounded-lg border border-border/60 bg-slate-50/50 p-3 text-small"
    >
      <p className="font-medium text-foreground">Scan details</p>
      <dl className="space-y-2">
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Scope</dt>
          <dd className="max-w-[14rem] text-right text-foreground">
            {formatWindowLabel(data.window)}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Payments scanned</dt>
          <dd className="tabular-nums text-foreground">{data.scannedPayments}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Refunds scanned</dt>
          <dd className="tabular-nums text-foreground">{data.scannedRefunds}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Ledger entries scanned</dt>
          <dd className="tabular-nums text-foreground">{data.scannedLedgerEntries}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Issues found</dt>
          <dd className="tabular-nums text-foreground">{data.issueCount}</dd>
        </div>
      </dl>
      {data.truncated ? (
        <p className="text-caption text-amber-800">
          Issue list was truncated; increase the scan limit or narrow the date range.
        </p>
      ) : null}
      <p className="text-caption leading-relaxed text-muted-foreground">
        {data.disclaimer}
      </p>
      <div className="border-t border-border/70 pt-3">
        <dl className="space-y-2.5">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-muted-foreground">Last checked</dt>
            <dd className="text-right tabular-nums text-foreground">{checkedLabel}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-muted-foreground">Gross collections (period)</dt>
            <dd className="text-right font-semibold tabular-nums text-foreground">
              {grossCollectionsAmount != null
                ? formatInrAmount(grossCollectionsAmount)
                : "—"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default function ReconciliationPanel({
  data,
  loading,
  error,
  onRetry,
  grossCollectionsAmount,
  checkedAt,
  onViewDetails,
}: ReconciliationPanelProps) {
  const inSync = Boolean(data && data.issueCount === 0 && !error);
  const checkedLabel = formatCheckedAt(checkedAt ?? new Date());

  return (
    <section className="w-full self-start rounded-card border border-border/60 bg-background p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-foreground">Reconciliation</h3>
        <button
          type="button"
          onClick={onViewDetails}
          className="shrink-0 text-small font-medium text-link hover:underline"
        >
          View Details →
        </button>
      </div>

      {loading ? (
        <div className="mt-4 space-y-4">
          <div className="h-16 animate-pulse rounded-lg bg-muted/40" />
          <div className="h-px bg-border" />
          <div className="h-10 animate-pulse rounded-lg bg-muted/40" />
        </div>
      ) : null}

      {error && onRetry ? (
        <div className="mt-4">
          <AdminLoadErrorCallout
            title="Could not load reconciliation"
            onRetry={onRetry}
          >
            {error}
          </AdminLoadErrorCallout>
        </div>
      ) : null}
      {error && !onRetry ? (
        <p className="mt-3 text-small text-destructive">{error}</p>
      ) : null}

      {!loading && !error && inSync && data ? (
        <div className="mt-5">
          <div className="flex items-start gap-3">
            <SyncIcon />
            <div className="min-w-0 pt-0.5">
              <p className="text-[15px] font-semibold leading-snug text-foreground">
                All systems in <span className="text-emerald-600">sync</span>
              </p>
              <p className="mt-1 text-small leading-relaxed text-muted-foreground">
                Payment records and ledger entries are consistent.
              </p>
            </div>
          </div>
          <ReconciliationDetails
            data={data}
            checkedLabel={checkedLabel}
            grossCollectionsAmount={grossCollectionsAmount}
          />
        </div>
      ) : null}

      {!loading && !error && data && data.issueCount > 0 ? (
        <div id="reconciliation-issues" className="mt-5 space-y-3">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700">
              !
            </span>
            <p className="text-small font-medium text-amber-900">
              {data.issueCount} issue{data.issueCount === 1 ? "" : "s"} found
              {data.truncated ? " (truncated)" : ""}.
            </p>
          </div>
          <ul className="max-h-56 space-y-2 overflow-y-auto text-small">
            {data.issues.map((issue, index) => (
              <li
                key={`${issue.type}-${index}`}
                className="rounded-lg border border-border p-2"
              >
                <span
                  className={
                    issue.severity === "error"
                      ? "font-semibold text-destructive"
                      : "font-semibold text-amber-700"
                  }
                >
                  {issue.type}
                </span>
                <p className="text-muted-foreground">{issue.explanation}</p>
              </li>
            ))}
          </ul>
          <ReconciliationDetails
            data={data}
            checkedLabel={checkedLabel}
            grossCollectionsAmount={grossCollectionsAmount}
          />
        </div>
      ) : null}
    </section>
  );
}
