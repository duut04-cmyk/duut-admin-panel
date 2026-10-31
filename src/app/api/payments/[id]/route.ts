import { handlePaymentDetailGet } from "@/lib/bff/paymentsHandlers";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return handlePaymentDetailGet(id);
}
