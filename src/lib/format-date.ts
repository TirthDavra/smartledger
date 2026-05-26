/** Display date, e.g. Jan 15, 2026 */
export function formatDisplayDate(value: Date | string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Short date for lists, e.g. Jan 15 */
export function formatShortDate(value: Date | string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

/** Month label for charts, e.g. Jan */
export function formatMonthLabel(date: Date) {
  return date.toLocaleString("en-IN", { month: "short" });
}

/** ISO date string (YYYY-MM-DD) for date inputs */
export function formatDateForInput(value: Date | string) {
  return new Date(value).toISOString().split("T")[0];
}
