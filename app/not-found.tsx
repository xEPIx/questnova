import Link from "next/link";

export default function NotFound() {
  return (
    <section className="text-center py-16">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p>Page not found.</p>
      <Link href="/" className="underline">Go home</Link>
    </section>
  );
}
