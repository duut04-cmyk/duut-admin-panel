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
    <div className="flex items-baseline justify-between gap-3">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-right font-medium">{value}</dd>
    </div>
  );
}

function shortId(value: string): string {
  if (value.length <= 14) return value;
  return `${value.slice(0, 8)}…${value.slice(-4)}`;
}

export default function DeliveryPayment({ payment }: DeliveryPaymentProps) {
  const breakdown = payment.pricingBreakdown;

  return (
    <section aria-labelledby="delivery-payment-heading">
      <AdminSectionHeader title="Money" />

      <DeliveryDetailCard className="mt-3 space-y-4 p-4 text-small">
        <dl className="space-y-2">
          <Row
            label="Status"
            value={
              <AdminStatus
                variant={paymentStatusVariant(payment.status)}
                label={payment.status.replaceAll("_", " ")}
              />
            }
          />
          <Row
            label="Charged"
            value={
              <span className="tabular-nums">
                {money(payment.currency, payment.amount)}
              </span>
            }
          />
          <Row label="Gateway" value={payment.gateway} />
          {payment.paidAt ? (
            <Row label="Paid" value={formatTimestamp(payment.paidAt)} />
          ) : null}
          {payment.refundedAmount > 0 ? (
            <Row
              label="Refunded"
              value={
                <span className="tabular-nums">
                  {money(payment.currency, payment.refundedAmount)}
                </span>
              }
            />
          ) : null}
        </dl>

        <div className="border-t border-border/60 pt-3">
          <p className="mb-2 text-caption font-medium text-muted-foreground">
            Breakdown
          </p>
          <dl className="space-y-1.5">
            <Row
              label="Provider quote"
              value={
                <span className="tabular-nums">
                  {money(breakdown.currency, breakdown.providerQuoteAmount)}
                </span>
              }
            />
            <Row
              label={`Fee ${breakdown.platformFeePercent}%`}
              value={
                <span className="tabular-nums">
                  {money(breakdown.currency, breakdown.platformFeeAmount)}
                </span>
              }
            />
            <Row
              label={`GST ${breakdown.gstPercent}%`}
              value={
                <span className="tabular-nums">
                  {money(breakdown.currency, breakdown.gstAmount)}
                </span>
              }
            />
            <Row
              label="Payable"
              value={
                <span className="tabular-nums font-semibold text-foreground">
                  {money(breakdown.currency, breakdown.customerPayableAmount)}
                </span>
              }
            />
          </dl>
        </div>

        {payment.refunds.length > 0 ? (
          <div className="border-t border-border/60 pt-3">
            <p className="mb-2 text-caption font-medium text-muted-foreground">
              Refunds
            </p>
            <ul className="space-y-2">
              {payment.refunds.map((refund) => (
                <li
                  key={refund.id}
                  className="rounded-md border border-border/60 px-3 py-2"
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
                    </p>
                  ) : null}
                  {refund.gatewayRefundId ? (
                    <p
                      className="mt-0.5 font-mono text-caption text-muted-foreground"
                      title={refund.gatewayRefundId}
                    >
                      {shortId(refund.gatewayRefundId)}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </DeliveryDetailCard>
    </section>
  );
}
