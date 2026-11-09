import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGame, games } from "@/lib/games";
import { getCodes } from "@/lib/content/codes";
import { JsonLd, gameJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedLinks from "@/components/RelatedLinks";
import RelatedGames from "@/components/RelatedGames";
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
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-primary/30 to-accent/30 p-6">
        <h1 className="text-3xl font-bold mb-2">{game.name}</h1>
        <p className="text-muted">{game.description}</p>
      </div>
      <div className="flex gap-2 mb-6">
        <Link href={`/game/${game.slug}/codes`} className="btn-primary">Codes</Link>
        <Link href={`/game/${game.slug}/guide`} className="btn">Guide</Link>
        <Link href={`/game/${game.slug}/values`} className="btn">Values</Link>
      </div>
      <FAQ items={faqItems} />
      <RelatedLinks slug={game.slug} />
      <RelatedGames current={game} />
    </article>
  );
}
