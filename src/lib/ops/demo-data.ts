import type { Brand, Product, SkinConcern } from "./types";
import { slugify } from "@/lib/utils";

/**
 * DEMO CATALOGUE, placeholder data shown while the live ops.velynbeauty.com
 * catalogue is being imported. Every entry is replaced automatically once the
 * Connector API returns products. Real Velyn brands; representative pricing.
 */

export const demoBrands: Brand[] = [
  { name: "CeraVe", origin: "USA", description: "Dermatologist-developed with essential ceramides and hyaluronic acid." },
  { name: "La Roche-Posay", origin: "France", description: "Dermatological skincare formulated with prebiotic thermal water." },
  { name: "The Ordinary", origin: "Canada", description: "Clinical formulations with integrity, potent actives, honest pricing." },
  { name: "COSRX", origin: "South Korea", description: "Minimalist K-beauty built around snail mucin and gentle actives." },
  { name: "Anua", origin: "South Korea", description: "Heartleaf-based Korean skincare for sensitive, blemish-prone skin." },
  { name: "Beauty of Joseon", origin: "South Korea", description: "Hanbang skincare pairing traditional herbs with modern formulation." },
  { name: "SKIN1004", origin: "South Korea", description: "Centella asiatica from Madagascar for soothing, barrier-first care." },
  { name: "Medicube", origin: "South Korea", description: "Derma-inspired solutions for pores, texture and blemishes." },
  { name: "TIAM", origin: "South Korea", description: "Vitamin C and niacinamide specialists for tone and clarity." },
  { name: "Good Molecules", origin: "USA", description: "Effective, accessible actives for everyday concerns." },
  { name: "Naturium", origin: "USA", description: "Science-backed skincare with a sensorial, clean formulation ethos." },
  { name: "Paula's Choice", origin: "USA", description: "Research-first skincare, famed for its BHA exfoliants." },
].map((b) => ({
  ...b,
  id: slugify(b.name),
  slug: slugify(b.name),
}));

type Seed = {
  name: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  concerns: SkinConcern[];
  category: string;
  featured?: boolean;
  short: string;
  qty?: number;
};

