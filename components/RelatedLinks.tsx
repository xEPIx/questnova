import Link from "next/link";

export default function RelatedLinks({ slug }: { slug: string }) {
  const links = [
    { name: "Codes", href: `/game/${slug}/codes` },
    { name: "Guide", href: `/game/${slug}/guide` },
    { name: "Values", href: `/game/${slug}/values` },
  ];
  return (
    <nav className="mt-6 flex gap-3 text-sm">
      {links.map((l) => (
        <Link key={l.name} href={l.href} className="underline">{l.name}</Link>
      ))}
    </nav>
  );
}
