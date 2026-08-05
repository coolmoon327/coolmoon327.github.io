import { site } from '@config/site';
import { assertBilingualNewsPairs, listedNews, newsRoute } from '@utils/news';
import { assertBilingualPostPairs, postRoute, visiblePosts } from '@utils/posts';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

const routes = [
  '/',
  '/publications/',
  '/projects/',
  '/research/',
  '/research/openraas-thesis/',
  '/games/',
  '/playground/',
  '/news/',
  '/blog/',
  '/zh/',
  '/zh/publications/',
  '/zh/projects/',
  '/zh/research/',
  '/zh/research/openraas-thesis/',
  '/zh/games/',
  '/zh/playground/',
  '/zh/news/',
  '/zh/blog/',
] as const;

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export async function GET(_context: APIContext): Promise<Response> {
  const origin = site.url.replace(/\/$/, '');
  const base = site.base.replace(/\/$/, '');
  const allPosts = await getCollection('posts');
  const allNews = await getCollection('news');
  assertBilingualPostPairs(allPosts);
  assertBilingualNewsPairs(allNews);
  const postRoutes = visiblePosts(allPosts).map(postRoute).sort();
  const newsRoutes = listedNews(allNews).map(newsRoute).sort();
  const entries = [...routes, ...postRoutes, ...newsRoutes]
    .map((route) => `  <url><loc>${escapeXml(`${origin}${base}${route}`)}</loc></url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
