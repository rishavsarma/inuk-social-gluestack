export function formatCompactNumber(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(".0", "")}k`;
  }
  return String(value);
}
