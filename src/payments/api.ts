import type {
  FinanceReconciliation,
  FinanceSummary,
  FinanceTimeseries,
  PaymentDetail,
  PaymentListResponse,
  RefundListResponse,
} from "@/data/financeTypes";

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

export async function fetchPaymentSummary(input: {
  from: string;
  to: string;
}): Promise<ApiResponse<FinanceSummary>> {
  const response = await fetch(
    `/api/payments/summary${buildQuery({ from: input.from, to: input.to })}`,
    { cache: "no-store" },
  );
  return parseResponse<FinanceSummary>(response);
}

export async function fetchPayments(input: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paidFrom?: string;
  paidTo?: string;
}): Promise<ApiResponse<PaymentListResponse>> {
  const response = await fetch(
    `/api/payments${buildQuery({
      page: input.page?.toString() ?? "1",
      limit: input.limit?.toString() ?? "10",
      search: input.search,
      status: input.status,
      paidFrom: input.paidFrom,
      paidTo: input.paidTo,
    })}`,
    { cache: "no-store" },
  );
  return parseResponse<PaymentListResponse>(response);
}

export async function fetchPaymentDetail(
  paymentId: string,
): Promise<ApiResponse<PaymentDetail>> {
  const response = await fetch(`/api/payments/${encodeURIComponent(paymentId)}`, {
    cache: "no-store",
  });
  return parseResponse<PaymentDetail>(response);
}

export async function fetchRefunds(input: {
  page?: number;
  limit?: number;
  status?: string;
  activityFrom?: string;
  activityTo?: string;
}): Promise<ApiResponse<RefundListResponse>> {
  const response = await fetch(
    `/api/refunds${buildQuery({
      page: input.page?.toString() ?? "1",
      limit: input.limit?.toString() ?? "10",
      status: input.status,
      activityFrom: input.activityFrom,
      activityTo: input.activityTo,
    })}`,
    { cache: "no-store" },
  );
  return parseResponse<RefundListResponse>(response);
}

export async function fetchFinanceTimeseries(input: {
  from: string;
  to: string;
  granularity?: "day" | "week" | "month";
}): Promise<ApiResponse<FinanceTimeseries>> {
  const response = await fetch(
    `/api/finance/timeseries${buildQuery({
      from: input.from,
      to: input.to,
      granularity: input.granularity ?? "day",
    })}`,
    { cache: "no-store" },
  );
  return parseResponse<FinanceTimeseries>(response);
}

export async function fetchFinanceReconciliation(input?: {
  from?: string;
  to?: string;
  limit?: number;
}): Promise<ApiResponse<FinanceReconciliation>> {
  const response = await fetch(
    `/api/finance/reconciliation${buildQuery({
      from: input?.from,
      to: input?.to,
      limit: input?.limit?.toString(),
    })}`,
    { cache: "no-store" },
  );
  return parseResponse<FinanceReconciliation>(response);
}
