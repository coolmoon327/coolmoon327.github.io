import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { chromium } from 'playwright';

const baseUrl = (process.argv[2] ?? 'http://127.0.0.1:4321').replace(/\/$/, '');
const previewUrl = new URL(baseUrl);
const basePath = previewUrl.pathname.replace(/\/$/, '');
const outputDir = path.resolve(process.argv[3] ?? 'test-results/responsive');
const auditMode = process.argv[4] ?? 'all';
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined;

assert.ok(
  ['all', 'site', 'games', 'states'].includes(auditMode),
  `Unknown responsive audit mode: ${auditMode}`,
);

const routes = [
  '/',
  '/research/',
  '/research/openraas-thesis/',
  '/publications/',
  '/projects/',
  '/blog/',
  '/news/',
  '/games/',
  '/playground/',
  '/owner/',
  '/zh/',
  '/zh/research/',
  '/zh/research/openraas-thesis/',
  '/zh/publications/',
  '/zh/projects/',
  '/zh/blog/',
  '/zh/news/',
  '/zh/games/',
  '/zh/playground/',
  '/zh/owner/',
  '/404.html',
];

function htmlAttribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'))?.[1] ?? null;
}

async function addRepresentativeNewsDetails() {
  for (const indexRoute of ['/news/', '/zh/news/']) {
    const response = await fetch(baseUrl + indexRoute);
    assert.equal(response.status, 200, `Cannot discover a News detail route from ${indexRoute}`);
    const html = await response.text();
    const cardTag = [...html.matchAll(/<a\b[^>]*>/gi)]
      .map((match) => match[0])
      .find((tag) => (htmlAttribute(tag, 'class') ?? '').split(/\s+/).includes('news-card-link'));
    const href = cardTag ? htmlAttribute(cardTag, 'href') : null;
    assert.ok(href, `No listed News detail link found at ${indexRoute}`);
    const pathname = new URL(href, previewUrl.origin).pathname;
    const route =
      basePath && pathname.startsWith(`${basePath}/`) ? pathname.slice(basePath.length) : pathname;
    if (!routes.includes(route)) routes.push(route);
  }
}

const inlineGamesByRoute = {
  '/': 'orbit',
  '/research/': 'secrecy',
  '/research/openraas-thesis/': 'resource',
  '/zh/': 'orbit',
  '/zh/research/': 'secrecy',
  '/zh/research/openraas-thesis/': 'resource',
};

const gameHeights = {
  runner: 360,
  bandit: 430,
  qpath: 620,
  return: 430,
  world: 660,
  stl: 660,
  movable: 720,
  pinching: 680,
  secrecy: 620,
  hopper: 600,
  backscatter: 680,
  resilience: 600,
  orbit: 360,
  signature: 260,
  echo: 430,
  match: 590,
  merge: 700,
  resource: 540,
};

const viewportScenarios = [
  { name: 'extreme-reflow-195', width: 195, height: 422, mode: 'stress' },
  { name: 'extreme-reflow-240', width: 240, height: 480, mode: 'stress' },
  { name: 'phone-portrait-280', width: 280, height: 653, mode: 'viewport' },
  { name: 'phone-portrait-320', width: 320, height: 568, mode: 'viewport' },
  { name: 'phone-portrait-360', width: 360, height: 800, mode: 'viewport' },
  { name: 'phone-portrait-390', width: 390, height: 844, mode: 'viewport' },
  { name: 'phone-portrait-430', width: 430, height: 932, mode: 'viewport' },
  { name: 'profile-card-boundary-520', width: 520, height: 900, mode: 'viewport' },
  { name: 'profile-card-boundary-521', width: 521, height: 900, mode: 'viewport' },
  { name: 'phone-landscape-short', width: 320, height: 280, mode: 'viewport' },
  { name: 'phone-landscape-568', width: 568, height: 320, mode: 'viewport' },
  { name: 'phone-landscape-667', width: 667, height: 375, mode: 'viewport' },
  { name: 'phone-landscape-844', width: 844, height: 390, mode: 'viewport' },
  { name: 'phone-landscape-932', width: 932, height: 430, mode: 'viewport' },
  { name: 'mobile-boundary-720', width: 720, height: 900, mode: 'viewport' },
  { name: 'tablet-boundary-721', width: 721, height: 900, mode: 'viewport' },
  { name: 'profile-grid-boundary-760', width: 760, height: 900, mode: 'viewport' },
  { name: 'profile-grid-boundary-761', width: 761, height: 900, mode: 'viewport' },
  { name: 'tablet-portrait-768', width: 768, height: 1024, mode: 'viewport' },
  { name: 'tablet-portrait-820', width: 820, height: 1180, mode: 'viewport' },
  { name: 'tablet-boundary-900', width: 900, height: 700, mode: 'viewport' },
  { name: 'desktop-boundary-901', width: 901, height: 700, mode: 'viewport' },
  { name: 'tablet-landscape-1024', width: 1024, height: 768, mode: 'viewport' },
  { name: 'tablet-landscape-1180', width: 1180, height: 820, mode: 'viewport' },
  { name: 'desktop-1366', width: 1366, height: 768, mode: 'viewport' },
  { name: 'desktop-1440', width: 1440, height: 900, mode: 'viewport' },
  {
    name: 'desktop-zoom-67',
    width: Math.round(1440 / 0.67),
    height: Math.round(900 / 0.67),
    mode: 'zoom-equivalent',
    physical: '1440x900',
    zoom: 0.67,
  },
  {
    name: 'desktop-zoom-80',
    width: Math.round(1440 / 0.8),
    height: Math.round(900 / 0.8),
    mode: 'zoom-equivalent',
    physical: '1440x900',
    zoom: 0.8,
  },
  {
    name: 'desktop-zoom-125',
    width: Math.round(1440 / 1.25),
    height: Math.round(900 / 1.25),
    mode: 'zoom-equivalent',
    physical: '1440x900',
    zoom: 1.25,
  },
  {
    name: 'desktop-zoom-150',
    width: Math.round(1440 / 1.5),
    height: Math.round(900 / 1.5),
    mode: 'zoom-equivalent',
    physical: '1440x900',
    zoom: 1.5,
  },
  {
    name: 'desktop-zoom-200',
    width: Math.round(1440 / 2),
    height: Math.round(900 / 2),
    mode: 'zoom-equivalent',
    physical: '1440x900',
    zoom: 2,
  },
];

const directGameWidths = [280, 320, 390, 430, 720];
const landscapeGameScenarios = [
  { name: 'landscape-568', width: 568, height: 320 },
  { name: 'landscape-844', width: 844, height: 390 },
  { name: 'landscape-932', width: 932, height: 430 },
];

const failures = [];
const results = {
  baseUrl,
  routes,
  viewportScenarios,
  directGameWidths,
  landscapeGameScenarios,
  minimumGameCssWidth: 280,
  siteCases: 0,
  embeddedGameCases: 0,
  directGameCases: 0,
  stateCases: 0,
  failures,
};

function addFailure(scope, target, scenario, message, details = {}) {
  failures.push({ scope, target, scenario, message, details });
}

async function waitForStableLayout(page) {
  await page
    .evaluate(() =>
      Promise.race([
        document.fonts?.ready ?? Promise.resolve(),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]),
    )
    .catch(() => undefined);
  await page.waitForTimeout(30);
}

