import type { DeliveryRequestStatus } from "@/data/orchestrationTypes";
import AdminStatus from "@/ui/AdminStatus";
import { deliveryStatusLabel, deliveryStatusVariant } from "./utils";

type DeliveryStatusProps = {
  status: DeliveryRequestStatus;
  className?: string;
};

export default function DeliveryStatus({
  status,
  className = "",
}: DeliveryStatusProps) {
  return (
    <AdminStatus
      variant={deliveryStatusVariant(status)}
      label={deliveryStatusLabel(status)}
      className={className}
    />
  );
}
