export type ReportingSummary = {
  window: {
    from: string;
    toExclusive: string;
    timeZone: "Asia/Kolkata";
  };
  deliveriesCreated: {
    total: number;
    deliveredCurrentStatus: number;
    deliveredLabel: string;
    inProgress: number;
    cancelled: number;
    failed: number;
  };
  booking: {
    deliveriesWithBookingAttempt: number;
    deliveriesWithConfirmedBooking: number;
    successRatePercent: number | null;
    successRateLabel: string;
  };
  orchestrationRuns: {
    totalRuns: number;
    completedRuns: number;
    failedRuns: number;
    failureRatePercent: number | null;
    averageDurationMs: number | null;
    durationSampleSize: number;
  };
  funnel: {
    deliveriesCreated: number;
    withEligibleEvaluation: number;
    withQuote: number;
    withConfirmedBooking: number;
    currentlyDelivered: number;
    attemptSelectionRule: string;
  };
  packageTypeDistribution: Array<{
    packageType: string;
    count: number;
    percent: number;
  }>;
  trends: Record<
    string,
    { current: number; previous: number; changePercent: number | null }
  >;
};

export type OrchestrationReporting = {
  runsByStatus: Record<string, number>;
  failureReasons: Array<{ reason: string; count: number }>;
  serviceScorecard: Array<{
    providerServiceCode: string;
    evaluatedCount: number;
    eligibleCount: number;
    selectedCount: number;
    bookingAttemptCount: number;
    confirmedBookingCount: number;
    bookingSuccessRatePercent: number | null;
    averageProviderQuoteAmountInr: number | null;
    providerQuoteLabel: string;
    bookingSuccessRateLabel: string;
  }>;
};

export type RecentDeliveryItem = {
  deliveryId: string;
  reference: string;
  status: string;
  packageType: string | null;
  createdAt: string;
  routeLabel: string | null;
};

export type RecentActivityItem = {
  eventId: string;
  deliveryId: string;
  deliveryReference: string;
  summary: string;
  occurredAt: string;
  toStatus: string;
};

export type FeedbackReporting = {
  feedbackCount: number;
  averageDriverRating: number | null;
  averageDeliveryRating: number | null;
  topIssueTags: Array<{ tag: string; count: number }>;
  topPositiveTags: Array<{ tag: string; count: number }>;
  recentSnippets: Array<{
    deliveryId: string;
    deliveryReference: string;
    submittedAt: string;
    driverRating: number;
    deliveryRating: number;
    issueTagCount: number;
    positiveTagCount: number;
  }>;
};
