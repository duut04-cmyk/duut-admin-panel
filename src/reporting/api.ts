import type {
  FeedbackReporting,
  OrchestrationReporting,
  RecentActivityItem,
  RecentDeliveryItem,
  ReportingSummary,
} from "@/data/reportingTypes";

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
};

function extractErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message?: unknown }).message ?? "Request failed.");
  }
  return "Request failed.";
}

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = (await response.json()) as ApiResponse<T> & {
    error?: string | { message?: string };
  };
  if (!response.ok || !data.success) {
    return {
      success: false,
      error: extractErrorMessage(data.error),
      status: response.status,
    };
  }
  return { success: true, data: data.data, status: response.status };
}

function buildQuery(params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

export async function fetchReportingSummary(input: {
  from: string;
  to: string;
}): Promise<ApiResponse<ReportingSummary>> {
  const response = await fetch(
    `/api/reporting/summary${buildQuery({ from: input.from, to: input.to })}`,
    { cache: "no-store" },
  );
  return parseResponse<ReportingSummary>(response);
}

export async function fetchOrchestrationReporting(input: {
  from: string;
  to: string;
}): Promise<ApiResponse<OrchestrationReporting>> {
  const response = await fetch(
    `/api/reporting/orchestration${buildQuery({ from: input.from, to: input.to })}`,
    { cache: "no-store" },
  );
  return parseResponse<OrchestrationReporting>(response);
}

export async function fetchRecentDeliveries(input: {
  from: string;
  to: string;
  limit?: number;
}): Promise<ApiResponse<{ items: RecentDeliveryItem[] }>> {
  const response = await fetch(
    `/api/reporting/recent-deliveries${buildQuery({
      from: input.from,
      to: input.to,
      limit: input.limit?.toString(),
    })}`,
    { cache: "no-store" },
  );
  return parseResponse<{ items: RecentDeliveryItem[] }>(response);
}

export async function fetchRecentActivity(input?: {
  limit?: number;
  hours?: number;
}): Promise<ApiResponse<{ hours: number; items: RecentActivityItem[] }>> {
  const response = await fetch(
    `/api/reporting/recent-activity${buildQuery({
      limit: input?.limit?.toString(),
      hours: input?.hours?.toString(),
    })}`,
    { cache: "no-store" },
  );
  return parseResponse<{ hours: number; items: RecentActivityItem[] }>(response);
}

export async function fetchFeedbackReporting(input: {
  from: string;
  to: string;
  recentLimit?: number;
}): Promise<ApiResponse<FeedbackReporting>> {
  const response = await fetch(
    `/api/reporting/feedback${buildQuery({
      from: input.from,
      to: input.to,
      recentLimit: input.recentLimit?.toString(),
    })}`,
    { cache: "no-store" },
  );
  return parseResponse<FeedbackReporting>(response);
}
