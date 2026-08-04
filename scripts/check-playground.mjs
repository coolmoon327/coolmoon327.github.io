import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

import { chromium } from 'playwright';

const baseUrl = (process.argv[2] ?? 'http://127.0.0.1:4321').replace(/\/$/, '');
const outputDir = path.resolve(process.argv[3] ?? 'test-results/playground');
const standaloneUrl = process.argv[4]?.replace(/\/$/, '');
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined;
const browserErrors = [];
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
const chineseTitles = {
  runner: '奖励跑酷',
  bandit: '探索与利用',
  qpath: '路由学徒',
  return: '折扣回报',
  world: '潜空间预演',
  stl: '时序语义哨兵',
  movable: '可移动天线实验',
  pinching: '夹持天线实验',
  secrecy: '保密波束实验',
  hopper: '跳频学徒',
  backscatter: '借波突围',
  resilience: '断链续航',
  orbit: '链路捕获',
  signature: '灵感星图',
  echo: '信号回放',
  match: '图样记忆',
  merge: '论文花园',
  resource: 'OpenRaaS 组网',
};
const chinesePlaygroundPath = new URL(`${baseUrl}/zh/playground/`).pathname;

async function loadAllGames(page) {
  for (let index = 0; index < gameIds.length; index += 1) {
    const game = page.locator('pocket-game').nth(index);
    await game.scrollIntoViewIfNeeded();
    await game.evaluate(
      (element) =>
        new Promise((resolve) => {
          const frame = element.shadowRoot?.querySelector('iframe');
          if (
            frame?.contentDocument?.readyState === 'complete' &&
            frame.contentWindow?.location.href !== 'about:blank'
          ) {
            resolve();
            return;
          }
          frame?.addEventListener('load', resolve, { once: true });
        }),
    );
  }
}

async function auditCollectionPacking(page, label) {
  const collections = await page.locator('.collection').evaluateAll((sections) =>
    sections.map((section) =>
      [...section.querySelectorAll('.game-column')].map((column) => ({
        left: Math.round(column.getBoundingClientRect().left),
        rowGap: Number.parseFloat(getComputedStyle(column).rowGap),
        cards: [...column.querySelectorAll('.game-card')].map((card) => {
          const cardRect = card.getBoundingClientRect();
          const copyRect = card.querySelector('.game-copy').getBoundingClientRect();
          const stageRect = card.querySelector('.game-stage').getBoundingClientRect();
          return {
            top: cardRect.top,
            bottom: cardRect.bottom,
            copyBottom: copyRect.bottom,
            stageTop: stageRect.top,
          };
        }),
      })),
    ),
  );

  for (const [collectionIndex, columns] of collections.entries()) {
    assert.equal(columns.length, 2, `${label} collection ${collectionIndex + 1} needs two columns`);
    assert.notEqual(
      columns[0].left,
      columns[1].left,
      `${label} collection ${collectionIndex + 1} columns must be side by side`,
    );
    assert.equal(
      columns[0].cards.length,
      columns[1].cards.length,
      `${label} collection ${collectionIndex + 1} must split cards evenly`,
    );

    for (const column of columns) {
      assert.equal(column.rowGap, 16, 'Desktop game columns must use a 16px row gap');
      for (const card of column.cards) {
        assert.ok(
          card.stageTop >= card.copyBottom,
          'Each game stage must sit below its copy block',
        );
      }
      for (let index = 1; index < column.cards.length; index += 1) {
        const gap = column.cards[index].top - column.cards[index - 1].bottom;
        assert.ok(
          Math.abs(gap - column.rowGap) <= 0.5,
          `Game column gap ${gap}px does not match its ${column.rowGap}px CSS row gap`,
        );
      }
    }

    const columnSpans = columns.map((column) => {
      const first = column.cards[0];
      const last = column.cards.at(-1);
      return last.bottom - first.top;
    });
    assert.ok(
      Math.abs(columnSpans[0] - columnSpans[1]) <= 180,
      `${label} collection ${collectionIndex + 1} columns differ by ${Math.abs(columnSpans[0] - columnSpans[1])}px`,
    );
  }
}

async function auditMobileReadingOrder(page, label) {
  const collections = await page.locator('.collection').evaluateAll((sections) =>
    sections.map((section) => {
      const grid = section.querySelector('.game-columns');
      const cards = [...section.querySelectorAll('.game-card')]
        .map((card) => ({
          bottom: card.getBoundingClientRect().bottom,
          index: Number(card.querySelector('.game-index')?.textContent),
          top: card.getBoundingClientRect().top,
        }))
        .sort((first, second) => first.top - second.top);

      return {
        gaps: cards.slice(1).map((card, index) => card.top - cards[index].bottom),
        indices: cards.map((card) => card.index),
        rowGap: Number.parseFloat(getComputedStyle(grid).rowGap),
      };
    }),
  );

  for (const { gaps, indices, rowGap } of collections) {
    assert.deepEqual(
      indices,
      [...indices].sort((first, second) => first - second),
      `${label} cards must keep their numbered reading order`,
    );
    assert.equal(rowGap, 16, `${label} must use a 16px row gap`);
    assert.ok(
      gaps.every((gap) => Math.abs(gap - rowGap) <= 0.5),
      `${label} card gaps ${gaps.join(', ')}px must match the ${rowGap}px CSS row gap`,
    );
  }
}

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  ...(executablePath ? { executablePath } : {}),
});

