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
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <JsonLd data={websiteJsonLd()} />
        <header className="border-b border-slate-800">
          <nav className="mx-auto max-w-5xl flex gap-4 p-4">
            <Link href="/" className="font-bold">QuestNova</Link>
            <Link href="/games">Games</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl p-4">{children}</main>
        <footer className="border-t border-slate-800 mt-8">
          <div className="mx-auto max-w-5xl p-4 text-sm text-slate-400">© QuestNova</div>
        </footer>
      </body>
    </html>
  );
}
