type FlowStepProps = {
  value: number | string;
  label: string;
  highlight?: boolean;
};

export function FlowStep({ value, label, highlight = false }: FlowStepProps) {
  return (
    <div
      className={`flex flex-col items-center rounded-lg border px-4 py-5 text-center sm:px-5 ${
        highlight ? "border-accent/40 bg-surface-accent" : "border-border bg-background"
      }`}
    >
      <p className="text-[1.5rem] font-bold tracking-tight text-foreground md:text-[1.75rem]">
        {value}
      </p>
      <p className="mt-1 text-caption font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

export function FlowArrow({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center text-muted-foreground/60 ${className}`}
      aria-hidden="true"
    >
      <svg
        className="h-6 w-6 rotate-90 lg:rotate-0"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      >
        <path d="M4 10h12M12 6l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
