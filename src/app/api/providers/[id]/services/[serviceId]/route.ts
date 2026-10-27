import { handleProviderServiceUpdatePatch } from "@/lib/bff/providerHandlers";
import type { UpdateProviderServiceInput } from "@/data/providerTypes";

type RouteContext = {
  params: Promise<{ id: string; serviceId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { id, serviceId } = await context.params;
  const body = (await request.json()) as UpdateProviderServiceInput;
  return handleProviderServiceUpdatePatch(id, serviceId, body);
}
