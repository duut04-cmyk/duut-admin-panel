import { handleProviderStatusPatch } from "@/lib/bff/providerHandlers";
import type { UpdateProviderStatusInput } from "@/data/providerTypes";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json()) as UpdateProviderStatusInput;
  return handleProviderStatusPatch(id, body);
}
