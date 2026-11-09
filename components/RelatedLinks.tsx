import Link from "next/link";
import { getAvailablePages } from "@/lib/games";

export default function RelatedLinks({ slug }: { slug: string }) {
  const available = getAvailablePages(slug);
  const links = [
    { name: "Codes", href: `/game/${slug}/codes`, key: "codes" },
    { name: "Guide", href: `/game/${slug}/guide`, key: "guide" },
    { name: "Values", href: `/game/${slug}/values`, key: "values" },
  ].filter((l) => available.includes(l.key as any));
  if (links.length === 0) return null;
  return (
    <nav className="mt-6 flex gap-3 text-sm">
      {links.map((l) => (
        <Link key={l.name} href={l.href} className="underline">{l.name}</Link>
      ))}
    </nav>
  );
}
