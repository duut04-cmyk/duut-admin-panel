import { handleProviderVehicleUpdatePatch } from "@/lib/bff/providerHandlers";
import type { UpdateProviderVehicleInput } from "@/data/providerTypes";

type RouteContext = {
  params: Promise<{ id: string; vehicleId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { id, vehicleId } = await context.params;
  const body = (await request.json()) as UpdateProviderVehicleInput;
  return handleProviderVehicleUpdatePatch(id, vehicleId, body);
}
