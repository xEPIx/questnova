import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGame, games, getAvailablePages } from "@/lib/games";
import { getValues } from "@/lib/content/values";
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedLinks from "@/components/RelatedLinks";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game || !getAvailablePages(slug).includes("values")) return {};
  return { title: `${game.name} Value List | QuestNova`, description: `${game.name} value list.` };
}

export default async function ValuesPage({ params }: Props) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game || !getAvailablePages(slug).includes("values")) notFound();
  const data = getValues(slug);
  const crumbs = [
    { name: "Home", url: "https://questnova.pages.dev/" },
    { name: game.name, url: `https://questnova.pages.dev/game/${game.slug}` },
    { name: "Values", url: `https://questnova.pages.dev/game/${game.slug}/values` },
  ];
  return (
    <article>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: game.name, href: `/game/${game.slug}` }, { name: "Values", href: `/game/${game.slug}/values` }]} />
      <h1 className="text-2xl font-bold mb-2">{data?.title ?? `${game.name} Value List`}</h1>
      <ul>
        {data?.entries.map((e, i) => (
          <li key={i}>{e.item}: {e.value} ({e.trend})</li>
        )) ?? <li>No values yet.</li>}
      </ul>
      <RelatedLinks slug={game.slug} />
    </article>
  );
}
