import { handleReportingRecentDeliveriesGet } from "@/lib/bff/reportingHandlers";

export async function GET(request: Request) {
  return handleReportingRecentDeliveriesGet(request);
}
