import AdminLoadErrorCallout from "@/components/AdminLoadErrorCallout";
import type { FinanceReconciliation } from "@/data/financeTypes";

type ReconciliationPanelProps = {
  data: FinanceReconciliation | null;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
};

export default function ReconciliationPanel({
  data,
  loading,
  error,
  onRetry,
}: ReconciliationPanelProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <h3 className="text-base font-semibold">Internal reconciliation</h3>
      <p className="mt-1 text-small text-muted-foreground">
        Database consistency between payments, SUCCESS refunds, and ledger entries. Not
        Cashfree settlement reconciliation.
      </p>
      {loading ? (
        <p className="mt-3 text-small text-muted-foreground">Loading…</p>
      ) : null}
      {error && onRetry ? (
        <AdminLoadErrorCallout title="Could not load reconciliation" onRetry={onRetry}>
          {error}
        </AdminLoadErrorCallout>
      ) : error ? (
        <p className="mt-3 text-small text-destructive">{error}</p>
      ) : null}
      {!error && data ? (
        <div className="mt-4 space-y-3">
          <p className="text-small text-muted-foreground">
            Scanned {data.scannedPayments} payments, {data.scannedRefunds} refunds,{" "}
            {data.scannedLedgerEntries} ledger rows — {data.issueCount} issue
            {data.issueCount === 1 ? "" : "s"}
            {data.truncated ? " (truncated)" : ""}.
          </p>
          {data.issues.length === 0 ? (
            <p className="text-small text-emerald-700">
              No discrepancies in scan scope.
            </p>
          ) : (
            <ul className="max-h-64 space-y-2 overflow-y-auto text-small">
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
                  {issue.expectedAmount != null || issue.actualAmount != null ? (
                    <p className="tabular-nums">
                      expected {issue.expectedAmount ?? "—"} / actual{" "}
                      {issue.actualAmount ?? "—"}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </section>
  );
}
