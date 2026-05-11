export function formatPoints(points: number) {
  return new Intl.NumberFormat("en-SG").format(points);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    maximumFractionDigits: 0,
  }).format(amount);
}
