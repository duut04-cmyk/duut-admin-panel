import type {
  CustomerDetail,
  ListCustomersParams,
  PaginatedCustomers,
  UpdateCustomerInput,
} from "@/data/customerTypes";

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

function buildQuery(params: ListCustomersParams): string {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search?.trim()) searchParams.set("search", params.search.trim());
  if (params.status) searchParams.set("status", params.status);
  if (params.emailVerified !== undefined) {
    searchParams.set("emailVerified", String(params.emailVerified));
  }
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function fetchCustomers(
  params: ListCustomersParams = {},
): Promise<ApiResponse<PaginatedCustomers>> {
  const response = await fetch(`/api/customers${buildQuery(params)}`, {
    cache: "no-store",
  });
  return parseResponse<PaginatedCustomers>(response);
}

export async function fetchCustomer(id: string): Promise<ApiResponse<CustomerDetail>> {
  const response = await fetch(`/api/customers/${id}`, { cache: "no-store" });
  return parseResponse<CustomerDetail>(response);
}

export async function updateCustomer(
  id: string,
  input: UpdateCustomerInput,
): Promise<ApiResponse<CustomerDetail>> {
  const response = await fetch(`/api/customers/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseResponse<CustomerDetail>(response);
}
