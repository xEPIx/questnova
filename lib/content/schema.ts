export type ContentPage = "codes" | "guide" | "values";

export type GameContent = {
  slug: string;
  name: string;
  description: string;
  source: string;
  lastVerified: string;
  pages: ContentPage[];
  featured?: boolean;
  trending?: boolean;
  tags?: string[];
};

export function hasPage(content: GameContent, page: ContentPage): boolean {
  return content.pages.includes(page);
}
