export type SettingsKeyValueItem = {
  label: string;
  value: string;
  hint?: string;
};

type SettingsKeyValueCardProps = {
  items: SettingsKeyValueItem[];
};

function DetailRow({ label, value, hint }: SettingsKeyValueItem) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <dt className="text-caption text-muted-foreground">{label}</dt>
      <dd className="min-w-0 sm:max-w-[65%] sm:text-right">
        <span className="text-small font-medium text-foreground">{value}</span>
        {hint ? (
          <p className="mt-0.5 text-caption text-muted-foreground">{hint}</p>
        ) : null}
      </dd>
    </div>
  );
}

export default function SettingsKeyValueCard({ items }: SettingsKeyValueCardProps) {
  return (
    <article className="rounded-card border border-border/60 bg-background p-4 shadow-sm sm:p-5">
      <dl className="space-y-3">
        {items.map((item) => (
          <DetailRow key={item.label} {...item} />
        ))}
      </dl>
    </article>
  );
}
