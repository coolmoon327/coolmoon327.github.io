const baseUrl = (process.argv[2] ?? 'http://127.0.0.1:4321').replace(/\/$/, '');
const previewUrl = new URL(baseUrl);
const basePath = previewUrl.pathname.replace(/\/$/, '');
const routeUrl = (path) => new URL(`${basePath}${path}`, previewUrl.origin);
const routeHref = (path) => `${basePath}${path}` || '/';
const attributeValue = (tag, name) =>
  tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'))?.[1];
const paschalisProfileUrl = 'https://www.ku.ac.ae/college-people/paschalis-sofotasios';
const gameIds = [
  'runner',
  'bandit',
  'qpath',
  'return',
  'world',
  'stl',
  'movable',
  'pinching',
  'secrecy',
  'hopper',
  'backscatter',
  'resilience',
  'orbit',
  'signature',
  'echo',
  'match',
  'merge',
  'resource',
];

const coreRoutes = [
  {
    path: '/',
    lang: 'en',
    marker: 'Yuhang Shen',
    switchHref: '/zh/',
    embeddedGames: ['orbit'],
  },
  {
    path: '/research/',
    lang: 'en',
    marker: 'Current doctoral research',
    switchHref: '/zh/research/',
    advisorHref: paschalisProfileUrl,
    embeddedGames: ['secrecy'],
    requiredMarkers: [
      'Academic background',
      'selected recognition',
      'PhD Research-Path Scholarship',
      'Annual stipend: AED 240,000',
      'B.Econ. in Finance',
      'M.Eng. in Information and Communication Engineering',
    ],
    forbiddenMarkers: [
      'official working title recorded by the program',
      'public descriptions intentionally remain',
      'under review and are summarized only at the theme level',
      '>Experience</h3>',
      'B.A. in Finance',
      'M.Eng. in Network Engineering',
    ],
  },
  {
    path: '/research/openraas-thesis/',
    lang: 'en',
    marker: 'Public implementation trail',
    switchHref: '/zh/research/openraas-thesis/',
    embeddedGames: ['resource'],
    requiredMarkers: ['M.Eng. in Information and Communication Engineering'],
    forbiddenMarkers: ['M.Eng. in Network Engineering'],
  },
  {
    path: '/publications/',
    lang: 'en',
    marker: 'Publications',
    switchHref: '/zh/publications/',
  },
  {
    path: '/projects/',
    lang: 'en',
    marker: 'Projects',
    switchHref: '/zh/projects/',
    requiredMarkers: ['single research narrative'],
    forbiddenMarkers: ['only when it is ready for public release'],
  },
  {
    path: '/blog/',
    lang: 'en',
    marker: 'A home for research notes, engineering notebooks, and reading notes.',
    switchHref: '/zh/blog/',
    requiredMarkers: ['Protected notes'],
    forbiddenMarkers: ['after the site structure is approved'],
    blogLocale: 'en',
  },
  {
    path: '/blog/protected/',
    lang: 'en',
    marker: 'Protected notes',
    switchHref: '/zh/blog/protected/',
    protectedBlog: true,
  },
  {
    path: '/games/',
    lang: 'en',
    marker: 'Eighteen small, dependency-free games',
    switchHref: '/zh/games/',
    embeddedGames: gameIds,
  },
  {
    path: '/playground/',
    lang: 'en',
    marker: 'Eighteen small, dependency-free games',
    switchHref: '/zh/playground/',
    embeddedGames: gameIds,
  },
  {
    path: '/owner/',
    lang: 'en',
    marker: 'Unlock current home links',
    switchHref: '/zh/owner/',
    owner: true,
  },
  {
    path: '/zh/',
    lang: 'zh-CN',
    marker: '近期发表与录用论文',
    switchHref: '/',
    embeddedGames: ['orbit'],
  },
  {
    path: '/zh/research/',
    lang: 'zh-CN',
    marker: '当前博士研究',
    switchHref: '/research/',
    advisorHref: paschalisProfileUrl,
    embeddedGames: ['secrecy'],
    requiredMarkers: [
      '学术背景与代表性荣誉',
      '博士阶段科研奖学金',
      '每年津贴 24 万迪拉姆',
      '金融学专业经济学学士',
      '信息与通信工程专业工学硕士',
    ],
    forbiddenMarkers: [
      '培养项目登记时采用的暂定题目',
      '公开说明仅概述研究问题',
      '正在审稿，本页仅概述其研究方向',
      '>研究与工程经历</h3>',
      '金融学专业文学学士',
      '网络工程专业工学硕士',
    ],
  },
  {
    path: '/zh/research/openraas-thesis/',
    lang: 'zh-CN',
    marker: '相关开源实现',
    switchHref: '/research/openraas-thesis/',
    embeddedGames: ['resource'],
    requiredMarkers: ['工学硕士（信息与通信工程）'],
    forbiddenMarkers: ['工学硕士（网络工程）'],
  },
  {
    path: '/zh/publications/',
    lang: 'zh-CN',
    marker: '论文',
    switchHref: '/publications/',
  },
  {
    path: '/zh/projects/',
    lang: 'zh-CN',
    marker: '项目',
    switchHref: '/projects/',
    requiredMarkers: ['串联为一条完整的研究脉络'],
    forbiddenMarkers: ['博士阶段代码达到公开条件后再纳入'],
  },
  {
    path: '/zh/blog/',
    lang: 'zh-CN',
    marker: '博客用于整理研究笔记、工程记录与阅读笔记，文章会在这里陆续发布。',
    switchHref: '/blog/',
    requiredMarkers: ['受保护笔记'],
    forbiddenMarkers: ['待网站结构稳定后'],
    blogLocale: 'zh',
  },
  {
    path: '/zh/blog/protected/',
    lang: 'zh-CN',
    marker: '受保护笔记',
    switchHref: '/blog/protected/',
    protectedBlog: true,
  },
  {
    path: '/zh/games/',
    lang: 'zh-CN',
    marker: '这里有 18 款无需额外依赖的轻量小游戏',
    switchHref: '/games/',
    embeddedGames: gameIds,
  },
  {
    path: '/zh/playground/',
    lang: 'zh-CN',
    marker: '这里有 18 款无需额外依赖的轻量小游戏',
    switchHref: '/playground/',
    embeddedGames: gameIds,
  },
  {
    path: '/zh/owner/',
    lang: 'zh-CN',
    marker: '解锁家庭服务目录',
    switchHref: '/owner/',
    owner: true,
    ownerHeaderClass: 'owner-header--zh',
  },
];

