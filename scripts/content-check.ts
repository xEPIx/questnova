import { contentManifest } from "../lib/content/manifest.ts";
import { validateContent, validateFreshness, validatePageContent } from "../lib/validation.ts";

const maxDays = Number(process.env.CONTENT_MAX_AGE_DAYS ?? 30);
const errors: string[] = [];

const contentResult = validateContent(contentManifest);
errors.push(...contentResult.errors);
errors.push(...validateFreshness(contentManifest, maxDays));
for (const c of contentManifest) errors.push(...validatePageContent(c));

// source URL check
for (const c of contentManifest) {
  if (!/^https?:\/\//.test(c.source)) errors.push(`invalid source URL: ${c.slug}`);
}

if (errors.length) {
  console.error("Content check failed:");
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}

console.log(`Content check passed (${contentManifest.length} items, max age ${maxDays} days).`);
