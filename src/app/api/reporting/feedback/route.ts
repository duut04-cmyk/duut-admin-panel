import { handleReportingFeedbackGet } from "@/lib/bff/reportingHandlers";

export async function GET(request: Request) {
  return handleReportingFeedbackGet(request);
}
