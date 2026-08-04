import rss from '@astrojs/rss';
import { site } from '@config/site';
import { assertBilingualPostPairs, postRoute, sortPosts, visiblePosts } from '@utils/posts';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export async function GET(context: APIContext) {
  const allPosts = await getCollection('posts');
  assertBilingualPostPairs(allPosts);
  const posts = sortPosts(visiblePosts(allPosts, 'en'));

  return rss({
    title: site.blog?.name || site.title,
    description: site.blog?.description || site.description,
    site: context.site ?? site.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description ?? '',
      pubDate: post.data.date,
      link: `${site.base}${postRoute(post)}`,
      categories: [...(post.data.tags ?? []), ...(post.data.categories ?? [])],
      author: site.author.email ? `${site.author.email} (${site.author.name})` : site.author.name,
    })),
    customData: [
      `<language>${site.lang}</language>`,
      site.author.email
        ? `<managingEditor>${site.author.email} (${site.author.name})</managingEditor>`
        : '',
      `<generator>as-folio (Astro)</generator>`,
    ]
      .filter(Boolean)
      .join('\n'),
  });
}
