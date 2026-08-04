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

describe('localized Blog and Owner Access copy', () => {
  it('keeps both locales structurally aligned', () => {
    const english = site.pages.localized.en;
    const chinese = site.pages.localized.zh;

    expect(Object.keys(chinese.blog).sort()).toEqual(Object.keys(english.blog).sort());
    expect(Object.keys(chinese.blog.protected).sort()).toEqual(
      Object.keys(english.blog.protected).sort(),
    );
    expect(Object.keys(chinese.owner).sort()).toEqual(Object.keys(english.owner).sort());
  });

  it('provides every component-owned label through site configuration', () => {
    for (const locale of ['en', 'zh'] as const) {
      const { blog, owner } = site.pages.localized[locale];
      const labels = [
        blog.protectedLabel,
        blog.rssLabel,
        ...Object.values(blog.protected),
        owner.internetGroup,
        owner.homeGroup,
        owner.internetBadge,
        owner.homeBadge,
      ];

      expect(labels.every((label) => label.trim().length > 0)).toBe(true);
    }
  });
});
