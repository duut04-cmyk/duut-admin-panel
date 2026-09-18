type AdminFilterChipProps = {
  label: string;
  onRemove: () => void;
};

export default function AdminFilterChip({ label, onRemove }: AdminFilterChipProps) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex max-w-full items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1 text-caption font-medium text-foreground transition-colors hover:border-foreground/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      aria-label={`Remove filter: ${label}`}
    >
      <span className="truncate">{label}</span>
      <span aria-hidden="true" className="text-muted-foreground">
        ×
      </span>
    </button>
  );
}
