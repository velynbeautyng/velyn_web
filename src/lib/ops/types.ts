/**
 * Normalized domain types for the storefront. The UltimatePOS Connector API
 * returns a much larger, differently-shaped payload; `normalize.ts` maps it
 * onto these clean shapes so the rest of the app never touches raw ops data.
 */

import type { SkinConcern } from "./concerns";
export type { SkinConcern } from "./concerns";

export type ProductVariation = {
  /** ops variation id, stable per purchasable unit. */
  id: string;
  name: string;
  sku: string;
  price: number;
  /** Price before discount, when higher than `price`. */
  compareAtPrice?: number;
  inStock: boolean;
  qtyAvailable: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  category?: string;
  categorySlug?: string;
  /** Plain-text description (for cards, meta, SEO). */
  description?: string;
  /** Sanitized rich HTML description with sub-headings (for the product page). */
  descriptionHtml?: string;
  shortDescription?: string;
  concerns: SkinConcern[];
  image?: string;
  gallery: string[];
  /** Lowest variation price, used for listing cards. */
  price: number;
  compareAtPrice?: number;
  variations: ProductVariation[];
  inStock: boolean;
  featured: boolean;
  /** Nuvene sells only original products bought through named distributors. */
  authentic: boolean;
};

export type Brand = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  origin?: string;
  logo?: string;
  productCount?: number;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  productCount?: number;
};

export type ProductQuery = {
  brand?: string;
  category?: string;
  concern?: string;
  search?: string;
  featured?: boolean;
  page?: number;
  perPage?: number;
  sort?: "featured" | "price-asc" | "price-desc" | "name";
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};
