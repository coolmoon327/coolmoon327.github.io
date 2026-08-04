import { describe, expect, it, vi } from 'vitest';

// Mock astro:content so the module resolves in unit tests
vi.mock('astro:content', () => ({ getCollection: vi.fn() }));

import {
  allCategories,
  allTags,
  assertBilingualPostPairs,
  postRoute,
  relatedPosts,
  sortPosts,
  translatedPost,
  visiblePosts,
} from './posts';

// Minimal post factory — only the fields used by utils/posts.ts
function makePost(
  id: string,
  opts: {
    date?: Date;
    tags?: string[];
    categories?: string[];
    hidden?: boolean;
    draft?: boolean;
    pinned?: boolean;
    locale?: 'en' | 'zh';
    slug?: string;
    sourceId?: string;
    translationKey?: string;
    generated?: boolean;
  } = {},
) {
  return {
    id,
    data: {
      title: id,
      date: opts.date ?? new Date('2024-01-01'),
      tags: opts.tags ?? [],
      categories: opts.categories ?? [],
      hidden: opts.hidden ?? false,
      draft: opts.draft ?? false,
      pinned: opts.pinned ?? false,
      locale: opts.locale ?? 'en',
      slug: opts.slug ?? id,
      sourceId: opts.sourceId ?? id,
      translationKey: opts.translationKey ?? id,
      generated: opts.generated ?? true,
    },
  } as any;
}

describe('sortPosts', () => {
  it('puts pinned posts first', () => {
    const a = makePost('a', { date: new Date('2024-01-01') });
    const b = makePost('b', { date: new Date('2024-06-01'), pinned: true });
    expect(sortPosts([a, b])[0].id).toBe('b');
  });

  it('sorts by date descending within same pinned status', () => {
    const old = makePost('old', { date: new Date('2020-01-01') });
    const recent = makePost('recent', { date: new Date('2024-01-01') });
    const result = sortPosts([old, recent]);
    expect(result[0].id).toBe('recent');
  });

  it('does not mutate the input array', () => {
    const posts = [makePost('a'), makePost('b')];
    const copy = [...posts];
    sortPosts(posts);
    expect(posts).toEqual(copy);
  });
});

describe('visiblePosts', () => {
  it('filters out hidden and draft posts', () => {
    const visible = makePost('v');
    const hidden = makePost('h', { hidden: true });
    const draft = makePost('d', { draft: true });
    expect(visiblePosts([visible, hidden, draft])).toEqual([visible]);
  });

  it('filters by locale', () => {
    const en = makePost('en', { locale: 'en' });
    const zh = makePost('zh', { locale: 'zh' });
    expect(visiblePosts([en, zh], 'zh')).toEqual([zh]);
  });
});

describe('bilingual post routing', () => {
  const en = makePost('generated/en/hello', {
    locale: 'en',
    slug: 'hello',
    sourceId: 'source-1',
    translationKey: 'hello-pair',
  });
  const zh = makePost('generated/zh/hello', {
    locale: 'zh',
    slug: 'hello',
    sourceId: 'source-1',
    translationKey: 'hello-pair',
  });

  it('uses the stable frontmatter slug for locale-aware routes', () => {
    expect(postRoute(en)).toBe('/blog/hello/');
    expect(postRoute(zh)).toBe('/zh/blog/hello/');
  });

  it('resolves the paired translation', () => {
    expect(translatedPost(en, [en, zh])).toBe(zh);
  });

  it('accepts exactly one English and one Chinese translation', () => {
    expect(() => assertBilingualPostPairs([en, zh])).not.toThrow();
  });

  it('rejects a missing translation', () => {
    expect(() => assertBilingualPostPairs([en])).toThrow(/exactly one English and one Chinese/);
  });

  it('rejects mismatched slugs', () => {
    const mismatchedZh = makePost('generated/zh/other', {
      locale: 'zh',
      slug: 'other',
      sourceId: 'source-1',
      translationKey: 'hello-pair',
    });
    expect(() => assertBilingualPostPairs([en, mismatchedZh])).toThrow(/share one public slug/);
  });

  it('rejects mismatched publication states', () => {
    const hiddenZh = makePost('generated/zh/hello', {
      locale: 'zh',
      slug: 'hello',
      sourceId: 'source-1',
      translationKey: 'hello-pair',
      hidden: true,
    });
    expect(() => assertBilingualPostPairs([en, hiddenZh])).toThrow(/share one publication state/);
  });

  it('rejects duplicate public routes', () => {
    const duplicateEn = makePost('generated/en/duplicate', {
      locale: 'en',
      slug: 'hello',
      sourceId: 'source-2',
      translationKey: 'other-pair',
    });
    expect(() => assertBilingualPostPairs([en, zh, duplicateEn])).toThrow(/is claimed by both/);
  });
});

describe('allTags', () => {
  it('returns unique sorted tags', () => {
    const posts = [makePost('a', { tags: ['z', 'a'] }), makePost('b', { tags: ['a', 'b'] })];
    expect(allTags(posts)).toEqual(['a', 'b', 'z']);
  });
});

describe('allCategories', () => {
  it('returns unique sorted categories', () => {
    const posts = [
      makePost('a', { categories: ['cs', 'ai'] }),
      makePost('b', { categories: ['ai'] }),
    ];
    expect(allCategories(posts)).toEqual(['ai', 'cs']);
  });
});

describe('relatedPosts', () => {
  it('excludes the current post', () => {
    const current = makePost('a', { tags: ['x'] });
    const other = makePost('b', { tags: ['x'] });
    const result = relatedPosts(current, [current, other]);
    expect(result.every((p) => p.id !== 'a')).toBe(true);
  });

  it('returns posts sorted by tag overlap', () => {
    const current = makePost('a', { tags: ['x', 'y', 'z'] });
    const high = makePost('high', { tags: ['x', 'y', 'z'] });
    const low = makePost('low', { tags: ['x'] });
    const result = relatedPosts(current, [current, low, high]);
    expect(result[0].id).toBe('high');
  });

  it('excludes posts with no shared tags', () => {
    const current = makePost('a', { tags: ['x'] });
    const unrelated = makePost('b', { tags: ['q'] });
    expect(relatedPosts(current, [current, unrelated])).toHaveLength(0);
  });

  it('excludes draft, hidden, and other-locale posts', () => {
    const current = makePost('a', { tags: ['x'], locale: 'en' });
    const draft = makePost('draft', { tags: ['x'], draft: true });
    const hidden = makePost('hidden', { tags: ['x'], hidden: true });
    const chinese = makePost('zh', { tags: ['x'], locale: 'zh' });
    expect(relatedPosts(current, [current, draft, hidden, chinese])).toEqual([]);
  });

  it('respects the limit parameter', () => {
    const current = makePost('a', { tags: ['x'] });
    const others = ['b', 'c', 'd'].map((id) => makePost(id, { tags: ['x'] }));
    expect(relatedPosts(current, [current, ...others], 2)).toHaveLength(2);
  });
});
