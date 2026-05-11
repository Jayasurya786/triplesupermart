export function formatCustomerId(sequence: number) {
  return `TNS${String(sequence).padStart(4, "0")}`;
}
