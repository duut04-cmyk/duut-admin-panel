import { handlePaymentsSummaryGet } from "@/lib/bff/paymentsHandlers";

export async function GET(request: Request) {
  return handlePaymentsSummaryGet(request);
}
