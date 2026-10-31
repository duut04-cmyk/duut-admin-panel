import { handleFinanceTimeseriesGet } from "@/lib/bff/paymentsHandlers";

export async function GET(request: Request) {
  return handleFinanceTimeseriesGet(request);
}
