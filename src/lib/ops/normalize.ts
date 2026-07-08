import type { Product, ProductVariation, SkinConcern } from "./types";
import { slugify } from "@/lib/utils";
import { opsConfig } from "./config";

/** Raw shapes from the UltimatePOS Connector API (only fields we consume). */
export type RawOpsProduct = {
  id: number;
  name: string;
  sku?: string;
  type?: string;
  enable_stock?: number | string;
  image_url?: string;
  product_description?: string | null;
  is_inactive?: number;
  category?: { id: number; name: string } | null;
  sub_category?: { id: number; name: string } | null;
  brand?: { id: number; name: string } | null;
  product_variations?: RawVariationGroup[];
};

type RawVariationGroup = {
  id: number;
  name: string;
  variations?: RawVariation[];
};

type RawVariation = {
  id: number;
  name: string;
  sub_sku?: string;
  sell_price_inc_tax?: string | number;
  default_sell_price?: string | number;
  variation_location_details?: {
    location_id: number | string;
    qty_available: string | number;
  }[];
};

const num = (v: string | number | undefined | null): number => {
  const n = typeof v === "string" ? parseFloat(v) : (v ?? 0);
  return Number.isFinite(n) ? n : 0;
};

/** Keyword → skin concern inference, since ops has no native concern field. */
const CONCERN_RULES: [RegExp, SkinConcern][] = [
  [/acne|blemish|effaclar|spot|salicylic|bha|tea tree/i, "Acne-Prone"],
  [/pigment|dark spot|brighten|arbutin|vitamin c|tranexamic|niacinamide|tone/i, "Hyperpigmentation"],
  [/hydrat|moistur|hyaluronic|dry|barrier|ceramide/i, "Dry Skin"],
  [/sensitiv|soothe|calm|centella|cica|heartleaf|redness/i, "Sensitive Skin"],
  [/oil|sebum|pore|mattif/i, "Oily Skin"],
  [/age|wrinkle|firm|retinol|peptide|collagen/i, "Anti-Ageing"],
];

function inferConcerns(name: string, category?: string): SkinConcern[] {
  const hay = `${name} ${category ?? ""}`;
  const found = CONCERN_RULES.filter(([re]) => re.test(hay)).map(([, c]) => c);
  return found.length ? Array.from(new Set(found)) : ["All Skin Types"];
}

export function normalizeProduct(raw: RawOpsProduct): Product {
  // Brands are managed in ops. A product with no brand there stays brandless
  // (rather than inventing a fake "Velyn" brand on the storefront).
  const brand = raw.brand?.name?.trim() ?? "";
  const category = raw.category?.name ?? undefined;
  const wantedLocation = opsConfig.locationId;
  // When stock tracking is off in ops, items are always purchasable; when on,
  // availability comes from the location's qty_available.
  const stockManaged = Number(raw.enable_stock) === 1;

  const variations: ProductVariation[] = (raw.product_variations ?? [])
    .flatMap((g) => g.variations ?? [])
    .map((v) => {
      const price = num(v.sell_price_inc_tax) || num(v.default_sell_price);
      const details = v.variation_location_details ?? [];
      const qty = details
        .filter(
          (d) =>
            !wantedLocation || String(d.location_id) === String(wantedLocation),
        )
        .reduce((sum, d) => sum + num(d.qty_available), 0);
      return {
        id: String(v.id),
        // UltimatePOS names a single product's only variation "DUMMY"; treat
        // that (and empty) as the no-variant default so no phantom option
        // button renders on the product page.
        name: v.name && v.name !== "DUMMY" ? v.name : "Default",
        sku: v.sub_sku || raw.sku || String(v.id),
        price,
        inStock: stockManaged ? qty > 0 : true,
        qtyAvailable: qty,
      };
    })
    .filter((v) => v.price > 0);

  const prices = variations.map((v) => v.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const image = raw.image_url && !/no_image|default/i.test(raw.image_url)
    ? raw.image_url
    : undefined;

  const description = raw.product_description
    ? raw.product_description.replace(/<[^>]+>/g, "").trim()
    : undefined;

  return {
    id: String(raw.id),
    slug: slugify(`${brand}-${raw.name}-${raw.id}`),
    name: raw.name,
    brand,
    brandSlug: slugify(brand),
    category,
    categorySlug: category ? slugify(category) : undefined,
    description,
    shortDescription: description?.slice(0, 140),
    concerns: inferConcerns(raw.name, category),
    image,
    gallery: image ? [image] : [],
    price: minPrice,
    variations,
    inStock: variations.some((v) => v.inStock),
    featured: false,
    authentic: true,
  };
}
