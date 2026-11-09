import { contentManifest, getContent } from "@/lib/content/manifest";

export type Game = {
  slug: string;
  name: string;
  description: string;
  featured?: boolean;
  trending?: boolean;
  tags?: string[];
};

export const games: Game[] = contentManifest.map((c) => ({
  slug: c.slug,
  name: c.name,
  description: c.description,
  featured: c.featured,
  trending: c.trending,
  tags: c.tags,
}));

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

export { getContent, getAvailablePages } from "@/lib/content/manifest";