const removedDemoRoutes = [
  '/people/',
  '/books/',
  '/cv/',
  '/news/',
  '/teaching/',
  '/repositories/',
  '/blog/welcome/',
  '/projects/as-folio/',
];

const failures = [];
const blogIndexLinks = new Map();

for (const route of coreRoutes) {
  const response = await fetch(routeUrl(route.path), { redirect: 'manual' });
  const html = await response.text();
  const languagePattern = new RegExp(`<html[^>]+lang=["']?${route.lang}`, 'i');
  if (response.status !== 200) {
    failures.push(`${route.path}: expected 200, received ${response.status}`);
  }
  if (!languagePattern.test(html)) {
    failures.push(`${route.path}: missing html lang=${route.lang}`);
  }
  if (!html.includes(route.marker)) {
    failures.push(`${route.path}: missing expected content marker`);
  }
  if (!html.includes(`href="${routeHref(route.switchHref)}"`)) {
    failures.push(`${route.path}: missing corresponding language switch`);
  }
  for (const marker of route.requiredMarkers ?? []) {
    if (!html.includes(marker)) {
      failures.push(`${route.path}: missing required public marker: ${marker}`);
    }
  }
  for (const marker of route.forbiddenMarkers ?? []) {
    if (html.includes(marker)) {
      failures.push(`${route.path}: contains retired internal-facing copy: ${marker}`);
    }
  }
  if (
    route.ownerHeaderClass &&
    !new RegExp(`<header[^>]*class=["'][^"']*\\b${route.ownerHeaderClass}\\b[^"']*["']`, 'i').test(
      html,
    )
  ) {
    failures.push(
      `${route.path}: missing ${route.ownerHeaderClass} on the rendered header element`,
    );
  }
  if (route.advisorHref && !html.includes(`href="${route.advisorHref}"`)) {
    failures.push(`${route.path}: missing Paschalis Sofotasios KU profile link`);
  }
  if (route.advisorHref && html.includes('khazna.ku.ac.ae/en/persons/paschalis-sofotasios')) {
    failures.push(`${route.path}: still contains the retired Paschalis Sofotasios Khazna link`);
  }
  const embedScriptCount = (
    html.match(/<script\b[^>]*\bsrc=["'][^"']*\/pocket-play\/embed\.js["'][^>]*>/gi) ?? []
  ).length;
  const expectedEmbedScriptCount = route.embeddedGames ? 1 : 0;
  if (embedScriptCount !== expectedEmbedScriptCount) {
    failures.push(
      `${route.path}: expected ${expectedEmbedScriptCount} pocket-game embed script, found ${embedScriptCount}`,
    );
  }
  if (route.embeddedGames) {
    const embeddedGames = [...html.matchAll(/<pocket-game\b[^>]*\bgame="([^"]+)"/g)].map(
      (match) => match[1],
    );
    if (embeddedGames.length !== route.embeddedGames.length) {
      failures.push(
        `${route.path}: expected ${route.embeddedGames.length} embedded games, found ${embeddedGames.length}`,
      );
    }
    if (new Set(embeddedGames).size !== embeddedGames.length) {
      failures.push(`${route.path}: contains duplicate embedded game ids`);
    }
    for (const gameId of route.embeddedGames) {
      if (!embeddedGames.includes(gameId)) {
        failures.push(`${route.path}: missing embedded game ${gameId}`);
      }
    }
    const expectedGameLanguage = route.lang === 'zh-CN' ? 'zh-CN' : 'en';
    const localizedGames = [
      ...html.matchAll(new RegExp(`<pocket-game\\b[^>]*\\blang="${expectedGameLanguage}"`, 'g')),
    ].length;
    if (localizedGames !== route.embeddedGames.length) {
      failures.push(
        `${route.path}: expected ${route.embeddedGames.length} games with lang=${expectedGameLanguage}, found ${localizedGames}`,
      );
    }
  }
  if (/\b(?:\d{1,3}\.){3}\d{1,3}\b/.test(html)) {
    failures.push(`${route.path}: contains an IPv4 literal`);
  }
  if (/github_pat_|ghp_[A-Za-z0-9]{20,}|BEGIN (?:OPENSSH |RSA )?PRIVATE KEY/.test(html)) {
    failures.push(`${route.path}: contains credential-like material`);
  }
  if (route.owner && !html.includes('noindex, nofollow')) {
    failures.push(`${route.path}: missing noindex, nofollow`);
  }
  if (route.owner && (!html.includes('data-home-access') || !html.includes('type="password"'))) {
    failures.push(`${route.path}: missing the encrypted owner gateway shell`);
  }
  if (route.protectedBlog && !html.includes('noindex, nofollow, noarchive')) {
    failures.push(`${route.path}: missing protected-blog noindex policy`);
  }
  if (
    route.protectedBlog &&
    (!html.includes('data-protected-blog') || !html.includes('type="password"'))
  ) {
    failures.push(`${route.path}: missing the protected-blog decryption shell`);
  }
  if (route.blogLocale) {
    const expectedPrefix = routeHref(route.blogLocale === 'zh' ? '/zh/blog/' : '/blog/');
    const links = [...html.matchAll(/<a\b[^>]*>/gi)]
      .map((match) => match[0])
      .filter((tag) => (attributeValue(tag, 'class') ?? '').split(/\s+/).includes('post-title'))
      .map((tag) => attributeValue(tag, 'href'))
      .filter((href) => typeof href === 'string' && href.startsWith(expectedPrefix));
    blogIndexLinks.set(route.blogLocale, [...new Set(links)]);
  }
  if (/Albert Einstein|Linus Torvalds|Dadang NH/.test(html)) {
    failures.push(`${route.path}: contains an upstream demo identity`);
  }
  console.log(`core ${response.status} ${route.lang.padEnd(5)} ${route.path}`);
}

