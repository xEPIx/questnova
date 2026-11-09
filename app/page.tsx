import type { Metadata } from "next";
import Link from "next/link";
import { getFeaturedGames, getTrendingGames, games } from "@/lib/games";

export const metadata: Metadata = {
  title: "Home",
  description: "QuestNova gaming utility platform: codes, value lists, tools.",
};

export default function HomePage() {
  const featured = getFeaturedGames();
  const trending = getTrendingGames();
  return (
    <section>
      <h1 className="text-3xl font-bold mb-4">QuestNova</h1>
      <p className="mb-6">Automated gaming utility platform.</p>
      <Link href="/search" className="underline mb-6 inline-block">Search games</Link>
      <h2 className="text-xl font-semibold mb-2">Featured Games</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {featured.map((g) => (
          <li key={g.slug} className="border border-slate-800 rounded p-3">
            <Link href={`/game/${g.slug}`} className="font-bold text-blue-400">{g.name}</Link>
            <p className="text-sm text-slate-400">{g.description}</p>
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mb-2">Trending Games</h2>
      <ul className="flex flex-wrap gap-2 mb-8">
        {trending.map((g) => (
          <li key={g.slug}>
            <Link href={`/game/${g.slug}`} className="text-blue-400">{g.name}</Link>
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mb-2">All Games</h2>
      <ul className="space-y-1">
        {games.map((g) => (
          <li key={g.slug}>
            <Link href={`/game/${g.slug}`} className="text-blue-400">{g.name}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
