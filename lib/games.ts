export type Game = {
  slug: string;
  name: string;
  description: string;
  featured?: boolean;
};

export const games: Game[] = [
  { slug: "blox-fruits", name: "Blox Fruits", description: "Codes, values and tools for Blox Fruits.", featured: true },
  { slug: "grow-a-garden", name: "Grow a Garden", description: "Codes and resources for Grow a Garden.", featured: true },
  { slug: "anime-vanguards", name: "Anime Vanguards", description: "Codes and guides for Anime Vanguards.", featured: true },
  { slug: "blue-lock-rivals", name: "Blue Lock Rivals", description: "Codes and tools for Blue Lock Rivals.", featured: true },
  { slug: "fisch", name: "Fisch", description: "Codes and value lists for Fisch.", featured: true },
  { slug: "roblox", name: "Roblox", description: "General Roblox codes and resources." },
];

export function getGame(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}
