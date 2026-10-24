import type { DeliveryListItem } from "@/data/deliveryApiTypes";
import { formatTimestamp } from "@/orchestration/components/utils";

export type DeliveryMetrics = {
  total: number;
  inTransit: number;
  delivered: number;
  failed: number;
  cancelled: number;
};

export { formatTimestamp };

export function formatListItemRoute(item: DeliveryListItem): string {
  const pickup = item.pickup.addressText.trim();
  const drop = item.drop.addressText.trim();
  if (!pickup && !drop) return "—";
  const short = (value: string) =>
    value.length > 36 ? `${value.slice(0, 33)}…` : value;
  return `${short(pickup)} → ${short(drop)}`;
}
