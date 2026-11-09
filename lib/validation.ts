import { Game } from "./games";
import { contentManifest, GameContent } from "./content/manifest";

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
    if (!c.lastVerified) errors.push(`missing lastVerified: ${c.slug}`);
    if (!c.pages) errors.push(`missing pages: ${c.slug}`);
  }
  return { valid: errors.length === 0, errors };
}

export function validateManifest() {
  return validateContent(contentManifest);
}