function watchPage(page, label) {
  page.on('pageerror', (error) => browserErrors.push(`${label}: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().startsWith('Failed to load resource:')) {
      browserErrors.push(
        `${label} console: ${message.text()}${message.location().url ? ` (${message.location().url})` : ''}`,
      );
    }
  });
  page.on('response', (response) => {
    if (new URL(response.url()).origin === new URL(baseUrl).origin && response.status() >= 400) {
      browserErrors.push(`${label} response: ${response.status()} ${response.url()}`);
    }
  });
  page.on('requestfailed', (request) => {
    if (new URL(request.url()).origin === new URL(baseUrl).origin) {
      browserErrors.push(
        `${label} request: ${request.url()} (${request.failure()?.errorText || 'failed'})`,
      );
    }
  });
}

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  watchPage(page, 'playground');
  await page.goto(`${baseUrl}/playground/`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => customElements.get('pocket-game'));

  const renderedGameIds = await page
    .locator('pocket-game')
    .evaluateAll((games) => games.map((game) => game.getAttribute('game')));
  assert.deepEqual(
    [...renderedGameIds].sort(),
    [...gameIds].sort(),
    'English Playground must render all eighteen games once',
  );

  await loadAllGames(page);
  await auditCollectionPacking(page, 'English Playground');

  await page.screenshot({ path: path.join(outputDir, 'playground-en.png'), fullPage: true });

  const languageSwitch = page.locator('a.language-switch:visible').first();
  const switchHref = await languageSwitch.getAttribute('href');
  assert.equal(new URL(switchHref, page.url()).pathname, chinesePlaygroundPath);
  await languageSwitch.click();
  await page.waitForURL((url) => url.pathname === chinesePlaygroundPath);
  await page.waitForLoadState('networkidle');

  assert.equal(await page.locator('html').getAttribute('lang'), 'zh-CN');
  assert.equal((await page.locator('h1').innerText()).replace(/\s/g, ''), '小游戏实验室');
  const chineseTitleLines = await page.locator('h1').evaluate((heading) => {
    const range = document.createRange();
    range.selectNodeContents(heading);
    return range.getClientRects().length;
  });
  assert.equal(chineseTitleLines, 1, 'Chinese Playground title must stay on one line on desktop');
  assert.equal(await page.locator('pocket-game').count(), gameIds.length);
  const gameLanguages = await page
    .locator('pocket-game')
    .evaluateAll((games) => games.map((game) => game.getAttribute('lang')));
  assert.ok(gameLanguages.every((language) => language === 'zh-CN'));
  await loadAllGames(page);

  const localizedGames = await page.locator('pocket-game').evaluateAll((games) =>
    games.map((game) => {
      const frame = game.shadowRoot?.querySelector('iframe');
      return {
        game: game.getAttribute('game'),
        language: frame?.contentDocument?.documentElement.lang,
        title: frame?.contentDocument?.querySelector('h1')?.textContent?.trim(),
      };
    }),
  );
  for (const game of localizedGames) {
    assert.equal(game.language, 'zh-CN', `${game.game} iframe must switch to Chinese`);
    assert.equal(game.title, chineseTitles[game.game], `${game.game} title must be Chinese`);
  }
  const localizedCards = await page.locator('.game-card').evaluateAll((cards) =>
    cards.map((card) => ({
      game: card.querySelector('pocket-game')?.getAttribute('game'),
      title: card.querySelector('h3')?.textContent?.trim(),
    })),
  );
  for (const card of localizedCards) {
    assert.equal(card.title, chineseTitles[card.game], `${card.game} card title must be Chinese`);
  }
  await auditCollectionPacking(page, 'Chinese Playground');

  const runnerSource = await page
    .locator('pocket-game[game="runner"]')
    .evaluate((game) => game.shadowRoot?.querySelector('iframe')?.getAttribute('src'));
  assert.equal(new URL(runnerSource).searchParams.get('lang'), 'zh');
  await page.screenshot({ path: path.join(outputDir, 'playground-zh.png'), fullPage: true });

  await page.setViewportSize({ width: 761, height: 900 });
  const boundaryColumnCounts = await page
    .locator('.collection')
    .evaluateAll((sections) =>
      sections.map(
        (section) =>
          new Set(
            [...section.querySelectorAll('.game-card')].map((card) =>
              Math.round(card.getBoundingClientRect().left),
            ),
          ).size,
      ),
    );
  assert.ok(
    boundaryColumnCounts.every((count) => count === 2),
    '761px Playground must retain two card columns',
  );

  for (const width of [760, 580, 320]) {
    await page.setViewportSize({ width, height: 900 });
    const responsiveLayout = await page.locator('.collection').evaluateAll((sections) => ({
      columnCounts: sections.map(
        (section) =>
          new Set(
            [...section.querySelectorAll('.game-card')].map((card) =>
              Math.round(card.getBoundingClientRect().left),
            ),
          ).size,
      ),
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    assert.ok(
      responsiveLayout.columnCounts.every((count) => count === 1),
      `${width}px Playground must use one card column`,
    );
    assert.ok(
      responsiveLayout.scrollWidth <= responsiveLayout.clientWidth + 1,
      `${width}px Playground must not overflow horizontally`,
    );
    await auditMobileReadingOrder(page, `${width}px Playground`);
  }

  const signaturePage = await browser.newPage({ viewport: { width: 720, height: 520 } });
  watchPage(signaturePage, 'signature');
  await signaturePage.goto(`${baseUrl}/pocket-play/games/signature/?embed=1&lang=en`, {
    waitUntil: 'networkidle',
  });
  const sky = signaturePage.locator('#sky');
  const skyBox = await sky.boundingBox();
  assert.ok(skyBox, 'Signature sky must be visible');
  await sky.click({ position: { x: skyBox.width * 0.5, y: skyBox.height * 0.5 } });
  await sky.click({ position: { x: skyBox.width * 0.24, y: skyBox.height * 0.3 } });
  await sky.click({ position: { x: skyBox.width * 0.72, y: skyBox.height * 0.68 } });
  await signaturePage.waitForFunction(() => document.querySelectorAll('.star').length === 2);

  const endpointDistances = await signaturePage.evaluate(() => {
    const stars = [...document.querySelectorAll('.star')].map((star) => {
      const rect = star.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    });
    const line = document.querySelector('.connection');
    const matrix = line.ownerSVGElement.getScreenCTM();
    const start = new DOMPoint(
      Number(line.getAttribute('x1')),
      Number(line.getAttribute('y1')),
    ).matrixTransform(matrix);
    const end = new DOMPoint(
      Number(line.getAttribute('x2')),
      Number(line.getAttribute('y2')),
    ).matrixTransform(matrix);
    return [
      Math.hypot(start.x - stars[0].x, start.y - stars[0].y),
      Math.hypot(end.x - stars[1].x, end.y - stars[1].y),
    ];
  });
  assert.ok(
    endpointDistances.every((distance) => distance <= 1.5),
    `Signature line endpoints are offset by ${endpointDistances.join(', ')}px`,
  );
  await signaturePage.waitForTimeout(450);
  const signatureDashArray = await signaturePage
    .locator('.connection')
    .evaluate((line) => getComputedStyle(line).strokeDasharray);
  assert.equal(signatureDashArray, 'none', 'Signature connections must remain continuous');
  await signaturePage.screenshot({ path: path.join(outputDir, 'signature-alignment.png') });

  if (standaloneUrl) {
    const standalonePage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    watchPage(standalonePage, 'standalone playground');
    await standalonePage.goto(standaloneUrl, { waitUntil: 'networkidle' });
    await standalonePage.waitForFunction(() => customElements.get('pocket-game'));
    const standaloneGames = await standalonePage
      .locator('pocket-game')
      .evaluateAll((games) => games.map((game) => game.getAttribute('game')));
    assert.deepEqual(
      [...standaloneGames].sort(),
      [...gameIds].sort(),
      'Standalone lab must render all eighteen games once',
    );

    await auditCollectionPacking(standalonePage, 'Standalone lab');

    await standalonePage.locator('[data-language="zh"]').click();
    await standalonePage.waitForURL(/lang=zh-CN/);
    await standalonePage.waitForLoadState('networkidle');
    assert.equal(await standalonePage.locator('html').getAttribute('lang'), 'zh-CN');
    const standaloneLanguages = await standalonePage
      .locator('pocket-game')
      .evaluateAll((games) => games.map((game) => game.getAttribute('lang')));
    assert.ok(standaloneLanguages.every((language) => language === 'zh-CN'));
    await loadAllGames(standalonePage);
    await standalonePage.screenshot({
      path: path.join(outputDir, 'playground-standalone-zh.png'),
      fullPage: true,
    });
  }

  assert.deepEqual(browserErrors, [], 'Playground pages must not emit browser errors');
  console.log(
    `Playground browser QA passed: ${gameIds.length} games, bilingual switch, two-column packing, and signature alignment${standaloneUrl ? ', including the standalone lab' : ''}.`,
  );
} finally {
  await browser.close();
}
