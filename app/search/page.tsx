"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { searchGames } from "@/lib/games";

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const results = searchGames(q);
  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Search</h1>
      <form action="/search" method="get" className="mb-4">
        <input name="q" defaultValue={q} className="border border-slate-700 bg-slate-900 px-3 py-2 rounded" placeholder="Search games..." />
        <button type="submit" className="ml-2 px-3 py-2 bg-slate-700 rounded">Search</button>
      </form>
      <ul className="space-y-2">
        {results.map((g) => (
          <li key={g.slug}>
            <Link href={`/game/${g.slug}`} className="text-blue-400">{g.name}</Link>
            <p className="text-sm text-slate-400">{g.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