async function measurePage(page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    const body = document.body;
    const viewportWidth = root.clientWidth;
    const viewportHeight = root.clientHeight;

    const isVisible = (element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        Number(style.opacity || 1) > 0 &&
        rect.width > 0 &&
        rect.height > 0
      );
    };

    const outsideControls = [
      ...document.querySelectorAll(
        'a[href], button, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])',
      ),
    ]
      .filter(isVisible)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          id: element.id,
          text: element.getAttribute('aria-label') || element.textContent?.trim().slice(0, 48),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
        };
      })
      .filter((item) => item.left < -1 || item.right > viewportWidth + 1);

    const horizontalOverflowElements = [...document.querySelectorAll('body *')]
      .filter(isVisible)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          id: element.id,
          className: typeof element.className === 'string' ? element.className : '',
          text: element.textContent?.trim().replace(/\s+/g, ' ').slice(0, 72),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
        };
      })
      .filter(
        (item) =>
          item.left < -1 ||
          item.right > viewportWidth + 1 ||
          item.scrollWidth > item.clientWidth + 1,
      )
      .slice(0, 20);

    const shadowOverflowElements = [...document.querySelectorAll('pocket-game')]
      .flatMap((host) => [...(host.shadowRoot?.querySelectorAll('*') ?? [])])
      .filter(isVisible)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          part: element.getAttribute('part'),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
        };
      })
      .filter(
        (item) =>
          item.left < -1 ||
          item.right > viewportWidth + 1 ||
          item.scrollWidth > item.clientWidth + 1,
      )
      .slice(0, 20);

    const navbar = document.querySelector('.navbar');
    const navbarRect = navbar?.getBoundingClientRect();
    const navShell = navbar?.firstElementChild;
    const brand = navShell?.firstElementChild;
    const controlGroup = navShell?.lastElementChild;
    const brandRect = brand?.getBoundingClientRect();
    const controlRect = controlGroup?.getBoundingClientRect();
    const navOverlap =
      brandRect && controlRect && isVisible(brand) && isVisible(controlGroup)
        ? Math.round(brandRect.right - controlRect.left)
        : 0;

    const firstHeading = document.querySelector('main h1, main h2, main [role="heading"]');
    const headingRect = firstHeading?.getBoundingClientRect();
    const interiorHeader = document.querySelector('.interior > header');
    const interiorHeaderRect = interiorHeader?.getBoundingClientRect();
    const heroHeading = interiorHeader?.querySelector('h1');
    const heroIntro = interiorHeader?.querySelector('.intro');
    const heroHeaderStyle = interiorHeader ? getComputedStyle(interiorHeader) : null;
    const headingRange = heroHeading ? document.createRange() : null;
    headingRange?.selectNodeContents(heroHeading);
    const headingLines = headingRange
      ? [...headingRange.getClientRects()].map((rect) => ({
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
          top: rect.top,
          width: rect.width,
        }))
      : [];
    const headingLineCharacterCounts = [];
    if (heroHeading) {
      const walker = document.createTreeWalker(heroHeading, NodeFilter.SHOW_TEXT);
      let textNode = walker.nextNode();
      let previousTop = null;
      while (textNode) {
        for (let offset = 0; offset < textNode.length; offset += 1) {
          if (!textNode.data[offset].trim()) continue;
          const characterRange = document.createRange();
          characterRange.setStart(textNode, offset);
          characterRange.setEnd(textNode, offset + 1);
          const top = characterRange.getBoundingClientRect().top;
          if (previousTop === null || Math.abs(top - previousTop) > 1) {
            headingLineCharacterCounts.push(0);
            previousTop = top;
          }
          headingLineCharacterCounts[headingLineCharacterCounts.length - 1] += 1;
        }
        textNode = walker.nextNode();
      }
    }
    const introRange = heroIntro ? document.createRange() : null;
    introRange?.selectNodeContents(heroIntro);
    const introLines = introRange
      ? [...introRange.getClientRects()].map((rect) => ({
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
          top: rect.top,
          width: rect.width,
        }))
      : [];
    const heroIntroRect = heroIntro?.getBoundingClientRect();
    const profileHeading = document.querySelector('#profile-heading');
    const profileHeadingRange = profileHeading ? document.createRange() : null;
    profileHeadingRange?.selectNodeContents(profileHeading);
    const profileHeadingLines = profileHeadingRange
      ? [...profileHeadingRange.getClientRects()].map((rect) => ({
          left: rect.left,
          right: rect.right,
          top: rect.top,
        }))
      : [];
    const profileGrid = document.querySelector('.profile-grid');
    const profileCards = profileGrid
      ? [...profileGrid.querySelectorAll(':scope > .profile-card')]
      : [];
    const recognitionCard = profileGrid?.querySelector('.profile-card--recognition');
    const recognitionGrid = recognitionCard?.querySelector('ul');
    const recognitionItems = recognitionGrid ? [...recognitionGrid.querySelectorAll('li')] : [];
    const featuredRecognition = recognitionCard?.querySelector('.profile-item--featured');
    const finalRecognition = recognitionItems.at(-1);
    const gridTrackCount = (element) =>
      element
        ? getComputedStyle(element)
            .gridTemplateColumns.split(' ')
            .filter((track) => track.length > 0).length
        : 0;
    const newsGrid = document.querySelector('[data-news-grid]');
    const newsCards = newsGrid ? [...newsGrid.querySelectorAll(':scope > [data-news-card]')] : [];
    const visibleNewsCards = newsCards.filter((card) => isVisible(card));
    const newsCardMetrics = visibleNewsCards.map((card) => {
      const link = card.querySelector('.news-card-link');
      const cover = card.querySelector('.news-cover');
      const poster = cover?.querySelector('.news-cover__poster');
      const rect = link?.getBoundingClientRect();
      const linkStyle = link ? getComputedStyle(link) : null;
      const naturalHeight = link
        ? link.scrollHeight +
          (Number.parseFloat(linkStyle?.borderTopWidth || '') || 0) +
          (Number.parseFloat(linkStyle?.borderBottomWidth || '') || 0)
        : 0;
      const coverRect = cover?.getBoundingClientRect();
      const posterTextRects = poster
        ? [...poster.querySelectorAll('.news-cover__kicker, .news-cover__title, ul')].map(
            (element) => element.getBoundingClientRect(),
          )
        : [];

      return {
        bottom: rect?.bottom ?? 0,
        height: rect?.height ?? 0,
        heightDelta: Math.abs((rect?.height ?? 0) - naturalHeight),
        left: rect?.left ?? 0,
        posterClipped: coverRect
          ? posterTextRects.some(
              (textRect) =>
                textRect.top < coverRect.top - 1 || textRect.bottom > coverRect.bottom + 1,
            )
          : false,
        top: rect?.top ?? 0,
      };
    });
    const newsColumns = new Map();
    for (const card of newsCardMetrics) {
      const key = Math.round(card.left * 2) / 2;
      const column = newsColumns.get(key) ?? [];
      column.push(card);
      newsColumns.set(key, column);
    }
    const newsVerticalGaps = [...newsColumns.values()].flatMap((column) =>
      column
        .sort((a, b) => a.top - b.top)
        .slice(1)
        .map((card, index) => card.top - column[index].bottom),
    );
    const newsCardHeights = newsCardMetrics.map((card) => card.height);
    const inlineGames = [...document.querySelectorAll('[data-inline-game]')].map((section) => {
      const copy = section.querySelector('.inline-game__copy');
      const stage = section.querySelector('.inline-game__stage');
      const host = section.querySelector('pocket-game');
      const fallback = section.querySelector('.inline-game__fallback');
      const copyRect = copy?.getBoundingClientRect();
      const stageRect = stage?.getBoundingClientRect();

      return {
        game: section.getAttribute('data-inline-game'),
        columnCount: gridTrackCount(section),
        copy: copyRect
          ? {
              bottom: copyRect.bottom,
              left: copyRect.left,
              right: copyRect.right,
              top: copyRect.top,
            }
          : null,
        stage: stageRect
          ? {
              bottom: stageRect.bottom,
              left: stageRect.left,
              right: stageRect.right,
              top: stageRect.top,
              width: stageRect.width,
            }
          : null,
        hostVisible: host ? isVisible(host) : false,
        fallbackVisible: fallback ? isVisible(fallback) : false,
      };
    });

    return {
      clientWidth: viewportWidth,
      scrollWidth: Math.max(root.scrollWidth, body?.scrollWidth ?? 0),
      clientHeight: viewportHeight,
      scrollHeight: Math.max(root.scrollHeight, body?.scrollHeight ?? 0),
      outsideControls,
      horizontalOverflowElements,
      shadowOverflowElements,
      navOverlap,
      navbar: navbarRect
        ? {
            top: Math.round(navbarRect.top),
            bottom: Math.round(navbarRect.bottom),
            left: Math.round(navbarRect.left),
            right: Math.round(navbarRect.right),
            height: Math.round(navbarRect.height),
          }
        : null,
      headingTop: headingRect ? Math.round(headingRect.top) : null,
      profileHeadingLines,
      inlineGames,
      news: newsGrid
        ? {
            cardCount: newsCards.length,
            clippedPosterCount: newsCardMetrics.filter((card) => card.posterClipped).length,
            columnCount: Number.parseInt(getComputedStyle(newsGrid).columnCount, 10) || 1,
            heightRange:
              newsCardHeights.length > 0
                ? Math.max(...newsCardHeights) - Math.min(...newsCardHeights)
                : 0,
            maxVerticalGap: newsVerticalGaps.length > 0 ? Math.max(...newsVerticalGaps) : 0,
            maxNaturalHeightDelta:
              newsCardMetrics.length > 0
                ? Math.max(...newsCardMetrics.map((card) => card.heightDelta))
                : 0,
            occupiedColumnCount: newsColumns.size,
            visibleCardCount: visibleNewsCards.length,
          }
        : null,
      profile: profileGrid
        ? {
            cardCount: profileCards.length,
            columnCount: gridTrackCount(profileGrid),
            recognitionColumnCount: gridTrackCount(recognitionGrid),
            recognitionItemCount: recognitionItems.length,
            featuredColumnEnd: featuredRecognition
              ? getComputedStyle(featuredRecognition).gridColumnEnd
              : null,
            finalColumnEnd: finalRecognition
              ? getComputedStyle(finalRecognition).gridColumnEnd
              : null,
          }
        : null,
      hero:
        heroHeading && heroIntro && heroIntroRect
          ? {
              headingLineCharacterCounts,
              headingLines,
              header: interiorHeaderRect
                ? {
                    left: interiorHeaderRect.left,
                    right: interiorHeaderRect.right,
                    width: interiorHeaderRect.width,
                  }
                : null,
              intro: {
                bottom: heroIntroRect.bottom,
                left: heroIntroRect.left,
                right: heroIntroRect.right,
                top: heroIntroRect.top,
                width: heroIntroRect.width,
              },
              headerColumnGap: Number.parseFloat(heroHeaderStyle?.columnGap || '') || 0,
              headerGridColumns: (heroHeaderStyle?.gridTemplateColumns || '')
                .split(' ')
                .map((track) => Number.parseFloat(track))
                .filter(Number.isFinite),
              introLines,
              introTextWrap: getComputedStyle(heroIntro).getPropertyValue('text-wrap') || '',
            }
          : null,
    };
  });
}

