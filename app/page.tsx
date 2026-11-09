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
      <div className="py-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">QuestNova</h1>
        <p className="text-muted text-lg mb-6">The modern gaming utility platform.</p>
        <Link href="/search" className="btn-primary">Search games</Link>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-10 text-center">
        <div className="card"><div className="text-2xl font-bold">{games.length}+</div><div className="text-muted text-sm">Games tracked</div></div>
        <div className="card"><div className="text-2xl font-bold">100+</div><div className="text-muted text-sm">Codes monitored</div></div>
        <div className="card"><div className="text-2xl font-bold">1000+</div><div className="text-muted text-sm">Pages indexed</div></div>
      </div>
      <h2 className="text-xl font-semibold mb-3">Featured Games</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {featured.map((g) => (
          <Link key={g.slug} href={`/game/${g.slug}`} className="card block">
            <div className="font-bold">{g.name}</div>
            <p className="text-sm text-muted">{g.description}</p>
          </Link>
        ))}
      </div>
      <h2 className="text-xl font-semibold mb-3">Trending</h2>
      <div className="flex flex-wrap gap-2 mb-10">
        {trending.map((g) => (
          <Link key={g.slug} href={`/game/${g.slug}`} className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10">{g.name}</Link>
        ))}
      </div>
    </section>
  );
}
