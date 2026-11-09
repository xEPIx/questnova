import { contentManifest, getAvailablePages } from "../lib/content/manifest.ts";

const errors: string[] = [];
const urls = new Set<string>();

// sitemap consistency
const base = "https://questnova.pages.dev";
const expected = [base, `${base}/games`, `${base}/search`, `${base}/calculator`];
for (const c of contentManifest) {
  expected.push(`${base}/game/${c.slug}`);
  for (const p of getAvailablePages(c.slug)) {
    expected.push(`${base}/game/${c.slug}/${p}`);
  }
}

for (const u of expected) {
  if (urls.has(u)) errors.push(`duplicate sitemap url: ${u}`);
  urls.add(u);
}

// manifest page validity
const validPages = ["codes", "guide", "values", "calculator"];
for (const c of contentManifest) {
  for (const p of c.pages) {
    if (!validPages.includes(p)) errors.push(`invalid page: ${c.slug}/${p}`);
  }
}

if (errors.length) {
  console.error("Site health check failed:");
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}
console.log(`Site health check passed (${urls.size} urls).`);
