import type { DeliveryHistoryDetail } from "@/data/deliveryApiTypes";

export type HistoryFetchApiResult = {
  success: boolean;
  data?: DeliveryHistoryDetail;
  error?: string;
};

export type AppliedHistoryLoad = {
  history: DeliveryHistoryDetail | null;
  historyError: string | null;
};

export const DEFAULT_HISTORY_ERROR =
  "Delivery history could not be loaded. Sidebar and timeline may be unavailable.";

export function applyDeliveryHistoryFetch(
  result: HistoryFetchApiResult,
): AppliedHistoryLoad {
  if (result.success && result.data) {
    return { history: result.data, historyError: null };
  }

  if (result.success && !result.data) {
    return {
      history: null,
      historyError: DEFAULT_HISTORY_ERROR,
    };
  }

  return {
    history: null,
    historyError: result.error ?? DEFAULT_HISTORY_ERROR,
  };
}
