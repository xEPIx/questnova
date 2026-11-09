import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { JsonLd, websiteJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: { default: "QuestNova", template: "%s | QuestNova" },
  description: "Automated gaming utility platform: codes, value lists, tools.",
  metadataBase: new URL("https://questnova.pages.dev"),
  openGraph: { type: "website", siteName: "QuestNova" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-text">
        <JsonLd data={websiteJsonLd()} />
        <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur bg-bg/80">
          <nav className="mx-auto max-w-6xl flex items-center gap-4 p-4">
            <Link href="/" className="font-bold text-lg">QuestNova</Link>
            <div className="flex-1" />
            <Link href="/games" className="text-muted hover:text-text">Games</Link>
            <Link href="/search" className="text-muted hover:text-text">Search</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl p-4">{children}</main>
        <footer className="border-t border-white/10 mt-8">
          <div className="mx-auto max-w-6xl p-4 text-sm text-muted">© QuestNova</div>
        </footer>
      </body>
    </html>
  );
}
