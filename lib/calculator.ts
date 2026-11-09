export type CalcInputs = { base: number; multiplier: number; defense: number };

export function calculateDamage({ base, multiplier, defense }: CalcInputs): number {
  if (!Number.isFinite(base) || !Number.isFinite(multiplier) || !Number.isFinite(defense)) {
    throw new Error("invalid input");
  }
  if (base < 0 || multiplier < 0 || defense < 0) throw new Error("negative input");
  const raw = base * multiplier;
  const mitigated = raw * (1 - Math.min(defense, 100) / 100);
  return Math.max(0, Math.round(mitigated));
}
