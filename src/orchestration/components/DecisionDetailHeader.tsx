import Link from "next/link";
import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import AdminStatus from "@/ui/AdminStatus";
import { deliveryStatusLabel, deliveryStatusVariant } from "./utils";

type DecisionDetailHeaderProps = {
  record: OrchestrationRecord;
};

export default function DecisionDetailHeader({ record }: DecisionDetailHeaderProps) {
  const { deliveryRequest } = record;
  const status = deliveryRequest.status;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Link
        href="/orchestration"
        className="inline-flex items-center gap-1.5 text-small font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M10 12L6 8l4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to orchestration
      </Link>
      <AdminStatus
        variant={deliveryStatusVariant(status)}
        label={deliveryStatusLabel(status)}
      />
    </div>
  );
}
