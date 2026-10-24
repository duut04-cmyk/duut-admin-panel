import { handleOrchestrationRunGet } from "@/lib/bff/orchestrationHandlers";

type RouteContext = {
  params: Promise<{ orchestrationRequestId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { orchestrationRequestId } = await context.params;
  return handleOrchestrationRunGet(orchestrationRequestId);
}
