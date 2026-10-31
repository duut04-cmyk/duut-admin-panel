/** Maps display IDs (PAY-abc12345) to backend search terms (UUID prefix). */
export function normalizePaymentSearchTerm(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  const payMatch = /^PAY[-]?([0-9a-f]+)$/i.exec(trimmed);
  if (payMatch?.[1]) {
    return payMatch[1].toLowerCase();
  }
  return trimmed;
}
