import { handleOrchestrationListGet } from "@/lib/bff/orchestrationHandlers";

export async function GET(request: Request) {
  return handleOrchestrationListGet(request);
}
