const baseUrl = (process.argv[2] ?? 'http://127.0.0.1:4321').replace(/\/$/, '');
const previewUrl = new URL(baseUrl);
const basePath = previewUrl.pathname.replace(/\/$/, '');
const routeUrl = (path) => new URL(`${basePath}${path}`, previewUrl.origin);
const routeHref = (path) => `${basePath}${path}` || '/';
const paschalisProfileUrl = 'https://www.ku.ac.ae/college-people/paschalis-sofotasios';
const gameIds = [
  'runner',
  'bandit',
  'qpath',
  'return',
  'movable',
  'pinching',
  'secrecy',
  'hopper',
  'orbit',
  'signature',
  'echo',
  'match',
  'merge',
  'resource',
];

const coreRoutes = [
  { path: '/', lang: 'en', marker: 'Yuhang Shen', switchHref: '/zh/' },
  {
    path: '/research/',
    lang: 'en',
    marker: 'Current doctoral research',
    switchHref: '/zh/research/',
    advisorHref: paschalisProfileUrl,
    requiredMarkers: [
      'Academic background',
      'selected recognition',
      'PhD Research-Path Scholarship',
      'Annual stipend: AED 240,000',
      'B.Econ. in Finance',
    ],
    forbiddenMarkers: [
      'official working title recorded by the program',
      'public descriptions intentionally remain',
      'under review and are summarized only at the theme level',
      '>Experience</h3>',
      'B.A. in Finance',
    ],
  },
  {
    path: '/research/openraas-thesis/',
    lang: 'en',
    marker: 'Public implementation trail',
    switchHref: '/zh/research/openraas-thesis/',
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
    marker: 'Writing will live here.',
    switchHref: '/zh/blog/',
    requiredMarkers: ['A home for research notes, engineering notebooks, and reading notes.'],
    forbiddenMarkers: ['after the site structure is approved'],
  },
  {
    path: '/games/',
    lang: 'en',
    marker: 'Fourteen small, dependency-free games',
    switchHref: '/zh/games/',
    games: true,
  },
  {
    path: '/playground/',
    lang: 'en',
    marker: 'Fourteen small, dependency-free games',
    switchHref: '/zh/playground/',
    games: true,
  },
  {
    path: '/owner/',
    lang: 'en',
    marker: 'Unlock current home links',
    switchHref: '/zh/owner/',
    owner: true,
  },
  { path: '/zh/', lang: 'zh-CN', marker: '近期发表与录用论文', switchHref: '/' },
  {
    path: '/zh/research/',
    lang: 'zh-CN',
    marker: '当前博士研究',
    switchHref: '/research/',
    advisorHref: paschalisProfileUrl,
    requiredMarkers: [
      '学术背景与代表性荣誉',
      '博士阶段科研奖学金',
      '每年津贴 24 万迪拉姆',
      '金融学专业经济学学士',
    ],
    forbiddenMarkers: [
      '培养项目登记时采用的暂定题目',
      '公开说明仅概述研究问题',
      '正在审稿，本页仅概述其研究方向',
      '>研究与工程经历</h3>',
      '金融学专业文学学士',
    ],
  },
  {
    path: '/zh/research/openraas-thesis/',
    lang: 'zh-CN',
    marker: '相关开源实现',
    switchHref: '/research/openraas-thesis/',
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
    marker: '文章将在这里陆续发布',
    switchHref: '/blog/',
    requiredMarkers: ['整理研究笔记、工程记录与阅读笔记'],
    forbiddenMarkers: ['待网站结构稳定后'],
  },
  {
    path: '/zh/games/',
    lang: 'zh-CN',
    marker: '这里有 14 款无需额外依赖的轻量小游戏',
    switchHref: '/games/',
    games: true,
  },
  {
    path: '/zh/playground/',
    lang: 'zh-CN',
    marker: '这里有 14 款无需额外依赖的轻量小游戏',
    switchHref: '/playground/',
    games: true,
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
  if (route.games) {
    const embeddedGames = [...html.matchAll(/<pocket-game\b[^>]*\bgame="([^"]+)"/g)].map(
      (match) => match[1],
    );
    if (embeddedGames.length !== gameIds.length) {
      failures.push(
        `${route.path}: expected ${gameIds.length} embedded games, found ${embeddedGames.length}`,
      );
    }
    for (const gameId of gameIds) {
      if (!embeddedGames.includes(gameId)) {
        failures.push(`${route.path}: missing embedded game ${gameId}`);
      }
    }
    const expectedGameLanguage = route.lang === 'zh-CN' ? 'zh-CN' : 'en';
    const localizedGames = [
      ...html.matchAll(new RegExp(`<pocket-game\\b[^>]*\\blang="${expectedGameLanguage}"`, 'g')),
    ].length;
    if (localizedGames !== gameIds.length) {
      failures.push(
        `${route.path}: expected ${gameIds.length} games with lang=${expectedGameLanguage}, found ${localizedGames}`,
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
  if (/Albert Einstein|Linus Torvalds|Dadang NH/.test(html)) {
    failures.push(`${route.path}: contains an upstream demo identity`);
  }
  console.log(`core ${response.status} ${route.lang.padEnd(5)} ${route.path}`);
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
