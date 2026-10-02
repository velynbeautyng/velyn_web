import { CONCERNS } from "./concerns";

export const CONCERN_OPTIONS = CONCERNS.map(({ slug, label, short }) => ({
  slug,
  label,
  short,
}));
