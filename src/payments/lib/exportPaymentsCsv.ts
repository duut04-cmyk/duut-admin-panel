import type { PaymentListItem } from "@/data/financeTypes";

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function paymentsToCsv(items: PaymentListItem[]): string {
  const header = [
    "Payment ID",
    "Order ID",
    "Customer",
    "Amount",
    "Currency",
    "Status",
    "Paid At",
    "Gateway",
    "Gateway Order ID",
  ];
  const rows = items.map((item) =>
    [
      item.id,
      item.deliveryReference,
      item.customerName ?? "",
      item.amount,
      item.currency,
      item.status,
      item.paidAt ?? "",
      item.gateway,
      item.gatewayOrderId ?? "",
    ]
      .map(csvEscape)
      .join(","),
  );
  return [header.join(","), ...rows].join("\n");
}

export function downloadPaymentsCsv(items: PaymentListItem[], filename: string): void {
  const blob = new Blob([paymentsToCsv(items)], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
