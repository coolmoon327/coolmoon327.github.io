import { site } from '@config/site';
import type { APIContext } from 'astro';

const routes = [
  '/',
  '/publications/',
  '/projects/',
  '/research/',
  '/research/openraas-thesis/',
  '/blog/',
  '/zh/',
  '/zh/publications/',
  '/zh/projects/',
  '/zh/research/',
  '/zh/research/openraas-thesis/',
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

export function GET(_context: APIContext): Response {
  const origin = site.url.replace(/\/$/, '');
  const base = site.base.replace(/\/$/, '');
  const entries = routes
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
