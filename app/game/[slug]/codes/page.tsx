import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGame, games, getAvailablePages } from "@/lib/games";
import { getCodes } from "@/lib/content/codes";
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedLinks from "@/components/RelatedLinks";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return games
    .filter((g) => getAvailablePages(g.slug).includes("codes"))
    .map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) return {};
  return { title: `${game.name} Codes (Updated Daily) | QuestNova`, description: `Latest ${game.name} codes.` };
}

export default async function CodesPage({ params }: Props) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();
  const data = getCodes(slug);
  const crumbs = [
    { name: "Home", url: "https://questnova.pages.dev/" },
    { name: game.name, url: `https://questnova.pages.dev/game/${game.slug}` },
    { name: "Codes", url: `https://questnova.pages.dev/game/${game.slug}/codes` },
  ];
  return (
    <article>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: game.name, href: `/game/${game.slug}` }, { name: "Codes", href: `/game/${game.slug}/codes` }]} />
      <h1 className="text-2xl font-bold mb-2">{game.name} Codes</h1>
      <ul>
        {data?.entries.map((e, i) => (
          <li key={i}>{e.code} - {e.reward} ({e.status})</li>
        )) ?? <li>No codes yet.</li>}
      </ul>
      <RelatedLinks slug={game.slug} />
    </article>
  );
}
