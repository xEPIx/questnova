import type { MetadataRoute } from "next";
import { games, getAvailablePages } from "@/lib/games";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://questnova.pages.dev";
  const urls: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date() },
    { url: `${base}/games`, lastModified: new Date() },
    { url: `${base}/search`, lastModified: new Date() },
    { url: `${base}/calculator`, lastModified: new Date() },
  ];
  for (const g of games) {
    urls.push({ url: `${base}/game/${g.slug}`, lastModified: new Date() });
    for (const p of getAvailablePages(g.slug)) {
      urls.push({ url: `${base}/game/${g.slug}/${p}`, lastModified: new Date() });
    }
  }
  return urls;
}
