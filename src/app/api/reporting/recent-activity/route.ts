import { handleReportingRecentActivityGet } from "@/lib/bff/reportingHandlers";

export async function GET(request: Request) {
  return handleReportingRecentActivityGet(request);
}
