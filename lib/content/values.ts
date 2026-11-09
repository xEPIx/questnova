export type ValueEntry = { item: string; value: number; trend: "up" | "down" | "stable" };

export type GameValues = { slug: string; title: string; entries: ValueEntry[] };

export const valuesData: GameValues[] = [
  { slug: "fisch", title: "Fisch Value List", entries: [{ item: "Rod", value: 100, trend: "stable" }] },
];

export function getValues(slug: string): GameValues | undefined {
  return valuesData.find((v) => v.slug === slug);
}
