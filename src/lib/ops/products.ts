import "server-only";
import type {
  Brand,
  Category,
  Paginated,
  Product,
  ProductQuery,
} from "./types";
import { concernSlug } from "./concerns";
import { pickFeatured } from "./featured";
import { opsFetch } from "./client";
import { normalizeProduct, type RawOpsProduct } from "./normalize";
import { isDemoFallbackEnabled, isOpsConfigured } from "./config";
import { demoBrands, demoCategories, demoProducts } from "./demo-data";

/**
 * Public storefront data API. Each function tries the live Connector API first
 * and, on any failure or empty result, falls back to the demo catalogue (when
 * enabled) so pages never crash or render blank while the catalogue is imported.
 *
 * `dataSource()` lets the UI show an honest "demo data" notice when relevant.
 */

let usingDemo = !isOpsConfigured();

export function dataSource(): "live" | "demo" {
  return usingDemo ? "demo" : "live";
}

async function liveProducts(): Promise<Product[]> {
  // Connector returns paginated data; pull a generous page for a catalogue
  // this size. (Pagination can be added when the catalogue grows large.)
  const res = await opsFetch<{ data: RawOpsProduct[] }>("product", {
    query: { per_page: 500, order_by: "name", order_direction: "asc" },
  });
  const products = (res.data ?? [])
    .filter((p) => p.is_inactive !== 1)
    .map(normalizeProduct)
    .filter((p) => p.price > 0);
  return products;
}

/** Cached full catalogue for the current request lifecycle. */
async function getAllProducts(): Promise<Product[]> {
  if (isOpsConfigured()) {
    try {
      const live = await liveProducts();
      if (live.length > 0) {
        usingDemo = false;
        return markFeatured(live);
      }
    } catch (err) {
      // Any ops failure (API error, network/DNS outage, timeout) degrades
      // gracefully to the demo catalogue rather than 500-ing the storefront.
      console.error(
        "[ops] product fetch failed, falling back to demo catalogue:",
        err instanceof Error ? err.message : err,
      );
    }
  }
  usingDemo = true;
  if (!isDemoFallbackEnabled()) return [];
  return demoProducts;
}

/** Live ops has no "featured" flag; feature one product per brand, headline brands first. */
function markFeatured(products: Product[]): Product[] {
  const order = pickFeatured(products, 8);
  const featured = new Set(order);
  return products
    .map((p) => (featured.has(p.id) ? { ...p, featured: true } : p))
    .sort((a, b) => {
      const ia = order.indexOf(a.id);
      const ib = order.indexOf(b.id);
      return (ia === -1 ? order.length : ia) - (ib === -1 ? order.length : ib);
    });
}

function applyQuery(all: Product[], q: ProductQuery): Paginated<Product> {
  let items = [...all];

  if (q.featured) items = items.filter((p) => p.featured);
  if (q.brand) items = items.filter((p) => p.brandSlug === q.brand);
  if (q.category) items = items.filter((p) => p.categorySlug === q.category);
  if (q.concern) {
    items = items.filter((p) =>
      p.concerns.some((c) => concernSlug(c) === q.concern),
    );
  }
  if (q.search) {
    const s = q.search.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.brand.toLowerCase().includes(s) ||
        p.concerns.some((c) => c.toLowerCase().includes(s)),
    );
  }

  switch (q.sort) {
    case "price-asc":
      items.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      items.sort((a, b) => b.price - a.price);
      break;
    case "name":
      items.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      items.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || a.price - b.price,
      );
  }

  const perPage = q.perPage ?? 12;
  const page = Math.max(1, q.page ?? 1);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;

  return {
    items: items.slice(start, start + perPage),
    total,
    page,
    perPage,
    totalPages,
  };
}

export async function getProducts(
  query: ProductQuery = {},
): Promise<Paginated<Product>> {
  const all = await getAllProducts();
  return applyQuery(all, query);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const all = await getAllProducts();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const all = await getAllProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const all = await getAllProducts();
  return all
    .filter((p) => p.id !== product.id)
    .map((p) => ({
      p,
      score:
        (p.brandSlug === product.brandSlug ? 2 : 0) +
        p.concerns.filter((c) => product.concerns.includes(c)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);
}

export async function getBrands(): Promise<Brand[]> {
  const all = await getAllProducts();
  if (usingDemo) {
    return demoBrands.map((b) => ({
      ...b,
      productCount: all.filter((p) => p.brandSlug === b.slug).length,
    }));
  }
  // Derive brands from the live catalogue.
  const map = new Map<string, Brand>();
  for (const p of all) {
    if (!p.brandSlug) continue; // skip brandless products
    const existing = map.get(p.brandSlug);
    if (existing) {
      existing.productCount = (existing.productCount ?? 0) + 1;
    } else {
      map.set(p.brandSlug, {
        id: p.brandSlug,
        slug: p.brandSlug,
        name: p.brand,
        productCount: 1,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const brands = await getBrands();
  return brands.find((b) => b.slug === slug) ?? null;
}

export async function getCategories(): Promise<Category[]> {
  const all = await getAllProducts();
  if (usingDemo) return demoCategories;
  const map = new Map<string, Category>();
  for (const p of all) {
    if (!p.categorySlug || !p.category) continue;
    const existing = map.get(p.categorySlug);
    if (existing) existing.productCount = (existing.productCount ?? 0) + 1;
    else
      map.set(p.categorySlug, {
        id: p.categorySlug,
        slug: p.categorySlug,
        name: p.category,
        productCount: 1,
      });
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}
