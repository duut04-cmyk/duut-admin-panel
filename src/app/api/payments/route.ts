import { handlePaymentsListGet } from "@/lib/bff/paymentsHandlers";

export async function GET(request: Request) {
  return handlePaymentsListGet(request);
}