async function auditMobileMenu(page, route, scenario) {
  const toggler = page.locator('#navbar-toggler');
  if (!(await toggler.isVisible())) return;

  await toggler.click();
  const menu = await page.locator('#navbar-collapse').evaluate((collapse) => {
    const rect = collapse.getBoundingClientRect();
    const style = getComputedStyle(collapse);
    const controls = [...collapse.querySelectorAll('a[href], button, [role="button"]')].filter(
      (element) => {
        const controlStyle = getComputedStyle(element);
        const controlRect = element.getBoundingClientRect();
        return (
          controlStyle.display !== 'none' &&
          controlStyle.visibility !== 'hidden' &&
          controlRect.width > 0 &&
          controlRect.height > 0
        );
      },
    );
    const lastRect = controls.at(-1)?.getBoundingClientRect();
    const scrollable =
      ['auto', 'scroll'].includes(style.overflowY) &&
      collapse.scrollHeight > collapse.clientHeight + 1;

    return {
      expanded: document.querySelector('#navbar-toggler')?.getAttribute('aria-expanded'),
      top: Math.round(rect.top),
      bottom: Math.round(rect.bottom),
      height: Math.round(rect.height),
      viewportHeight: document.documentElement.clientHeight,
      overflowY: style.overflowY,
      scrollHeight: collapse.scrollHeight,
      clientHeight: collapse.clientHeight,
      lastControlBottom: lastRect ? Math.round(lastRect.bottom) : null,
      scrollable,
    };
  });

  if (menu.expanded !== 'true') {
    addFailure(
      'site',
      route,
      scenario.name,
      'Mobile navigation did not expose expanded state',
      menu,
    );
  }
  if (menu.bottom > menu.viewportHeight + 1 && !menu.scrollable) {
    addFailure(
      'site',
      route,
      scenario.name,
      'Mobile navigation extends below a short viewport and cannot scroll',
      menu,
    );
  }
  await toggler.click();
}

async function auditMobileNavbarGeometry(page, route, scenario) {
  const toggler = page.locator('#navbar-toggler');
  if (!(await toggler.isVisible())) return;

  const closedState = await page.evaluate(() => {
    const button = document.querySelector('#navbar-toggler');
    const controls = [
      ...document.querySelectorAll('.mobile-controls > a, .mobile-controls > button'),
    ];
    const bars = [...document.querySelectorAll('#navbar-toggler .icon-bar')];
    const buttonStyle = button ? getComputedStyle(button) : null;
    const barRects = bars.map((bar) => {
      const rect = bar.getBoundingClientRect();
      return {
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
        height: rect.height,
        width: rect.width,
      };
    });
    const controlRects = controls.map((control) => {
      const rect = control.getBoundingClientRect();
      return {
        centerY: rect.top + rect.height / 2,
        height: rect.height,
        width: rect.width,
      };
    });

    return {
      flexDirection: buttonStyle?.flexDirection,
      barRects,
      controlRects,
    };
  });

  const barCenterXs = closedState.barRects.map((bar) => bar.centerX);
  const barCenterYs = closedState.barRects.map((bar) => bar.centerY);
  const controlCenterYs = closedState.controlRects.map((control) => control.centerY);
  const barsAreVertical =
    closedState.flexDirection === 'column' &&
    closedState.barRects.length === 3 &&
    closedState.barRects.every(
      (bar) => Math.abs(bar.width - 22) <= 0.5 && Math.abs(bar.height - 2) <= 0.5,
    ) &&
    Math.max(...barCenterXs) - Math.min(...barCenterXs) <= 0.5 &&
    barCenterYs[1] - barCenterYs[0] >= 5.5 &&
    barCenterYs[2] - barCenterYs[1] >= 5.5;
  const controlsAreAligned =
    closedState.controlRects.length >= 3 &&
    closedState.controlRects.every((control) => control.height >= 43.5 && control.width >= 43.5) &&
    Math.max(...controlCenterYs) - Math.min(...controlCenterYs) <= 0.5;

  results.stateCases += 1;
  if (!barsAreVertical || !controlsAreAligned) {
    addFailure(
      'responsive-state',
      route,
      scenario,
      'Mobile navigation controls are not vertically stacked and optically aligned',
      closedState,
    );
  }

  await toggler.click();
  await page.waitForTimeout(500);
  const openState = await page.evaluate(() => {
    const bars = [...document.querySelectorAll('#navbar-toggler .icon-bar')];
    return {
      expanded: document.querySelector('#navbar-toggler')?.getAttribute('aria-expanded'),
      bars: bars.map((bar) => {
        const rect = bar.getBoundingClientRect();
        const transform = getComputedStyle(bar).transform;
        const matrix = transform === 'none' ? null : new DOMMatrixReadOnly(transform);
        return {
          angle: matrix ? (Math.atan2(matrix.b, matrix.a) * 180) / Math.PI : 0,
          centerX: rect.left + rect.width / 2,
          centerY: rect.top + rect.height / 2,
          transform,
        };
      }),
      middleOpacity: bars[1] ? getComputedStyle(bars[1]).opacity : null,
    };
  });
  results.stateCases += 1;
  const [topBar, , bottomBar] = openState.bars;
  const closeBarsMeet =
    topBar &&
    bottomBar &&
    Math.abs(topBar.centerX - bottomBar.centerX) <= 0.75 &&
    Math.abs(topBar.centerY - bottomBar.centerY) <= 0.75 &&
    Math.abs(topBar.angle - 45) <= 1 &&
    Math.abs(bottomBar.angle + 45) <= 1;
  if (openState.expanded !== 'true' || openState.middleOpacity !== '0' || !closeBarsMeet) {
    addFailure(
      'responsive-state',
      route,
      scenario + '-expanded',
      'Mobile hamburger does not animate into a clear close control',
      openState,
    );
  }
  await toggler.click();
}

async function waitForEmbeddedGames(page) {
  await page.waitForFunction(() => customElements.get('pocket-game'));
  const elements = page.locator('pocket-game');
  const count = await elements.count();
  for (let index = 0; index < count; index += 1) {
    await elements.nth(index).scrollIntoViewIfNeeded();
    await page.waitForFunction(
      (gameIndex) => {
        const element = document.querySelectorAll('pocket-game')[gameIndex];
        const frame = element?.shadowRoot?.querySelector('iframe');
        return (
          frame?.contentDocument?.readyState === 'complete' &&
          frame.contentWindow?.location.href !== 'about:blank'
        );
      },
      index,
      { timeout: 5000 },
    );
  }
}

