import {
  handleProviderServiceCreatePost,
  handleProviderServicesListGet,
} from "@/lib/bff/providerHandlers";
import type { CreateProviderServiceInput } from "@/data/providerTypes";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return handleProviderServicesListGet(id);
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json()) as CreateProviderServiceInput;
  return handleProviderServiceCreatePost(id, body);
}
