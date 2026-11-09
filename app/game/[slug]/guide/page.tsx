import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGame, games, getAvailablePages } from "@/lib/games";
import { getGuide } from "@/lib/content/guides";
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
  if (!game || !getAvailablePages(slug).includes("guide")) return {};
  return { title: `${game.name} Beginner Guide | QuestNova`, description: `${game.name} guide.` };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game || !getAvailablePages(slug).includes("guide")) notFound();
  const guide = getGuide(slug);
  const crumbs = [
    { name: "Home", url: "https://questnova.pages.dev/" },
    { name: game.name, url: `https://questnova.pages.dev/game/${game.slug}` },
    { name: "Guide", url: `https://questnova.pages.dev/game/${game.slug}/guide` },
  ];
  return (
    <article>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: game.name, href: `/game/${game.slug}` }, { name: "Guide", href: `/game/${game.slug}/guide` }]} />
      <h1 className="text-2xl font-bold mb-2">{guide?.title ?? `${game.name} Guide`}</h1>
      {guide?.sections.map((s, i) => (
        <section key={i} className="mb-4">
          <h2 className="font-semibold">{s.heading}</h2>
          <p>{s.body}</p>
        </section>
      )) ?? <p>Guide coming soon.</p>}
      <RelatedLinks slug={game.slug} />
    </article>
  );
}
