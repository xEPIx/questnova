import Link from "next/link";
import { Game } from "@/lib/games";

export default function GameCard({ game }: { game: Game }) {
  return (
    <div className="border border-slate-800 rounded p-3">
      <Link href={`/game/${game.slug}`} className="font-bold text-blue-400">{game.name}</Link>
      <p className="text-sm text-slate-400">{game.description}</p>
    </div>
  );
}
