import type { ReactNode } from "react";

export const DELIVERY_DETAIL_CARD_CLASS =
  "rounded-card border border-border/60 bg-background shadow-sm";

type DeliveryDetailCardProps = {
  children: ReactNode;
  className?: string;
};

export default function DeliveryDetailCard({
  children,
  className = "",
}: DeliveryDetailCardProps) {
  return <div className={`${DELIVERY_DETAIL_CARD_CLASS} ${className}`}>{children}</div>;
}
