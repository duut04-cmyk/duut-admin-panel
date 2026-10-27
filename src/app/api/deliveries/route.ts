import { handleDeliveryListGet } from "@/lib/bff/deliveryHandlers";

export async function GET(request: Request) {
  return handleDeliveryListGet(request);
}
