export type Game = {
  slug: string;
  name: string;
  description: string;
  featured?: boolean;
  trending?: boolean;
  tags?: string[];
};

export const games: Game[] = [
  { slug: "blox-fruits", name: "Blox Fruits", description: "Codes, values and tools for Blox Fruits.", featured: true, trending: true, tags: ["roblox", "codes", "values"] },
  { slug: "grow-a-garden", name: "Grow a Garden", description: "Codes and resources for Grow a Garden.", featured: true, trending: true, tags: ["roblox", "codes"] },
  { slug: "anime-vanguards", name: "Anime Vanguards", description: "Codes and guides for Anime Vanguards.", featured: true, tags: ["roblox", "codes"] },
  { slug: "blue-lock-rivals", name: "Blue Lock Rivals", description: "Codes and tools for Blue Lock Rivals.", featured: true, tags: ["roblox", "codes"] },
  { slug: "fisch", name: "Fisch", description: "Codes and value lists for Fisch.", featured: true, trending: true, tags: ["roblox", "values"] },
  { slug: "roblox", name: "Roblox", description: "General Roblox codes and resources.", tags: ["roblox"] },
];

export function getGame(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}

export function getFeaturedGames(): Game[] {
  return games.filter((g) => g.featured);
}

export function getTrendingGames(): Game[] {
  return games.filter((g) => g.trending);
}

export function searchGames(query: string): Game[] {
  const q = query.toLowerCase().trim();
  if (!q) return games;
  return games.filter((g) =>
    g.name.toLowerCase().includes(q) ||
    g.description.toLowerCase().includes(q) ||
    (g.tags ?? []).some((t) => t.includes(q))
  );
}
