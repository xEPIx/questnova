export default function FAQ({ items }: { items: { q: string; a: string }[] }) {
  return (
    <section className="mt-6">
      <h2 className="text-xl font-semibold mb-2">FAQ</h2>
      {items.map((it, i) => (
        <details key={i} className="mb-2">
          <summary className="cursor-pointer">{it.q}</summary>
          <p className="text-sm text-slate-300 mt-1">{it.a}</p>
        </details>
      ))}
    </section>
  );
}
