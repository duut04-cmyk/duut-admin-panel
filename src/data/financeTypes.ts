export type FinanceWindow = {
  from: string;
  toExclusive: string;
  timeZone: "Asia/Kolkata";
};

export type FinanceAmountCount = {
  count: number;
  totalAmount: string;
  currency: "INR";
};

export type FinanceSummary = {
  window: FinanceWindow;
  collections: FinanceAmountCount;
  successfulRefunds: FinanceAmountCount;
  pendingRefunds: FinanceAmountCount;
  failedRefunds: FinanceAmountCount;
  netActivityInPeriod: {
    amount: string;
    currency: "INR";
    formula: string;
  };
  lifetime: {
    totalCollected: string;
    totalSuccessfulRefunds: string;
    net: string;
    currency: "INR";
    formula: string;
  };
};

export type PaymentListItem = {
  id: string;
  deliveryId: string;
  deliveryReference: string;
  status: string;
  amount: string;
  currency: "INR";
  refundedAmount: string;
  gateway: string;
  gatewayOrderId: string | null;
  paidAt: string | null;
  createdAt: string;
};

export type PaymentListResponse = {
  items: PaymentListItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PricingBreakdown = {
  label: "Pricing Breakdown";
  providerQuoteAmount: string;
  platformFeePercent: number;
  platformFeeAmount: string;
  subtotal: string;
  gstPercent: number;
  gstAmount: string;
  customerPayableAmount: string;
  currency: string;
  orchestrationRequestId: string | null;
  orchestrationOptionId: string | null;
  snapshotMetadata: Record<string, unknown> | null;
  revenueDisclaimer: string;
};

export type ProviderQuoteBooked = {
  label: string;
  quotedAmount: string | null;
  quotedCurrency: string | null;
  bookedAmount: string | null;
  bookedCurrency: string | null;
  bookingStatus: string | null;
  providerCode: string | null;
  disclaimer: string;
};

export type PaymentDetail = {
  id: string;
  deliveryId: string;
  deliveryReference: string;
  status: string;
  amount: string;
  currency: "INR";
  refundedAmount: string;
  successfulRefundTotal: string;
  refundedAmountMatchesSuccessfulRefunds: boolean;
  gateway: string;
  gatewayOrderId: string | null;
  gatewayPaymentSessionId: string | null;
  paidAt: string | null;
  failedAt: string | null;
  expiredAt: string | null;
  createdAt: string;
  updatedAt: string;
  pricingBreakdown: PricingBreakdown | null;
  providerQuoteBooked: ProviderQuoteBooked | null;
  attempts: Array<{
    id: string;
    attemptNumber: number;
    status: string;
    amount: string;
    currency: string;
    gatewayPaymentId: string | null;
    paymentMethod: string | null;
    startedAt: string | null;
    completedAt: string | null;
  }>;
  refunds: RefundListItem[];
  ledgerEntries: Array<{
    id: string;
    type: string;
    direction: string;
    amount: string;
    currency: string;
    refundId: string | null;
    idempotencyKey: string;
    description: string | null;
    createdAt: string;
  }>;
};

export type RefundListItem = {
  id: string;
  paymentId: string;
  deliveryId: string;
  deliveryReference: string;
  amount: string;
  currency: "INR";
  status: string;
  reasonCode: string | null;
  gatewayRefundId: string | null;
  requestedAt: string;
  processedAt: string | null;
};

export type RefundListResponse = {
  items: RefundListItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type FinanceTimeseriesPoint = {
  bucketStart: string;
  bucketLabel: string;
  collections: string;
  successfulRefunds: string;
  net: string;
};

export type FinanceTimeseries = {
  window: FinanceWindow;
  granularity: "day" | "week" | "month";
  currency: "INR";
  points: FinanceTimeseriesPoint[];
};

export type ReconciliationIssue = {
  severity: "error" | "warning";
  type: string;
  paymentId: string | null;
  refundId: string | null;
  ledgerEntryId: string | null;
  deliveryId: string | null;
  expectedAmount: string | null;
  actualAmount: string | null;
  explanation: string;
};

export type FinanceReconciliation = {
  window: FinanceWindow | null;
  scannedPayments: number;
  scannedRefunds: number;
  scannedLedgerEntries: number;
  issueCount: number;
  truncated: boolean;
  issues: ReconciliationIssue[];
  disclaimer: string;
};
