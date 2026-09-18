import type { DeliveryRequestStatus } from "@/data/orchestrationTypes";
import { DeliveryStatusPill } from "./DeliveryStatusPill";

type DeliveryStatusProps = {
  status: DeliveryRequestStatus;
  className?: string;
};

export default function DeliveryStatus({
  status,
  className = "",
}: DeliveryStatusProps) {
  return <DeliveryStatusPill status={status} className={className} />;
}
