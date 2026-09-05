type AdminTrendDirection = "positive" | "negative" | "neutral";

type AdminTrendProps = {
  value: string;
  direction?: AdminTrendDirection;
  className?: string;
};

const directionClasses: Record<AdminTrendDirection, string> = {
  positive: "text-admin-success",
  negative: "text-admin-danger",
  neutral: "text-muted-foreground",
};

const directionLabels: Record<AdminTrendDirection, string> = {
  positive: "Increased",
  negative: "Decreased",
  neutral: "No change",
};

function TrendArrow({ direction }: { direction: AdminTrendDirection }) {
  if (direction === "neutral") return null;

  const up = direction === "positive";

  return (
    <svg
      className="h-3 w-3 shrink-0"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      {up ? (
        <path d="M6 9V3M6 3L3 6M6 3l3 3" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M6 3v6M6 9L3 6M6 9l3-3" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

export default function AdminTrend({
  value,
  direction = "neutral",
  className = "",
}: AdminTrendProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-caption font-medium ${directionClasses[direction]} ${className}`}
      aria-label={`${directionLabels[direction]}: ${value}`}
    >
      <TrendArrow direction={direction} />
      <span>{value}</span>
    </span>
  );
}
