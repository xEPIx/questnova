import { GameContent, ContentPage } from "./schema";

export const contentManifest: GameContent[] = [
  { slug: "blox-fruits", name: "Blox Fruits", description: "Codes, values and tools for Blox Fruits.", source: "https://www.roblox.com", lastVerified: "2026-11-09", pages: ["codes", "guide"], featured: true, trending: true, tags: ["roblox", "codes", "values"] },
  { slug: "grow-a-garden", name: "Grow a Garden", description: "Codes and resources for Grow a Garden.", source: "https://www.roblox.com", lastVerified: "2026-11-09", pages: ["codes"], featured: true, trending: true, tags: ["roblox", "codes"] },
  { slug: "anime-vanguards", name: "Anime Vanguards", description: "Codes and guides for Anime Vanguards.", source: "https://www.roblox.com", lastVerified: "2026-11-09", pages: [], featured: true, tags: ["roblox", "codes"] },
  { slug: "blue-lock-rivals", name: "Blue Lock Rivals", description: "Codes and tools for Blue Lock Rivals.", source: "https://www.roblox.com", lastVerified: "2026-11-09", pages: [], featured: true, tags: ["roblox", "codes"] },
  { slug: "fisch", name: "Fisch", description: "Codes and value lists for Fisch.", source: "https://www.roblox.com", lastVerified: "2026-11-09", pages: ["values"], featured: true, trending: true, tags: ["roblox", "values"] },
  { slug: "roblox", name: "Roblox", description: "General Roblox codes and resources.", source: "https://www.roblox.com", lastVerified: "2026-11-09", pages: [], tags: ["roblox"] },
];

export function getContent(slug: string): GameContent | undefined {
  return contentManifest.find((c) => c.slug === slug);
}

export function getAvailablePages(slug: string): ContentPage[] {
  return getContent(slug)?.pages ?? [];
}
