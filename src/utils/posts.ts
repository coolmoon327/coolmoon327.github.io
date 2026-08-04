import type { CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'posts'>;
export type PostLocale = Post['data']['locale'];

/**
 * Fail the build when a bilingual post pair is incomplete or ambiguous.
 * Both translations intentionally share one ASCII slug so the site's existing
 * language switcher and alternate-language metadata resolve to valid routes.
 */
export function assertBilingualPostPairs(posts: Post[]): void {
  const byTranslation = new Map<string, Post[]>();
  const translationBySource = new Map<string, string>();
  const postByRoute = new Map<string, Post>();

  for (const post of posts) {
    const { sourceId, translationKey } = post.data;
    const routeKey = `${post.data.locale}:${post.data.slug}`;
    const existingRoute = postByRoute.get(routeKey);
    if (existingRoute) {
      throw new Error(
        `Blog route "${postRoute(post)}" is claimed by both "${existingRoute.id}" and "${post.id}".`,
      );
    }
    postByRoute.set(routeKey, post);

    const existingKey = translationBySource.get(sourceId);
    if (existingKey && existingKey !== translationKey) {
      throw new Error(
        `Blog source "${sourceId}" is assigned to multiple translation keys: "${existingKey}" and "${translationKey}".`,
      );
    }
    translationBySource.set(sourceId, translationKey);

    const pair = byTranslation.get(translationKey) ?? [];
    pair.push(post);
    byTranslation.set(translationKey, pair);
  }

  for (const [translationKey, pair] of byTranslation) {
    const locales = pair.map((post) => post.data.locale);
    const sourceIds = new Set(pair.map((post) => post.data.sourceId));
    const slugs = new Set(pair.map((post) => post.data.slug));
    const publicationStates = new Set(
      pair.map(
        (post) =>
          `${post.data.hidden ? 'hidden' : 'listed'}:${post.data.draft ? 'draft' : 'published'}`,
      ),
    );
    const generationStates = new Set(pair.map((post) => post.data.generated));

    if (
      pair.length !== 2 ||
      !locales.includes('en') ||
      !locales.includes('zh') ||
      new Set(locales).size !== 2
    ) {
      throw new Error(
        `Blog translation "${translationKey}" must contain exactly one English and one Chinese post.`,
      );
    }
    if (sourceIds.size !== 1) {
      throw new Error(`Blog translation "${translationKey}" must share one sourceId.`);
    }
    if (slugs.size !== 1) {
      throw new Error(`Blog translation "${translationKey}" must share one public slug.`);
    }
    if (publicationStates.size !== 1) {
      throw new Error(`Blog translation "${translationKey}" must share one publication state.`);
    }
    if (generationStates.size !== 1) {
      throw new Error(`Blog translation "${translationKey}" must share one generated state.`);
    }
  }
}

/** Return the locale-aware public route for a post (without the deployment base). */
export function postRoute(post: Post): string {
  const prefix = post.data.locale === 'zh' ? '/zh/blog/' : '/blog/';
  return `${prefix}${post.data.slug}/`;
}

/** Return the other-language post in a validated pair. */
export function translatedPost(post: Post, posts: Post[]): Post | undefined {
  return posts.find(
    (candidate) =>
      candidate.data.translationKey === post.data.translationKey &&
      candidate.data.sourceId === post.data.sourceId &&
      candidate.data.locale !== post.data.locale,
  );
}

/**
 * Sort posts: pinned first, then by date descending.
 */
export function sortPosts(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => {
    if (a.data.pinned !== b.data.pinned) return a.data.pinned ? -1 : 1;
    return b.data.date.getTime() - a.data.date.getTime();
  });
}

/**
 * Filter out hidden and draft posts, optionally restricting the locale.
 */
export function visiblePosts(posts: Post[], locale?: PostLocale): Post[] {
  return posts.filter(
    (post) => !post.data.hidden && !post.data.draft && (!locale || post.data.locale === locale),
  );
}

/**
 * Compute a similarity score between two posts based on shared tags.
 * Returns a number from 0 (no match) to 1 (identical tags).
 */
function tagSimilarity(a: Post, b: Post): number {
  const tagsA = new Set(a.data.tags);
  const tagsB = new Set(b.data.tags);
  if (tagsA.size === 0 && tagsB.size === 0) return 0;
  const intersection = [...tagsA].filter((t) => tagsB.has(t)).length;
  const union = new Set([...tagsA, ...tagsB]).size;
  return intersection / union;
}

/**
 * Return up to `limit` related posts, ranked by tag similarity to `current`.
 * Excludes the current post, other locales, drafts, and hidden posts.
 */
export function relatedPosts(current: Post, all: Post[], limit = 3): Post[] {
  return all
    .filter(
      (post) =>
        post.id !== current.id &&
        post.data.locale === current.data.locale &&
        !post.data.hidden &&
        !post.data.draft,
    )
    .map((p) => ({ post: p, score: tagSimilarity(current, p) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.post.data.date.getTime() - a.post.data.date.getTime())
    .slice(0, limit)
    .map(({ post }) => post);
}

/**
 * Get all unique tags across posts, sorted alphabetically.
 */
export function allTags(posts: Post[]): string[] {
  return [...new Set(posts.flatMap((p) => p.data.tags))].sort();
}

/**
 * Get all unique categories across posts, sorted alphabetically.
 */
export function allCategories(posts: Post[]): string[] {
  return [...new Set(posts.flatMap((p) => p.data.categories))].sort();
}
