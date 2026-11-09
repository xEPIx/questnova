import type { MetadataRoute } from "next";
import { games } from "@/lib/games";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://questnova.pages.dev";
  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/games`, lastModified: new Date() },
    ...games.map((g) => ({ url: `${base}/game/${g.slug}`, lastModified: new Date() })),
  ];
}
