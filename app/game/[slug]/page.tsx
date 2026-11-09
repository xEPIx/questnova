import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGame, games } from "@/lib/games";
import { getCodes } from "@/lib/content/codes";
import { JsonLd, gameJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedLinks from "@/components/RelatedLinks";
import FAQ from "@/components/FAQ";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) return {};
  return {
    title: `${game.name} | QuestNova`,
    description: game.description,
    alternates: { canonical: `/game/${game.slug}` },
    openGraph: { title: game.name, description: game.description },
  };
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();
  const crumbs = [
    { name: "Home", url: "https://questnova.pages.dev/" },
    { name: game.name, url: `https://questnova.pages.dev/game/${game.slug}` },
  ];
  const faqItems = [{ q: `What is ${game.name}?`, a: game.description }];
  return (
    <article>
      <JsonLd data={gameJsonLd(game)} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqJsonLd(faqItems)} />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: game.name, href: `/game/${game.slug}` }]} />
      <h1 className="text-2xl font-bold mb-2">{game.name}</h1>
      <p>{game.description}</p>
      <FAQ items={faqItems} />
      <RelatedLinks slug={game.slug} />
    </article>
  );
}
