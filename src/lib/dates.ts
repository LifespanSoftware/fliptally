/** UK tax year runs 6 April – 5 April. Returns the tax year containing `date`, e.g. 2026 for 2026/27. */
export function ukTaxYearStart(date: Date): number {
  const aprilSixth = new Date(date.getFullYear(), 3, 6);
  return date >= aprilSixth ? date.getFullYear() : date.getFullYear() - 1;
}

export function taxYearRange(startYear: number): { start: Date; end: Date } {
  return {
    start: new Date(startYear, 3, 6),
    end: new Date(startYear + 1, 3, 5, 23, 59, 59, 999),
  };
}

export function taxYearLabel(startYear: number): string {
  return `${startYear}/${String(startYear + 1).slice(2)}`;
}

export function calendarYearRange(year: number): { start: Date; end: Date } {
  return {
    start: new Date(year, 0, 1),
    end: new Date(year, 11, 31, 23, 59, 59, 999),
  };
}

export function formatGBP(value: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(d);
}

export function formatDateLong(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}
