const baseUrl = (process.argv[2] ?? 'http://127.0.0.1:4321').replace(/\/$/, '');

const coreRoutes = [
  { path: '/', lang: 'en', marker: 'Yuhang Shen', switchHref: '/zh/' },
  {
    path: '/research/',
    lang: 'en',
    marker: 'Current doctoral research',
    switchHref: '/zh/research/',
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
  { path: '/projects/', lang: 'en', marker: 'Projects', switchHref: '/zh/projects/' },
  { path: '/blog/', lang: 'en', marker: 'Writing will live here.', switchHref: '/zh/blog/' },
  {
    path: '/owner/',
    lang: 'en',
    marker: 'Unlock current home links',
    switchHref: '/zh/owner/',
    owner: true,
  },
  { path: '/zh/', lang: 'zh-CN', marker: '近期公开工作', switchHref: '/' },
  {
    path: '/zh/research/',
    lang: 'zh-CN',
    marker: '当前博士研究',
    switchHref: '/research/',
  },
  {
    path: '/zh/research/openraas-thesis/',
    lang: 'zh-CN',
    marker: '公开工程脉络',
    switchHref: '/research/openraas-thesis/',
  },
  {
    path: '/zh/publications/',
    lang: 'zh-CN',
    marker: '论文',
    switchHref: '/publications/',
  },
  { path: '/zh/projects/', lang: 'zh-CN', marker: '项目', switchHref: '/projects/' },
  { path: '/zh/blog/', lang: 'zh-CN', marker: '以后文章会发布在这里', switchHref: '/blog/' },
  {
    path: '/zh/owner/',
    lang: 'zh-CN',
    marker: '解锁当前家庭入口',
    switchHref: '/owner/',
    owner: true,
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
  const response = await fetch(`${baseUrl}${route.path}`, { redirect: 'manual' });
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
  if (!html.includes(`href="${route.switchHref}"`)) {
    failures.push(`${route.path}: missing corresponding language switch`);
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
  const response = await fetch(`${baseUrl}${path}`, { redirect: 'manual' });
  if (response.status !== 404) {
    failures.push(`${path}: expected 404, received ${response.status}`);
  }
  console.log(`demo ${response.status}       ${path}`);
}

if (failures.length > 0) {
  console.error('\nRoute validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`\nValidated ${coreRoutes.length} core routes and ${removedDemoRoutes.length} removed demo routes.`);
}
