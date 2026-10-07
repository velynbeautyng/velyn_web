/** Shop search: every word typed must appear in the brand, name, category or concerns. */

type Searchable = {
  name: string;
  brand: string;
  category?: string;
  concerns: readonly string[];
};

const fold = (s: string) => s.toLowerCase().replace(/['’]/g, "");

export function matchesSearch(p: Searchable, query: string): boolean {
  const words = fold(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const hay = fold([p.brand, p.name, p.category ?? "", ...p.concerns].join(" "));
  return words.every((w) => hay.includes(w));
}
