import { Game } from "./games";
import { contentManifest } from "./content/manifest";
import { GameContent } from "./content/schema";

export function validateGame(game: Game): string[] {
  const errors: string[] = [];
  if (!game.slug || !/^[a-z0-9-]+$/.test(game.slug)) errors.push("invalid slug");
  if (!game.name) errors.push("missing name");
  if (!game.description) errors.push("missing description");
  return errors;
}

export function validateGames(games: Game[]): { valid: boolean; errors: Record<string, string[]> } {
  const errors: Record<string, string[]> = {};
  let valid = true;
  for (const g of games) {
    const e = validateGame(g);
    if (e.length) {
      errors[g.slug] = e;
      valid = false;
    }
  }
  return { valid, errors };
}

export function validateContent(content: GameContent[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const slugs = new Set<string>();
  for (const c of content) {
    if (slugs.has(c.slug)) errors.push(`duplicate slug: ${c.slug}`);
    slugs.add(c.slug);
    if (!c.source) errors.push(`missing source: ${c.slug}`);
  if (c.source && !/^https?:\/\//.test(c.source)) errors.push(`invalid source URL: ${c.slug}`);
    if (!c.lastVerified) errors.push(`missing lastVerified: ${c.slug}`);
    if (!c.pages) errors.push(`missing pages: ${c.slug}`);
  }
  return { valid: errors.length === 0, errors };
}

export function validateManifest() {
  return validateContent(contentManifest);
}

export function validateFreshness(content: GameContent[], maxDays = 30): string[] {
  const errors: string[] = [];
  const now = Date.now();
  for (const c of content) {
    const verified = new Date(c.lastVerified).getTime();
    if (Number.isNaN(verified)) {
      errors.push(`invalid lastVerified: ${c.slug}`);
      continue;
    }
    const ageDays = (now - verified) / (1000 * 60 * 60 * 24);
    if (ageDays < 0) errors.push(`future date: ${c.slug}`);
    else if (ageDays > maxDays) errors.push(`stale content: ${c.slug}`);
  }
  return errors;
}

export function validatePageContent(content: GameContent): string[] {
  const errors: string[] = [];
  // basic: declared pages must be valid names
  const validPages = ["codes", "guide", "values"];
  for (const p of content.pages) {
    if (!validPages.includes(p)) errors.push(`unknown page: ${content.slug}/${p}`);
  }
  return errors;
}

export function runQualityGates() {
  const errors: string[] = [];
  errors.push(...validateContent(contentManifest).errors);
  errors.push(...validateFreshness(contentManifest));
  for (const c of contentManifest) errors.push(...validatePageContent(c));
  return { valid: errors.length === 0, errors };
}
