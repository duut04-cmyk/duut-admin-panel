import type {
  CreateProviderInput,
  ProviderDetail,
  ProviderSummary,
  UpdateProviderInput,
} from "@/data/providerTypes";

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

export async function fetchProviders(): Promise<ApiResponse<ProviderSummary[]>> {
  const response = await fetch("/api/providers", { cache: "no-store" });
  return parseResponse<ProviderSummary[]>(response);
}

export async function createProvider(
  input: CreateProviderInput,
): Promise<ApiResponse<ProviderDetail>> {
  const response = await fetch("/api/providers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseResponse<ProviderDetail>(response);
}

export async function updateProvider(
  id: string,
  input: UpdateProviderInput,
): Promise<ApiResponse<ProviderDetail>> {
  const response = await fetch(`/api/providers/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseResponse<ProviderDetail>(response);
}
