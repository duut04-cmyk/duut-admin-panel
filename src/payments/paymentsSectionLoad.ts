import type {
  FinanceReconciliation,
  FinanceSummary,
  FinanceTimeseries,
  PaymentListResponse,
  RefundListResponse,
} from "@/data/financeTypes";
import type { ApiResponse } from "./api";
import {
  fetchFinanceReconciliation,
  fetchFinanceTimeseries,
  fetchPaymentSummary,
  fetchPayments,
  fetchRefunds,
} from "./api";

export type SectionState<T> = {
  loading: boolean;
  error: string | null;
  data: T | null;
};

export type PaginatedSectionState<T> = SectionState<T> & {
  page: number;
  totalPages: number;
};

export function emptySection<T>(): SectionState<T> {
  return { loading: false, error: null, data: null };
}

export function emptyPaginatedSection<T>(): PaginatedSectionState<T> {
  return { loading: false, error: null, data: null, page: 1, totalPages: 0 };
}

export function clampPage(page: number, totalPages: number): number {
  if (totalPages <= 0) {
    return 1;
  }
  return Math.min(Math.max(1, page), totalPages);
}

export async function loadSummarySection(input: {
  from: string;
  to: string;
}): Promise<SectionState<FinanceSummary>> {
  const result = await fetchPaymentSummary(input);
  if (!result.success || !result.data) {
    return {
      loading: false,
      error: result.error ?? "Failed to load summary.",
      data: null,
    };
  }
  return { loading: false, error: null, data: result.data };
}

export async function loadTimeseriesSection(input: {
  from: string;
  to: string;
  granularity: "day" | "week" | "month";
}): Promise<SectionState<FinanceTimeseries>> {
  const result = await fetchFinanceTimeseries(input);
  if (!result.success) {
    return {
      loading: false,
      error: result.error ?? "Failed to load timeseries.",
      data: null,
    };
  }
  return { loading: false, error: null, data: result.data ?? null };
}

export async function loadPaymentsSection(input: {
  from: string;
  to: string;
  page: number;
  limit: number;
  search?: string;
}): Promise<PaginatedSectionState<PaymentListResponse>> {
  const result = await fetchPayments({
    page: input.page,
    limit: input.limit,
    search: input.search,
    paidFrom: input.from,
    paidTo: input.to,
  });
  if (!result.success || !result.data) {
    return {
      loading: false,
      error: result.error ?? "Failed to load payments.",
      data: null,
      page: input.page,
      totalPages: 0,
    };
  }
  const totalPages = result.data.totalPages;
  const page = clampPage(input.page, totalPages);
  if (page !== input.page && totalPages > 0) {
    return loadPaymentsSection({ ...input, page });
  }
  return {
    loading: false,
    error: null,
    data: result.data,
    page,
    totalPages,
  };
}

export async function loadRefundsSection(input: {
  from: string;
  to: string;
  page: number;
  limit: number;
}): Promise<PaginatedSectionState<RefundListResponse>> {
  const result = await fetchRefunds({
    page: input.page,
    limit: input.limit,
    activityFrom: input.from,
    activityTo: input.to,
  });
  if (!result.success || !result.data) {
    return {
      loading: false,
      error: result.error ?? "Failed to load refunds.",
      data: null,
      page: input.page,
      totalPages: 0,
    };
  }
  const totalPages = result.data.totalPages;
  const page = clampPage(input.page, totalPages);
  if (page !== input.page && totalPages > 0) {
    return loadRefundsSection({ ...input, page });
  }
  return {
    loading: false,
    error: null,
    data: result.data,
    page,
    totalPages,
  };
}

export async function loadReconciliationSection(input: {
  from: string;
  to: string;
  limit: number;
}): Promise<SectionState<FinanceReconciliation>> {
  const result = await fetchFinanceReconciliation(input);
  if (!result.success) {
    return {
      loading: false,
      error: result.error ?? "Failed to load reconciliation.",
      data: null,
    };
  }
  return { loading: false, error: null, data: result.data ?? null };
}

export function buildPaymentsListQuery(input: {
  from: string;
  to: string;
  page: number;
}): Record<string, string> {
  return {
    paidFrom: input.from,
    paidTo: input.to,
    page: String(input.page),
  };
}

export function buildRefundsListQuery(input: {
  from: string;
  to: string;
  page: number;
}): Record<string, string> {
  return {
    activityFrom: input.from,
    activityTo: input.to,
    page: String(input.page),
  };
}

export type { ApiResponse };
