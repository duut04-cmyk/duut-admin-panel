import { handleFinanceReconciliationGet } from "@/lib/bff/paymentsHandlers";

export async function GET(request: Request) {
  return handleFinanceReconciliationGet(request);
}
