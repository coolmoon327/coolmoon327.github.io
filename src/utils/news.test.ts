import { describe, expect, it, vi } from 'vitest';

vi.mock('astro:content', () => ({ getCollection: vi.fn() }));

import {
  assertBilingualNewsPairs,
  listedNews,
  newsAuthors,
  newsKeywords,
  newsRoute,
  routableNews,
  sortNews,
  translatedNews,
} from './news';

function makeNews(
  id: string,
  options: {
    locale?: 'en' | 'zh';
    slug?: string;
    newsId?: string;
    translationKey?: string;
    date?: Date;
    module?: 'fields' | 'advisors' | 'interests';
    keywords?: string[];
    authors?: string[];
    subjectIds?: string[];
    workIds?: string[];
    focusSubjectId?: string;
    hidden?: boolean;
    draft?: boolean;
    archived?: boolean;
    coverImageCredit?: string;
    lastmod?: Date;
  } = {},
) {
  return {
    id,
    data: {
      locale: options.locale ?? 'en',
      slug: options.slug ?? 'fixture',
      newsId: options.newsId ?? 'news-fixture',
      translationKey: options.translationKey ?? 'news-fixture-pair',
      date: options.date ?? new Date('2026-08-01'),
      coverageStart: new Date('2026-07-01'),
      coverageEnd: new Date('2026-07-31'),
      module: options.module ?? 'fields',
      keywords: options.keywords ?? ['physical-layer-security'],
      authors: options.authors ?? ['A. Author'],
      subjectIds: options.subjectIds ?? [],
      workIds: options.workIds ?? ['work-fixture'],
      focusSubjectId: options.focusSubjectId,
      generated: true,
      coverTone: 'ocean',
      coverImage: undefined,
      coverImageCredit: options.coverImageCredit,
      lastmod: options.lastmod,
      hidden: options.hidden ?? false,
      draft: options.draft ?? false,
      archived: options.archived ?? false,
    },
  } as any;
}

const pair = () => [makeNews('en/fixture'), makeNews('zh/fixture', { locale: 'zh' })];

describe('bilingual news contract', () => {
  it('accepts one structurally aligned pair', () => {
    expect(() => assertBilingualNewsPairs(pair())).not.toThrow();
  });

  it('rejects incomplete and mismatched pairs', () => {
    expect(() => assertBilingualNewsPairs([pair()[0]])).toThrow(/exactly one English/);
    expect(() =>
      assertBilingualNewsPairs([
        pair()[0],
        makeNews('zh/fixture', { locale: 'zh', module: 'advisors' }),
      ]),
    ).toThrow(/share one module/);
  });

  it('rejects duplicate locale routes', () => {
    const [en, zh] = pair();
    const duplicate = makeNews('en/other', {
      newsId: 'news-other',
      translationKey: 'other-pair',
    });
    expect(() => assertBilingualNewsPairs([en, zh, duplicate])).toThrow(/claimed by both/);
  });

  it('rejects divergent image credit and modification dates', () => {
    const en = makeNews('en/fixture', {
      coverImageCredit: 'Example credit',
      lastmod: new Date('2026-08-02'),
    });
    const wrongCredit = makeNews('zh/fixture', {
      locale: 'zh',
      coverImageCredit: 'Different credit',
      lastmod: new Date('2026-08-02'),
    });
    expect(() => assertBilingualNewsPairs([en, wrongCredit])).toThrow(
      /share generation and cover state/,
    );

    const wrongDate = makeNews('zh/fixture', {
      locale: 'zh',
      coverImageCredit: 'Example credit',
      lastmod: new Date('2026-08-03'),
    });
    expect(() => assertBilingualNewsPairs([en, wrongDate])).toThrow(
      /share generation and cover state/,
    );
  });

  it('resolves locale-aware routes and translations', () => {
    const [en, zh] = pair();
    expect(newsRoute(en)).toBe('/news/fixture/');
    expect(newsRoute(zh)).toBe('/zh/news/fixture/');
    expect(translatedNews(en, [en, zh])).toBe(zh);
  });
});

describe('news visibility and ordering', () => {
  it('keeps archived detail routes but removes archived cards from the feed', () => {
    const current = makeNews('current');
    const archived = makeNews('archived', {
      archived: true,
      newsId: 'news-archived',
      slug: 'archived',
      translationKey: 'archived-pair',
    });
    expect(routableNews([current, archived])).toEqual([current, archived]);
    expect(listedNews([current, archived])).toEqual([current]);
  });

  it('filters hidden and draft routes', () => {
    const hidden = makeNews('hidden', { hidden: true });
    const draft = makeNews('draft', { draft: true });
    expect(routableNews([hidden, draft])).toEqual([]);
  });

  it('sorts newest first and breaks ties by stable identity', () => {
    const old = makeNews('old', { newsId: 'z', date: new Date('2026-07-01') });
    const tiedB = makeNews('b', { newsId: 'b' });
    const tiedA = makeNews('a', { newsId: 'a' });
    expect(sortNews([old, tiedB, tiedA]).map((entry) => entry.id)).toEqual(['a', 'b', 'old']);
  });

  it('derives select options from work metadata', () => {
    const first = makeNews('first', { keywords: ['b', 'a'], authors: ['Zed', 'Amy'] });
    const second = makeNews('second', { keywords: ['a'], authors: ['Amy'] });
    expect(newsKeywords([first, second])).toEqual(['a', 'b']);
    expect(newsAuthors([first, second])).toEqual(['Amy', 'Zed']);
  });
});
