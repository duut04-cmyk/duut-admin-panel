import { handleRefundsListGet } from "@/lib/bff/paymentsHandlers";

export async function GET(request: Request) {
  return handleRefundsListGet(request);
}
