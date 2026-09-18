type EvaluationResultVariant = "accent" | "danger" | "neutral";

const variantStyles: Record<EvaluationResultVariant, { pill: string; dot: string }> = {
  accent: {
    pill: "bg-orange-50 text-orange-700",
    dot: "bg-orange-500",
  },
  danger: {
    pill: "bg-red-50 text-red-700",
    dot: "bg-red-500",
  },
  neutral: {
    pill: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
  },
};

type EvaluationResultPillProps = {
  label: string;
  variant: EvaluationResultVariant;
  className?: string;
};

export default function EvaluationResultPill({
  label,
  variant,
  className = "",
}: EvaluationResultPillProps) {
  const styles = variantStyles[variant];

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded px-2.5 py-0.5 text-caption font-medium ${styles.pill} ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${styles.dot}`}
        aria-hidden="true"
      />
      <span className="min-w-0 whitespace-normal break-words">{label}</span>
    </span>
  );
}
