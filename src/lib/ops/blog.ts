import "server-only";
import { opsFetch, OpsError } from "./client";
import { isOpsConfigured } from "./config";
import { renderMarkdown } from "@/lib/markdown";
import { articles as localArticles, getArticle, type Article } from "@/lib/education";

/**
 * Education Hub content source. Published posts authored in the ops admin take
 * over the hub; until any are published (or if ops is unreachable) the in-repo
 * articles are served instead. Individual in-repo slugs stay resolvable by URL
 * even after ops posts go live, so no existing link 404s.
 */

type RawOpsPost = {
  id: number;
  title: string;
  slug: string;
  tag?: string | null;
  excerpt?: string | null;
  cover_image_url?: string | null;
  read_minutes?: number | null;
  author_name?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  published_at?: string | null;
  body?: string | null;
};

function toArticle(p: RawOpsPost, withBody: boolean): Article {
  return {
    slug: p.slug,
    title: p.title,
    tag: p.tag?.trim() || "Article",
    excerpt: p.excerpt?.trim() || "",
    readMinutes: p.read_minutes || 3,
    date: p.published_at
      ? p.published_at.slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    body: [],
    bodyHtml: withBody && p.body ? renderMarkdown(p.body) : undefined,
    coverImage: p.cover_image_url?.trim() || undefined,
    author: p.author_name?.trim() || undefined,
    metaTitle: p.meta_title?.trim() || undefined,
    metaDescription: p.meta_description?.trim() || undefined,
    source: "ops",
  };
}

/** The full Education Hub list: ops published posts if any, else in-repo. */
export async function getEducationArticles(): Promise<Article[]> {
  if (isOpsConfigured()) {
    try {
      const res = await opsFetch<{ data: RawOpsPost[] }>("blog");
      const posts = (res.data ?? []).map((p) => toArticle(p, false));
      if (posts.length > 0) return posts;
    } catch (err) {
      console.error(
        "[blog] ops fetch failed, using in-repo articles:",
        err instanceof Error ? err.message : err,
      );
    }
  }
  return localArticles;
}

/** True once at least one post is published in ops (i.e. the hub is "live"). */
async function opsHasPublishedPosts(): Promise<boolean> {
  try {
    const res = await opsFetch<{ data: RawOpsPost[] }>("blog");
    return (res.data ?? []).length > 0;
  } catch {
    return false;
  }
}

/**
 * A single article by slug. Ops posts win. Once ops has *any* published post,
 * the in-repo sample articles are retired, so an unknown slug 404s instead of
 * falling back. The in-repo articles only serve while ops is empty or
 * unreachable, so publishing your first post cleanly replaces the samples.
 */
export async function getEducationArticle(slug: string): Promise<Article | null> {
  if (isOpsConfigured()) {
    try {
      const res = await opsFetch<{ data: RawOpsPost }>(
        `blog/${encodeURIComponent(slug)}`,
      );
      if (res.data) return toArticle(res.data, true);
    } catch (err) {
      // Ops reachable but no such published post: honour "ops mode": if any
      // posts exist, the samples are gone (404). Only a truly-empty or
      // unreachable ops falls through to the in-repo article.
      if (err instanceof OpsError && err.status === 404) {
        if (await opsHasPublishedPosts()) return null;
      }
    }
  }
  return getArticle(slug) ?? null;
}
