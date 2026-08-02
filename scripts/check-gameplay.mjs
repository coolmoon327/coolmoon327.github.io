import assert from 'node:assert/strict';

import { chromium } from 'playwright';

const gameBase = new URL(process.argv[2] ?? 'http://127.0.0.1:4321/pocket-play/games/');
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined;
const browserErrors = [];

const games = {
  runner: 360,
  bandit: 430,
  qpath: 500,
  movable: 720,
  pinching: 680,
  secrecy: 520,
  orbit: 360,
  signature: 260,
  echo: 430,
  match: 590,
  merge: 680,
};

function gameUrl(id, language = 'en') {
  const url = new URL(`${id}/`, gameBase);
  url.searchParams.set('embed', '1');
  url.searchParams.set('lang', language);
  url.searchParams.set('theme', 'light');
  return url.href;
}

function angularDistance(first, second) {
  const distance = Math.abs(first - second) % 360;
  return Math.min(distance, 360 - distance);
}

async function openGame(browser, id, options = {}) {
  const page = await browser.newPage({
    viewport: { width: options.width ?? 420, height: options.height ?? games[id] },
    reducedMotion: options.reducedMotion ?? 'no-preference',
  });
  if (options.randomValues) {
    await page.addInitScript((values) => {
      let index = 0;
      Math.random = () => values[index++] ?? 0.5;
    }, options.randomValues);
  }
  page.on('pageerror', (error) => browserErrors.push(`${id}: ${error.message}`));
  await page.goto(gameUrl(id, options.language), { waitUntil: 'networkidle' });
  return page;
}

