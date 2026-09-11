import { Suspense } from "react";
import Deliveries from "@/deliveries";

export default function DeliveriesPage() {
  return (
    <Suspense fallback={null}>
      <Deliveries />
    </Suspense>
  );
}
