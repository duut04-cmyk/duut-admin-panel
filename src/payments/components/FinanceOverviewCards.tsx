import type { FinanceSummary } from "@/data/financeTypes";

type FinanceOverviewCardsProps = {
  summary: FinanceSummary | null;
};

function Card({
  title,
  amount,
  count,
  subtitle,
}: {
  title: string;
  amount: string;
  count?: number;
  subtitle?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <p className="text-small font-medium text-muted-foreground">{title}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums text-foreground">
        INR {amount}
      </p>
      {count != null ? (
        <p className="mt-1 text-small text-muted-foreground">{count} records</p>
      ) : null}
      {subtitle ? (
        <p className="mt-2 text-xs leading-snug text-muted-foreground">{subtitle}</p>
      ) : null}
    </div>
  );
}

export default function FinanceOverviewCards({ summary }: FinanceOverviewCardsProps) {
  if (!summary) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-xl border border-border bg-muted/40"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Card
        title="Gross collections (by paidAt)"
        amount={summary.collections.totalAmount}
        count={summary.collections.count}
      />
      <Card
        title="Successful refunds (SUCCESS, by processedAt)"
        amount={summary.successfulRefunds.totalAmount}
        count={summary.successfulRefunds.count}
      />
      <Card
        title="Net activity in period"
        amount={summary.netActivityInPeriod.amount}
        subtitle={summary.netActivityInPeriod.formula}
      />
      <Card
        title="Lifetime net collected"
        amount={summary.lifetime.net}
        subtitle="Captured payments (PAID, PARTIALLY_REFUNDED, REFUNDED with paidAt) minus lifetime SUCCESS refunds"
      />
      <Card
        title="Pending refunds (requested in period)"
        amount={summary.pendingRefunds.totalAmount}
        count={summary.pendingRefunds.count}
      />
      <Card
        title="Failed refunds (processed in period)"
        amount={summary.failedRefunds.totalAmount}
        count={summary.failedRefunds.count}
      />
    </div>
  );
}
