export function percentOf(value: number, percent: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(percent)) throw new Error("invalid input");
  if (value < 0 || percent < 0) throw new Error("negative input");
  return Math.round((value * percent) / 100);
}
