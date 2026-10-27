import Link from "next/link";
import type { DeliveryListItem } from "@/data/deliveryApiTypes";
import DeliveryStatus from "./DeliveryStatus";
import { formatListItemRoute, formatTimestamp } from "./utils";

type DeliveryRowProps = {
  item: DeliveryListItem;
  variant?: "table" | "card";
};

export default function DeliveryRow({ item, variant = "table" }: DeliveryRowProps) {
  const href = `/deliveries/${item.id}`;

  if (variant === "card") {
    return (
      <Link
        href={href}
        className="block rounded-card border border-border/60 bg-background p-4 shadow-sm transition-colors hover:border-foreground/20 hover:bg-surface/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-label={`Open delivery ${item.reference}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-semibold text-foreground">{item.reference}</p>
            <p className="mt-0.5 text-caption text-muted-foreground">{item.id}</p>
            <p className="mt-0.5 text-small text-muted-foreground">
              {formatListItemRoute(item)}
            </p>
          </div>
          <DeliveryStatus status={item.status} />
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-small">
          <div>
            <dt className="text-caption text-muted-foreground">Package</dt>
            <dd className="mt-0.5 font-medium text-foreground">{item.packageType}</dd>
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
    <tr className="border-b border-border last:border-b-0 transition-colors hover:bg-surface/30">
      <td className="whitespace-nowrap px-4 py-3.5 md:px-5">
        <Link
          href={href}
          className="block font-semibold text-foreground hover:text-link focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
        >
          {item.reference}
        </Link>
        <p className="mt-0.5 max-w-[12rem] truncate text-caption text-muted-foreground">
          {item.id}
        </p>
      </td>
      <td className="max-w-xs px-4 py-3.5 text-small text-muted-foreground md:px-5">
        {formatListItemRoute(item)}
      </td>
      <td className="px-4 py-3.5 text-small text-foreground md:px-5">
        {item.packageType}
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
