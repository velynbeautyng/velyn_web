/**
 * Order references. New orders start with NB (Nuvene Beauty); orders placed
 * before the rename start with VB and stay trackable, because ops matches the
 * reference exactly as it was stored.
 */
export function newOrderReference(now: number, random: string): string {
  return `NB-${now.toString(36).toUpperCase()}-${random.toUpperCase()}`;
}

/** Turn a reference typed by hand ("vb muy0vgn0 ff2f01") into its stored form. */
export function normalizeReference(input: string): string {
  return input
    .trim()
    .toUpperCase()
    .replace(/[\s_]+/g, "-")
    .replace(/-{2,}/g, "-");
}
