import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

async function loadSite() {
  return import('./site');
}

let site: Awaited<ReturnType<typeof loadSite>>['site'];

beforeAll(async () => {
  vi.stubEnv('SITE', 'https://example.test/');
  vi.stubEnv('BASE_URL', '/');
  ({ site } = await loadSite());
});

afterAll(() => {
  vi.unstubAllEnvs();
});

describe('localized Blog, Research News, and Owner Access copy', () => {
  it('keeps both locales structurally aligned', () => {
    const english = site.pages.localized.en;
    const chinese = site.pages.localized.zh;

    expect(Object.keys(chinese.blog).sort()).toEqual(Object.keys(english.blog).sort());
    expect(Object.keys(chinese.blog.protected).sort()).toEqual(
      Object.keys(english.blog.protected).sort(),
    );
    expect(Object.keys(chinese.news).sort()).toEqual(Object.keys(english.news).sort());
    expect(Object.keys(chinese.news.modules).sort()).toEqual(
      Object.keys(english.news.modules).sort(),
    );
    expect(Object.keys(chinese.news.keywordGroups).sort()).toEqual(
      Object.keys(english.news.keywordGroups).sort(),
    );
    expect(Object.keys(chinese.news.keywords).sort()).toEqual(
      Object.keys(english.news.keywords).sort(),
    );
    expect(Object.keys(chinese.owner).sort()).toEqual(Object.keys(english.owner).sort());
  });

  it('provides every component-owned label through site configuration', () => {
    for (const locale of ['en', 'zh'] as const) {
      const { blog, news, owner } = site.pages.localized[locale];
      const labels = [
        blog.protectedLabel,
        blog.rssLabel,
        ...Object.values(blog.protected),
        news.filtersLabel,
        news.moduleLabel,
        news.keywordLabel,
        news.authorLabel,
        news.authorsLabel,
        news.resetAction,
        news.moreAuthors,
        ...Object.values(news.modules),
        ...Object.values(news.keywordGroups),
        ...Object.values(news.keywords),
        owner.internetGroup,
        owner.homeGroup,
        owner.internetBadge,
        owner.homeBadge,
      ];

      expect(labels.every((label) => label.trim().length > 0)).toBe(true);
    }
  });

  it('describes post-level author lists as coverage rather than a shared byline', () => {
    expect(site.pages.localized.en.news.authorsLabel).toBe('Authors covered');
    expect(site.pages.localized.zh.news.authorsLabel).toBe('本期涉及作者');
  });

  it('names the four core fields in both localized Research News introductions', () => {
    expect(site.pages.localized.en.news.intro).toContain('wireless communications');
    expect(site.pages.localized.en.news.intro).toContain('physical-layer security');
    expect(site.pages.localized.en.news.intro).toContain('reinforcement learning');
    expect(site.pages.localized.en.news.intro).toContain('convex optimization');

    expect(site.pages.localized.zh.news.intro).toContain('无线通信');
    expect(site.pages.localized.zh.news.intro).toContain('物理层安全');
    expect(site.pages.localized.zh.news.intro).toContain('强化学习');
    expect(site.pages.localized.zh.news.intro).toContain('凸优化');
  });

  it('keeps Research News first in the More menu without adding a top-level item', () => {
    for (const locale of ['en', 'zh'] as const) {
      const items = site.i18n.locales[locale].navbar.items;
      const more = items.find((item) => 'children' in item);
      expect(more && 'children' in more ? more.children[0]?.href : undefined).toBe(
        locale === 'zh' ? '/zh/news/' : '/news/',
      );
    }
  });
});