async function auditEmbeddedGames(page, route, scenario) {
  await waitForEmbeddedGames(page);
  const audits = await page.locator('pocket-game').evaluateAll((elements) =>
    elements.map((element) => {
      const frame = element.shadowRoot?.querySelector('iframe');
      const doc = frame?.contentDocument;
      const root = doc?.documentElement;
      const body = doc?.body;
      const rect = frame?.getBoundingClientRect();
      return {
        game: element.getAttribute('game'),
        frameCount: element.shadowRoot?.querySelectorAll('iframe').length ?? 0,
        frameSrc: frame?.src ?? null,
        frameWidth: rect ? Math.round(rect.width) : null,
        frameHeight: rect ? Math.round(rect.height) : null,
        documentLanguage: doc?.documentElement.lang ?? null,
        documentTheme: doc?.documentElement.dataset.theme ?? null,
        hostLanguage: document.documentElement.lang,
        hostTheme: document.documentElement.dataset.theme,
        clientWidth: root?.clientWidth ?? null,
        scrollWidth: Math.max(root?.scrollWidth ?? 0, body?.scrollWidth ?? 0),
        clientHeight: root?.clientHeight ?? null,
        scrollHeight: Math.max(root?.scrollHeight ?? 0, body?.scrollHeight ?? 0),
      };
    }),
  );

  for (const audit of audits) {
    results.embeddedGameCases += 1;
    const frameUrl = audit.frameSrc ? new URL(audit.frameSrc) : null;
    const expectedPath = `${basePath}/pocket-play/games/${audit.game}/` || '/';
    if (
      audit.frameCount !== 1 ||
      !frameUrl ||
      frameUrl.origin !== previewUrl.origin ||
      frameUrl.pathname !== expectedPath ||
      frameUrl.searchParams.get('embed') !== '1' ||
      audit.documentLanguage !== audit.hostLanguage ||
      audit.documentTheme !== audit.hostTheme ||
      audit.frameHeight < gameHeights[audit.game]
    ) {
      addFailure(
        'embedded-game-settings',
        route + '#' + audit.game,
        scenario.name,
        'Embedded game does not match its host route, language, theme, or minimum size',
        audit,
      );
    }
    if (
      audit.clientWidth == null ||
      audit.scrollWidth > audit.clientWidth + 1 ||
      audit.clientHeight == null ||
      audit.scrollHeight > audit.clientHeight + 1
    ) {
      addFailure(
        'embedded-game',
        route + '#' + audit.game,
        scenario.name,
        'Embedded game content overflows its iframe',
        audit,
      );
    }
  }
}

async function auditSiteMatrix(browser) {
  const page = await browser.newPage();
  let runtimeErrors = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('requestfailed', (request) => {
    const requestUrl = new URL(request.url());
    if (requestUrl.origin === new URL(baseUrl).origin) {
      runtimeErrors.push(
        request.method() + ' ' + requestUrl.pathname + ': ' + request.failure()?.errorText,
      );
    }
  });

  for (const scenario of viewportScenarios) {
    await page.setViewportSize({ width: scenario.width, height: scenario.height });
    console.log(
      '[site] ' +
        scenario.name +
        ' (' +
        scenario.width +
        'x' +
        scenario.height +
        ' CSS px): ' +
        routes.length +
        ' routes',
    );

    for (const route of routes) {
      runtimeErrors = [];
      const response = await page.goto(baseUrl + route, { waitUntil: 'domcontentloaded' });
      await waitForStableLayout(page);
      results.siteCases += 1;

      if (!response || ![200, 404].includes(response.status())) {
        addFailure('site', route, scenario.name, 'Unexpected HTTP status ' + response?.status());
      }

      const metrics = await measurePage(page);
      if (metrics.scrollWidth > metrics.clientWidth + 1) {
        addFailure('site', route, scenario.name, 'Page overflows horizontally', metrics);
      }
      if (metrics.outsideControls.length > 0) {
        addFailure(
          'site',
          route,
          scenario.name,
          'Visible interactive controls extend outside the viewport',
          { controls: metrics.outsideControls },
        );
      }
      if (metrics.navOverlap > 1) {
        addFailure('site', route, scenario.name, 'Navbar brand overlaps its controls', metrics);
      }
      if (
        metrics.navbar &&
        (metrics.navbar.left < -1 ||
          metrics.navbar.right > metrics.clientWidth + 1 ||
          metrics.navbar.height > metrics.clientHeight * 0.4)
      ) {
        addFailure('site', route, scenario.name, 'Fixed navbar does not fit the viewport', metrics);
      }
      if (
        metrics.navbar &&
        metrics.headingTop != null &&
        metrics.headingTop < metrics.navbar.bottom - 1
      ) {
        addFailure(
          'site',
          route,
          scenario.name,
          'Page heading starts underneath the fixed navbar',
          metrics,
        );
      }
      const expectedInlineGame = inlineGamesByRoute[route];
      if (expectedInlineGame) {
        const inlineGame = metrics.inlineGames[0];
        if (metrics.inlineGames.length !== 1 || inlineGame?.game !== expectedInlineGame) {
          addFailure(
            'inline-game-layout',
            route,
            scenario.name,
            `Expected one ${expectedInlineGame} inline game`,
            { inlineGames: metrics.inlineGames },
          );
        } else if (!inlineGame.copy || !inlineGame.stage) {
          addFailure(
            'inline-game-layout',
            route,
            scenario.name,
            'Inline game is missing its copy or stage region',
            inlineGame,
          );
        } else {
          const shouldUseColumns = scenario.width > 900;
          const shouldUseFallback = scenario.width < results.minimumGameCssWidth;
          const usesExpectedFlow = shouldUseColumns
            ? inlineGame.columnCount === 2 && inlineGame.stage.left > inlineGame.copy.right
            : inlineGame.columnCount === 1 && inlineGame.stage.top > inlineGame.copy.bottom;
          const usesExpectedViewport = shouldUseFallback
            ? !inlineGame.hostVisible && inlineGame.fallbackVisible
            : inlineGame.hostVisible && !inlineGame.fallbackVisible;
          const fillsMinimumViewport =
            scenario.width !== results.minimumGameCssWidth ||
            inlineGame.stage.width >= results.minimumGameCssWidth - 1;

          if (!usesExpectedFlow || !usesExpectedViewport || !fillsMinimumViewport) {
            addFailure(
              'inline-game-layout',
              route,
              scenario.name,
              'Inline game does not use the intended columns, mobile stack, or narrow fallback',
              {
                ...inlineGame,
                shouldUseColumns,
                shouldUseFallback,
                fillsMinimumViewport,
              },
            );
          }
        }
      } else if (metrics.inlineGames.length > 0) {
        addFailure(
          'inline-game-layout',
          route,
          scenario.name,
          'Unexpected inline game on this route',
          { inlineGames: metrics.inlineGames },
        );
      }
      if (route === '/news/' || route === '/zh/news/') {
        const expectedColumns =
          scenario.width > 900 ? 4 : scenario.width > 760 ? 3 : scenario.width > 520 ? 2 : 1;
        if (
          !metrics.news ||
          metrics.news.cardCount < 1 ||
          metrics.news.columnCount !== expectedColumns ||
          metrics.news.occupiedColumnCount !== expectedColumns
        ) {
          addFailure(
            'news-grid',
            route,
            scenario.name,
            `News feed should use ${expectedColumns} columns at this viewport`,
            { news: metrics.news, expectedColumns },
          );
        }
        if (
          metrics.news &&
          (metrics.news.heightRange < 8 ||
            metrics.news.maxVerticalGap > 22 ||
            metrics.news.maxNaturalHeightDelta > 2.5 ||
            metrics.news.clippedPosterCount > 0)
        ) {
          addFailure(
            'news-masonry',
            route,
            scenario.name,
            'News cards should keep natural heights, stack tightly, and show every poster in full',
            { news: metrics.news },
          );
        }
      }
      if (route === '/publications/' && scenario.width >= 901 && metrics.hero) {
        const headingRight = Math.max(...metrics.hero.headingLines.map((line) => line.right));
        const horizontalGap = metrics.hero.intro.left - headingRight;
        if (
          metrics.hero.headingLines.length !== 1 ||
          horizontalGap < 20 ||
          horizontalGap > 34 ||
          metrics.hero.intro.width < 280
        ) {
          addFailure(
            'site-hero',
            route,
            scenario.name,
            'Publication title and introduction are not tightly separated without overlap',
            { ...metrics.hero, horizontalGap },
          );
        }
      }
      if (route === '/zh/publications/' && scenario.width >= 721 && metrics.hero) {
        const [firstTrack, secondTrack] = metrics.hero.headerGridColumns;
        const trackRatio = firstTrack / secondTrack;
        const headingRight = Math.max(...metrics.hero.headingLines.map((line) => line.right));
        const horizontalGap = metrics.hero.intro.left - headingRight;
        if (
          metrics.hero.headingLines.length !== 1 ||
          metrics.hero.headingLineCharacterCounts.join(',') !== '2' ||
          metrics.hero.headerGridColumns.length !== 2 ||
          Math.abs(metrics.hero.headerColumnGap - 48) > 1 ||
          trackRatio < 0.58 ||
          trackRatio > 0.62 ||
          horizontalGap < metrics.hero.headerColumnGap - 1
        ) {
          addFailure(
            'site-hero',
            route,
            scenario.name,
            'Chinese publication hero does not use the shared two-column interior spacing',
            { ...metrics.hero, horizontalGap, trackRatio },
          );
        }
      }
      if (route === '/zh/owner/' && scenario.width >= 721 && metrics.hero) {
        const [firstTrack, secondTrack] = metrics.hero.headerGridColumns;
        const trackRatio = firstTrack / secondTrack;
        const headingRight = Math.max(...metrics.hero.headingLines.map((line) => line.right));
        const horizontalGap = metrics.hero.intro.left - headingRight;
        const rightEdgeDelta = Math.abs(metrics.hero.header.right - metrics.hero.intro.right);
        if (
          metrics.hero.headingLines.length !== 1 ||
          metrics.hero.headingLineCharacterCounts.join(',') !== '4' ||
          metrics.hero.headerGridColumns.length !== 2 ||
          Math.abs(metrics.hero.headerColumnGap - 48) > 1 ||
          trackRatio < 0.58 ||
          trackRatio > 0.62 ||
          horizontalGap < 32 ||
          rightEdgeDelta > 1 ||
          metrics.hero.introLines.length > 2 ||
          metrics.hero.introLines.length < 1 ||
          !metrics.hero.introTextWrap?.includes('balance')
        ) {
          addFailure(
            'site-hero',
            route,
            scenario.name,
            'Chinese private-access hero does not use the shared two-column layout with a right-aligned introduction',
            { ...metrics.hero, horizontalGap, rightEdgeDelta, trackRatio },
          );
        }
      }
      if (
        route === '/zh/owner/' &&
        scenario.name === 'mobile-boundary-720' &&
        metrics.hero?.headingLineCharacterCounts.join(',') !== '4'
      ) {
        addFailure(
          'site-hero',
          route,
          scenario.name,
          'Chinese private-access title must return to one natural line at the mobile boundary',
          metrics.hero,
        );
      }
      if (
        route === '/zh/research/' &&
        scenario.width >= 901 &&
        metrics.profileHeadingLines.length !== 1
      ) {
        addFailure(
          'site-heading',
          route,
          scenario.name,
          'Chinese academic background and recognition heading must remain on one line at desktop widths',
          { profileHeadingLines: metrics.profileHeadingLines },
        );
      }
      if ((route === '/research/' || route === '/zh/research/') && metrics.profile) {
        const expectedProfileColumns = scenario.width <= 760 ? 1 : 2;
        const expectedRecognitionColumns = scenario.width <= 520 ? 1 : 2;
        const expectedSpanningEnd = scenario.width <= 520 ? 'auto' : '-1';
        if (
          metrics.profile.cardCount !== 2 ||
          metrics.profile.recognitionItemCount !== 6 ||
          metrics.profile.columnCount !== expectedProfileColumns ||
          metrics.profile.recognitionColumnCount !== expectedRecognitionColumns ||
          metrics.profile.featuredColumnEnd !== expectedSpanningEnd ||
          metrics.profile.finalColumnEnd !== expectedSpanningEnd
        ) {
          addFailure(
            'site-profile',
            route,
            scenario.name,
            'Academic background and recognition cards do not match the intended responsive grid',
            { ...metrics.profile, expectedProfileColumns, expectedRecognitionColumns },
          );
        }
      }
      for (const message of runtimeErrors) {
        addFailure('site-runtime', route, scenario.name, message);
      }

      await auditMobileMenu(page, route, scenario);
      const embeddedGameCount = await page.locator('pocket-game').count();
      if (embeddedGameCount > 0 && scenario.width >= results.minimumGameCssWidth) {
        await auditEmbeddedGames(page, route, scenario);
      }
    }
  }

  await page.close();
}

