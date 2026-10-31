const COLORS = {
  collections: "#2563EB",
  refunds: "#10B981",
  net: "#8B5CF6",
} as const;

type FinanceChartLegendProps = {
  className?: string;
};

export default function FinanceChartLegend({
  className = "",
}: FinanceChartLegendProps) {
  return (
    <div
      className={`flex flex-wrap items-center gap-3 text-xs text-muted-foreground ${className}`}
    >
      <span className="inline-flex items-center gap-1.5">
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: COLORS.collections }}
          aria-hidden="true"
        />
        Collections
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: COLORS.refunds }}
          aria-hidden="true"
        />
        Refunds
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: COLORS.net }}
          aria-hidden="true"
        />
        Net Activity
      </span>
    </div>
  );
}
