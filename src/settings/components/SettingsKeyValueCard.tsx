export type SettingsKeyValueItem = {
  label: string;
  value: string;
  /** Short source chip, e.g. env var name or "Code" */
  hint?: string;
};

type SettingsKeyValueCardProps = {
  items: SettingsKeyValueItem[];
  title?: string;
};

function DetailRow({ label, value, hint }: SettingsKeyValueItem) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <dt className="text-small text-muted-foreground">{label}</dt>
      <dd className="flex min-w-0 flex-wrap items-center gap-2 sm:justify-end">
        <span className="text-small font-medium text-foreground">{value}</span>
        {hint ? (
          <span className="max-w-full truncate rounded-full border border-border/70 bg-muted/30 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
            {hint}
          </span>
        ) : null}
      </dd>
    </div>
  );
}

export default function SettingsKeyValueCard({
  items,
  title,
}: SettingsKeyValueCardProps) {
  return (
    <article className="rounded-card border border-border/60 bg-background p-4 shadow-sm">
      {title ? (
        <h3 className="mb-3 text-small font-semibold text-foreground">{title}</h3>
      ) : null}
      <dl className="space-y-2.5">
        {items.map((item) => (
          <DetailRow key={item.label} {...item} />
        ))}
      </dl>
    </article>
  );
}
