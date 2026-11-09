import Link from "next/link";
import { Game, games } from "@/lib/games";

export default function RelatedGames({ current }: { current: Game }) {
  const related = games
    .filter((g) => g.slug !== current.slug)
    .filter((g) => (g.tags ?? []).some((t) => (current.tags ?? []).includes(t)))
    .slice(0, 4);
  if (related.length === 0) return null;
  return (
    <section className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Related Games</h2>
      <ul className="flex flex-wrap gap-2">
        {related.map((g) => (
          <li key={g.slug}>
            <Link href={`/game/${g.slug}`} className="text-blue-400 underline">{g.name}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
