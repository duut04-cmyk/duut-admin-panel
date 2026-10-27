import type {
  AdminAccount,
  PatchRuntimePoliciesRequestBody,
  PatchRuntimePoliciesResult,
  SettingsSnapshot,
} from "@/data/settingsTypes";

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

export async function fetchSettingsSnapshot(): Promise<ApiResponse<SettingsSnapshot>> {
  const response = await fetch("/api/settings", { cache: "no-store" });
  return parseResponse<SettingsSnapshot>(response);
}

export async function fetchAdminAccount(): Promise<ApiResponse<AdminAccount>> {
  const response = await fetch("/api/auth/me", { cache: "no-store" });
  return parseResponse<AdminAccount>(response);
}

export async function patchRuntimePolicies(
  body: PatchRuntimePoliciesRequestBody,
): Promise<ApiResponse<PatchRuntimePoliciesResult>> {
  const response = await fetch("/api/settings/policies", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  return parseResponse<PatchRuntimePoliciesResult>(response);
}

/** @deprecated Use patchRuntimePolicies */
export const patchBookingPolicies = patchRuntimePolicies;
