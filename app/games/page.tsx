import type { Metadata } from "next";
import Link from "next/link";
import { games } from "@/lib/games";

export const metadata: Metadata = { title: "Games", description: "Games directory." };

export default function GamesPage() {
  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Games Directory</h1>
      <ul className="space-y-2">
        {games.map((g) => (
          <li key={g.slug}>
            <Link href={`/game/${g.slug}`} className="text-blue-400">{g.name}</Link>
            <p className="text-sm text-slate-400">{g.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
