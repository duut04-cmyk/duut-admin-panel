import { handleProviderCapabilitiesPut } from "@/lib/bff/providerHandlers";
import type { ReplaceProviderCapabilitiesBody } from "@/providers/providerCapabilities";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json()) as ReplaceProviderCapabilitiesBody;
  return handleProviderCapabilitiesPut(id, body);
}