async function measureDirectGame(page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    const body = document.body;
    const controls = [
      ...document.querySelectorAll(
        'button, a[href], input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])',
      ),
    ]
      .filter((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return (
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          rect.width > 0 &&
          rect.height > 0
        );
      })
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          text: element.getAttribute('aria-label') || element.textContent?.trim().slice(0, 48),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          top: Math.round(rect.top + scrollY),
          bottom: Math.round(rect.bottom + scrollY),
        };
      });

    return {
      clientWidth: root.clientWidth,
      scrollWidth: Math.max(root.scrollWidth, body.scrollWidth),
      clientHeight: root.clientHeight,
      scrollHeight: Math.max(root.scrollHeight, body.scrollHeight),
      overflowY: getComputedStyle(root).overflowY,
      controls,
    };
  });
}

async function auditDirectGames(browser) {
  const page = await browser.newPage();
  let runtimeErrors = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));

  for (const [game, recommendedHeight] of Object.entries(gameHeights)) {
    for (const language of ['en', 'zh']) {
      for (const width of directGameWidths) {
        runtimeErrors = [];
        await page.setViewportSize({ width, height: recommendedHeight });
        await page.goto(
          baseUrl +
            '/pocket-play/games/' +
            game +
            '/?embed=1&lang=' +
            (language === 'zh' ? 'zh-CN' : 'en'),
          { waitUntil: 'domcontentloaded' },
        );
        await waitForStableLayout(page);
        results.directGameCases += 1;
        const metrics = await measureDirectGame(page);
        const scenario = width + 'x' + recommendedHeight + '-' + language;

        if (
          metrics.scrollWidth > metrics.clientWidth + 1 ||
          metrics.scrollHeight > metrics.clientHeight + 1
        ) {
          addFailure(
            'direct-game',
            game,
            scenario,
            'Game overflows its recommended iframe dimensions',
            metrics,
          );
        }
        const outside = metrics.controls.filter(
          (control) => control.left < -1 || control.right > metrics.clientWidth + 1,
        );
        if (outside.length > 0) {
          addFailure('direct-game', game, scenario, 'Game controls extend outside the viewport', {
            controls: outside,
          });
        }
        for (const message of runtimeErrors) {
          addFailure('game-runtime', game, scenario, message);
        }
      }
    }

    for (const scenario of landscapeGameScenarios) {
      runtimeErrors = [];
      await page.setViewportSize({ width: scenario.width, height: scenario.height });
      await page.goto(baseUrl + '/pocket-play/games/' + game + '/?lang=en', {
        waitUntil: 'domcontentloaded',
      });
      await waitForStableLayout(page);
      results.directGameCases += 1;
      const metrics = await measureDirectGame(page);

      if (metrics.scrollWidth > metrics.clientWidth + 1) {
        addFailure(
          'direct-game-landscape',
          game,
          scenario.name,
          'Landscape game page overflows horizontally',
          metrics,
        );
      }
      if (metrics.scrollHeight > metrics.clientHeight + 1 && metrics.overflowY === 'hidden') {
        addFailure(
          'direct-game-landscape',
          game,
          scenario.name,
          'Landscape game needs vertical scrolling but disables it',
          metrics,
        );
      }
      const unreachable = metrics.controls.filter(
        (control) =>
          control.left < -1 ||
          control.right > metrics.clientWidth + 1 ||
          control.bottom > metrics.scrollHeight + 1,
      );
      if (unreachable.length > 0) {
        addFailure(
          'direct-game-landscape',
          game,
          scenario.name,
          'Landscape game controls are outside the scrollable document',
          { controls: unreachable },
        );
      }
      for (const message of runtimeErrors) {
        addFailure('game-runtime', game, scenario.name, message);
      }
    }
    console.log('[games] ' + game + ': responsive iframe and landscape checks complete');
  }

  await page.close();
}

