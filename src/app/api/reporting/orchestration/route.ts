import { handleReportingOrchestrationGet } from "@/lib/bff/reportingHandlers";

export async function GET(request: Request) {
  return handleReportingOrchestrationGet(request);
}
