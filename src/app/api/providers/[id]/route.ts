import {
  handleProviderDetailGet,
  handleProviderDetailPatch,
} from "@/lib/bff/providerHandlers";
import type { UpdateProviderInput } from "@/data/providerTypes";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return handleProviderDetailGet(id);
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json()) as UpdateProviderInput;
  return handleProviderDetailPatch(id, body);
}
