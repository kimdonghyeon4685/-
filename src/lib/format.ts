export function formatCurrency(value: number): string {
  return `${new Intl.NumberFormat("ko-KR").format(value)}원`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ko-KR").format(value);
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(new Date(value));
}

export function uniqueStrings(values: string[]): string[] {
  return [...new Set(values)];
}

export function clampInteger(
  rawValue: string | null,
  fallback: number,
  min: number,
  max: number,
): number {
  const parsed = Number.parseInt(rawValue ?? "", 10);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(Math.max(parsed, min), max);
}
