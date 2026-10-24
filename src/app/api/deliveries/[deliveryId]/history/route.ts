import { handleDeliveryHistoryGet } from "@/lib/bff/deliveryHandlers";

type RouteContext = {
  params: Promise<{ deliveryId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { deliveryId } = await context.params;
  return handleDeliveryHistoryGet(deliveryId);
}
