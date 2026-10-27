import {
  handleProviderVehicleCreatePost,
  handleProviderVehiclesListGet,
} from "@/lib/bff/providerHandlers";
import type { CreateProviderVehicleInput } from "@/data/providerTypes";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return handleProviderVehiclesListGet(id);
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json()) as CreateProviderVehicleInput;
  return handleProviderVehicleCreatePost(id, body);
}
