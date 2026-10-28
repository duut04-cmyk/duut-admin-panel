import type { ReactNode } from "react";
import type { DeliveryHistoryDetail } from "@/data/deliveryApiTypes";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import AdminStatus from "@/ui/AdminStatus";
import DeliveryDetailCard from "./DeliveryDetailCard";
import { formatTimestamp } from "./utils";

type DeliveryPaymentProps = {
  payment: NonNullable<DeliveryHistoryDetail["payment"]>;
};

function money(currency: string, amount: number) {
  return `${currency} ${amount.toFixed(2)}`;
}

function paymentStatusVariant(
  status: string,
): "success" | "warning" | "pending" | "operational" {
  switch (status) {
    case "PAID":
    case "PARTIALLY_REFUNDED":
    case "REFUNDED":
      return "success";
    case "FAILED":
    case "EXPIRED":
      return "warning";
    case "PENDING":
    case "CREATED":
      return "pending";
    default:
      return "operational";
  }
}

function refundStatusVariant(
  status: string,
): "success" | "warning" | "pending" | "failed" {
  switch (status) {
    case "SUCCESS":
      return "success";
    case "FAILED":
      return "failed";
    case "REQUESTED":
    case "PENDING":
      return "pending";
    default:
      return "pending";
  }
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 xl:flex-row xl:gap-3">
      <dt className="shrink-0 text-muted-foreground xl:w-36">{label}</dt>
      <dd className="min-w-0 font-medium">{value}</dd>
    </div>
  );
}

export default function DeliveryPayment({ payment }: DeliveryPaymentProps) {
  const breakdown = payment.pricingBreakdown;

  return (
    <section aria-labelledby="delivery-payment-heading">
      <AdminSectionHeader
        title="Payment & refunds"
        description="Customer charge via payment gateway, pricing breakdown, and refund records."
      />

      <DeliveryDetailCard className="mt-4 space-y-6 p-4 md:p-5 text-small">
        <dl className="space-y-2.5">
          <Row
            label="Payment status"
            value={
              <AdminStatus
                variant={paymentStatusVariant(payment.status)}
                label={payment.status.replaceAll("_", " ")}
              />
            }
          />
          <Row
            label="Amount charged"
            value={
              <span className="tabular-nums">
                {money(payment.currency, payment.amount)}
              </span>
            }
          />
          <Row label="Gateway" value={payment.gateway} />
          {payment.gatewayOrderId ? (
            <Row
              label="Gateway order ID"
              value={
                <span className="break-all font-mono text-caption">
                  {payment.gatewayOrderId}
                </span>
              }
            />
          ) : null}
          {payment.gatewayPaymentId ? (
            <Row
              label="Gateway payment ID"
              value={
                <span className="break-all font-mono text-caption">
                  {payment.gatewayPaymentId}
                </span>
              }
            />
          ) : null}
          {payment.paidAt ? (
            <Row label="Paid at" value={formatTimestamp(payment.paidAt)} />
          ) : null}
          {payment.refundedAmount > 0 ? (
            <Row
              label="Refunded total"
              value={
                <span className="tabular-nums">
                  {money(payment.currency, payment.refundedAmount)}
                </span>
              }
            />
          ) : null}
          <Row
            label="Payment record ID"
            value={
              <span className="break-all font-mono text-caption">{payment.id}</span>
            }
          />
        </dl>

        <div className="border-t border-border/60 pt-4">
          <h3 className="text-caption font-semibold text-muted-foreground">
            Customer pricing breakdown
          </h3>
          <p className="mt-1 text-caption text-muted-foreground">
            Frozen at payment creation from the selected orchestration quote.
          </p>
          <dl className="mt-3 space-y-2">
            <Row
              label="Provider quote"
              value={
                <span className="tabular-nums">
                  {money(breakdown.currency, breakdown.providerQuoteAmount)}
                </span>
              }
            />
            <Row
              label="Platform fee"
              value={
                <span className="tabular-nums">
                  {breakdown.platformFeePercent}% ·{" "}
                  {money(breakdown.currency, breakdown.platformFeeAmount)}
                </span>
              }
            />
            <Row
              label="Subtotal"
              value={
                <span className="tabular-nums">
                  {money(breakdown.currency, breakdown.subtotal)}
                </span>
              }
            />
            <Row
              label="GST"
              value={
                <span className="tabular-nums">
                  {breakdown.gstPercent}% ·{" "}
                  {money(breakdown.currency, breakdown.gstAmount)}
                </span>
              }
            />
            <Row
              label="Customer payable"
              value={
                <span className="tabular-nums text-foreground">
                  {money(breakdown.currency, breakdown.customerPayableAmount)}
                </span>
              }
            />
          </dl>
        </div>

        {payment.refunds.length > 0 ? (
          <div className="border-t border-border/60 pt-4">
            <h3 className="text-caption font-semibold text-muted-foreground">
              Refunds
            </h3>
            <ul className="mt-3 space-y-3">
              {payment.refunds.map((refund) => (
                <li
                  key={refund.id}
                  className="rounded-md border border-border/60 px-3 py-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="tabular-nums font-medium">
                      {money(refund.currency, refund.amount)}
                    </span>
                    <AdminStatus
                      variant={refundStatusVariant(refund.status)}
                      label={refund.status}
                    />
                  </div>
                  {refund.reasonCode ? (
                    <p className="mt-1 text-caption text-muted-foreground">
                      {refund.reasonCode}
                      {refund.reason ? ` — ${refund.reason}` : ""}
                    </p>
                  ) : null}
                  {refund.gatewayRefundId ? (
                    <p className="mt-1 break-all font-mono text-caption text-muted-foreground">
                      Refund ID: {refund.gatewayRefundId}
                    </p>
                  ) : null}
                  <p className="mt-1 text-caption text-muted-foreground">
                    Requested {formatTimestamp(refund.requestedAt)}
                    {refund.processedAt
                      ? ` · Processed ${formatTimestamp(refund.processedAt)}`
                      : ""}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {payment.attempts.length > 1 ? (
          <div className="border-t border-border/60 pt-4">
            <h3 className="text-caption font-semibold text-muted-foreground">
              Payment attempts
            </h3>
            <ul className="mt-3 space-y-2 text-caption">
              {payment.attempts.map((attempt) => (
                <li key={attempt.id} className="text-muted-foreground">
                  #{attempt.attemptNumber} {attempt.status}
                  {attempt.gatewayPaymentId ? ` · ${attempt.gatewayPaymentId}` : ""}
                  {attempt.paymentMethod ? ` · ${attempt.paymentMethod}` : ""}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </DeliveryDetailCard>
    </section>
  );
}
