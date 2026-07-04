import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getBrands, getProducts } from "@/lib/ops/products";
import { articles } from "@/lib/education";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, priority: 1, changeFrequency: "weekly", lastModified: now },
    { url: `${base}/shop`, priority: 0.9, changeFrequency: "daily", lastModified: now },
    { url: `${base}/brands`, priority: 0.8, changeFrequency: "weekly", lastModified: now },
    { url: `${base}/about`, priority: 0.6, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/wholesale`, priority: 0.7, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/partner`, priority: 0.7, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/education`, priority: 0.7, changeFrequency: "weekly", lastModified: now },
    { url: `${base}/contact`, priority: 0.5, changeFrequency: "yearly", lastModified: now },
    { url: `${base}/authenticity`, priority: 0.5, changeFrequency: "yearly", lastModified: now },
    { url: `${base}/faq`, priority: 0.5, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/returns`, priority: 0.3, changeFrequency: "yearly", lastModified: now },
    { url: `${base}/privacy`, priority: 0.3, changeFrequency: "yearly", lastModified: now },
    { url: `${base}/terms`, priority: 0.3, changeFrequency: "yearly", lastModified: now },
  ];

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${base}/education/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  let brandRoutes: MetadataRoute.Sitemap = [];
  try {
    const [{ items }, brands] = await Promise.all([
      getProducts({ perPage: 1000 }),
      getBrands(),
    ]);
    productRoutes = items.map((p) => ({
      url: `${base}/shop/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
    brandRoutes = brands.map((b) => ({
      url: `${base}/brands/${b.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {
    // If the catalogue can't be read at build time, ship the static map.
  }

  return [...staticRoutes, ...brandRoutes, ...productRoutes, ...articleRoutes];
}
