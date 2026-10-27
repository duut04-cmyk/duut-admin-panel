import { handleReportingSummaryGet } from "@/lib/bff/reportingHandlers";

export async function GET(request: Request) {
  return handleReportingSummaryGet(request);
}
