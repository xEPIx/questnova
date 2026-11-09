import Link from "next/link";

export default function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  return (
    <nav className="text-sm text-slate-400 mb-4">
      {items.map((it, i) => (
        <span key={i}>
          {i > 0 && " / "}
          <Link href={it.href} className="hover:underline">{it.name}</Link>
        </span>
      ))}
    </nav>
  );
}