async function auditResponsiveStates(browser) {
  const page = await browser.newPage({ viewport: { width: 320, height: 280 } });

  for (const width of [280, 320, 390, 430]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ['/', '/zh/']) {
      await page.goto(baseUrl + route, { waitUntil: 'domcontentloaded' });
      await waitForStableLayout(page);
      await auditMobileNavbarGeometry(page, route, width + 'x844');
    }
  }

  await page.setViewportSize({ width: 320, height: 280 });
  await page.goto(baseUrl + '/', { waitUntil: 'domcontentloaded' });
  await waitForStableLayout(page);
  await page.locator('#navbar-toggler').click();
  await page.locator('.mobile-dropdown-trigger').first().click();
  const shortMenu = await page.locator('#navbar-collapse').evaluate((collapse) => {
    collapse.scrollTop = collapse.scrollHeight;
    const style = getComputedStyle(collapse);
    const controls = [...collapse.querySelectorAll('a[href], button')].filter((element) => {
      const rect = element.getBoundingClientRect();
      return getComputedStyle(element).display !== 'none' && rect.width > 0 && rect.height > 0;
    });
    const rect = collapse.getBoundingClientRect();
    const lastRect = controls.at(-1)?.getBoundingClientRect();
    return {
      viewportHeight: document.documentElement.clientHeight,
      top: Math.round(rect.top),
      bottom: Math.round(rect.bottom),
      clientHeight: collapse.clientHeight,
      scrollHeight: collapse.scrollHeight,
      scrollTop: collapse.scrollTop,
      overflowY: style.overflowY,
      lastControlBottom: lastRect ? Math.round(lastRect.bottom) : null,
    };
  });
  results.stateCases += 1;
  if (
    !['auto', 'scroll'].includes(shortMenu.overflowY) ||
    shortMenu.bottom > shortMenu.viewportHeight + 1 ||
    shortMenu.lastControlBottom > shortMenu.viewportHeight + 1
  ) {
    addFailure(
      'responsive-state',
      'mobile-menu',
      '320x280-expanded',
      'Expanded mobile navigation is not fully reachable by internal scrolling',
      shortMenu,
    );
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseUrl + '/research/', { waitUntil: 'domcontentloaded' });
  await waitForStableLayout(page);
  await page.locator('#navbar-toggler').click();
  await page.setViewportSize({ width: 844, height: 390 });
  await page.waitForTimeout(50);
  await page.evaluate(() => window.dispatchEvent(new Event('resize')));
  await page.waitForTimeout(20);
  const rotationState = await page.evaluate(() => {
    window.scrollTo(0, 240);
    return {
      innerWidth,
      clientWidth: document.documentElement.clientWidth,
      mediaMatches: window.matchMedia('(min-width: 768px)').matches,
      bodyOverflow: document.body.style.overflow,
      expanded: document.querySelector('#navbar-toggler')?.getAttribute('aria-expanded'),
      collapseHidden: document.querySelector('#navbar-collapse')?.classList.contains('hidden'),
      scrollY,
    };
  });
  results.stateCases += 1;
  if (
    rotationState.bodyOverflow !== '' ||
    rotationState.expanded !== 'false' ||
    !rotationState.collapseHidden ||
    rotationState.scrollY === 0
  ) {
    addFailure(
      'responsive-state',
      'mobile-menu',
      'portrait-to-landscape-breakpoint',
      'Navigation state or page scrolling remains locked after crossing the desktop breakpoint',
      rotationState,
    );
  }

  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto(baseUrl + '/', { waitUntil: 'domcontentloaded' });
  await waitForStableLayout(page);
  const dropdownTrigger = page.locator('.nav-dropdown-trigger').first();
  const dropdownMenu = page.locator('.nav-dropdown-menu').first();
  await dropdownTrigger.click();
  const pointerOpenState = await dropdownTrigger.getAttribute('aria-expanded');
  const pointerMenuVisibility = await dropdownMenu.evaluate(
    (menu) => getComputedStyle(menu).visibility,
  );
  await dropdownTrigger.click();
  await page.waitForTimeout(180);
  const pointerClosedState = await dropdownTrigger.getAttribute('aria-expanded');
  const pointerClosedVisual = await dropdownMenu.evaluate((menu) => ({
    visibility: getComputedStyle(menu).visibility,
    opacity: getComputedStyle(menu).opacity,
    dropdownClass: menu.closest('.nav-dropdown')?.className,
    hovered: menu.closest('.nav-dropdown')?.matches(':hover'),
  }));
  await page.locator('main').hover({ position: { x: 4, y: 4 } });
  await dropdownTrigger.evaluate((trigger) =>
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 0 })),
  );
  const assistiveOpenState = await dropdownTrigger.getAttribute('aria-expanded');
  const assistiveMenuVisibility = await dropdownMenu.evaluate(
    (menu) => getComputedStyle(menu).visibility,
  );
  const assistiveFocusIsMenuitem = await page.evaluate(
    () => document.activeElement?.getAttribute('role') === 'menuitem',
  );
  await page.keyboard.press('Escape');
  await page.waitForTimeout(180);
  const escapeClosedState = await dropdownTrigger.getAttribute('aria-expanded');
  const escapeMenuVisibility = await dropdownMenu.evaluate(
    (menu) => getComputedStyle(menu).visibility,
  );
  await dropdownTrigger.click();
  await page.locator('main').click({ position: { x: 4, y: 4 } });
  const outsideClosedState = await dropdownTrigger.getAttribute('aria-expanded');
  results.stateCases += 3;
  if (
    pointerOpenState !== 'true' ||
    pointerMenuVisibility !== 'visible' ||
    pointerClosedState !== 'false' ||
    pointerClosedVisual.visibility !== 'hidden' ||
    assistiveOpenState !== 'true' ||
    assistiveMenuVisibility !== 'visible' ||
    !assistiveFocusIsMenuitem ||
    escapeClosedState !== 'false' ||
    escapeMenuVisibility !== 'hidden' ||
    outsideClosedState !== 'false'
  ) {
    addFailure(
      'responsive-state',
      'desktop-dropdown',
      'pointer-keyboard-assistive-click',
      'Desktop dropdown visual, focus, and ARIA states diverge across input paths',
      {
        pointerOpenState,
        pointerMenuVisibility,
        pointerClosedState,
        pointerClosedVisual,
        assistiveOpenState,
        assistiveMenuVisibility,
        assistiveFocusIsMenuitem,
        escapeClosedState,
        escapeMenuVisibility,
        outsideClosedState,
      },
    );
  }
  await page.close();

  const inlinePage = await browser.newPage();
  const inlineErrors = [];
  inlinePage.on('pageerror', (error) => inlineErrors.push(error.message));
  await inlinePage.setViewportSize({ width: 390, height: 844 });

  const readInlineState = () =>
    inlinePage.locator('[data-inline-game]').evaluate((section) => {
      const host = section.querySelector('pocket-game');
      const frames = host?.shadowRoot?.querySelectorAll('iframe') ?? [];
      const frame = frames[0];
      const stylesheet = host?.shadowRoot?.querySelector('link[rel="stylesheet"]');
      return {
        game: section.getAttribute('data-inline-game'),
        hostLanguage: document.documentElement.lang,
        hostTheme: document.documentElement.dataset.theme,
        frameLanguage: frame?.contentDocument?.documentElement.lang ?? null,
        frameTheme: frame?.contentDocument?.documentElement.dataset.theme ?? null,
        frameCount: frames.length,
        stylesheetHref: stylesheet?.href ?? null,
        embedScriptCount: document.querySelectorAll('script[src*="/pocket-play/embed.js"]').length,
        customElementRegistered: Boolean(customElements.get('pocket-game')),
      };
    });

  await inlinePage.setViewportSize({ width: 1024, height: 768 });
  await inlinePage.goto(baseUrl + '/publications/', { waitUntil: 'domcontentloaded' });
  await waitForStableLayout(inlinePage);
  const researchHref = `${basePath}/research/` || '/';
  await Promise.all([
    inlinePage.waitForURL(baseUrl + '/research/'),
    inlinePage.locator(`a[href="${researchHref}"]:visible`).first().click(),
  ]);
  await waitForStableLayout(inlinePage);
  await waitForEmbeddedGames(inlinePage);
  const inlineEnglish = await readInlineState();

  await inlinePage.setViewportSize({ width: 390, height: 844 });
  await inlinePage.locator('[data-light-toggle]:visible').first().click();
  await inlinePage.waitForFunction(() => {
    const host = document.querySelector('pocket-game');
    const frame = host?.shadowRoot?.querySelector('iframe');
    return (
      frame?.contentDocument?.documentElement.dataset.theme ===
      document.documentElement.dataset.theme
    );
  });
  const inlineThemed = await readInlineState();

  await Promise.all([
    inlinePage.waitForURL(baseUrl + '/zh/research/'),
    inlinePage.locator('a.language-switch:visible').first().click(),
  ]);
  await waitForStableLayout(inlinePage);
  await waitForEmbeddedGames(inlinePage);
  const inlineChinese = await readInlineState();

  const thesisHref = `${basePath}/zh/research/openraas-thesis/` || '/';
  await Promise.all([
    inlinePage.waitForURL(baseUrl + '/zh/research/openraas-thesis/'),
    inlinePage.locator(`a[href="${thesisHref}"]`).first().click(),
  ]);
  await waitForStableLayout(inlinePage);
  await waitForEmbeddedGames(inlinePage);
  const inlineThesis = await readInlineState();

  await inlinePage.goBack({ waitUntil: 'domcontentloaded' });
  await inlinePage.waitForURL(baseUrl + '/zh/research/');
  await inlinePage.waitForTimeout(350);
  await waitForStableLayout(inlinePage);
  await waitForEmbeddedGames(inlinePage);
  const inlineReturned = await readInlineState();

  results.stateCases += 5;
  const expectedStylesheetHref = new URL(`${basePath}/pocket-play/embed.css`, previewUrl.origin)
    .href;
  const validInlineState = (state, game, language) =>
    state.game === game &&
    state.hostLanguage === language &&
    state.frameLanguage === language &&
    state.hostTheme === state.frameTheme &&
    state.frameCount === 1 &&
    state.stylesheetHref === expectedStylesheetHref &&
    state.embedScriptCount === 1 &&
    state.customElementRegistered;
  if (
    !validInlineState(inlineEnglish, 'secrecy', 'en') ||
    !validInlineState(inlineThemed, 'secrecy', 'en') ||
    inlineThemed.hostTheme === inlineEnglish.hostTheme ||
    !validInlineState(inlineChinese, 'secrecy', 'zh-CN') ||
    !validInlineState(inlineThesis, 'resource', 'zh-CN') ||
    !validInlineState(inlineReturned, 'secrecy', 'zh-CN') ||
    inlineErrors.length > 0
  ) {
    addFailure(
      'responsive-state',
      'inline-games',
      'theme-language-view-transitions',
      'Inline games diverge after theme, language, or page-transition changes',
      {
        inlineEnglish,
        inlineThemed,
        inlineChinese,
        inlineThesis,
        inlineReturned,
        inlineErrors,
      },
    );
  }
  await inlinePage.close();

  const noScriptContext = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const noScriptPage = await noScriptContext.newPage();
  await noScriptPage.goto(baseUrl + '/research/', { waitUntil: 'domcontentloaded' });
  const noScriptState = await noScriptPage.locator('[data-inline-game]').evaluate((section) => {
    const host = section.querySelector('pocket-game');
    const fallback = section.querySelector('.inline-game__noscript');
    const viewport = section.querySelector('.inline-game__viewport');
    const fallbackLink = fallback?.querySelector('a');
    const isVisible = (element) => {
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        rect.width > 0 &&
        rect.height > 0
      );
    };
    return {
      hostVisible: isVisible(host),
      fallbackVisible: isVisible(fallback),
      fallbackHref: fallbackLink?.href ?? null,
      viewportHeight: viewport?.getBoundingClientRect().height ?? null,
    };
  });
  results.stateCases += 1;
  if (
    noScriptState.hostVisible ||
    !noScriptState.fallbackVisible ||
    !noScriptState.fallbackHref?.includes('/pocket-play/games/secrecy/') ||
    noScriptState.viewportHeight == null ||
    noScriptState.viewportHeight >= 300
  ) {
    addFailure(
      'responsive-state',
      'inline-games',
      'javascript-disabled-fallback',
      'Inline game does not expose a compact standalone fallback without JavaScript',
      noScriptState,
    );
  }

  await noScriptPage.goto(baseUrl + '/news/', { waitUntil: 'domcontentloaded' });
  const noScriptNews = await noScriptPage.locator('[data-news-index]').evaluate((root) => {
    const cards = [...root.querySelectorAll('[data-news-card]')];
    const visibleCards = cards.filter((card) => {
      const rect = card.getBoundingClientRect();
      const style = getComputedStyle(card);
      return !card.hidden && style.display !== 'none' && rect.width > 0 && rect.height > 0;
    });
    return {
      cardCount: cards.length,
      visibleCardCount: visibleCards.length,
      selectCount: root.querySelectorAll('select[data-news-filter]').length,
    };
  });
  results.stateCases += 1;
  if (
    noScriptNews.cardCount < 1 ||
    noScriptNews.visibleCardCount !== noScriptNews.cardCount ||
    noScriptNews.selectCount !== 3
  ) {
    addFailure(
      'responsive-state',
      'research-news',
      'javascript-disabled-feed',
      'News must show every card without JavaScript while retaining three native selects',
      noScriptNews,
    );
  }
  await noScriptContext.close();

  const filterPage = await browser.newPage({ viewport: { width: 901, height: 700 } });
  await filterPage.goto(baseUrl + '/news/', { waitUntil: 'domcontentloaded' });
  await waitForStableLayout(filterPage);
  const filterSeed = await filterPage
    .locator('[data-news-card]')
    .first()
    .evaluate((card) => ({
      author: JSON.parse(card.getAttribute('data-authors') || '[]')[0],
      keyword: JSON.parse(card.getAttribute('data-keywords') || '[]')[0],
      module: card.getAttribute('data-module'),
    }));
  await filterPage.selectOption('[data-news-filter="module"]', filterSeed.module);
  await filterPage.selectOption('[data-news-filter="keyword"]', filterSeed.keyword);
  await filterPage.selectOption('[data-news-filter="author"]', filterSeed.author);
  const filteredNews = await filterPage.locator('[data-news-index]').evaluate((root) => {
    const cards = [...root.querySelectorAll('[data-news-card]')];
    const selected = Object.fromEntries(
      [...root.querySelectorAll('select[data-news-filter]')].map((select) => [
        select.name,
        select.value,
      ]),
    );
    const visible = cards.filter((card) => !card.hidden);
    return {
      selected,
      total: cards.length,
      visible: visible.length,
      hidden: cards.length - visible.length,
      count: Number(root.querySelector('[data-news-result-count]')?.textContent),
      everyVisibleMatches: visible.every(
        (card) =>
          card.getAttribute('data-module') === selected.module &&
          JSON.parse(card.getAttribute('data-keywords') || '[]').includes(selected.keyword) &&
          JSON.parse(card.getAttribute('data-authors') || '[]').includes(selected.author),
      ),
    };
  });
  await waitForStableLayout(filterPage);
  const filteredNewsLayout = (await measurePage(filterPage)).news;

  const zeroCombo = await filterPage.locator('[data-news-index]').evaluate((root) => {
    const cards = [...root.querySelectorAll('[data-news-card]')].map((card) => ({
      module: card.getAttribute('data-module'),
      keywords: JSON.parse(card.getAttribute('data-keywords') || '[]'),
      authors: JSON.parse(card.getAttribute('data-authors') || '[]'),
    }));
    const options = (name) =>
      [...root.querySelectorAll(`select[name="${name}"] option`)]
        .map((option) => option.value)
        .filter(Boolean);
    for (const module of options('module')) {
      for (const keyword of options('keyword')) {
        for (const author of options('author')) {
          const matches = cards.some(
            (card) =>
              card.module === module &&
              card.keywords.includes(keyword) &&
              card.authors.includes(author),
          );
          if (!matches) return { module, keyword, author };
        }
      }
    }
    return null;
  });
  if (zeroCombo) {
    await filterPage.selectOption('[data-news-filter="module"]', zeroCombo.module);
    await filterPage.selectOption('[data-news-filter="keyword"]', zeroCombo.keyword);
    await filterPage.selectOption('[data-news-filter="author"]', zeroCombo.author);
  }
  const zeroNews = await filterPage.locator('[data-news-index]').evaluate((root) => ({
    count: Number(root.querySelector('[data-news-result-count]')?.textContent),
    emptyVisible: !root.querySelector('[data-news-empty]')?.hidden,
    visible: [...root.querySelectorAll('[data-news-card]')].filter((card) => !card.hidden).length,
  }));
  await filterPage.locator('[data-news-filters] button[type="reset"]').click();
  await filterPage.waitForTimeout(30);
  await waitForStableLayout(filterPage);
  const resetNews = await filterPage.locator('[data-news-index]').evaluate((root) => ({
    total: root.querySelectorAll('[data-news-card]').length,
    visible: [...root.querySelectorAll('[data-news-card]')].filter((card) => !card.hidden).length,
  }));
  const resetNewsLayout = (await measurePage(filterPage)).news;
  results.stateCases += 3;
  if (
    filteredNews.visible < 1 ||
    filteredNews.visible !== filteredNews.count ||
    !filteredNews.everyVisibleMatches ||
    (filteredNews.total > 1 && filteredNews.hidden < 1)
  ) {
    addFailure(
      'responsive-state',
      'research-news',
      'three-filter-intersection',
      'News filters do not apply module, keyword, and author as an AND intersection',
      filteredNews,
    );
  }
  if (
    !filteredNewsLayout ||
    filteredNewsLayout.visibleCardCount !== filteredNews.visible ||
    filteredNewsLayout.occupiedColumnCount !== Math.min(4, filteredNews.visible) ||
    filteredNewsLayout.maxVerticalGap > 22 ||
    filteredNewsLayout.clippedPosterCount > 0
  ) {
    addFailure(
      'responsive-state',
      'research-news',
      'filtered-masonry-layout',
      'Filtered News cards do not reflow into tightly stacked columns',
      { filteredNews, filteredNewsLayout },
    );
  }
  if (!zeroCombo || zeroNews.visible !== 0 || zeroNews.count !== 0 || !zeroNews.emptyVisible) {
    addFailure(
      'responsive-state',
      'research-news',
      'zero-result-state',
      'News filters do not expose the explicit zero-result state for a valid option combination',
      { zeroCombo, zeroNews },
    );
  }
  if (resetNews.total < 1 || resetNews.visible !== resetNews.total) {
    addFailure(
      'responsive-state',
      'research-news',
      'filter-reset',
      'Resetting News filters does not restore the complete feed',
      resetNews,
    );
  }
  if (
    !resetNewsLayout ||
    resetNewsLayout.visibleCardCount !== resetNews.total ||
    resetNewsLayout.occupiedColumnCount !== 4 ||
    resetNewsLayout.maxVerticalGap > 22 ||
    resetNewsLayout.clippedPosterCount > 0
  ) {
    addFailure(
      'responsive-state',
      'research-news',
      'reset-masonry-layout',
      'Resetting News filters does not restore the complete tightly stacked feed',
      { resetNews, resetNewsLayout },
    );
  }
  await filterPage.close();

  const storageContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await storageContext.addInitScript(() => {
    for (const method of ['getItem', 'setItem', 'removeItem']) {
      Object.defineProperty(Storage.prototype, method, {
        configurable: true,
        value() {
          throw new DOMException('Storage denied for responsive QA', 'SecurityError');
        },
      });
    }
  });
  const storagePage = await storageContext.newPage();
  const storageErrors = [];
  storagePage.on('pageerror', (error) => storageErrors.push(error.message));
  await storagePage.goto(baseUrl + '/', { waitUntil: 'domcontentloaded' });
  await waitForStableLayout(storagePage);
  const themeBefore = await storagePage.locator('html').getAttribute('data-theme');
  const visibleThemeToggle = storagePage.locator('[data-light-toggle]:visible').first();
  await visibleThemeToggle.click();
  const themeAfter = await storagePage.locator('html').getAttribute('data-theme');
  const visibleIcon = await visibleThemeToggle.evaluate((button) => {
    const icon = [...button.querySelectorAll('[data-light-toggle-icon]')].find(
      (element) => getComputedStyle(element).display !== 'none',
    );
    return icon?.getAttribute('data-light-toggle-icon');
  });
  results.stateCases += 1;
  const expectedIcon = themeAfter === 'dark' ? 'sun' : 'moon';
  if (themeAfter === themeBefore || visibleIcon !== expectedIcon || storageErrors.length > 0) {
    addFailure(
      'responsive-state',
      'theme-toggle',
      'storage-denied',
      'Theme state, icon, or runtime errors diverge when local storage is unavailable',
      { themeBefore, themeAfter, visibleIcon, expectedIcon, storageErrors },
    );
  }
  await storageContext.close();

  const footerPage = await browser.newPage();
  for (const viewport of [
    { name: 'zoomed-phone-312', width: 312, height: 675 },
    { name: 'short-landscape-422', width: 422, height: 195 },
  ]) {
    await footerPage.setViewportSize({ width: viewport.width, height: viewport.height });
    for (const route of routes) {
      await footerPage.goto(baseUrl + route, { waitUntil: 'domcontentloaded' });
      await waitForStableLayout(footerPage);
      await footerPage.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await footerPage.waitForTimeout(50);
      const overlap = await footerPage.evaluate(() => {
        const button = document.querySelector('#back-to-top');
        const buttonRect = button?.getBoundingClientRect();
        const buttonVisible =
          buttonRect &&
          getComputedStyle(button).display !== 'none' &&
          buttonRect.width > 0 &&
          buttonRect.height > 0;
        const links = [...document.querySelectorAll('footer a')];
        const intersections = buttonVisible
          ? links
              .map((link) => {
                const rect = link.getBoundingClientRect();
                const width = Math.max(
                  0,
                  Math.min(rect.right, buttonRect.right) - Math.max(rect.left, buttonRect.left),
                );
                const height = Math.max(
                  0,
                  Math.min(rect.bottom, buttonRect.bottom) - Math.max(rect.top, buttonRect.top),
                );
                return {
                  text: link.textContent?.trim(),
                  area: Math.round(width * height),
                };
              })
              .filter((item) => item.area > 0)
          : [];
        return {
          buttonVisible: Boolean(buttonVisible),
          buttonRect: buttonRect
            ? {
                top: Math.round(buttonRect.top),
                right: Math.round(buttonRect.right),
                bottom: Math.round(buttonRect.bottom),
                left: Math.round(buttonRect.left),
              }
            : null,
          intersections,
        };
      });
      results.stateCases += 1;
      if (overlap.intersections.length > 0) {
        addFailure(
          'responsive-state',
          route,
          viewport.name,
          'Back-to-top control overlaps footer links',
          overlap,
        );
      }
    }
  }
  await footerPage.close();

  const textResizePage = await browser.newPage();
  for (const viewport of [
    { name: 'text-200-phone', width: 320, height: 568 },
    { name: 'text-200-tablet', width: 640, height: 720 },
  ]) {
    await textResizePage.setViewportSize({ width: viewport.width, height: viewport.height });
    for (const route of routes) {
      await textResizePage.goto(baseUrl + route, { waitUntil: 'domcontentloaded' });
      await textResizePage.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await textResizePage.waitForTimeout(30);
      const metrics = await measurePage(textResizePage);
      const navbarContainment = await textResizePage.evaluate(() => {
        const navbar = document.querySelector('.navbar')?.getBoundingClientRect();
        const controls = [
          ...document.querySelectorAll(
            '.mobile-controls a, .mobile-controls button, .mobile-controls [data-light-toggle]',
          ),
        ]
          .filter((element) => getComputedStyle(element).display !== 'none')
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return {
              top: Math.round(rect.top),
              bottom: Math.round(rect.bottom),
              left: Math.round(rect.left),
              right: Math.round(rect.right),
            };
          });
        return {
          navbar: navbar
            ? {
                top: Math.round(navbar.top),
                bottom: Math.round(navbar.bottom),
                left: Math.round(navbar.left),
                right: Math.round(navbar.right),
              }
            : null,
          controls,
        };
      });
      results.stateCases += 1;
      const controlsOutsideNavbar = navbarContainment.controls.filter(
        (control) =>
          !navbarContainment.navbar ||
          control.top < navbarContainment.navbar.top - 1 ||
          control.bottom > navbarContainment.navbar.bottom + 1 ||
          control.left < navbarContainment.navbar.left - 1 ||
          control.right > navbarContainment.navbar.right + 1,
      );
      if (
        metrics.scrollWidth > metrics.clientWidth + 1 ||
        metrics.outsideControls.length > 0 ||
        controlsOutsideNavbar.length > 0
      ) {
        addFailure(
          'responsive-state',
          route,
          viewport.name,
          'Page does not reflow cleanly after 200% text-only resizing',
          { metrics, controlsOutsideNavbar },
        );
      }
    }
  }
  await textResizePage.close();
}

