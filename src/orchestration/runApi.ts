import type { AdminOrchestrationRunDetail } from "@/data/orchestrationApiTypes";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
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
    return { success: false, error: extractErrorMessage(data.error) };
  }

  return { success: true, data: data.data };
}

export async function fetchOrchestrationRun(
  orchestrationRequestId: string,
): Promise<ApiResponse<AdminOrchestrationRunDetail>> {
  const response = await fetch(
    `/api/orchestrations/${encodeURIComponent(orchestrationRequestId)}`,
    { cache: "no-store" },
  );
  return parseResponse<AdminOrchestrationRunDetail>(response);
}
