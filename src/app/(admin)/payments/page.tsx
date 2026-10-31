import { Suspense } from "react";
import PaymentsPage from "@/payments";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PaymentsPage />
    </Suspense>
  );
}
