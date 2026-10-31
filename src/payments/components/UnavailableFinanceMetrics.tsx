const items = [
  { label: "Cashfree settlement", value: "Not tracked yet" },
  { label: "Actual provider invoice", value: "Not tracked yet" },
  { label: "Provider payouts", value: "Not implemented" },
  { label: "Actual provider cost", value: "Not available" },
  { label: "Gross margin", value: "Not available" },
];

export default function UnavailableFinanceMetrics() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/20 p-4">
      <h3 className="text-small font-semibold text-foreground">Unavailable metrics</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-center justify-between gap-3 text-small"
          >
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-medium text-foreground">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
