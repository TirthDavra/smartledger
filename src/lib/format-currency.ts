const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Full INR display, e.g. ₹1,23,456.78 */
export function formatInr(amount: number) {
  return inrFormatter.format(amount);
}

/** INR for charts/tooltips */
export function formatInrChart(value: number) {
  return inrFormatter.format(value);
}

/** Compact INR for dashboard stat cards, e.g. ₹52.4k / ₹1.2L */
export function formatInrCompact(amount: number) {
  if (amount >= 10_000_000) {
    return `₹${(amount / 10_000_000).toFixed(1)}Cr`;
  }
  if (amount >= 100_000) {
    return `₹${(amount / 100_000).toFixed(1)}L`;
  }
  if (amount >= 1_000) {
    return `₹${(amount / 1_000).toFixed(1)}k`;
  }
  return formatInr(amount);
}
