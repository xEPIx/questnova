import { Game } from "./games";

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