async function assertNoOverflow(page, id) {
  const dimensions = await page.evaluate(() => ({
    clientHeight: document.documentElement.clientHeight,
    clientWidth: document.documentElement.clientWidth,
    scrollHeight: document.documentElement.scrollHeight,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  assert.ok(
    dimensions.scrollWidth <= dimensions.clientWidth + 1,
    `${id} overflows horizontally at 280px: ${JSON.stringify(dimensions)}`,
  );
  assert.ok(
    dimensions.scrollHeight <= dimensions.clientHeight + 1,
    `${id} overflows its recommended frame: ${JSON.stringify(dimensions)}`,
  );
}

async function checkRunner(browser) {
  const page = await openGame(browser, 'runner');
  const track = page.locator('#track');
  const runnerGeometry = await page.locator('#agent').evaluate((agent) => {
    const bounds = agent.getBoundingClientRect();
    const style = getComputedStyle(agent);
    const legs = getComputedStyle(agent, '::after');
    const agentCenter = bounds.left + bounds.width / 2;
    const legOuterWidth =
      Number.parseFloat(legs.width) +
      (legs.boxSizing === 'border-box'
        ? 0
        : Number.parseFloat(legs.borderLeftWidth) + Number.parseFloat(legs.borderRightWidth));
    const legLeft =
      bounds.left + Number.parseFloat(style.borderLeftWidth) + Number.parseFloat(legs.left);
    const track = agent.closest('#track');
    const legCenter = legLeft + legOuterWidth / 2;
    return {
      agentCenter,
      agentBottom: Number.parseFloat(style.bottom),
      agentHeight: bounds.height,
      legCenter,
      legBoxSizing: legs.boxSizing,
      bottomLeftRadius: style.borderBottomLeftRadius,
      bottomRightRadius: style.borderBottomRightRadius,
      boxShadow: style.boxShadow,
      trackClientHeight: track.clientHeight,
    };
  });
  assert.ok(
    Math.abs(runnerGeometry.agentCenter - runnerGeometry.legCenter) <= 0.5,
    `Runner body and legs must share a visual center: ${JSON.stringify(runnerGeometry)}`,
  );
  assert.equal(runnerGeometry.legBoxSizing, 'border-box');
  assert.equal(runnerGeometry.bottomLeftRadius, runnerGeometry.bottomRightRadius);
  assert.equal(runnerGeometry.boxShadow, 'none');

  const runnerPhysics = await track.evaluate((element) => ({
    gravity: Number(element.dataset.gravity),
    jumpVelocity: Number(element.dataset.jumpVelocity),
    maximumHeight: Number(element.dataset.obstacleMaxHeight),
    minimumHeight: Number(element.dataset.obstacleMinHeight),
  }));
  assert.deepEqual([runnerPhysics.minimumHeight, runnerPhysics.maximumHeight], [20, 48]);
  assert.ok(
    Object.values(runnerPhysics).every((value) => Number.isFinite(value) && value > 0),
    `Runner physics values must be finite and positive: ${JSON.stringify(runnerPhysics)}`,
  );
  const theoreticalApex = runnerPhysics.jumpVelocity ** 2 / (2 * runnerPhysics.gravity);
  const visibleApex =
    runnerGeometry.trackClientHeight - runnerGeometry.agentBottom - runnerGeometry.agentHeight;
  assert.ok(
    theoreticalApex <= visibleApex,
    `Runner jump apex must remain inside the compact track: ${JSON.stringify({ theoreticalApex, visibleApex })}`,
  );
  const clearHeight = runnerPhysics.maximumHeight - 3;
  let simulatedHeight = 0;
  let simulatedVelocity = runnerPhysics.jumpVelocity;
  let clearFrames = 0;
  let simulationSteps = 0;
  while ((simulatedVelocity > 0 || simulatedHeight > 0) && simulationSteps < 1_000) {
    simulatedVelocity -= runnerPhysics.gravity * 0.032;
    simulatedHeight = Math.max(0, simulatedHeight + simulatedVelocity * 0.032);
    if (simulatedHeight >= clearHeight) clearFrames += 1;
    simulationSteps += 1;
  }
  assert.ok(simulationSteps < 1_000 && simulatedHeight === 0, 'Runner jump simulation must land');
  const requiredFrames = Math.ceil((28 + (24 - 8)) / (112 * 0.032));
  assert.ok(
    clearFrames >= requiredFrames + 1,
    `Tallest obstacle must remain jumpable at the slowest speed: ${JSON.stringify({ clearFrames, requiredFrames, runnerPhysics })}`,
  );

  await track.click();
  assert.equal(await track.getAttribute('data-phase'), 'running');
  assert.equal(await page.locator('#episode').textContent(), '1');
  await track.press('ArrowUp');
  await page.waitForFunction(() => {
    const transform = document.querySelector('#agent').style.transform;
    return /translate3d\(0(px)?, -[1-9]/.test(transform);
  });
  await page.close();

  for (const fixture of [
    { expectedHeight: 20, randomValues: [0.5, 0, 0.5], reducedMotion: 'no-preference' },
    {
      expectedHeight: 48,
      randomValues: [0.5, 1 - Number.EPSILON, 0.5],
      reducedMotion: 'reduce',
    },
  ]) {
    const fixturePage = await openGame(browser, 'runner', fixture);
    const fixtureTrack = fixturePage.locator('#track');
    await fixtureTrack.click();
    if (fixture.reducedMotion === 'reduce') {
      await fixtureTrack.press('ArrowUp');
      await fixturePage.waitForFunction(() =>
        /-[1-9]/.test(document.querySelector('#agent').style.transform),
      );
      assert.equal(
        await fixturePage
          .locator('#agent')
          .evaluate((agent) => getComputedStyle(agent, '::after').animationName),
        'none',
      );
    }
    await fixturePage.locator('.obstacle').first().waitFor({ state: 'attached', timeout: 2_000 });
    assert.equal(
      await fixturePage
        .locator('.obstacle')
        .first()
        .evaluate((obstacle) => Number.parseFloat(getComputedStyle(obstacle).height)),
      fixture.expectedHeight,
    );
    await fixturePage.close();
  }
}

async function checkBandit(browser) {
  const page = await openGame(browser, 'bandit');
  const firstArm = page.locator('[data-arm="0"]');
  for (let pull = 0; pull < 15; pull += 1) await firstArm.click();
  assert.equal(await page.locator('#remaining').textContent(), '0');
  assert.equal(await page.locator('#arm-0-pulls').textContent(), '15');
  assert.equal(await page.locator('#outcome').isVisible(), true);
  assert.equal(await firstArm.isDisabled(), true);
  await page.locator('#new-trial').click();
  assert.equal(await page.locator('#remaining').textContent(), '15');
  assert.equal(await page.locator('#outcome').isHidden(), true);
  await page.close();
}

async function checkQPath(browser) {
  const page = await openGame(browser, 'qpath', { width: 280 });

  const readTopology = async () => {
    const topology = await page.locator('#board').evaluate((board) => ({
      config: JSON.parse(board.dataset.config),
      reachableCount: Number(board.dataset.reachableCount),
      signature: board.dataset.topology,
      source: board.dataset.topologySource,
    }));
    const { config } = topology;
    assert.equal(config.walls.length, 5);
    assert.equal(config.risks.length, 2);
    assert.equal(config.goals.length, 3);

    const goalStates = config.goals.map((goal) => goal.state);
    const occupied = new Set([config.start, ...config.walls, ...config.risks, ...goalStates]);
    assert.equal(occupied.size, 11, `Q-path topology sets must not overlap: ${topology.signature}`);

    const walls = new Set(config.walls);
    const reached = new Set([config.start]);
    const queue = [config.start];
    for (let index = 0; index < queue.length; index += 1) {
      const state = queue[index];
      const row = Math.floor(state / 5);
      const column = state % 5;
      for (const [rowStep, columnStep] of [
        [-1, 0],
        [0, 1],
        [1, 0],
        [0, -1],
      ]) {
        const nextRow = row + rowStep;
        const nextColumn = column + columnStep;
        const nextState = nextRow * 5 + nextColumn;
        if (
          nextRow < 0 ||
          nextRow >= 5 ||
          nextColumn < 0 ||
          nextColumn >= 5 ||
          walls.has(nextState) ||
          reached.has(nextState)
        ) {
          continue;
        }
        reached.add(nextState);
        queue.push(nextState);
      }
    }
    assert.equal(
      reached.size,
      20,
      `Q-path open cells must form one connected graph: ${topology.signature}`,
    );
    assert.equal(topology.reachableCount, reached.size);
    assert.ok(goalStates.every((state) => reached.has(state)));

    const domTopology = await page.locator('#board').evaluate((board) => ({
      goals: [...board.querySelectorAll('[data-goal]')].map((cell) => ({
        id: cell.dataset.goal,
        state: Number(cell.dataset.state),
      })),
      risks: [...board.querySelectorAll('.risk')].map((cell) => Number(cell.dataset.state)),
      walls: [...board.querySelectorAll('.wall')].map((cell) => Number(cell.dataset.state)),
    }));
    const byState = (first, second) => first - second;
    assert.deepEqual(domTopology.walls.sort(byState), [...config.walls].sort(byState));
    assert.deepEqual(domTopology.risks.sort(byState), [...config.risks].sort(byState));
    assert.deepEqual(
      domTopology.goals.sort((first, second) => first.id.localeCompare(second.id)),
      [...config.goals].sort((first, second) => first.id.localeCompare(second.id)),
    );
    assert.equal(topology.source, 'random');
    return topology.signature;
  };

  let previousTopology = await readTopology();
  for (let reload = 0; reload < 4; reload += 1) {
    await page.reload({ waitUntil: 'networkidle' });
    const nextTopology = await readTopology();
    assert.notEqual(
      nextTopology,
      previousTopology,
      'Each Q-path refresh must create a new topology',
    );
    previousTopology = nextTopology;
  }

  for (const id of ['A', 'B', 'C']) {
    const target = page.locator(`[data-goal="${id}"]`);
    await target.click();
    assert.match(
      await page.locator('#status').textContent(),
      new RegExp(`Target ${id}(?:\\s|·)`),
      `Visible target ${id} must select the same training goal`,
    );
    assert.equal(await target.getAttribute('aria-pressed'), 'true');
  }

  const targetSizes = await page.locator('[data-goal]').evaluateAll((targets) =>
    targets.map((target) => {
      const bounds = target.getBoundingClientRect();
      return { height: bounds.height, width: bounds.width };
    }),
  );
  assert.ok(
    targetSizes.every(({ height, width }) => height >= 44 && width >= 44),
    `Q-path targets must be at least 44px: ${JSON.stringify(targetSizes)}`,
  );

  for (const id of ['A', 'B', 'C']) {
    await page.locator(`[data-goal="${id}"]`).click();
    await page.locator('#train').click();
    assert.ok(
      await page
        .locator('.cell:not(.wall) .policy')
        .evaluateAll((policies) => policies.some((policy) => policy.textContent !== '')),
      `A trained Q-path map toward ${id} must render at least one policy arrow`,
    );
    assert.notEqual(await page.locator('#success-rate').textContent(), '—');
    assert.match(await page.locator('#route-summary').textContent(), new RegExp(`${id} ·`));
  }
  await page.close();
}

function parsePercent(value) {
  const parsed = Number.parseInt(value, 10);
  assert.ok(
    Number.isFinite(parsed) && parsed >= 0 && parsed <= 100,
    `Invalid percentage: ${value}`,
  );
  return parsed;
}

async function waitForOptimization(page, id, timeout = 10_000) {
  await page.waitForFunction(
    () => document.querySelector('#field')?.dataset.optimizing === 'true',
    undefined,
    { timeout: 2_000 },
  );
  await page.waitForFunction(
    () => document.querySelector('#field')?.dataset.optimizing === 'false',
    undefined,
    { timeout },
  );
  assert.equal(
    await page.locator('#optimize').isEnabled(),
    true,
    `${id} search button must recover`,
  );
}

async function checkMovable(browser) {
  const page = await openGame(browser, 'movable');
  const field = page.locator('#field');
  const firstHandle = page.locator('.antenna-handle').first();

  assert.equal(await page.locator('.station').count(), 4, 'Movable lab needs four stations');
  assert.equal(
    await page.locator('.antenna-handle').count(),
    12,
    'Each station needs three antennas',
  );
  assert.equal(await page.locator('.user').count(), 24, 'Movable lab needs 24 users');
  assert.equal(
    await page.locator('.heat-cell').count(),
    256,
    'Coverage heat map needs 256 samples',
  );
  assert.ok(
    Number(await field.getAttribute('data-min-base-distance')) >= 25,
    'Bases must stay dispersed',
  );

  const initialConfig = await field.getAttribute('data-config');
  await firstHandle.press('End');
  assert.notEqual(
    await field.getAttribute('data-config'),
    initialConfig,
    'Keyboard steering must change an angle',
  );

  const handleBox = await firstHandle.boundingBox();
  const fieldBox = await field.boundingBox();
  assert.ok(handleBox && fieldBox, 'Movable antenna geometry must be visible');
  const beforeDrag = await field.getAttribute('data-config');
  await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(fieldBox.x + fieldBox.width * 0.72, fieldBox.y + fieldBox.height * 0.2, {
    steps: 6,
  });
  await page.mouse.up();
  assert.notEqual(
    await field.getAttribute('data-config'),
    beforeDrag,
    'Pointer drag must steer an antenna',
  );

  const beforeRandomize = await field.getAttribute('data-config');
  await page.locator('#randomize').click();
  assert.notEqual(
    await field.getAttribute('data-config'),
    beforeRandomize,
    'Random scene must regenerate geometry',
  );

  await page.locator('#optimize').click();
  await waitForOptimization(page, 'movable');
  parsePercent(await page.locator('#coverage').textContent());
  parsePercent(await page.locator('#interference').textContent());
  assert.match(await page.locator('#served').textContent(), /^\d+$/);

  await page.evaluate(() => window.PocketRuntime.apply({ lang: 'zh', theme: 'dark' }));
  assert.equal(await page.locator('h1').textContent(), '可移动天线实验室');
  await page.close();
}

async function checkPinching(browser) {
  const page = await openGame(browser, 'pinching');
  const field = page.locator('#field');
  const firstPinch = page.locator('.pinch').first();

  assert.equal(await page.locator('.pinch').count(), 4, 'Pinching lab needs four pinch points');
  assert.equal(await page.locator('.user').count(), 18, 'Pinching lab needs 18 users');

  const fieldBox = await field.boundingBox();
  const pinchBox = await firstPinch.boundingBox();
  assert.ok(fieldBox && pinchBox, 'Pinching geometry must be visible');
  const initialConfig = await field.getAttribute('data-config');
  await page.mouse.move(pinchBox.x + pinchBox.width / 2, pinchBox.y + pinchBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(fieldBox.x + fieldBox.width * 0.32, fieldBox.y + fieldBox.height * 0.2, {
    steps: 6,
  });
  await page.mouse.up();
  assert.notEqual(
    await field.getAttribute('data-config'),
    initialConfig,
    'Pointer drag must move and aim a pinch',
  );

  const beforeKeyboard = await field.getAttribute('data-config');
  await firstPinch.press('End');
  await firstPinch.press('ArrowUp');
  assert.notEqual(
    await field.getAttribute('data-config'),
    beforeKeyboard,
    'Keyboard must move a pinch',
  );

  const beforeRandomize = await field.getAttribute('data-config');
  await page.locator('#randomize').click();
  assert.notEqual(
    await field.getAttribute('data-config'),
    beforeRandomize,
    'Random scene must regenerate pinches',
  );

  await page.locator('#optimize').click();
  await waitForOptimization(page, 'pinching');
  parsePercent(await page.locator('#coverage').textContent());
  parsePercent(await page.locator('#interference').textContent());
  assert.match(await page.locator('#served').textContent(), /^\d+ \/ 18$/);

  await page.evaluate(() => window.PocketRuntime.apply({ lang: 'zh', theme: 'dark' }));
  assert.equal(await page.locator('h1').textContent(), '夹持天线实验');
  await page.close();
}

async function checkSecrecy(browser) {
  const page = await openGame(browser, 'secrecy');
  const field = page.locator('#field');
  const reflectorCount = await page.locator('.reflector').count();
  assert.ok(reflectorCount >= 1 && reflectorCount <= 2, 'Secrecy lab needs one or two reflectors');

  const initialAngle = await field.getAttribute('data-angle');
  await field.press('ArrowRight');
  assert.notEqual(
    await field.getAttribute('data-angle'),
    initialAngle,
    'Keyboard must steer Alice',
  );

  const fieldBox = await field.boundingBox();
  assert.ok(fieldBox, 'Secrecy field must be visible');
  await page.mouse.move(fieldBox.x + fieldBox.width * 0.22, fieldBox.y + fieldBox.height * 0.52);
  await page.mouse.down();
  await page.mouse.move(fieldBox.x + fieldBox.width * 0.8, fieldBox.y + fieldBox.height * 0.2, {
    steps: 6,
  });
  await page.mouse.up();
  assert.ok(
    Number.isFinite(Number(await field.getAttribute('data-angle'))),
    'Pointer steering must keep a valid angle',
  );

  const initialConfig = await field.getAttribute('data-config');
  await page.locator('#randomize').click();
  assert.notEqual(
    await field.getAttribute('data-config'),
    initialConfig,
    'Random scene must move targets and panels',
  );

  await page.locator('#optimize').click();
  await waitForOptimization(page, 'secrecy', 4_000);
  assert.equal(
    await field.getAttribute('data-angle'),
    await field.getAttribute('data-best-angle'),
    'Animated search must settle on the evaluated best bearing',
  );
  const secrecyScore = Number(await page.locator('#secrecy-score').textContent());
  assert.ok(secrecyScore >= 0 && secrecyScore <= 100, 'Secrecy score must stay within 0–100');

  await page.evaluate(() => window.PocketRuntime.apply({ lang: 'zh', theme: 'dark' }));
  assert.equal(await page.locator('h1').textContent(), '保密波束实验室');
  await page.close();
}

async function stopOrbitAtAngle(page, expectedAngle, tolerance = 4) {
  return page.evaluate(
    ({ expected, allowed }) =>
      new Promise((resolve, reject) => {
        const timeout = window.setTimeout(
          () => reject(new Error(`Orbit did not reach ${expected} degrees`)),
          6_000,
        );

        function stopWhenAligned() {
          const angle = Number(document.querySelector('#field').dataset.currentAngle);
          const distance = Math.abs(angle - expected) % 360;
          const hint = document.querySelector('#hint');
          const assistState = hint.dataset.assistState || '';
          if (
            Number.isFinite(angle) &&
            assistState &&
            Math.min(distance, 360 - distance) <= allowed
          ) {
            window.clearTimeout(timeout);
            const assistStatus = document.querySelector('#assist-status');
            const targetZone = document.querySelector('.target-zone');
            const cue = {
              state: assistState,
              visibleText: hint.textContent,
              announcedText: assistStatus.textContent,
              targetAnimation: getComputedStyle(targetZone).animationName,
              hintHeight: hint.getBoundingClientRect().height,
              scrollHeight: document.documentElement.scrollHeight,
              viewportHeight: window.innerHeight,
            };
            document.querySelector('#action').click();
            resolve(cue);
            return;
          }
          window.requestAnimationFrame(stopWhenAligned);
        }

        stopWhenAligned();
      }),
    { expected: expectedAngle, allowed: tolerance },
  );
}

async function runOrbitRound(page, offset) {
  await page.locator('#action').click();
  const state = await page.locator('#field').evaluate((field) => ({
    target: Number(field.dataset.targetAngle),
    tolerance: Number(field.dataset.targetTolerance),
    visualSpan: Number.parseFloat(
      field.querySelector('.target-zone').style.getPropertyValue('--target-span'),
    ),
    visualStart: Number.parseFloat(
      field.querySelector('.target-zone').style.getPropertyValue('--target-start'),
    ),
  }));
  assert.ok(Number.isFinite(state.target), 'Orbit must expose the rendered target angle');
  assert.ok(Number.isFinite(state.tolerance), 'Orbit must expose the rendered hit tolerance');
  assert.equal(state.visualSpan, state.tolerance * 2, 'Orbit window width must match hit width');
  assert.ok(
    angularDistance(state.visualStart, state.target - state.tolerance) <= 0.02,
    'Orbit window start must match the hit boundary',
  );
  const cueAtStop = await stopOrbitAtAngle(page, (state.target + offset + 360) % 360);
  return {
    ...state,
    cueAtStop,
    assistStatus: await page.locator('#assist-status').textContent(),
    hintAssistState: await page.locator('#hint').getAttribute('data-assist-state'),
    fieldAssistState: await page.locator('#field').getAttribute('data-assist-state'),
    targetAnimation: await page
      .locator('.target-zone')
      .evaluate((targetZone) => getComputedStyle(targetZone).animationName),
    result: await page.locator('#field').getAttribute('data-result'),
  };
}

async function checkOrbit(browser, reducedMotion = 'no-preference') {
  const page = await openGame(browser, 'orbit', {
    reducedMotion,
    width: reducedMotion === 'reduce' ? 280 : 420,
  });
  await page.locator('#assist').click();
  assert.equal(await page.locator('#assist').getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('#hint').getAttribute('data-assist-state'), 'toggle-on');
  assert.match(await page.locator('#hint').textContent(), /Assist is on/);
  assert.equal(await page.locator('#assist-status').textContent(), 'Assist cues are on.');
  const toggleLayout = await page.locator('#hint').evaluate((hint) => ({
    height: hint.getBoundingClientRect().height,
    scrollHeight: document.documentElement.scrollHeight,
    viewportHeight: window.innerHeight,
  }));
  assert.ok(
    toggleLayout.scrollHeight <= toggleLayout.viewportHeight + 1,
    'Visible assist toggle must fit the game viewport',
  );

  const first = await runOrbitRound(page, 0);
  assert.equal(first.result, 'hit', 'Stopping in the visible window must count as a hit');
  assert.equal(first.cueAtStop.state, 'target', 'Visible assist must identify the hit window');
  assert.equal(
    first.cueAtStop.visibleText,
    first.cueAtStop.announcedText,
    'Visible and screen-reader assist cues must stay synchronized',
  );
  assert.match(first.cueAtStop.visibleText, /Stop now/);
  assert.equal(
    first.cueAtStop.targetAnimation,
    reducedMotion === 'reduce' ? 'none' : 'assist-target-pulse',
    'Target emphasis must respect reduced-motion preferences',
  );
  assert.ok(
    Math.abs(first.cueAtStop.hintHeight - toggleLayout.height) <= 1,
    'Visible assist cues must not shift the game layout',
  );
  assert.ok(
    first.cueAtStop.scrollHeight <= first.cueAtStop.viewportHeight + 1,
    'Visible target cue must fit the game viewport',
  );
  assert.equal(first.assistStatus, '', 'Orbit result must clear stale assist cues');
  assert.equal(first.hintAssistState, null, 'Orbit result must clear the visible assist state');
  assert.equal(first.fieldAssistState, null, 'Orbit result must clear the field assist state');
  assert.equal(first.targetAnimation, 'none', 'Orbit result must stop target emphasis');

  const second = await runOrbitRound(page, first.tolerance + 8);
  assert.equal(second.result, 'miss', 'Stopping outside the visible window must miss');
  assert.equal(
    second.cueAtStop.state,
    'close',
    'Visible assist must warn when the target is close',
  );
  assert.match(second.cueAtStop.visibleText, /near the window/);
  assert.ok(
    Math.abs(second.cueAtStop.hintHeight - toggleLayout.height) <= 1,
    'Close assist cue must not shift the game layout',
  );
  assert.ok(
    second.cueAtStop.scrollHeight <= second.cueAtStop.viewportHeight + 1,
    'Visible close cue must fit the game viewport',
  );

  const third = await runOrbitRound(page, first.tolerance + 32);
  assert.equal(third.result, 'miss', 'Stopping far outside the window must miss');
  assert.equal(third.cueAtStop.state, 'far', 'Visible assist must identify a distant target');
  assert.match(third.cueAtStop.visibleText, /still far/);
  assert.ok(
    Math.abs(third.cueAtStop.hintHeight - toggleLayout.height) <= 1,
    'Far assist cue must not shift the game layout',
  );
  assert.ok(
    third.cueAtStop.scrollHeight <= third.cueAtStop.viewportHeight + 1,
    'Visible far cue must fit the game viewport',
  );
  assert.ok(
    angularDistance(first.target, second.target) >= 45,
    'Orbit target must move by a visible amount between rounds',
  );

  await page.evaluate(() => window.PocketRuntime.apply({ lang: 'zh' }));
  await page.locator('#assist').click();
  assert.equal(
    await page.locator('#hint').textContent(),
    '辅助提示已关闭，请观察窗口手动停下月球。',
  );
  await page.locator('#assist').click();
  assert.match(await page.locator('#hint').textContent(), /辅助提示已开启/);
  await page.close();
}

async function checkSignature(browser) {
  const page = await openGame(browser, 'signature');
  const sky = page.locator('#sky');
  await sky.click({ position: { x: 80, y: 54 } });
  for (let point = 0; point < 7; point += 1) await sky.press('Enter');
  assert.equal(await page.locator('.star').count(), 7);
  assert.equal(await page.locator('.connection').count(), 6);
  await sky.press('Enter');
  assert.equal(await page.locator('.star').count(), 0);
  assert.equal(await page.locator('.connection').count(), 0);
  await page.close();
}

async function checkEcho(browser) {
  const page = await openGame(browser, 'echo');
  await page.locator('#action').click();
  const activePad = page.locator('.echo-pad.is-active').first();
  await activePad.waitFor({ state: 'visible', timeout: 3_000 });
  const pad = await activePad.getAttribute('data-pad');
  await page.waitForFunction(() =>
    [...document.querySelectorAll('.echo-pad')].some((button) => !button.disabled),
  );
  await page.locator(`[data-pad="${pad}"]`).click();
  await page.waitForFunction(() => document.querySelector('#round').textContent === '2');
  const roundBeforeLanguageChange = await page.locator('#round').textContent();
  await page.evaluate(() => window.PocketRuntime.apply({ lang: 'zh' }));
  assert.equal(await page.locator('h1').textContent(), '记忆回声');
  assert.equal(await page.locator('#round').textContent(), roundBeforeLanguageChange);
  await page.close();
}

async function checkMatch(browser) {
  const page = await openGame(browser, 'match');
  const pair = await page.locator('.card').evaluateAll((cards) => {
    const firstBySymbol = new Map();
    for (const card of cards) {
      const symbol = card.dataset.symbol;
      if (firstBySymbol.has(symbol)) return [firstBySymbol.get(symbol), card.dataset.position];
      firstBySymbol.set(symbol, card.dataset.position);
    }
    return [];
  });
  await page.locator(`[data-position="${pair[0]}"]`).click();
  await page.locator(`[data-position="${pair[1]}"]`).click();
  assert.equal(await page.locator('#pairs').textContent(), '1 / 8');
  await page.evaluate(() => window.PocketRuntime.apply({ lang: 'zh' }));
  const matchedLabel = await page.locator('.card.is-matched').first().getAttribute('aria-label');
  assert.match(matchedLabel, /已配对 [\u4e00-\u9fff]/, 'Matched cards need a spoken Chinese name');
  await page.close();
}

async function checkMerge(browser) {
  const page = await openGame(browser, 'merge');
  await page.locator('#toggle-game').click();
  const boardSignature = () =>
    page
      .locator('.cell')
      .evaluateAll((cells) =>
        cells.map((cell) => cell.querySelector('.tile')?.dataset.value ?? '').join('|'),
      );
  let before = await boardSignature();
  let changed = false;
  for (const direction of ['left', 'up', 'right', 'down']) {
    await page.locator(`[data-direction="${direction}"]`).click();
    const after = await boardSignature();
    if (after !== before) {
      changed = true;
      break;
    }
    before = after;
  }
  assert.equal(changed, true, 'At least one direction must move the initial Merge board');
  const beforeLanguageChange = await boardSignature();
  await page.evaluate(() => window.PocketRuntime.apply({ lang: 'zh', theme: 'dark' }));
  assert.equal(await boardSignature(), beforeLanguageChange);
  assert.equal(await page.locator('h1').textContent(), '方块花园');
  await page.locator('#restart-game').click();
  assert.equal(await page.locator('#score').textContent(), '0');
  assert.equal(await page.locator('.tile').count(), 2);
  await page.close();
}

const browser = await chromium.launch({
  headless: true,
  ...(executablePath ? { executablePath } : {}),
});

try {
  await checkRunner(browser);
  await checkBandit(browser);
  await checkQPath(browser);
  await checkMovable(browser);
  await checkPinching(browser);
  await checkSecrecy(browser);
  await checkOrbit(browser);
  await checkOrbit(browser, 'reduce');
  await checkSignature(browser);
  await checkEcho(browser);
  await checkMatch(browser);
  await checkMerge(browser);

  for (const [id, height] of Object.entries(games)) {
    const page = await openGame(browser, id, { width: 280, height });
    await assertNoOverflow(page, id);
    await page.close();
  }

  assert.deepEqual(browserErrors, [], 'Games must not emit uncaught browser errors');

  console.log(
    `Gameplay QA passed: ${Object.keys(games).length} games, core interactions, target geometry, reduced motion, bilingual state, and 280px overflow.`,
  );
} finally {
  await browser.close();
}
