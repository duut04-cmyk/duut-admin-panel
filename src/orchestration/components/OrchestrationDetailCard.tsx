import type { ReactNode } from "react";

export const ORCHESTRATION_DETAIL_CARD_CLASS =
  "rounded-card border border-border/60 bg-background shadow-sm";

type OrchestrationDetailCardProps = {
  children: ReactNode;
  className?: string;
};

export default function OrchestrationDetailCard({
  children,
  className = "",
}: OrchestrationDetailCardProps) {
  return (
    <div className={`${ORCHESTRATION_DETAIL_CARD_CLASS} ${className}`}>{children}</div>
  );
}
