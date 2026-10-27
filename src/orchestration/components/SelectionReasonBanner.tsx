type SelectionReasonBannerProps = {
  reason: string | null | undefined;
  selectedServiceName: string;
};

export default function SelectionReasonBanner({
  reason,
  selectedServiceName,
}: SelectionReasonBannerProps) {
  const displayReason = reason?.trim() || "Selection reason not available.";

  return (
    <aside
      aria-label={`Why Doot selected ${selectedServiceName}`}
      className="rounded-lg border border-accent/20 bg-orange-50/60 px-4 py-3"
    >
      <p className="text-small leading-snug text-foreground">
        <span className="font-semibold">Why {selectedServiceName}?</span>
        <span className="mx-1.5 text-muted-foreground" aria-hidden="true">
          —
        </span>
        <span className="text-muted-foreground">{displayReason}</span>
      </p>
    </aside>
  );
}
