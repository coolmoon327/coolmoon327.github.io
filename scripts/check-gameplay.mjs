import assert from 'node:assert/strict';

import { chromium } from 'playwright';

const gameBase = new URL(process.argv[2] ?? 'http://127.0.0.1:4321/pocket-play/games/');
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined;
const browserErrors = [];

const games = {
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
  if (options.clock) await page.clock.install();
  if (options.captureLearnerStateCount) {
    await page.addInitScript((expectedStateCount) => {
      let exposedAgent;
      Object.defineProperty(window, 'PocketTabularAgent', {
        configurable: true,
        get: () => exposedAgent,
        set: (BaseAgent) => {
          exposedAgent = class TestVisibleTabularAgent extends BaseAgent {
            constructor(...args) {
              super(...args);
              if (args[0] === expectedStateCount) window.__qaGameLearner = this;
            }
          };
        },
      });
    }, options.captureLearnerStateCount);
  }
  if (options.randomValues) {
    await page.addInitScript((values) => {
      let index = 0;
      Math.random = () => values[index++] ?? 0.5;
    }, options.randomValues);
  }
  page.on('pageerror', (error) => browserErrors.push(`${id}: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().startsWith('Failed to load resource:')) {
      browserErrors.push(
        `${id} console: ${message.text()}${message.location().url ? ` (${message.location().url})` : ''}`,
      );
    }
  });
  page.on('response', (response) => {
    if (new URL(response.url()).origin === gameBase.origin && response.status() >= 400) {
      browserErrors.push(`${id} response: ${response.status()} ${response.url()}`);
    }
  });
  page.on('requestfailed', (request) => {
    if (new URL(request.url()).origin === gameBase.origin) {
      browserErrors.push(
        `${id} request: ${request.url()} (${request.failure()?.errorText || 'failed'})`,
      );
    }
  });
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
    `${id} overflows horizontally: ${JSON.stringify(dimensions)}`,
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
    await fixturePage.locator('.obstacle').first().waitFor({ state: 'attached', timeout: 5_000 });
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
  const page = await openGame(browser, 'qpath', {
    width: 280,
    reducedMotion: 'reduce',
    captureLearnerStateCount: 25,
  });

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

  const target = page.locator('[data-goal]').first();
  await target.click();
  assert.equal(await target.getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('#game').getAttribute('data-phase'), 'decision');

  const sharedLearnerChecks = await page.evaluate(() => {
    const makeExperience = (source, action = 0, reward = 0.5) => ({
      state: 0,
      action,
      reward,
      nextState: 0,
      nextAllowed: [0, 1],
      done: true,
      source,
    });
    const playerLearner = new window.PocketTabularAgent(1, 2, { alpha: 0.5, gamma: 0 });
    const agentLearner = new window.PocketTabularAgent(1, 2, { alpha: 0.5, gamma: 0 });
    playerLearner.observe(makeExperience('player'));
    agentLearner.observe(makeExperience('agent'));
    playerLearner.replay([makeExperience('player')], 3);
    agentLearner.replay([makeExperience('agent')], 3);

    const revisable = new window.PocketTabularAgent(1, 2, { alpha: 0.8, gamma: 0 });
    revisable.observe(makeExperience('player', 0, 0.2));
    const firstAction = revisable.greedyAction(0, [0, 1]);
    revisable.observe(makeExperience('agent', 1, 1));
    const revisedAction = revisable.greedyAction(0, [0, 1]);

    return {
      equalQ: JSON.stringify(playerLearner.q) === JSON.stringify(agentLearner.q),
      playerCount: playerLearner.playerExperienceCount,
      agentCount: agentLearner.agentExperienceCount,
      firstAction,
      revisedAction,
    };
  });
  assert.equal(sharedLearnerChecks.equalQ, true, 'Player and Agent updates must be equal');
  assert.equal(sharedLearnerChecks.playerCount, 1);
  assert.equal(sharedLearnerChecks.agentCount, 1);
  assert.equal(sharedLearnerChecks.firstAction, 0);
  assert.equal(sharedLearnerChecks.revisedAction, 1, 'Later experience must revise the policy');

  assert.equal(await page.locator('#agent-next').isDisabled(), false);
  assert.equal(await page.locator('#agent-until-success').isDisabled(), false);
  await page.locator('#agent-next').click();
  assert.equal(await page.locator('#game').getAttribute('data-phase'), 'agent');
  const firstAgentStart = Number(await page.locator('#board').getAttribute('data-start-state'));
  await page.waitForFunction(
    () =>
      document.querySelector('#game').dataset.phase === 'decision' &&
      document.querySelector('#game').dataset.agentEpisodes === '1',
    undefined,
    { timeout: 12_000 },
  );
  const experienceAfterFirstAgent = Number(
    await page.locator('#game').getAttribute('data-experience-count'),
  );
  assert.ok(experienceAfterFirstAgent > 0);
  assert.equal(await page.locator('#game').getAttribute('data-player-experience-count'), '0');
  assert.equal(
    Number(await page.locator('#game').getAttribute('data-agent-experience-count')),
    experienceAfterFirstAgent,
  );
  assert.equal(await page.locator('#game').getAttribute('data-last-episode-controller'), 'agent');

  await page.locator('#player-next').click();
  assert.equal(await page.locator('#game').getAttribute('data-phase'), 'player');
  assert.equal(await page.locator('#game').getAttribute('data-controller'), 'player');
  const firstDemonstrationStart = Number(
    await page.locator('#board').getAttribute('data-start-state'),
  );
  assert.notEqual(firstDemonstrationStart, firstAgentStart);
  await assertNoOverflow(page, 'qpath player episode');

  const demonstrateShortestRoute = async () => {
    const route = await page.locator('#board').evaluate((board) => {
      const config = JSON.parse(board.dataset.config);
      const start = Number(board.dataset.startState);
      const goalId = board.dataset.selectedGoal;
      const goal = config.goals.find((candidate) => candidate.id === goalId).state;
      const walls = new Set(config.walls);
      const actions = [
        [-1, 0],
        [0, 1],
        [1, 0],
        [0, -1],
      ];
      const queue = [start];
      const previous = new Map([[start, null]]);
      const previousAction = new Map();
      for (let index = 0; index < queue.length; index += 1) {
        const state = queue[index];
        if (state === goal) break;
        const row = Math.floor(state / 5);
        const column = state % 5;
        actions.forEach(([rowStep, columnStep], action) => {
          const nextRow = row + rowStep;
          const nextColumn = column + columnStep;
          const nextState = nextRow * 5 + nextColumn;
          if (
            nextRow < 0 ||
            nextRow >= 5 ||
            nextColumn < 0 ||
            nextColumn >= 5 ||
            walls.has(nextState) ||
            previous.has(nextState)
          ) {
            return;
          }
          previous.set(nextState, state);
          previousAction.set(nextState, action);
          queue.push(nextState);
        });
      }
      const path = [];
      for (let state = goal; state !== start; state = previous.get(state)) {
        path.push(previousAction.get(state));
      }
      return path.reverse();
    });
    assert.ok(route.length > 0 && route.length <= 32);
    for (const action of route) await page.locator(`[data-action="${action}"]`).click();
    return route;
  };

  const crashIntoObstacle = async () => {
    const route = await page.locator('#board').evaluate((board) => {
      const config = JSON.parse(board.dataset.config);
      const start = Number(board.dataset.startState);
      const goalId = board.dataset.selectedGoal;
      const goal = config.goals.find((candidate) => candidate.id === goalId).state;
      const walls = new Set(config.walls);
      const actions = [
        [-1, 0],
        [0, 1],
        [1, 0],
        [0, -1],
      ];
      const queue = [start];
      const previous = new Map([[start, null]]);
      const previousAction = new Map();
      let crash = null;

      for (let index = 0; index < queue.length && !crash; index += 1) {
        const state = queue[index];
        const row = Math.floor(state / 5);
        const column = state % 5;
        for (let action = 0; action < actions.length; action += 1) {
          const [rowStep, columnStep] = actions[action];
          const nextRow = row + rowStep;
          const nextColumn = column + columnStep;
          if (nextRow < 0 || nextRow >= 5 || nextColumn < 0 || nextColumn >= 5) continue;
          const nextState = nextRow * 5 + nextColumn;
          if (walls.has(nextState)) {
            crash = { state, action };
            break;
          }
          if (nextState === goal || previous.has(nextState)) continue;
          previous.set(nextState, state);
          previousAction.set(nextState, action);
          queue.push(nextState);
        }
      }

      if (!crash) return [];
      const path = [];
      for (let state = crash.state; state !== start; state = previous.get(state)) {
        path.push(previousAction.get(state));
      }
      path.reverse();
      path.push(crash.action);
      return path;
    });
    assert.ok(route.length > 0 && route.length <= 32, 'A reachable obstacle must exist');
    for (const action of route) await page.locator(`[data-action="${action}"]`).click();
    return route;
  };

  const demonstration = await demonstrateShortestRoute();

  const game = page.locator('#game');
  assert.equal(await game.getAttribute('data-state-count'), '25');
  assert.equal(await game.getAttribute('data-decision-state-count'), '19');
  assert.equal(await game.getAttribute('data-start-pool-size'), '19');
  assert.equal(await game.getAttribute('data-action-count'), '4');
  assert.equal(await game.getAttribute('data-phase'), 'decision');
  assert.equal(await game.getAttribute('data-demo-episodes'), '1');
  assert.equal(await game.getAttribute('data-last-episode-result'), 'success');
  assert.equal(await game.getAttribute('data-last-episode-controller'), 'player');
  const experienceAfterDemo = Number(await game.getAttribute('data-experience-count'));
  const coverageAfterDemo = Number(await game.getAttribute('data-state-coverage'));
  const readinessAfterDemo = Number(await game.getAttribute('data-readiness'));
  const policyVersionAfterDemo = Number(await game.getAttribute('data-policy-version'));
  assert.ok(experienceAfterDemo >= experienceAfterFirstAgent + demonstration.length);
  assert.ok(
    Number(await game.getAttribute('data-player-experience-count')) >= demonstration.length,
  );
  assert.ok(coverageAfterDemo > 0 && coverageAfterDemo <= 25);
  assert.ok(readinessAfterDemo > 0);
  assert.ok(policyVersionAfterDemo > 0);
  assert.equal(await page.locator('#decision-panel').isVisible(), true);
  const qpathDecisionSizes = await page
    .locator('#decision-panel button')
    .evaluateAll((buttons) => buttons.map((button) => button.getBoundingClientRect().height));
  assert.ok(qpathDecisionSizes.every((height) => height >= 44));
  assert.ok(
    await page
      .locator('.cell:not(.wall) .policy')
      .evaluateAll((policies) => policies.some((policy) => policy.textContent !== '')),
    'A human route must produce visible policy arrows',
  );
  await assertNoOverflow(page, 'qpath decision');

  await page.locator('#player-next').click();
  assert.equal(await game.getAttribute('data-phase'), 'player');
  const secondDemonstrationStart = Number(
    await page.locator('#board').getAttribute('data-start-state'),
  );
  assert.notEqual(secondDemonstrationStart, firstDemonstrationStart);
  const secondDemonstration = await demonstrateShortestRoute();
  assert.equal(await game.getAttribute('data-demo-episodes'), '2');
  assert.equal(await game.getAttribute('data-last-episode-result'), 'success');
  assert.equal(await game.getAttribute('data-last-episode-controller'), 'player');
  const experienceAfterSecondDemo = Number(await game.getAttribute('data-experience-count'));
  const coverageAfterSecondDemo = Number(await game.getAttribute('data-state-coverage'));
  const readinessAfterSecondDemo = Number(await game.getAttribute('data-readiness'));
  const policyVersionAfterSecondDemo = Number(await game.getAttribute('data-policy-version'));
  assert.ok(experienceAfterSecondDemo >= experienceAfterDemo + secondDemonstration.length);
  assert.ok(coverageAfterSecondDemo > coverageAfterDemo);
  assert.ok(readinessAfterSecondDemo >= 0 && readinessAfterSecondDemo <= 100);
  assert.ok(policyVersionAfterSecondDemo > policyVersionAfterDemo);
  await assertNoOverflow(page, 'qpath second demonstration');

  await page.locator('#player-next').click();
  const crashStart = Number(await page.locator('#board').getAttribute('data-start-state'));
  assert.notEqual(crashStart, secondDemonstrationStart);
  const experienceBeforeCrash = Number(await game.getAttribute('data-experience-count'));
  const playerExperienceBeforeCrash = Number(
    await game.getAttribute('data-player-experience-count'),
  );
  const agentExperienceBeforeCrash = Number(await game.getAttribute('data-agent-experience-count'));
  const crashRoute = await crashIntoObstacle();
  assert.equal(await game.getAttribute('data-phase'), 'decision');
  assert.equal(await game.getAttribute('data-demo-episodes'), '3');
  assert.equal(await game.getAttribute('data-last-episode-result'), 'failure');
  assert.equal(await game.getAttribute('data-last-episode-cause'), 'obstacle');
  assert.equal(await game.getAttribute('data-last-episode-reward'), '-1');
  assert.ok(Number(await game.getAttribute('data-last-episode-return')) < 0);
  assert.equal(await page.locator('.cell.is-crash').count(), 1);
  assert.equal(await page.locator('.agent.is-crashed').count(), 1);
  assert.equal(
    Number(await game.getAttribute('data-experience-count')),
    experienceBeforeCrash + crashRoute.length,
  );
  assert.equal(
    Number(await game.getAttribute('data-player-experience-count')),
    playerExperienceBeforeCrash + crashRoute.length,
  );
  assert.equal(
    Number(await game.getAttribute('data-agent-experience-count')),
    agentExperienceBeforeCrash,
  );
  await assertNoOverflow(page, 'qpath obstacle termination');

  const agentEpisodesBeforeSingle = Number(await game.getAttribute('data-agent-episodes'));
  const experienceBeforeSingleAgent = Number(await game.getAttribute('data-experience-count'));
  const agentExperienceBeforeSingle = Number(
    await game.getAttribute('data-agent-experience-count'),
  );
  await page.locator('#agent-next').click();
  await page.waitForFunction(() => document.querySelector('#game').dataset.phase === 'agent');
  assert.notEqual(
    Number(await page.locator('#board').getAttribute('data-start-state')),
    crashStart,
  );
  await assertNoOverflow(page, 'qpath agent episode');
  await page.waitForFunction(
    (expectedEpisodes) =>
      document.querySelector('#game').dataset.phase === 'decision' &&
      Number(document.querySelector('#game').dataset.agentEpisodes) === expectedEpisodes,
    agentEpisodesBeforeSingle + 1,
    { timeout: 12_000 },
  );
  assert.equal(await game.getAttribute('data-last-episode-controller'), 'agent');
  assert.ok(Number(await game.getAttribute('data-experience-count')) > experienceBeforeSingleAgent);
  assert.ok(
    Number(await game.getAttribute('data-agent-experience-count')) > agentExperienceBeforeSingle,
  );
  assert.equal(await game.getAttribute('data-controller'), 'agent');
  await assertNoOverflow(page, 'qpath agent decision');

  await page.locator('#agent-until-success').click();
  await page.waitForFunction(() => document.querySelector('#game').dataset.phase === 'agent');
  assert.equal(await game.getAttribute('data-agent-run-mode'), 'until-success');
  assert.equal(await page.locator('#agent-until-success').isVisible(), true);
  await assertNoOverflow(page, 'qpath continuous agent active');
  await page.locator('#agent-until-success').click();
  assert.equal(await game.getAttribute('data-agent-run-mode'), 'single');
  const episodesBeforeStoppedRun = Number(await game.getAttribute('data-agent-episodes'));
  await page.waitForFunction(
    (expectedEpisodes) =>
      document.querySelector('#game').dataset.phase === 'decision' &&
      Number(document.querySelector('#game').dataset.agentEpisodes) === expectedEpisodes,
    episodesBeforeStoppedRun + 1,
    { timeout: 12_000 },
  );
  await page.waitForTimeout(500);
  assert.equal(
    Number(await game.getAttribute('data-agent-episodes')),
    episodesBeforeStoppedRun + 1,
  );

  await page.clock.install();
  await page.evaluate(() => {
    const learner = window.__qaGameLearner;
    const game = document.querySelector('#game');
    const board = document.querySelector('#board');
    const originalObserve = learner.observe.bind(learner);
    window.__qaContinuousStarts = [];
    window.__qaContinuousTerminals = [];

    learner.observe = (experience) => {
      originalObserve(experience);
      if (experience.done) {
        window.__qaContinuousTerminals.push({
          attempt: Number(game.dataset.agentRunAttempts),
          reward: experience.reward,
          source: experience.source,
        });
      }
    };

    learner.selectAction = (state) => {
      const attempt = Number(game.dataset.agentRunAttempts);
      if (!window.__qaContinuousStarts.some((entry) => entry.attempt === attempt)) {
        window.__qaContinuousStarts.push({
          attempt,
          start: Number(board.dataset.startState),
        });
      }

      const config = JSON.parse(board.dataset.config);
      const goal = config.goals.find(
        (candidate) => candidate.id === board.dataset.selectedGoal,
      ).state;
      const walls = new Set(config.walls);
      const actions = [
        [-1, 0],
        [0, 1],
        [1, 0],
        [0, -1],
      ];
      const queue = [state];
      const previous = new Map([[state, null]]);
      const previousAction = new Map();
      let destination = null;
      let terminalAction = null;

      search: for (let index = 0; index < queue.length; index += 1) {
        const current = queue[index];
        const row = Math.floor(current / 5);
        const column = current % 5;
        for (let action = 0; action < actions.length; action += 1) {
          const [rowStep, columnStep] = actions[action];
          const nextRow = row + rowStep;
          const nextColumn = column + columnStep;
          if (nextRow < 0 || nextRow >= 5 || nextColumn < 0 || nextColumn >= 5) continue;
          const next = nextRow * 5 + nextColumn;

          if (attempt === 1 && walls.has(next)) {
            destination = current;
            terminalAction = action;
            break search;
          }
          if (walls.has(next) || (attempt === 1 && next === goal) || previous.has(next)) continue;
          previous.set(next, current);
          previousAction.set(next, action);
          if (attempt > 1 && next === goal) {
            destination = next;
            break search;
          }
          queue.push(next);
        }
      }

      if (destination === state && terminalAction !== null) return terminalAction;
      const route = [];
      for (let cursor = destination; cursor !== state; cursor = previous.get(cursor)) {
        route.push(previousAction.get(cursor));
      }
      route.reverse();
      if (terminalAction !== null) route.push(terminalAction);
      return route[0];
    };
  });
  const agentEpisodesBeforeAuto = Number(await game.getAttribute('data-agent-episodes'));
  const experienceBeforeAuto = Number(await game.getAttribute('data-experience-count'));
  const agentExperienceBeforeAuto = Number(await game.getAttribute('data-agent-experience-count'));
  await page.locator('#agent-until-success').click();
  await page.clock.runFor(10_000);
  await page.waitForFunction(
    () =>
      document.querySelector('#game').dataset.phase === 'decision' &&
      document.querySelector('#game').dataset.agentRunMode === 'idle' &&
      document.querySelector('#game').dataset.lastEpisodeResult === 'success',
    undefined,
    { timeout: 2_000 },
  );
  const autoAttempts = Number(await game.getAttribute('data-agent-run-attempts'));
  assert.equal(autoAttempts, 2);
  assert.equal(
    Number(await game.getAttribute('data-agent-episodes')) - agentEpisodesBeforeAuto,
    autoAttempts,
  );
  const continuousExperience =
    Number(await game.getAttribute('data-experience-count')) - experienceBeforeAuto;
  assert.ok(continuousExperience > 0);
  assert.equal(
    Number(await game.getAttribute('data-agent-experience-count')) - agentExperienceBeforeAuto,
    continuousExperience,
  );
  assert.equal(await game.getAttribute('data-last-episode-cause'), 'goal');
  const continuousTrace = await page.evaluate(() => ({
    starts: window.__qaContinuousStarts,
    terminals: window.__qaContinuousTerminals,
  }));
  assert.deepEqual(
    continuousTrace.terminals.map(({ attempt, reward, source }) => ({ attempt, reward, source })),
    [
      { attempt: 1, reward: -1, source: 'agent' },
      { attempt: 2, reward: 1, source: 'agent' },
    ],
  );
  assert.equal(continuousTrace.starts.length, 2);
  assert.notEqual(continuousTrace.starts[0].start, continuousTrace.starts[1].start);
  await assertNoOverflow(page, 'qpath continuous agent success');

  await page.evaluate(() => window.PocketRuntime.apply({ lang: 'zh', theme: 'dark' }));
  assert.equal(await page.locator('h1').textContent(), '路由学徒');
  assert.equal(await game.getAttribute('data-demo-episodes'), '3');
  await assertNoOverflow(page, 'qpath Chinese decision');
  await page.locator('#reset-learning').click();
  assert.equal(await game.getAttribute('data-demo-episodes'), '0');
  assert.equal(await game.getAttribute('data-agent-episodes'), '0');
  assert.equal(await game.getAttribute('data-experience-count'), '0');
  assert.equal(await game.getAttribute('data-player-experience-count'), '0');
  assert.equal(await game.getAttribute('data-agent-experience-count'), '0');
  assert.equal(await game.getAttribute('data-agent-run-mode'), 'idle');

  const stateTwentyPolicy = page.locator('.cell[data-state="20"] .policy');
  const primeRevisablePolicy = () =>
    page.evaluate(() => {
      const learner = window.__qaGameLearner;
      learner.q[20] = [-0.5, -0.5, -0.5, 0.8];
      learner.visits[20] = [1, 1, 1, 1];
      window.PocketRuntime.apply({ lang: 'en', theme: 'light' });
    });

  await page.locator('#player-next').click();
  assert.equal(await page.locator('#board').getAttribute('data-start-state'), '20');
  await primeRevisablePolicy();
  assert.equal(await stateTwentyPolicy.textContent(), '←');
  for (let step = 0; step < 32; step += 1) {
    await page.locator('[data-action="3"]').click();
  }
  assert.equal(await game.getAttribute('data-phase'), 'decision');
  assert.equal(await game.getAttribute('data-last-episode-controller'), 'player');
  assert.equal(await game.getAttribute('data-last-episode-cause'), 'timeout');
  assert.equal(await game.getAttribute('data-player-experience-count'), '32');
  assert.notEqual(await stateTwentyPolicy.textContent(), '←');

  await page.locator('#reset-learning').click();
  await page.evaluate(() => {
    window.__qaGameLearner.selectAction = () => 3;
  });
  await page.locator('#agent-next').click();
  assert.equal(await page.locator('#board').getAttribute('data-start-state'), '20');
  await primeRevisablePolicy();
  assert.equal(await stateTwentyPolicy.textContent(), '←');
  await page.clock.runFor(5_000);
  await page.waitForFunction(
    () =>
      document.querySelector('#game').dataset.phase === 'decision' &&
      document.querySelector('#game').dataset.agentEpisodes === '1',
    undefined,
    { timeout: 2_000 },
  );
  assert.equal(await game.getAttribute('data-last-episode-controller'), 'agent');
  assert.equal(await game.getAttribute('data-last-episode-cause'), 'timeout');
  assert.equal(await game.getAttribute('data-agent-experience-count'), '32');
  assert.notEqual(await stateTwentyPolicy.textContent(), '←');
  await page.close();
}

async function checkReturn(browser) {
  const page = await openGame(browser, 'return');
  const game = page.locator('#game');

  assert.equal(await game.getAttribute('data-total-rounds'), '6');
  for (let round = 0; round < 6; round += 1) {
    const correctRoute = await game.getAttribute('data-correct');
    await page.locator(`[data-route="${correctRoute}"]`).click();
    assert.equal(await game.getAttribute('data-result'), 'correct');
    assert.equal(await page.locator('#reveal').getAttribute('aria-hidden'), 'false');

    if (round === 1) {
      await page.evaluate(() => window.PocketRuntime.apply({ lang: 'zh', theme: 'dark' }));
      assert.equal(await page.locator('h1').textContent(), '折扣回报');
      assert.equal(await game.getAttribute('data-score'), '2');
    }
    await page.locator('#next').click();
  }

  assert.equal(await game.getAttribute('data-phase'), 'complete');
  assert.equal(await game.getAttribute('data-score'), '6');
  await page.locator('#next').click();
  assert.equal(await game.getAttribute('data-round'), '1');
  assert.equal(await game.getAttribute('data-score'), '0');
  await page.close();
}

async function checkWorld(browser) {
  const page = await openGame(browser, 'world', {
    width: 280,
    reducedMotion: 'reduce',
    randomValues: Array(600).fill(0.5),
  });
  const field = page.locator('#field');
  const actionButtons = page.locator('[data-action]');

  assert.equal(await field.getAttribute('data-phase'), 'ready');
  assert.equal(await page.locator('#user-layer > *').count(), 9);
  assert.equal(await page.locator('#round').textContent(), '0');
  assert.equal(await actionButtons.count(), 7);
  assert.deepEqual(await page.evaluate(() => window.__worldDebug.actions), [
    'north',
    'south',
    'west',
    'east',
    'descend',
    'hold',
    'climb',
  ]);
  const initialUav = await page.evaluate(() => window.__worldDebug.snapshot().uav);

  const forecastState = await page.locator('[data-action="east"]').evaluate((button) => {
    button.click();
    return {
      phase: document.querySelector('#field')?.dataset.phase,
      action: document.querySelector('#field')?.dataset.action,
      ghosts: document.querySelector('#ghost-layer')?.childElementCount,
      predictedX: Number(document.querySelector('#predicted-uav')?.getAttribute('cx')),
      actualX: document.querySelector('#uav')?.transform.baseVal.consolidate().matrix.e,
      disabled: [...document.querySelectorAll('button[data-action]')].every(
        (actionButton) => actionButton.disabled,
      ),
    };
  });
  assert.equal(forecastState.phase, 'forecast');
  assert.equal(forecastState.action, 'east');
  assert.equal(forecastState.ghosts, 27);
  assert.equal(forecastState.disabled, true);
  assert.ok(
    forecastState.predictedX > forecastState.actualX,
    'East must preview an eastward UAV move',
  );

  await page.waitForFunction(() => document.querySelector('#field')?.dataset.phase === 'observed');
  assert.equal(await page.locator('#ghost-layer > *').count(), 0);
  assert.equal(await page.locator('#round').textContent(), '1');
  assert.match(await page.locator('#prediction-error').textContent(), /^\d+\.\d{2}$/);
  assert.match(await page.locator('#service-rate').textContent(), /^\d+%$/);
  assert.equal(await actionButtons.first().isEnabled(), true);
  const coverageAlignment = await page.evaluate(() => {
    const ellipse = document.querySelector('#coverage');
    const centerX = Number(ellipse.getAttribute('cx'));
    const centerY = Number(ellipse.getAttribute('cy'));
    const radiusX = Number(ellipse.getAttribute('rx'));
    const radiusY = Number(ellipse.getAttribute('ry'));
    return [...document.querySelectorAll('#user-layer > g')].map((user) => {
      const matrix = user.transform.baseVal.consolidate().matrix;
      const visuallyInside =
        ((matrix.e - centerX) / radiusX) ** 2 + ((matrix.f - centerY) / radiusY) ** 2 <= 1.0001;
      return visuallyInside === user.classList.contains('is-served');
    });
  });
  assert.equal(coverageAlignment.every(Boolean), true, 'World-model coverage must match service');
  const movedEast = await page.evaluate(() => window.__worldDebug.snapshot().uav);
  assert.ok(movedEast.x > initialUav.x);
  assert.equal(movedEast.y, initialUav.y);
  assert.equal(movedEast.height, initialUav.height);
  await assertNoOverflow(page, 'world observed');

  const error = await page.locator('#prediction-error').textContent();
  await page.evaluate(() => window.PocketRuntime.apply({ lang: 'zh', theme: 'dark' }));
  assert.equal(await page.locator('h1').textContent(), '潜空间预演');
  assert.equal(await page.locator('#prediction-error').textContent(), error);

  await page.locator('#reset').click();
  assert.equal(await field.getAttribute('data-phase'), 'ready');
  assert.equal(await page.locator('#round').textContent(), '0');
  await page.locator('button[data-action="west"]').focus();
  await page.keyboard.press('Space');
  await page.waitForFunction(
    () =>
      document.querySelector('#field')?.dataset.phase === 'observed' &&
      document.querySelector('#field')?.dataset.action === 'west',
  );
  assert.ok(Number(await field.getAttribute('data-uav-x')) < initialUav.x);

  await page.locator('button[data-action="south"]').click();
  await page.waitForFunction(
    () =>
      document.querySelector('#field')?.dataset.phase === 'observed' &&
      document.querySelector('#field')?.dataset.action === 'south' &&
      document.querySelector('#round')?.textContent === '2',
  );
  assert.ok(Number(await field.getAttribute('data-uav-y')) > initialUav.y);

  await page.locator('button[data-action="descend"]').click();
  await page.waitForFunction(
    () =>
      document.querySelector('#field')?.dataset.phase === 'observed' &&
      document.querySelector('#field')?.dataset.action === 'descend' &&
      document.querySelector('#round')?.textContent === '3',
  );
  assert.ok(Number(await field.getAttribute('data-uav-height')) < initialUav.height);

  for (let round = 4; round <= 8; round += 1) {
    await page.locator('button[data-action="west"]').click();
    await page.waitForFunction(
      (expectedRound) =>
        document.querySelector('#field')?.dataset.phase === 'observed' &&
        document.querySelector('#field')?.dataset.action === 'west' &&
        Number(document.querySelector('#round')?.textContent) === expectedRound,
      round,
    );
  }
  assert.equal(Number(await field.getAttribute('data-uav-x')), 0.1);
  assert.equal(await field.getAttribute('data-clamped'), 'true');

  await page.locator('#reset').click();
  await page.locator('[data-action="hold"]').focus();
  await page.keyboard.press('ArrowUp');
  await page.waitForFunction(() => document.querySelector('#field')?.dataset.phase === 'observed');
  assert.equal(await field.getAttribute('data-action'), 'north');
  assert.ok(Number(await field.getAttribute('data-uav-y')) < initialUav.y);

  await page.keyboard.press('PageUp');
  await page.waitForFunction(
    () =>
      document.querySelector('#field')?.dataset.phase === 'observed' &&
      document.querySelector('#field')?.dataset.action === 'climb',
  );
  assert.ok(Number(await field.getAttribute('data-uav-height')) > initialUav.height);

  await page.locator('#reset').click();
  await page.evaluate(() => document.activeElement?.blur());
  for (let round = 1; round <= 3; round += 1) {
    await page.keyboard.press('Space');
    await page.waitForFunction(
      (expectedRound) =>
        document.querySelector('#field')?.dataset.phase === 'observed' &&
        Number(document.querySelector('#round')?.textContent) === expectedRound,
      round,
    );
  }
  assert.equal(await field.getAttribute('data-lock-streak'), '3');
  assert.equal(await field.getAttribute('data-locked'), 'true');
  assert.equal(await page.locator('#lock-chip .is-active').count(), 3);
  await assertNoOverflow(page, 'world locked zh');
  await page.close();
}

async function checkStl(browser) {
  const page = await openGame(browser, 'stl', { width: 280, reducedMotion: 'reduce' });
  const game = page.locator('#game');

  assert.equal(await game.getAttribute('data-monitor-only'), 'true');
  assert.equal(await game.getAttribute('data-phase'), 'ready');
  assert.equal(await game.getAttribute('data-total-slots'), '12');
  assert.equal(await game.getAttribute('data-threshold'), 'balanced');
  assert.equal(await game.getAttribute('data-threshold-value'), '0.333');
  assert.equal(await page.locator('button[data-threshold]').count(), 3);
  await page.locator('button[data-threshold="sensitive"]').click();
  assert.equal(await game.getAttribute('data-threshold'), 'sensitive');
  assert.equal(
    await page.locator('button[data-threshold="sensitive"]').getAttribute('aria-checked'),
    'true',
  );
  await page.keyboard.press('ArrowRight');
  assert.equal(await game.getAttribute('data-threshold'), 'balanced');
  await page.keyboard.press('ArrowRight');
  assert.equal(await game.getAttribute('data-threshold'), 'tolerant');
  assert.equal(
    await page.locator('button[data-threshold="tolerant"]').getAttribute('aria-checked'),
    'true',
  );
  await page.keyboard.press('2');
  assert.equal(await game.getAttribute('data-threshold'), 'balanced');

  await page.locator('#start-button').click();
  for (let checkpoint = 1; checkpoint <= 3; checkpoint += 1) {
    await page.waitForFunction((expectedCheckpoint) => {
      const root = document.querySelector('#game');
      return (
        root?.dataset.phase === 'decision' && Number(root.dataset.checkpoint) === expectedCheckpoint
      );
    }, checkpoint);
    const recommended = await game.getAttribute('data-recommended');
    assert.ok(['hold', 'repair', 'probe'].includes(recommended));
    const margin = Number(await game.getAttribute('data-semantic-margin'));
    const currentResponse = await game.getAttribute('data-response');
    if (margin < 0 && currentResponse === 'hold') assert.notEqual(recommended, 'hold');
    if (checkpoint === 1) {
      assert.equal(await page.locator('button[data-threshold="tolerant"]').isDisabled(), true);
      await page.locator('button[data-threshold="tolerant"]').click({ force: true });
      assert.equal(await game.getAttribute('data-threshold'), 'balanced');
      await page.keyboard.press(String(['hold', 'repair', 'probe'].indexOf(recommended) + 1));
    } else {
      await page.locator(`button[data-response="${recommended}"]`).click();
    }
  }

  await page.waitForFunction(() => document.querySelector('#game')?.dataset.phase === 'complete');
  assert.equal(await game.getAttribute('data-slot'), '12');
  assert.match(await game.getAttribute('data-score'), /^\d+$/);
  assert.match(await game.getAttribute('data-violation-rate'), /^\d+\.\d{3}$/);
  assert.match(await game.getAttribute('data-false-alarms'), /^\d+$/);
  assert.match(await game.getAttribute('data-misses'), /^\d+$/);
  await assertNoOverflow(page, 'stl complete');

  const score = await game.getAttribute('data-score');
  await page.evaluate(() => window.PocketRuntime.apply({ lang: 'zh', theme: 'dark' }));
  assert.equal(await page.locator('h1').textContent(), '时序语义哨兵');
  assert.equal(await game.getAttribute('data-score'), score);
  await page.locator('button[data-threshold="tolerant"]').click();
  assert.equal(await game.getAttribute('data-threshold'), 'tolerant');
  assert.equal(await game.getAttribute('data-threshold-value'), '0.500');
  assert.match(await page.locator('button[data-threshold="tolerant"]').textContent(), /宽松/);

  await page.locator('#reset-button').click();
  assert.equal(await game.getAttribute('data-phase'), 'ready');
  assert.equal(await game.getAttribute('data-slot'), '0');
  await page.close();
}

async function checkBackscatter(browser) {
  const page = await openGame(browser, 'backscatter', {
    width: 240,
    language: 'zh',
    reducedMotion: 'reduce',
  });
  const game = page.locator('.game[data-game="backscatter"]');
  const arena = page.locator('#arena');

  assert.equal(await game.getAttribute('data-phase'), 'primary');
  assert.equal(await game.getAttribute('data-slot'), '1');
  assert.equal(await game.getAttribute('data-complete'), 'false');
  assert.equal(await page.locator('#follow-actions').isHidden(), true);
  assert.equal(await page.locator('h1').textContent(), '借波突围');
  assert.match(await page.locator('.rhythm-heading').textContent(), /非概率/);
  await assertNoOverflow(page, 'backscatter zh primary 240px');
  const primaryTargetSizes = await page.locator('#primary-actions button').evaluateAll((buttons) =>
    buttons.map((button) => {
      const bounds = button.getBoundingClientRect();
      return { width: bounds.width, height: bounds.height };
    }),
  );
  assert.ok(
    primaryTargetSizes.every(({ width, height }) => width >= 44 && height >= 44),
    `Signal Judo controls must remain touchable at 240px: ${JSON.stringify(primaryTargetSizes)}`,
  );

  const batteryBeforeProbe = Number.parseInt(await page.locator('#battery').textContent(), 10);
  await page.locator('#primary-actions [data-action="probe"]').click();
  assert.equal(await game.getAttribute('data-phase'), 'follow');
  assert.equal(
    Number.parseInt(await page.locator('#battery').textContent(), 10),
    batteryBeforeProbe - 1,
  );
  assert.match(await arena.getAttribute('data-carrier'), /^(quiet|weak|steady|broken)$/);
  assert.match(await page.locator('#status').textContent(), /探测完成/);
  await assertNoOverflow(page, 'backscatter zh follow 240px');
  await page.evaluate(() => window.PocketRuntime.apply({ lang: 'en', theme: 'light' }));
  assert.match(await page.locator('#status').textContent(), /Probe complete/);
  await page.locator('#follow-actions [data-action="harvest"]').click();
  assert.equal(await game.getAttribute('data-phase'), 'primary');
  assert.equal(await game.getAttribute('data-slot'), '2');
  assert.equal(await page.locator('#history li').count(), 1);
  assert.match(await page.locator('#history li').first().textContent(), /[○≈∿⋯]/);
  assert.match(
    await page.locator('#history li').first().getAttribute('data-observation'),
    /^(quiet|weak|steady|broken)$/,
  );
  const rhythmSampleCount = await page
    .locator('#rhythm-strip i b')
    .evaluateAll((counts) => counts.reduce((sum, count) => sum + Number(count.textContent), 0));
  assert.equal(rhythmSampleCount, 1);
  assert.match(
    await game.getAttribute('data-adaptation'),
    /^(calibrated|needed|probed|recovered)$/,
  );

  let sawDrift = false;
  for (
    let action = 0;
    action < 10 && (await game.getAttribute('data-complete')) !== 'true';
    action += 1
  ) {
    const previousSlot = Number(await game.getAttribute('data-slot'));
    await page.locator('#primary-actions [data-action="wait"]').focus();
    await page.keyboard.press('3');
    const nextSlot = Number(await game.getAttribute('data-slot'));
    assert.ok(nextSlot > previousSlot || (await game.getAttribute('data-complete')) === 'true');
    sawDrift ||= (await arena.getAttribute('data-drift')) === 'true';
  }
  assert.equal(await game.getAttribute('data-complete'), 'true');
  assert.equal(sawDrift, true, 'Signal Judo must surface the hidden rhythm shift');
  assert.equal(await game.getAttribute('data-phase'), 'complete');
  assert.equal(await page.locator('#results').isVisible(), true);
  assert.equal(await page.locator('#history li').count(), 4);
  assert.match(await page.locator('#result-recovery').textContent(), /^0 \/ 100/);
  await assertNoOverflow(page, 'backscatter complete 240px');

  const delivered = Number.parseInt(await page.locator('#result-delivered').textContent(), 10);
  await page.evaluate(() => window.PocketRuntime.apply({ lang: 'zh', theme: 'dark' }));
  assert.equal(await page.locator('h1').textContent(), '借波突围');
  assert.equal(
    Number.parseInt(await page.locator('#result-delivered').textContent(), 10),
    delivered,
  );
  assert.match(await page.locator('#result-delivered').textContent(), /个数据包/);
  await assertNoOverflow(page, 'backscatter complete zh 240px');
  const restartBounds = await page.locator('#restart').boundingBox();
  assert.ok(
    restartBounds && restartBounds.y + restartBounds.height <= 681,
    `Signal Judo Chinese restart control must remain visible: ${JSON.stringify(restartBounds)}`,
  );
  await page.locator('#restart').click();
  assert.equal(await game.getAttribute('data-slot'), '1');
  assert.equal(await game.getAttribute('data-complete'), 'false');
  await assertNoOverflow(page, 'backscatter restarted zh 240px');
  await page.close();
}

async function checkResilience(browser) {
  const page = await openGame(browser, 'resilience', { width: 280, clock: true });
  const field = page.locator('#field');

  assert.equal(await field.getAttribute('data-resync-used'), 'false');
  assert.equal(await page.locator('#resync-token').textContent(), '1 / 1');
  assert.equal(await page.locator('#resync-control').isDisabled(), true);
  await page.keyboard.press('1');
  assert.equal(await page.locator('[data-payload="light"]').getAttribute('aria-pressed'), 'true');
  await page.locator('[data-payload="heavy"]').focus();
  await page.keyboard.press('Space');
  assert.equal(await page.locator('[data-payload="heavy"]').getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('[data-payload="medium"]').getAttribute('aria-pressed'), 'false');
  assert.equal(await page.locator('#resync-control').isDisabled(), true);

  await page.locator('#episode-control').focus();
  await page.keyboard.press('Space');
  assert.equal(await page.locator('#resync-control').isEnabled(), true);
  await page.locator('#resync-control').focus();
  await page.keyboard.press('Space');
  assert.equal(await field.getAttribute('data-resync-used'), 'true');
  assert.equal(await field.getAttribute('data-resync-pending'), 'true');
  assert.equal(await field.getAttribute('data-resync-cost'), '4.0');
  assert.equal(await page.locator('#service-gap').textContent(), '4.0');
  assert.equal(await page.locator('#resync-token').textContent(), '0 / 1');
  assert.equal(await page.locator('#resync-control').isDisabled(), true);
  await page.clock.runFor(1700);
  assert.equal(await page.locator('#slot').textContent(), '1 / 24');
  assert.equal(await field.getAttribute('data-source'), 'fresh');
  assert.equal(await field.getAttribute('data-resync'), 'applied');
  assert.equal(await field.getAttribute('data-resync-pending'), 'false');
  assert.ok(Number(await page.locator('#service-gap').textContent()) >= 4);
  assert.ok(
    (await page.locator('#history > .fresh, #history > .predicted, #history > .hold').count()) >= 1,
  );

  await page.locator('#episode-control').click();
  const pausedSlot = await page.locator('#slot').textContent();
  await page.clock.runFor(5100);
  assert.equal(await page.locator('#slot').textContent(), pausedSlot);
  await page.locator('#episode-control').click();
  await page.clock.runFor(23 * 1700);
  assert.equal(await page.locator('#slot').textContent(), '24 / 24');
  assert.equal(
    await page.locator('#history > .fresh, #history > .predicted, #history > .hold').count(),
    24,
  );
  assert.match(await page.locator('#service').textContent(), /^\d+%$/);
  assert.match(await page.locator('#service-gap').textContent(), /^\d+\.\d$/);
  assert.match(await field.getAttribute('data-mean-service'), /^\d+\.\d{2}$/);
  await assertNoOverflow(page, 'resilience complete');

  const serviceGap = await page.locator('#service-gap').textContent();
  await page.evaluate(() => window.PocketRuntime.apply({ lang: 'zh', theme: 'dark' }));
  assert.equal(await page.locator('h1').textContent(), '断链续航');
  assert.equal(await page.locator('#service-gap').textContent(), serviceGap);
  assert.equal(await page.locator('#episode-control').textContent(), '再来一局');
  await page.locator('#episode-control').click();
  assert.equal(await page.locator('#resync-token').textContent(), '1 / 1');
  assert.equal(await field.getAttribute('data-resync-used'), 'false');
  await page.locator('#episode-control').click();
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

  const fieldBox = await field.boundingBox();
  await firstHandle.press('Home');
  await firstHandle.press('ArrowRight');
  const handleBox = await firstHandle.boundingBox();
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
  assert.equal(await page.locator('h1').textContent(), '可移动天线实验');
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
  assert.equal(await page.locator('.metrics').getAttribute('aria-label'), '实时天线指标');
  assert.doesNotMatch(
    await firstPinch.getAttribute('aria-label'),
    /向向/,
    'Chinese pinch direction must not repeat the preposition',
  );
  await page.close();
}

async function checkSecrecy(browser) {
  const deterministicChannel = [
    0.7, 0.25, 0.2, 0.8, 0.3, 0.5, 0.5, 0.3, 0.5, 0.25, 0.5, 0.15, 0.2, 0.85, 0.8, 0.8, 0.2, 0.8,
    0.1, 0.4, 0.2, 0.8, 0.2, 0.8, 0.6, 0.8, 0.6,
  ];
  const page = await openGame(browser, 'secrecy', { randomValues: deterministicChannel });
  const field = page.locator('#field');
  const heatmap = page.locator('#energy-map');
  const wallToggle = page.locator('#wall-mode');

  await page.waitForFunction(() => {
    const revision = Number(document.querySelector('#field')?.dataset.heatmapRevision);
    return Number.isInteger(revision) && revision > 0;
  });

  const waitForHeatmapRevision = async (previousRevision) => {
    await page.waitForFunction(
      (previous) => Number(document.querySelector('#field')?.dataset.heatmapRevision) > previous,
      previousRevision,
      { timeout: 5_000 },
    );
  };

  const readHeatmap = async () =>
    heatmap.evaluate((canvas) => {
      const context = canvas.getContext('2d', { willReadFrequently: true });
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      const colors = new Set();
      let minimumLuminance = 255;
      let maximumLuminance = 0;
      let paintedPixels = 0;
      let hash = 2166136261;
      for (let index = 0; index < pixels.length; index += 4) {
        const red = pixels[index];
        const green = pixels[index + 1];
        const blue = pixels[index + 2];
        const alpha = pixels[index + 3];
        hash = Math.imul(hash ^ red, 16777619);
        hash = Math.imul(hash ^ green, 16777619);
        hash = Math.imul(hash ^ blue, 16777619);
        hash = Math.imul(hash ^ alpha, 16777619);
        if (alpha === 0) continue;
        paintedPixels += 1;
        const luminance = Math.round(0.2126 * red + 0.7152 * green + 0.0722 * blue);
        minimumLuminance = Math.min(minimumLuminance, luminance);
        maximumLuminance = Math.max(maximumLuminance, luminance);
        colors.add(`${red},${green},${blue},${alpha}`);
      }
      return {
        width: canvas.width,
        height: canvas.height,
        paintedPixels,
        uniqueColors: colors.size,
        luminanceRange: maximumLuminance - minimumLuminance,
        hash: hash >>> 0,
      };
    });

  const readScenario = async () =>
    page.evaluate(() => {
      const channel = window.__secrecyDebug.scenario();
      return {
        alice: channel.alice,
        bob: channel.bob,
        eve: channel.eve,
        obstacles: channel.obstacles,
      };
    });

  const readLinkTelemetry = async () =>
    field.evaluate((element) => ({
      bob: {
        directVisible: element.dataset.bobDirectVisible === 'true',
        pathCount: Number(element.dataset.bobPathCount),
        maxBounces: Number(element.dataset.bobMaxBounces),
        receivedDb: Number(element.dataset.bobReceivedDb),
      },
      eve: {
        directVisible: element.dataset.eveDirectVisible === 'true',
        pathCount: Number(element.dataset.evePathCount),
        maxBounces: Number(element.dataset.eveMaxBounces),
        receivedDb: Number(element.dataset.eveReceivedDb),
      },
    }));

  const assertHeatmapSamplesMatchReceivers = async () => {
    const samples = await page.evaluate(() => {
      const debug = window.__secrecyDebug;
      const channel = debug.scenario();
      const sampleDb = (point) => {
        const sample = debug.sampleHeatmap(point);
        return Number(
          typeof sample === 'number' ? sample : (sample.receivedDb ?? sample.db ?? sample.powerDb),
        );
      };
      return { bob: sampleDb(channel.bob), eve: sampleDb(channel.eve) };
    });
    const telemetry = await readLinkTelemetry();
    for (const receiver of ['bob', 'eve']) {
      assert.ok(
        Number.isFinite(samples[receiver]) && Number.isFinite(telemetry[receiver].receivedDb),
        `${receiver} heatmap and link readouts must be finite`,
      );
      assert.ok(
        Math.abs(samples[receiver] - telemetry[receiver].receivedDb) <= 0.5,
        `${receiver} heatmap sample must match its receiver readout: ${JSON.stringify({ samples, telemetry })}`,
      );
    }
  };

  const pathArray = (summary) =>
    Array.isArray(summary) ? summary : Array.isArray(summary?.paths) ? summary.paths : [];
  const bounceCount = (path) =>
    Number(
      path.bounces ??
        path.bounceCount ??
        path.reflectionCount ??
        (Array.isArray(path.surfaces) ? path.surfaces.length : Number.NaN),
    );
  const surfaceKinds = (path) =>
    (path.surfaces ?? path.reflections ?? []).map((surface) => {
      const value = String(
        typeof surface === 'string'
          ? surface
          : (surface.type ?? surface.kind ?? surface.surfaceType ?? surface.id ?? ''),
      ).toLowerCase();
      if (/wall|left|right|top|bottom/.test(value)) return 'wall';
      if (/obstacle|reflector|panel|^r\d/.test(value)) return 'obstacle';
      return value;
    });

  const obstacleCount = await page.locator('.reflective-surface').count();
  assert.ok(obstacleCount >= 1 && obstacleCount <= 2, 'Secrecy lab needs one or two obstacles');
  assert.equal(await heatmap.count(), 1, 'Secrecy lab must render one energy heatmap canvas');
  assert.equal(
    await page
      .locator('.link-path, .beam, .beam-axis, .reflection-axis, .reflection-input')
      .count(),
    0,
    'The heatmap view must not draw individual propagation paths or beam wedges',
  );
  assert.equal(await field.getAttribute('data-objective'), 'secrecy-rate');
  assert.equal(await field.getAttribute('data-reflection-model'), 'lossy-specular');
  assert.equal(await field.getAttribute('data-power-combination'), 'incoherent');
  assert.equal(await field.getAttribute('data-max-bounces'), '3');
  assert.equal(await field.getAttribute('data-reflection-coefficient'), '0.46');
  assert.equal(await field.getAttribute('data-db-floor'), '-36');
  assert.equal(await field.getAttribute('data-obstacle-count'), String(obstacleCount));
  assert.equal(await field.getAttribute('data-walls'), 'false');
  assert.equal(await wallToggle.isChecked(), false);

  const debugContract = await page.evaluate(() => ({
    evaluatePoint: typeof window.__secrecyDebug?.evaluatePoint,
    scenario: typeof window.__secrecyDebug?.scenario,
    pathSummary: typeof window.__secrecyDebug?.pathSummary,
    sampleHeatmap: typeof window.__secrecyDebug?.sampleHeatmap,
    constants: window.__secrecyDebug?.constants,
  }));
  assert.deepEqual(
    [
      debugContract.evaluatePoint,
      debugContract.scenario,
      debugContract.pathSummary,
      debugContract.sampleHeatmap,
    ],
    ['function', 'function', 'function', 'function'],
    'Secrecy heatmap must expose its deterministic QA surface',
  );
  const constants = debugContract.constants;
  assert.ok(constants && typeof constants === 'object', 'Secrecy debug constants must be exposed');
  assert.equal(constants.reflectionModel ?? constants.REFLECTION_MODEL, 'lossy-specular');
  assert.equal(constants.powerCombination ?? constants.POWER_COMBINATION, 'incoherent');
  assert.equal(Number(constants.maxBounces ?? constants.MAX_BOUNCES), 3);
  const reflectionCoefficient = Number(
    constants.reflectionCoefficient ?? constants.REFLECTION_COEFFICIENT,
  );
  assert.equal(reflectionCoefficient, 0.46);
  assert.equal(
    Number(
      constants.wallReflectionCoefficient ??
        constants.WALL_REFLECTION_COEFFICIENT ??
        reflectionCoefficient,
    ),
    reflectionCoefficient,
    'Walls must use the shared reflection coefficient',
  );
  assert.equal(
    Number(
      constants.obstacleReflectionCoefficient ??
        constants.OBSTACLE_REFLECTION_COEFFICIENT ??
        reflectionCoefficient,
    ),
    reflectionCoefficient,
    'Obstacles must use the shared reflection coefficient',
  );

  const canvasSize = await heatmap.evaluate((canvas) => ({
    width: canvas.width,
    height: canvas.height,
  }));
  assert.deepEqual(canvasSize, {
    width: Number(await field.getAttribute('data-heatmap-width')),
    height: Number(await field.getAttribute('data-heatmap-height')),
  });
  assert.ok(canvasSize.width >= 32 && canvasSize.height >= 18, 'Heatmap grid is too coarse');
  const initialHeatmap = await readHeatmap();
  assert.equal(initialHeatmap.paintedPixels, canvasSize.width * canvasSize.height);
  assert.ok(
    initialHeatmap.uniqueColors >= 4 && initialHeatmap.luminanceRange >= 10,
    `Energy heatmap must have visible intensity variation: ${JSON.stringify(initialHeatmap)}`,
  );

  const assertSecrecyRateIdentity = async () => {
    const metrics = await field.evaluate((element) => ({
      bobSnr: Number(element.dataset.bobSnr),
      eveSnr: Number(element.dataset.eveSnr),
      bobRate: Number(element.dataset.bobRate),
      eveRate: Number(element.dataset.eveRate),
      secrecyRate: Number(element.dataset.secrecyRate),
      codewordRate: Number(element.dataset.codewordRate),
      redundancyRate: Number(element.dataset.redundancyRate),
      bobCovered: element.dataset.bobCovered === 'true',
      eveListening: element.dataset.eveListening === 'true',
      secure: element.dataset.secure === 'true',
    }));
    assert.ok(
      [
        metrics.bobSnr,
        metrics.eveSnr,
        metrics.bobRate,
        metrics.eveRate,
        metrics.secrecyRate,
        metrics.codewordRate,
        metrics.redundancyRate,
      ].every(Number.isFinite),
      'Secrecy rates and thresholds must be finite',
    );
    assert.ok(metrics.bobSnr >= 0 && metrics.eveSnr >= 0, 'Link SNRs must be non-negative');
    assert.ok(
      Math.abs(metrics.bobRate - Math.log2(1 + metrics.bobSnr)) <= 1e-6,
      `Bob rate must use log2(1 + SNR): ${JSON.stringify(metrics)}`,
    );
    assert.ok(
      Math.abs(metrics.eveRate - Math.log2(1 + metrics.eveSnr)) <= 1e-6,
      `Eve rate must use log2(1 + SNR): ${JSON.stringify(metrics)}`,
    );
    assert.ok(
      Math.abs(metrics.secrecyRate - Math.max(metrics.bobRate - metrics.eveRate, 0)) <= 0.011,
      `Secrecy rate must equal [R_B - R_E]+: ${JSON.stringify(metrics)}`,
    );
    assert.equal(metrics.bobCovered, metrics.bobRate >= metrics.codewordRate);
    assert.equal(metrics.eveListening, metrics.eveRate > metrics.redundancyRate);
    assert.equal(metrics.secure, metrics.bobCovered && !metrics.eveListening);
    return metrics;
  };

  const metricsWithoutWalls = await assertSecrecyRateIdentity();
  await assertHeatmapSamplesMatchReceivers();
  assert.match(await page.locator('#secrecy-rate').textContent(), /^\d+\.\d{2}$/);
  assert.equal(await page.locator('.score-unit').textContent(), 'bit/s/Hz');
  assert.match(await page.locator('#bob-link').textContent(), /bit\/s\/Hz/);
  assert.match(await page.locator('#eve-link').textContent(), /bit\/s\/Hz/);

  const visibilityProbe = await page.evaluate(() => {
    const debug = window.__secrecyDebug;
    const channel = debug.scenario();
    const heading = Number(document.querySelector('#field').dataset.angle);
    const receivers = [channel.bob, channel.eve].map((point) => {
      const result = debug.evaluatePoint(point, heading, false);
      return {
        directVisible: result.directVisible,
        directPower: Number(result.directPower ?? result.direct?.power),
      };
    });
    const alice = channel.alice ?? { x: 50, y: 105 };
    const clearPoint = { x: alice.x + 18, y: alice.y + 18 };
    const clear = debug.evaluatePoint(clearPoint, heading, false);
    return {
      receivers,
      clear: {
        directVisible: clear.directVisible,
        directPower: Number(clear.directPower ?? clear.direct?.power),
      },
    };
  });
  assert.ok(
    visibilityProbe.receivers.some(
      (receiver) => receiver.directVisible === false && receiver.directPower === 0,
    ),
    `An opaque obstacle must fully remove LOS power behind it: ${JSON.stringify(visibilityProbe)}`,
  );
  assert.equal(visibilityProbe.clear.directVisible, true, 'A nearby side probe must retain LOS');
  assert.ok(visibilityProbe.clear.directPower > 0, 'An unobstructed LOS probe must receive power');
  const telemetryWithoutWalls = await readLinkTelemetry();
  assert.deepEqual(
    telemetryWithoutWalls.bob.directVisible,
    visibilityProbe.receivers[0].directVisible,
  );
  assert.deepEqual(
    telemetryWithoutWalls.eve.directVisible,
    visibilityProbe.receivers[1].directVisible,
  );
  for (const receiver of ['bob', 'eve']) {
    assert.ok(telemetryWithoutWalls[receiver].pathCount >= 0);
    assert.ok(
      telemetryWithoutWalls[receiver].maxBounces >= 0 &&
        telemetryWithoutWalls[receiver].maxBounces <= 3,
    );
  }

  const initialAngle = await field.getAttribute('data-angle');
  const revisionBeforeKeyboard = Number(await field.getAttribute('data-heatmap-revision'));
  await field.press('Shift+ArrowRight');
  await waitForHeatmapRevision(revisionBeforeKeyboard);
  assert.notEqual(
    await field.getAttribute('data-angle'),
    initialAngle,
    'Keyboard must steer Alice',
  );
  const steeredHeatmap = await readHeatmap();
  assert.notEqual(
    steeredHeatmap.hash,
    initialHeatmap.hash,
    'Changing Alice bearing must visibly change the energy heatmap',
  );
  await assertHeatmapSamplesMatchReceivers();

  const scenarioBeforeWalls = await readScenario();
  const heatmapBeforeWalls = await readHeatmap();
  const revisionBeforeWalls = Number(await field.getAttribute('data-heatmap-revision'));
  await page.locator('.wall-toggle').click();
  await waitForHeatmapRevision(revisionBeforeWalls);
  assert.equal(await wallToggle.isChecked(), true);
  assert.equal(await field.getAttribute('data-walls'), 'true');
  assert.equal(
    await page
      .locator('.link-path, .beam, .beam-axis, .reflection-axis, .reflection-input')
      .count(),
    0,
  );
  const heatmapWithWalls = await readHeatmap();
  assert.notEqual(
    heatmapWithWalls.hash,
    heatmapBeforeWalls.hash,
    'Enabling wall reflections must visibly change the energy heatmap',
  );
  assert.deepEqual(
    await readScenario(),
    scenarioBeforeWalls,
    'Wall mode must preserve Alice, Bob, Eve, and obstacle geometry',
  );

  const summariesWithWalls = await page.evaluate(() => {
    const debug = window.__secrecyDebug;
    const channel = debug.scenario();
    return {
      bob: debug.pathSummary(channel.bob, true),
      eve: debug.pathSummary(channel.eve, true),
      deterministic:
        typeof debug.deterministicGeometry === 'function' ? debug.deterministicGeometry() : null,
    };
  });
  const telemetryWithWalls = await readLinkTelemetry();
  let allPaths = [];
  for (const receiver of ['bob', 'eve']) {
    const paths = pathArray(summariesWithWalls[receiver]);
    assert.ok(paths.length > 0, `${receiver} must have at least one valid propagation path`);
    assert.equal(paths.length, telemetryWithWalls[receiver].pathCount);
    const bounceCounts = paths.map(bounceCount);
    assert.ok(
      bounceCounts.every((count) => Number.isInteger(count) && count >= 0 && count <= 3),
      `${receiver} paths must contain only zero to three reflections: ${JSON.stringify(bounceCounts)}`,
    );
    assert.equal(Math.max(...bounceCounts), telemetryWithWalls[receiver].maxBounces);
    allPaths.push(...paths);
  }
  if (!allPaths.some((path) => bounceCount(path) === 3) && summariesWithWalls.deterministic) {
    const fixture = summariesWithWalls.deterministic;
    allPaths = allPaths.concat(
      pathArray(fixture.summary ?? fixture.pathSummary ?? fixture.paths ?? fixture),
    );
  }
  assert.ok(
    allPaths.some((path) => bounceCount(path) === 3),
    'The enumerator must expose at least one valid three-reflection path',
  );
  assert.equal(
    allPaths.some((path) => bounceCount(path) >= 4),
    false,
    'The propagation model must never enumerate a fourth reflection',
  );
  const observedSurfaceKinds = new Set(allPaths.flatMap(surfaceKinds));
  assert.ok(observedSurfaceKinds.has('wall'), 'Wall mode must enumerate specular wall reflections');

  const wallTarget = await page.locator('.wall-toggle').boundingBox();
  assert.ok(
    wallTarget && wallTarget.width >= 44 && wallTarget.height >= 44,
    `Wall toggle must expose a 44px touch target: ${JSON.stringify(wallTarget)}`,
  );
  const metricsWithWalls = await assertSecrecyRateIdentity();
  await assertHeatmapSamplesMatchReceivers();
  assert.ok(
    Math.abs(metricsWithWalls.bobRate - metricsWithoutWalls.bobRate) > 1e-6 ||
      Math.abs(metricsWithWalls.eveRate - metricsWithoutWalls.eveRate) > 1e-6,
    'Four-wall mode must alter at least one link rate',
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
  await assertHeatmapSamplesMatchReceivers();

  const initialScenario = await readScenario();
  const revisionBeforeRandomize = Number(await field.getAttribute('data-heatmap-revision'));
  await page.locator('#randomize').click();
  await waitForHeatmapRevision(revisionBeforeRandomize);
  assert.notDeepEqual(
    await readScenario(),
    initialScenario,
    'Random scene must change channel geometry',
  );
  assert.equal(
    await field.getAttribute('data-walls'),
    'true',
    'New scenes must preserve wall mode',
  );
  const rateBeforeOptimization = (await assertSecrecyRateIdentity()).secrecyRate;

  await page.locator('#optimize').click();
  assert.equal(await field.getAttribute('data-optimizing'), 'true');
  await field.press('ArrowRight');
  const canceledAngle = await field.getAttribute('data-angle');
  await page.waitForTimeout(1_000);
  assert.equal(await field.getAttribute('data-optimizing'), 'false');
  assert.equal(await field.getAttribute('data-angle'), canceledAngle);
  assert.equal(await field.getAttribute('data-best-angle'), null);

  await page.locator('#optimize').click();
  await waitForOptimization(page, 'secrecy', 4_000);
  assert.equal(
    await field.getAttribute('data-angle'),
    await field.getAttribute('data-best-angle'),
    'Animated search must settle on the evaluated best bearing',
  );
  const optimizedMetrics = await assertSecrecyRateIdentity();
  assert.ok(
    optimizedMetrics.secrecyRate + 0.011 >= rateBeforeOptimization,
    'Secrecy-rate search must not make its objective worse',
  );
  assert.ok(
    Math.abs(
      optimizedMetrics.secrecyRate - Number(await field.getAttribute('data-best-secrecy-rate')),
    ) <= 0.011,
    'Animated search must settle on the evaluated maximum secrecy rate',
  );
  await assertHeatmapSamplesMatchReceivers();

  await page.setViewportSize({ width: 280, height: 600 });
  assert.equal(await page.locator('h1').textContent(), 'Secrecy Beam Lab');
  assert.match(await page.locator('.wall-toggle-text').textContent(), /wall/i);
  assert.match(await page.locator('.wall-toggle-copy').textContent(), /three|3/i);
  assert.match(await page.locator('#control-help').textContent(), /energy/i);
  assert.doesNotMatch(await page.locator('#control-help').textContent(), /dashed|ray paths?/i);
  await assertNoOverflow(page, 'secrecy three-bounce English state');
  await page.evaluate(() => window.PocketRuntime.apply({ lang: 'zh', theme: 'dark' }));
  assert.equal(await page.locator('h1').textContent(), '保密波束实验');
  assert.equal(await page.locator('.score-card-label').textContent(), '保密速率');
  assert.match(await page.locator('.wall-toggle-text').textContent(), /墙/);
  assert.match(await page.locator('.wall-toggle-copy').textContent(), /三|3/);
  assert.match(await wallToggle.getAttribute('aria-label'), /墙.*反射/);
  assert.match(await page.locator('#control-help').textContent(), /能量/);
  assert.doesNotMatch(await page.locator('#control-help').textContent(), /虚线|路径/);
  await assertNoOverflow(page, 'secrecy three-bounce Chinese state');
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('#wall-mode').isChecked(), false);
  assert.equal(await page.locator('#field').getAttribute('data-walls'), 'false');
  await page.close();

  const reducedPage = await openGame(browser, 'secrecy', {
    randomValues: deterministicChannel,
    reducedMotion: 'reduce',
  });
  await reducedPage.locator('.wall-toggle').click();
  await reducedPage.locator('#optimize').click();
  assert.equal(await reducedPage.locator('#field').getAttribute('data-optimizing'), 'false');
  assert.equal(
    await reducedPage.locator('#field').getAttribute('data-angle'),
    await reducedPage.locator('#field').getAttribute('data-best-angle'),
  );
  assert.equal(await reducedPage.locator('#field').getAttribute('data-max-bounces'), '3');
  assert.equal(await reducedPage.locator('.link-path, .beam, .beam-axis').count(), 0);
  await reducedPage.close();
}

async function checkHopper(browser) {
  const page = await openGame(browser, 'hopper', {
    width: 280,
    reducedMotion: 'reduce',
    randomValues: [0.5],
    captureLearnerStateCount: 18,
  });
  const game = page.locator('#game');

  const playSafeHumanEpisode = async () => {
    for (let slot = 0; slot < 12; slot += 1) {
      const state = await game.evaluate((element) => ({
        mode: element.dataset.jammerMode,
        previousChannel: Number(element.dataset.previousChannel),
        previousJammer: Number(element.dataset.previousJammer),
      }));
      const hiddenJammer =
        state.mode === 'reactive' ? state.previousChannel : (state.previousJammer + 1) % 3;
      await page.locator(`.channel[data-channel="${(hiddenJammer + 1) % 3}"]`).click();
    }
  };

  assert.equal(await page.locator('.channel[data-channel]').count(), 3);
  assert.equal(await game.getAttribute('data-state-count'), '18');
  assert.equal(await game.getAttribute('data-action-count'), '3');
  assert.equal(await game.getAttribute('data-total-slots'), '12');
  assert.equal(await game.getAttribute('data-success-target'), '9');
  assert.equal(await game.getAttribute('data-safe-channel-count'), '2');
  assert.equal(await page.locator('.trail-cell').count(), 36);
  assert.equal(await game.getAttribute('data-phase'), 'decision');
  assert.equal(await page.locator('#agent-next').isDisabled(), false);
  assert.equal(await page.locator('#agent-until-success').isDisabled(), false);

  await page.locator('#agent-next').click();
  assert.equal(await game.getAttribute('data-phase'), 'agent');
  const firstAgentSeed = Number(await game.getAttribute('data-episode-seed'));
  await page.waitForFunction(
    () =>
      document.querySelector('#game').dataset.phase === 'decision' &&
      document.querySelector('#game').dataset.agentEpisodes === '1',
    undefined,
    { timeout: 8_000 },
  );
  assert.equal(await game.getAttribute('data-experience-count'), '12');
  assert.equal(await game.getAttribute('data-player-experience-count'), '0');
  assert.equal(await game.getAttribute('data-agent-experience-count'), '12');
  assert.equal(await game.getAttribute('data-last-episode-controller'), 'agent');

  await page.locator('#player-next').click();
  assert.equal(await game.getAttribute('data-phase'), 'player');
  const firstHumanSeed = Number(await game.getAttribute('data-episode-seed'));
  assert.notEqual(firstHumanSeed, firstAgentSeed);
  await assertNoOverflow(page, 'hopper player episode');
  await playSafeHumanEpisode();

  assert.equal(await game.getAttribute('data-phase'), 'decision');
  assert.equal(await game.getAttribute('data-demo-episodes'), '1');
  assert.equal(await game.getAttribute('data-experience-count'), '24');
  assert.equal(await game.getAttribute('data-player-experience-count'), '12');
  assert.equal(await game.getAttribute('data-agent-experience-count'), '12');
  assert.equal(await game.getAttribute('data-collisions'), '0');
  assert.equal(await game.getAttribute('data-throughput'), '100');
  assert.equal(await game.getAttribute('data-last-episode-result'), 'success');
  assert.ok(Number(await game.getAttribute('data-state-coverage')) > 0);
  const readinessAfterFirstDemo = Number(await game.getAttribute('data-readiness'));
  assert.ok(readinessAfterFirstDemo >= 0 && readinessAfterFirstDemo <= 100);
  assert.equal(await page.locator('#decision-panel').isVisible(), true);
  const hopperDecisionSizes = await page
    .locator('#decision-panel button')
    .evaluateAll((buttons) => buttons.map((button) => button.getBoundingClientRect().height));
  assert.ok(hopperDecisionSizes.every((height) => height >= 44));
  await assertNoOverflow(page, 'hopper decision');

  await page.locator('#player-next').click();
  const secondHumanSeed = Number(await game.getAttribute('data-episode-seed'));
  assert.notEqual(secondHumanSeed, firstHumanSeed);
  await playSafeHumanEpisode();
  assert.equal(await game.getAttribute('data-demo-episodes'), '2');
  assert.equal(await game.getAttribute('data-experience-count'), '36');
  assert.equal(await game.getAttribute('data-player-experience-count'), '24');
  assert.ok(
    Number(await game.getAttribute('data-readiness')) >= 0 &&
      Number(await game.getAttribute('data-readiness')) <= 100,
  );
  await assertNoOverflow(page, 'hopper second demonstration');

  const agentEpisodesBeforeSingle = Number(await game.getAttribute('data-agent-episodes'));
  const experienceBeforeSingleAgent = Number(await game.getAttribute('data-experience-count'));
  await page.locator('#agent-next').click();
  await page.waitForFunction(() => document.querySelector('#game').dataset.phase === 'agent');
  assert.notEqual(Number(await game.getAttribute('data-episode-seed')), secondHumanSeed);
  await assertNoOverflow(page, 'hopper agent episode');
  await page.waitForFunction(
    (expectedEpisodes) =>
      document.querySelector('#game').dataset.phase === 'decision' &&
      Number(document.querySelector('#game').dataset.agentEpisodes) === expectedEpisodes,
    agentEpisodesBeforeSingle + 1,
    { timeout: 8_000 },
  );
  assert.equal(await game.getAttribute('data-controller'), 'agent');
  assert.equal(
    Number(await game.getAttribute('data-experience-count')),
    experienceBeforeSingleAgent + 12,
  );
  assert.equal(
    Number(await game.getAttribute('data-agent-experience-count')),
    (agentEpisodesBeforeSingle + 1) * 12,
  );
  await assertNoOverflow(page, 'hopper agent decision');

  await page.locator('#agent-until-success').click();
  await page.waitForFunction(() => document.querySelector('#game').dataset.phase === 'agent');
  assert.equal(await game.getAttribute('data-agent-run-mode'), 'until-success');
  assert.equal(await page.locator('#agent-until-success').isVisible(), true);
  await assertNoOverflow(page, 'hopper continuous agent active');
  await page.locator('#agent-until-success').click();
  assert.equal(await game.getAttribute('data-agent-run-mode'), 'single');
  const episodesBeforeStoppedRun = Number(await game.getAttribute('data-agent-episodes'));
  await page.waitForFunction(
    (expectedEpisodes) =>
      document.querySelector('#game').dataset.phase === 'decision' &&
      Number(document.querySelector('#game').dataset.agentEpisodes) === expectedEpisodes,
    episodesBeforeStoppedRun + 1,
    { timeout: 8_000 },
  );
  await page.waitForTimeout(500);
  assert.equal(
    Number(await game.getAttribute('data-agent-episodes')),
    episodesBeforeStoppedRun + 1,
  );

  await page.clock.install();
  await page.evaluate(() => {
    const learner = window.__qaGameLearner;
    const game = document.querySelector('#game');
    const originalObserve = learner.observe.bind(learner);
    window.__qaContinuousSeeds = [];
    window.__qaContinuousTerminals = [];

    learner.observe = (experience) => {
      originalObserve(experience);
      if (experience.done) {
        window.__qaContinuousTerminals.push({
          attempt: Number(game.dataset.agentRunAttempts),
          reward: experience.reward,
          source: experience.source,
        });
      }
    };

    learner.selectAction = (state) => {
      const attempt = Number(game.dataset.agentRunAttempts);
      if (!window.__qaContinuousSeeds.some((entry) => entry.attempt === attempt)) {
        window.__qaContinuousSeeds.push({
          attempt,
          seed: Number(game.dataset.episodeSeed),
        });
      }
      const reactive = state >= 9;
      const localState = reactive ? state - 9 : state;
      const previousJammer = Math.floor(localState / 3);
      const previousChannel = localState % 3;
      const jammer = reactive ? previousChannel : (previousJammer + 1) % 3;
      return attempt === 1 ? jammer : (jammer + 1) % 3;
    };
  });
  const agentEpisodesBeforeAuto = Number(await game.getAttribute('data-agent-episodes'));
  const experienceBeforeAuto = Number(await game.getAttribute('data-experience-count'));
  const agentExperienceBeforeAuto = Number(await game.getAttribute('data-agent-experience-count'));
  await page.locator('#agent-until-success').click();
  await page.clock.runFor(5_000);
  await page.waitForFunction(
    () =>
      document.querySelector('#game').dataset.phase === 'decision' &&
      document.querySelector('#game').dataset.agentRunMode === 'idle' &&
      document.querySelector('#game').dataset.lastEpisodeResult === 'success',
    undefined,
    { timeout: 2_000 },
  );
  const autoAttempts = Number(await game.getAttribute('data-agent-run-attempts'));
  assert.equal(autoAttempts, 2);
  assert.equal(
    Number(await game.getAttribute('data-agent-episodes')) - agentEpisodesBeforeAuto,
    autoAttempts,
  );
  assert.equal(
    Number(await game.getAttribute('data-experience-count')) - experienceBeforeAuto,
    autoAttempts * 12,
  );
  assert.equal(
    Number(await game.getAttribute('data-agent-experience-count')) - agentExperienceBeforeAuto,
    autoAttempts * 12,
  );
  const continuousTrace = await page.evaluate(() => ({
    seeds: window.__qaContinuousSeeds,
    terminals: window.__qaContinuousTerminals,
  }));
  assert.deepEqual(
    continuousTrace.terminals.map(({ attempt, reward, source }) => ({ attempt, reward, source })),
    [
      { attempt: 1, reward: -1, source: 'agent' },
      { attempt: 2, reward: 1, source: 'agent' },
    ],
  );
  assert.equal(continuousTrace.seeds.length, 2);
  assert.notEqual(continuousTrace.seeds[0].seed, continuousTrace.seeds[1].seed);
  assert.ok(Number(await game.getAttribute('data-multi-action-state-count')) > 0);
  await assertNoOverflow(page, 'hopper continuous agent success');

  await page.evaluate(() => window.PocketRuntime.apply({ lang: 'zh', theme: 'dark' }));
  assert.equal(await page.locator('h1').textContent(), '跳频学徒');
  await assertNoOverflow(page, 'hopper Chinese decision');
  await page.locator('#reset-learning').click();
  assert.equal(await game.getAttribute('data-demo-episodes'), '0');
  assert.equal(await game.getAttribute('data-agent-episodes'), '0');
  assert.equal(await game.getAttribute('data-experience-count'), '0');
  assert.equal(await game.getAttribute('data-player-experience-count'), '0');
  assert.equal(await game.getAttribute('data-agent-experience-count'), '0');
  assert.equal(await game.getAttribute('data-agent-run-mode'), 'idle');
  await page.close();
}

async function stopOrbitAtAngle(page, expectedAngle, tolerance = 10) {
  for (let frame = 0; frame < 240; frame += 1) {
    const cue = await page.evaluate(
      ({ expected, allowed }) => {
        const angle = Number(document.querySelector('#field').dataset.currentAngle);
        const distance = Math.abs(angle - expected) % 360;
        const hint = document.querySelector('#hint');
        const assistState = hint.dataset.assistState || '';
        if (
          Number.isFinite(angle) &&
          assistState &&
          Math.min(distance, 360 - distance) <= allowed
        ) {
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
          return cue;
        }
        return null;
      },
      { expected: expectedAngle, allowed: tolerance },
    );
    if (cue) return cue;
    await page.clock.runFor(32);
  }
  throw new Error(`Orbit did not reach ${expectedAngle} degrees`);
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
    clock: true,
    reducedMotion,
    width: reducedMotion === 'reduce' ? 280 : 420,
  });
  await page.locator('#assist').click();
  assert.equal(await page.locator('#assist').getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('#hint').getAttribute('data-assist-state'), 'toggle-on');
  assert.match(await page.locator('#hint').textContent(), /Range cues are on/);
  assert.equal(await page.locator('#assist-status').textContent(), 'Range cues are on.');
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
  assert.match(first.cueAtStop.visibleText, /Lock now/);
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

  const second = await runOrbitRound(page, first.tolerance + 12);
  assert.equal(second.result, 'miss', 'Stopping outside the visible window must miss');
  assert.equal(
    second.cueAtStop.state,
    'close',
    'Visible assist must warn when the target is close',
  );
  assert.match(second.cueAtStop.visibleText, /approaching the acquisition window/);
  assert.ok(
    Math.abs(second.cueAtStop.hintHeight - toggleLayout.height) <= 1,
    'Close assist cue must not shift the game layout',
  );
  assert.ok(
    second.cueAtStop.scrollHeight <= second.cueAtStop.viewportHeight + 1,
    'Visible close cue must fit the game viewport',
  );

  const third = await runOrbitRound(page, first.tolerance + 44);
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
    '距离提示已关闭，请看准窗口位置，手动捕获卫星。',
  );
  await page.locator('#assist').click();
  assert.match(await page.locator('#hint').textContent(), /距离提示已开启/);
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
  assert.equal(await page.locator('h1').textContent(), '信号回放');
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
  assert.equal(await page.locator('h1').textContent(), '论文花园');
  await page.locator('#restart-game').click();
  assert.equal(await page.locator('#score').textContent(), '0');
  assert.equal(await page.locator('.tile').count(), 2);
  await page.close();
}

async function checkResource(browser) {
  const page = await openGame(browser, 'resource');
  const board = page.locator('#board');

  assert.equal(await page.locator('.tile').count(), 16);
  assert.equal(await board.getAttribute('data-edge-count'), '15');
  assert.equal(await board.getAttribute('data-solved'), 'false');
  assert.ok(Number(await board.getAttribute('data-connected-resources')) <= 2);

  const initialRotations = await board.getAttribute('data-initial-rotations');
  await page.locator('.tile').first().click();
  assert.equal(await page.locator('#moves').textContent(), '1');
  await page.locator('#reset-board').click();
  assert.equal(await page.locator('#moves').textContent(), '0');
  assert.equal(await board.getAttribute('data-rotations'), initialRotations);

  await page.locator('.tile').first().focus();
  await page.locator('.tile').first().press('ArrowRight');
  assert.equal(
    await page.evaluate(() => document.activeElement?.getAttribute('data-index')),
    '1',
    'OpenRaaS Mesh arrow keys must move focus between tiles',
  );

  const rotations = (await board.getAttribute('data-rotations')).split('-').map(Number);
  solveBoard: for (const [index, rotation] of rotations.entries()) {
    for (let turn = 0; turn < (4 - rotation) % 4; turn += 1) {
      await page.locator(`[data-index="${index}"]`).click();
      if ((await board.getAttribute('data-solved')) === 'true') break solveBoard;
    }
  }
  assert.equal(await board.getAttribute('data-solved'), 'true');
  assert.equal(await board.getAttribute('data-connected-count'), '16');
  assert.equal(await board.getAttribute('data-connected-resources'), '4');
  assert.equal(await board.getAttribute('data-loose-ports'), '0');
  assert.ok(await page.locator('.request-pulse').count());

  const solvedMoves = await page.locator('#moves').textContent();
  await page.evaluate(() => window.PocketRuntime.apply({ lang: 'zh', theme: 'dark' }));
  assert.equal(await page.locator('h1').textContent(), 'OpenRaaS 组网');
  assert.equal(await page.locator('#moves').textContent(), solvedMoves);

  const oldSeed = await board.getAttribute('data-seed');
  await page.locator('#new-board').click();
  assert.notEqual(await board.getAttribute('data-seed'), oldSeed);
  assert.equal(await board.getAttribute('data-solved'), 'false');
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
  await checkReturn(browser);
  await checkWorld(browser);
  await checkStl(browser);
  await checkMovable(browser);
  await checkPinching(browser);
  await checkSecrecy(browser);
  await checkHopper(browser);
  await checkBackscatter(browser);
  await checkResilience(browser);
  await checkOrbit(browser);
  await checkOrbit(browser, 'reduce');
  await checkSignature(browser);
  await checkEcho(browser);
  await checkMatch(browser);
  await checkMerge(browser);
  await checkResource(browser);

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
