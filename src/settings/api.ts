import type { AdminAccount, SettingsSnapshot } from "@/data/settingsTypes";

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

export async function fetchSettingsSnapshot(): Promise<ApiResponse<SettingsSnapshot>> {
  const response = await fetch("/api/settings", { cache: "no-store" });
  return parseResponse<SettingsSnapshot>(response);
}

export async function fetchAdminAccount(): Promise<ApiResponse<AdminAccount>> {
  const response = await fetch("/api/auth/me", { cache: "no-store" });
  return parseResponse<AdminAccount>(response);
}
