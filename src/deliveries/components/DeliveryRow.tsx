import Link from "next/link";
import type { DeliveryListItem } from "@/data/deliveryApiTypes";
import DeliveryStatus from "./DeliveryStatus";
import { formatListItemRoute, formatTimestamp } from "./utils";

type DeliveryRowProps = {
  item: DeliveryListItem;
  variant?: "table" | "card";
};

function formatPackageLabel(value: string): string {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return "—";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function PackageChip({ value }: { value: string }) {
  return (
    <span className="inline-flex rounded-full border border-border bg-[#FFFBF5] px-2.5 py-0.5 text-caption font-medium text-foreground">
      {formatPackageLabel(value)}
    </span>
  );
}

export default function DeliveryRow({ item, variant = "table" }: DeliveryRowProps) {
  const href = `/deliveries/${item.id}`;

  if (variant === "card") {
    return (
      <Link
        href={href}
        className="block cursor-pointer rounded-[10px] border border-border bg-white p-4 shadow-[0_8px_24px_-16px_rgba(23,23,23,0.1)] transition-colors hover:border-foreground/20 hover:bg-surface/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-label={`Open delivery ${item.reference}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-semibold text-foreground">{item.reference}</p>
            <p className="mt-0.5 text-small text-muted-foreground">
              {formatListItemRoute(item)}
            </p>
          </div>
          <DeliveryStatus status={item.status} />
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-small">
          <div>
            <dt className="text-caption text-muted-foreground">Package</dt>
            <dd className="mt-1">
              <PackageChip value={item.packageType} />
            </dd>
          </div>
          <div className="text-right">
            <dt className="text-caption text-muted-foreground">Created</dt>
            <dd className="mt-0.5 tabular-nums text-muted-foreground">
              {formatTimestamp(item.createdAt)}
            </dd>
          </div>
        </dl>
      </Link>
    );
  }

  return (
    <tr className="relative cursor-pointer border-b border-border last:border-b-0 transition-colors hover:bg-surface/40">
      <td className="whitespace-nowrap px-4 py-3.5 md:px-5">
        <Link
          href={href}
          className="font-semibold text-foreground after:absolute after:inset-0 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label={`Open delivery ${item.reference}`}
        >
          {item.reference}
        </Link>
      </td>
      <td className="max-w-xs truncate px-4 py-3.5 text-small text-muted-foreground md:px-5">
        {formatListItemRoute(item)}
      </td>
      <td className="px-4 py-3.5 text-small md:px-5">
        <PackageChip value={item.packageType} />
      </td>
      <td className="px-4 py-3.5 md:px-5">
        <DeliveryStatus status={item.status} />
      </td>
      <td className="px-4 py-3.5 text-small tabular-nums text-muted-foreground md:px-5">
        {formatTimestamp(item.createdAt)}
      </td>
    </tr>
  );
}
