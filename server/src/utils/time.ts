const UNIT_TO_MS: Record<string, number> = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

export function durationToMs(value: string, fallbackMs: number) {
  const match = value.match(/^(\d+)([smhd])$/);
  if (!match) return fallbackMs;
  const amount = Number(match[1]);
  const unit = match[2];
  return amount * (UNIT_TO_MS[unit] ?? fallbackMs);
}
