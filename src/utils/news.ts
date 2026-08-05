import type { CollectionEntry } from 'astro:content';

export type NewsEntry = CollectionEntry<'news'>;
export type NewsLocale = NewsEntry['data']['locale'];

/** Fail the build when a public news pair is incomplete or internally inconsistent. */
export function assertBilingualNewsPairs(entries: NewsEntry[]): void {
  const byTranslation = new Map<string, NewsEntry[]>();
  const byRoute = new Map<string, NewsEntry>();
  const translationByNewsId = new Map<string, string>();

  for (const entry of entries) {
    const { locale, newsId, slug, translationKey } = entry.data;
    const routeKey = `${locale}:${slug}`;
    const existingRoute = byRoute.get(routeKey);
    if (existingRoute) {
      throw new Error(
        `News route "${newsRoute(entry)}" is claimed by both "${existingRoute.id}" and "${entry.id}".`,
      );
    }
    byRoute.set(routeKey, entry);

    const existingTranslation = translationByNewsId.get(newsId);
    if (existingTranslation && existingTranslation !== translationKey) {
      throw new Error(`News item "${newsId}" is assigned to multiple translation keys.`);
    }
    translationByNewsId.set(newsId, translationKey);

    const pair = byTranslation.get(translationKey) ?? [];
    pair.push(entry);
    byTranslation.set(translationKey, pair);
  }

  for (const [translationKey, pair] of byTranslation) {
    const locales = new Set(pair.map((entry) => entry.data.locale));
    if (pair.length !== 2 || locales.size !== 2 || !locales.has('en') || !locales.has('zh')) {
      throw new Error(
        `News translation "${translationKey}" must contain exactly one English and one Chinese entry.`,
      );
    }

    const shared = (select: (entry: NewsEntry) => unknown) =>
      new Set(pair.map((entry) => JSON.stringify(select(entry)))).size === 1;
    const publicationState = (entry: NewsEntry) => ({
      archived: entry.data.archived,
      draft: entry.data.draft,
      hidden: entry.data.hidden,
    });

    if (!shared((entry) => entry.data.newsId)) {
      throw new Error(`News translation "${translationKey}" must share one newsId.`);
    }
    if (!shared((entry) => entry.data.slug)) {
      throw new Error(`News translation "${translationKey}" must share one public slug.`);
    }
    if (!shared((entry) => entry.data.date.toISOString())) {
      throw new Error(`News translation "${translationKey}" must share one publication date.`);
    }
    if (
      !shared((entry) => entry.data.coverageStart.toISOString()) ||
      !shared((entry) => entry.data.coverageEnd.toISOString())
    ) {
      throw new Error(`News translation "${translationKey}" must share one coverage period.`);
    }
    if (!shared((entry) => entry.data.module)) {
      throw new Error(`News translation "${translationKey}" must share one module.`);
    }
    if (!shared((entry) => entry.data.keywords)) {
      throw new Error(`News translation "${translationKey}" must share ordered keywords.`);
    }
    if (!shared((entry) => entry.data.authors)) {
      throw new Error(`News translation "${translationKey}" must share ordered work authors.`);
    }
    if (!shared((entry) => entry.data.subjectIds) || !shared((entry) => entry.data.workIds)) {
      throw new Error(`News translation "${translationKey}" must share source identities.`);
    }
    if (!shared((entry) => entry.data.focusSubjectId)) {
      throw new Error(`News translation "${translationKey}" must share one focus subject.`);
    }
    if (
      !shared((entry) => entry.data.generated) ||
      !shared((entry) => entry.data.coverTone) ||
      !shared((entry) => entry.data.coverImage) ||
      !shared((entry) => entry.data.coverImageCredit) ||
      !shared((entry) => entry.data.lastmod?.toISOString())
    ) {
      throw new Error(
        `News translation "${translationKey}" must share generation and cover state.`,
      );
    }
    if (!shared(publicationState)) {
      throw new Error(`News translation "${translationKey}" must share one publication state.`);
    }
  }
}

export function newsRoute(entry: NewsEntry): string {
  const prefix = entry.data.locale === 'zh' ? '/zh/news/' : '/news/';
  return `${prefix}${entry.data.slug}/`;
}

export function translatedNews(entry: NewsEntry, entries: NewsEntry[]): NewsEntry | undefined {
  return entries.find(
    (candidate) =>
      candidate.data.translationKey === entry.data.translationKey &&
      candidate.data.newsId === entry.data.newsId &&
      candidate.data.locale !== entry.data.locale,
  );
}

/** Public detail routes include archived items so old links remain valid. */
export function routableNews(entries: NewsEntry[], locale?: NewsLocale): NewsEntry[] {
  return entries.filter(
    (entry) => !entry.data.hidden && !entry.data.draft && (!locale || entry.data.locale === locale),
  );
}

/** The feed excludes archived/superseded entries without deleting their routes. */
export function listedNews(entries: NewsEntry[], locale?: NewsLocale): NewsEntry[] {
  return routableNews(entries, locale).filter((entry) => !entry.data.archived);
}

/** Newest first; IDs provide deterministic ordering for equal editorial dates. */
export function sortNews(entries: NewsEntry[]): NewsEntry[] {
  return [...entries].sort(
    (a, b) =>
      b.data.date.getTime() - a.data.date.getTime() ||
      a.data.newsId.localeCompare(b.data.newsId, 'en'),
  );
}

export function newsKeywords(entries: NewsEntry[]): string[] {
  return [...new Set(entries.flatMap((entry) => entry.data.keywords))].sort((a, b) =>
    a.localeCompare(b, 'en'),
  );
}

export function newsAuthors(entries: NewsEntry[]): string[] {
  return [...new Set(entries.flatMap((entry) => entry.data.authors))].sort((a, b) =>
    a.localeCompare(b, 'en'),
  );
}
