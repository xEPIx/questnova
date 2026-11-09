export type Guide = { slug: string; title: string; sections: { heading: string; body: string }[] };

export const guidesData: Guide[] = [
  { slug: "blox-fruits", title: "Blox Fruits Beginner Guide", sections: [{ heading: "Start", body: "Choose a fruit and level up." }] },
];

export function getGuide(slug: string): Guide | undefined {
  return guidesData.find((g) => g.slug === slug);
}