const seeds: Seed[] = [
  { name: "Moisturising Lotion 473ml", brand: "CeraVe", price: 18800, concerns: ["Dry Skin", "All Skin Types"], category: "Moisturisers", featured: true, short: "Lightweight ceramide + hyaluronic acid lotion for 24-hour hydration." },
  { name: "Foaming Facial Cleanser 473ml", brand: "CeraVe", price: 17500, concerns: ["Oily Skin", "Acne-Prone"], category: "Cleansers", short: "Gel-to-foam cleanser that removes oil without stripping the barrier." },
  { name: "Effaclar Purifying Foaming Gel 200ml", brand: "La Roche-Posay", price: 22500, concerns: ["Acne-Prone", "Oily Skin"], category: "Cleansers", featured: true, short: "Daily purifying gel for oily, blemish-prone skin." },
  { name: "Anthelios UVMune 400 SPF50+ 50ml", brand: "La Roche-Posay", price: 34500, concerns: ["Sensitive Skin", "All Skin Types"], category: "Sunscreen", featured: true, short: "Advanced broad-spectrum protection, invisible finish." },
  { name: "Alpha Arbutin 2% + HA Serum 30ml", brand: "The Ordinary", price: 12000, concerns: ["Hyperpigmentation"], category: "Serums", featured: true, short: "Targets uneven tone and dark marks with pure alpha arbutin." },
  { name: "Niacinamide 10% + Zinc 1% 30ml", brand: "The Ordinary", price: 11500, concerns: ["Oily Skin", "Acne-Prone"], category: "Serums", short: "Balances sebum and visibly refines the look of pores." },
  { name: "Natural Moisturizing Factors + HA 100ml", brand: "The Ordinary", price: 13500, concerns: ["Dry Skin", "All Skin Types"], category: "Moisturisers", short: "Non-greasy daily moisturiser with amino acids and HA." },
  { name: "Advanced Snail 96 Mucin Power Essence 100ml", brand: "COSRX", price: 19500, concerns: ["All Skin Types", "Sensitive Skin"], category: "Essences", featured: true, short: "96% snail secretion filtrate for repair and glass-skin glow." },
  { name: "Low pH Good Morning Gel Cleanser 150ml", brand: "COSRX", price: 14000, concerns: ["Sensitive Skin", "Oily Skin"], category: "Cleansers", short: "Gentle, low-pH morning cleanse with tea tree and BHA." },
  { name: "Heartleaf 77% Soothing Toner 250ml", brand: "Anua", price: 21000, concerns: ["Sensitive Skin", "Acne-Prone"], category: "Toners", featured: true, short: "Calms redness and soothes reactive, blemish-prone skin." },
  { name: "Peach 70% Niacinamide Serum 30ml", brand: "Anua", price: 22500, concerns: ["Hyperpigmentation", "Oily Skin"], category: "Serums", short: "Brightens and smooths for a healthy, even glow." },
  { name: "Relief Sun: Rice + Probiotics SPF50+ 50ml", brand: "Beauty of Joseon", price: 16500, concerns: ["All Skin Types", "Sensitive Skin"], category: "Sunscreen", featured: true, short: "Cult organic-filter sunscreen with a dewy, weightless finish." },
  { name: "Glow Serum: Propolis + Niacinamide 30ml", brand: "Beauty of Joseon", price: 17000, concerns: ["Hyperpigmentation", "Dry Skin"], category: "Serums", short: "Propolis and niacinamide for luminous, nourished skin." },
  { name: "Centella Ampoule 55ml", brand: "SKIN1004", price: 18500, concerns: ["Sensitive Skin", "Acne-Prone"], category: "Serums", short: "Pure Madagascar centella to soothe and strengthen the barrier." },
  { name: "Zero Pore Pad 2.0 (70 pads)", brand: "Medicube", price: 26500, concerns: ["Oily Skin", "Acne-Prone"], category: "Exfoliants", short: "Daily toner pads that refine pores and smooth texture." },
  { name: "Vita B12 Hyaluronic Acid Serum 30ml", brand: "TIAM", price: 15500, concerns: ["Hyperpigmentation", "Dry Skin"], category: "Serums", short: "Layered vitamin complex for tone, glow and hydration." },
  { name: "Discoloration Correction Serum 30ml", brand: "Good Molecules", price: 13000, concerns: ["Hyperpigmentation"], category: "Serums", short: "Tranexamic-acid serum that fades stubborn dark spots." },
  { name: "Vitamin C Complex Face Serum 30ml", brand: "Naturium", price: 24000, concerns: ["Anti-Ageing", "Hyperpigmentation"], category: "Serums", short: "A layered vitamin C system for radiance and firmness." },
  { name: "Skin Perfecting 2% BHA Liquid Exfoliant 118ml", brand: "Paula's Choice", price: 38500, compareAtPrice: 42000, concerns: ["Acne-Prone", "Oily Skin"], category: "Exfoliants", featured: true, short: "The iconic leave-on BHA for clearer, smoother skin." },
  { name: "Skin Recovery Replenishing Moisturizer 60ml", brand: "Paula's Choice", price: 33000, concerns: ["Dry Skin", "Sensitive Skin"], category: "Moisturisers", short: "Rich, calming moisturiser for dry, sensitised skin." },
];

export const demoProducts: Product[] = seeds.map((s, i) => {
  const slug = slugify(`${s.brand}-${s.name}`);
  const variationId = `demo-${i + 1}`;
  return {
    id: `demo-${i + 1}`,
    slug,
    name: s.name,
    brand: s.brand,
    brandSlug: slugify(s.brand),
    category: s.category,
    categorySlug: slugify(s.category),
    shortDescription: s.short,
    description: `${s.short} Sourced directly from authorised distributors and verified authentic by Velyn before it reaches you.`,
    concerns: s.concerns,
    gallery: [],
    price: s.price,
    compareAtPrice: s.compareAtPrice,
    variations: [
      {
        id: variationId,
        name: "Default",
        sku: `VB-${1000 + i}`,
        price: s.price,
        compareAtPrice: s.compareAtPrice,
        inStock: (s.qty ?? 25) > 0,
        qtyAvailable: s.qty ?? 25,
      },
    ],
    inStock: (s.qty ?? 25) > 0,
    featured: Boolean(s.featured),
    authentic: true,
  };
});

export const demoCategories = Array.from(
  new Set(demoProducts.map((p) => p.category!)),
).map((name) => ({
  id: slugify(name),
  slug: slugify(name),
  name,
  productCount: demoProducts.filter((p) => p.category === name).length,
}));