const enBlogLinks = blogIndexLinks.get('en') ?? [];
const zhBlogLinks = blogIndexLinks.get('zh') ?? [];
const slugFromBlogHref = (href, locale) => {
  const prefix = routeHref(locale === 'zh' ? '/zh/blog/' : '/blog/');
  return href.startsWith(prefix) ? href.slice(prefix.length).replace(/\/$/, '') : '';
};
const enBlogSlugs = new Set(
  enBlogLinks.map((href) => slugFromBlogHref(href, 'en')).filter(Boolean),
);
const zhBlogSlugs = new Set(
  zhBlogLinks.map((href) => slugFromBlogHref(href, 'zh')).filter(Boolean),
);

if (enBlogLinks.length === 0 || zhBlogLinks.length === 0) {
  failures.push('blog indexes: expected at least one public post in each locale');
}
if (enBlogLinks.length !== zhBlogLinks.length) {
  failures.push(
    `blog indexes: English has ${enBlogLinks.length} posts but Chinese has ${zhBlogLinks.length}`,
  );
}
for (const slug of new Set([...enBlogSlugs, ...zhBlogSlugs])) {
  if (!enBlogSlugs.has(slug) || !zhBlogSlugs.has(slug)) {
    failures.push(`blog indexes: bilingual route pair is incomplete for ${slug}`);
    continue;
  }

  const pairs = [
    { locale: 'en', lang: 'en', path: `/blog/${slug}/`, alternate: `/zh/blog/${slug}/` },
    { locale: 'zh', lang: 'zh-CN', path: `/zh/blog/${slug}/`, alternate: `/blog/${slug}/` },
  ];
  const responses = await Promise.all(
    pairs.map(async (pair) => {
      const response = await fetch(routeUrl(pair.path), { redirect: 'manual' });
      return { pair, response, html: await response.text() };
    }),
  );
  for (const { pair, response, html } of responses) {
    if (response.status !== 200) {
      failures.push(`${pair.path}: expected 200, received ${response.status}`);
    }
    if (!new RegExp(`<html[^>]+lang=["']?${pair.lang}`, 'i').test(html)) {
      failures.push(`${pair.path}: missing html lang=${pair.lang}`);
    }
    if (!html.includes(`href="${routeHref(pair.alternate)}"`)) {
      failures.push(`${pair.path}: missing paired-language article link`);
    }
    console.log(`post ${response.status} ${pair.locale.padEnd(2)}    ${pair.path}`);
  }
}

for (const path of removedDemoRoutes) {
  const response = await fetch(routeUrl(path), { redirect: 'manual' });
  if (response.status !== 404) {
    failures.push(`${path}: expected 404, received ${response.status}`);
  }
  console.log(`demo ${response.status}       ${path}`);
}

const pocketAssets = [
  '/pocket-play/embed.js',
  '/pocket-play/embed.css',
  '/pocket-play/games.json',
  ...gameIds.map((gameId) => `/pocket-play/games/${gameId}/`),
];

for (const path of pocketAssets) {
  const response = await fetch(routeUrl(path), { redirect: 'manual' });
  if (response.status !== 200) {
    failures.push(`${path}: expected 200, received ${response.status}`);
  }
  console.log(`asset ${response.status}       ${path}`);
}

if (failures.length > 0) {
  console.error('\nRoute validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(
    `\nValidated ${coreRoutes.length} core routes, ${pocketAssets.length} game assets, and ${removedDemoRoutes.length} removed demo routes.`,
  );
}
