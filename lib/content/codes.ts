export type CodeEntry = { code: string; reward: string; status: "active" | "expired" };

export type GameCodes = {
  slug: string;
  title: string;
  entries: CodeEntry[];
  updatedAt: string;
};

export const codesData: GameCodes[] = [
  { slug: "blox-fruits", title: "Blox Fruits Codes", entries: [{ code: "EXAMPLE", reward: "2x Exp", status: "active" }], updatedAt: "2026-11-09" },
  { slug: "grow-a-garden", title: "Grow a Garden Codes", entries: [{ code: "GARDEN", reward: "Seeds", status: "active" }], updatedAt: "2026-11-09" },
];

export function getCodes(slug: string): GameCodes | undefined {
  return codesData.find((c) => c.slug === slug);
}
