import { handleProviderCredentialsPut } from "@/lib/bff/providerHandlers";
import type { UpsertProviderCredentialsInput } from "@/data/providerTypes";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json()) as UpsertProviderCredentialsInput;
  return handleProviderCredentialsPut(id, body);
}
