"use client";

import Link from "next/link";
import type { PaymentDetail } from "@/data/financeTypes";
import AdminStatus from "@/ui/AdminStatus";

type PaymentDetailPanelProps = {
  detail: PaymentDetail | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
};

function money(currency: string, amount: string) {
  return `${currency} ${amount}`;
}

export default function PaymentDetailPanel({
  detail,
  loading,
  error,
  onClose,
}: PaymentDetailPanelProps) {
  if (!detail && !loading && !error) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="flex h-full w-full max-w-lg flex-col border-l border-border bg-background shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-lg font-semibold">Payment detail</h2>
          <button
            type="button"
            className="text-small text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <p className="text-small text-muted-foreground">Loading…</p>
          ) : null}
          {error ? <p className="text-small text-destructive">{error}</p> : null}
          {detail ? (
            <div className="space-y-6">
              <div>
                <p className="text-small text-muted-foreground">Status</p>
                <AdminStatus label={detail.status} variant="operational" />
                <p className="mt-2 text-2xl font-semibold tabular-nums">
                  {money(detail.currency, detail.amount)}
                </p>
                <p className="text-small text-muted-foreground">
                  Refunded {money(detail.currency, detail.refundedAmount)}
                  {!detail.refundedAmountMatchesSuccessfulRefunds ? (
                    <span className="text-amber-600">
                      {" "}
                      — mismatch vs SUCCESS refunds
                    </span>
                  ) : null}
                </p>
                <Link
                  href={`/deliveries/${detail.deliveryId}`}
                  className="mt-2 inline-block text-small text-primary hover:underline"
                >
                  Delivery {detail.deliveryReference}
                </Link>
              </div>

              {detail.pricingBreakdown ? (
                <section>
                  <h3 className="font-semibold">{detail.pricingBreakdown.label}</h3>
                  <dl className="mt-2 grid grid-cols-2 gap-2 text-small">
                    <dt className="text-muted-foreground">Customer payable</dt>
                    <dd>{detail.pricingBreakdown.customerPayableAmount}</dd>
                    <dt className="text-muted-foreground">Provider quote</dt>
                    <dd>{detail.pricingBreakdown.providerQuoteAmount}</dd>
                    <dt className="text-muted-foreground">Platform fee</dt>
                    <dd>{detail.pricingBreakdown.platformFeeAmount}</dd>
                    <dt className="text-muted-foreground">GST</dt>
                    <dd>{detail.pricingBreakdown.gstAmount}</dd>
                  </dl>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {detail.pricingBreakdown.revenueDisclaimer}
                  </p>
                </section>
              ) : null}

              {detail.providerQuoteBooked ? (
                <section>
                  <h3 className="font-semibold">{detail.providerQuoteBooked.label}</h3>
                  <dl className="mt-2 grid grid-cols-2 gap-2 text-small">
                    <dt className="text-muted-foreground">Quoted</dt>
                    <dd>
                      {detail.providerQuoteBooked.quotedAmount ?? "—"}{" "}
                      {detail.providerQuoteBooked.quotedCurrency ?? ""}
                    </dd>
                    <dt className="text-muted-foreground">Booked</dt>
                    <dd>
                      {detail.providerQuoteBooked.bookedAmount ?? "—"}{" "}
                      {detail.providerQuoteBooked.bookedCurrency ?? ""}
                    </dd>
                  </dl>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {detail.providerQuoteBooked.disclaimer}
                  </p>
                </section>
              ) : null}

              <section>
                <h3 className="font-semibold">Refunds</h3>
                {detail.refunds.length === 0 ? (
                  <p className="text-small text-muted-foreground">No refunds.</p>
                ) : (
                  <ul className="mt-2 space-y-2 text-small">
                    {detail.refunds.map((refund) => (
                      <li
                        key={refund.id}
                        className="rounded-lg border border-border p-2"
                      >
                        <span className="font-medium">{refund.status}</span> —{" "}
                        {money(refund.currency, refund.amount)}
                        {refund.processedAt ? (
                          <span className="block text-muted-foreground">
                            processed {refund.processedAt}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section>
                <h3 className="font-semibold">Ledger</h3>
                <ul className="mt-2 space-y-2 text-small">
                  {detail.ledgerEntries.map((entry) => (
                    <li key={entry.id} className="rounded-lg border border-border p-2">
                      {entry.type} {entry.direction}{" "}
                      {money(entry.currency, entry.amount)}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