if (auditMode === 'all' || auditMode === 'site') await addRepresentativeNewsDetails();

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  ...(executablePath ? { executablePath } : {}),
});

try {
  if (auditMode === 'all' || auditMode === 'site') await auditSiteMatrix(browser);
  if (auditMode === 'all' || auditMode === 'games') await auditDirectGames(browser);
  if (auditMode === 'all' || auditMode === 'states') await auditResponsiveStates(browser);
} finally {
  await browser.close();
}

await writeFile(
  path.join(outputDir, 'responsive-report.json'),
  JSON.stringify(results, null, 2) + '\n',
);

if (failures.length > 0) {
  console.error('Responsive QA found ' + failures.length + ' failure(s):');
  for (const failure of failures) {
    console.error(
      '- [' +
        failure.scope +
        '] ' +
        failure.target +
        ' @ ' +
        failure.scenario +
        ': ' +
        failure.message,
    );
  }
  assert.fail('Responsive QA failed with ' + failures.length + ' issue(s)');
}

console.log(
  'Responsive QA passed: ' +
    results.siteCases +
    ' site cases, ' +
    results.embeddedGameCases +
    ' embedded-game cases, and ' +
    results.directGameCases +
    ' direct-game cases, and ' +
    results.stateCases +
    ' responsive state cases.',
);
