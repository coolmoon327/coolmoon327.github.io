const runtime = window.PocketRuntime;
const TabularAgent = window.PocketTabularAgent;
const SIZE = 5;
const STATE_COUNT = SIZE * SIZE;
const START_STATE = 20;
const MAX_STEPS = 32;
const TOPOLOGY_KEY = 'pocket-play.qpath.topology.v2';
const WALL_COUNT = 5;
const RISK_COUNT = 2;
const DECISION_STATE_COUNT = STATE_COUNT - WALL_COUNT - 1;
const ACTIONS = [
  { row: -1, column: 0, arrow: '↑', en: 'up', zh: '上' },
  { row: 0, column: 1, arrow: '→', en: 'right', zh: '右' },
  { row: 1, column: 0, arrow: '↓', en: 'down', zh: '下' },
  { row: 0, column: -1, arrow: '←', en: 'left', zh: '左' },
];
const GOAL_SPECS = [
  { id: 'A', en: 'Gateway', zh: '网关' },
  { id: 'B', en: 'Edge', zh: '边缘节点' },
  { id: 'C', en: 'Cloud', zh: '云端' },
];
const topology = createTopology();
const WALLS = topology.walls;
const RISKS = topology.risks;
const GOALS = topology.goals;

const game = document.querySelector('#game');
const board = document.querySelector('#board');
const status = document.querySelector('#status');
const routeSummary = document.querySelector('#route-summary');
const decisionPanel = document.querySelector('#decision-panel');
const decisionCopy = document.querySelector('#decision-copy');
const playerNextButton = document.querySelector('#player-next');
const agentNextButton = document.querySelector('#agent-next');
const resetLearningButton = document.querySelector('#reset-learning');
const moveButtons = [...document.querySelectorAll('[data-action]')];
const demoOutput = document.querySelector('#demo-episodes');
const experienceOutput = document.querySelector('#experience-count');
const coverageOutput = document.querySelector('#state-coverage');
const readinessOutput = document.querySelector('#readiness');

const learner = new TabularAgent(STATE_COUNT, ACTIONS.length, { alpha: 0.62, gamma: 0.91 });
const cells = [];
const goalButtons = new Map();
const agentMarker = document.createElement('span');
const startMarker = document.createElement('span');
agentMarker.className = 'agent';
agentMarker.setAttribute('aria-hidden', 'true');
startMarker.className = 'start-marker';
startMarker.setAttribute('aria-hidden', 'true');

let selectedGoal = null;
let startPool = [START_STATE];
let currentState = START_STATE;
let lastPlayerStart = START_STATE;
let phase = 'choose';
let controller = 'player';
let stepCount = 0;
let demoEpisodes = 0;
let agentEpisodes = 0;
let episodeExperience = [];
let protectedPolicyRows = new Map();
let agentTimer = 0;
let readiness = 0;
let statusState = { key: 'choose', data: {} };
let summaryState = null;

function t(english, chinese) {
  return runtime.text(english, chinese);
}

function shuffled(values) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function neighborStates(state, walls) {
  const row = Math.floor(state / SIZE);
  const column = state % SIZE;
  return ACTIONS.map((action) => ({ row: row + action.row, column: column + action.column }))
    .filter((next) => next.row >= 0 && next.row < SIZE && next.column >= 0 && next.column < SIZE)
    .map((next) => next.row * SIZE + next.column)
    .filter((nextState) => !walls.has(nextState));
}

function reachableFrom(start, walls) {
  const queue = [start];
  const reached = new Set(queue);
  for (let index = 0; index < queue.length; index += 1) {
    neighborStates(queue[index], walls).forEach((nextState) => {
      if (reached.has(nextState)) return;
      reached.add(nextState);
      queue.push(nextState);
    });
  }
  return reached;
}

function distancesFrom(start, walls) {
  const queue = [start];
  const distances = new Map([[start, 0]]);
  for (let index = 0; index < queue.length; index += 1) {
    neighborStates(queue[index], walls).forEach((nextState) => {
      if (distances.has(nextState)) return;
      distances.set(nextState, distances.get(queue[index]) + 1);
      queue.push(nextState);
    });
  }
  return distances;
}

function shortestPath(goalState, walls) {
  const queue = [START_STATE];
  const previous = new Map([[START_STATE, null]]);
  for (let index = 0; index < queue.length; index += 1) {
    const state = queue[index];
    if (state === goalState) break;
    neighborStates(state, walls).forEach((nextState) => {
      if (previous.has(nextState)) return;
      previous.set(nextState, state);
      queue.push(nextState);
    });
  }
  const path = [];
  for (let state = goalState; state !== null; state = previous.get(state)) path.push(state);
  return path.reverse();
}

function manhattanDistance(first, second) {
  return (
    Math.abs(Math.floor(first / SIZE) - Math.floor(second / SIZE)) +
    Math.abs((first % SIZE) - (second % SIZE))
  );
}

function topologySignature(goals, walls, risks) {
  const goalPart = goals.map((goal) => `${goal.id}${goal.state}`).join('-');
  const wallPart = [...walls].sort((first, second) => first - second).join('-');
  const riskPart = [...risks].sort((first, second) => first - second).join('-');
  return `${goalPart}|${wallPart}|${riskPart}`;
}

function previousTopology() {
  try {
    return window.sessionStorage.getItem(TOPOLOGY_KEY) || '';
  } catch {
    return '';
  }
}

function rememberTopology(signature) {
  try {
    window.sessionStorage.setItem(TOPOLOGY_KEY, signature);
  } catch {
    // Sandboxed embeds may deny storage without affecting play.
  }
}

function createTopology() {
  const previousSignature = previousTopology();
  const allStates = Array.from({ length: STATE_COUNT }, (_, state) => state);

  for (let attempt = 0; attempt < 240; attempt += 1) {
    const walls = new Set(
      shuffled(allStates.filter((state) => state !== START_STATE)).slice(0, WALL_COUNT),
    );
    if (neighborStates(START_STATE, walls).length < 2) continue;
    const reachable = reachableFrom(START_STATE, walls);
    if (reachable.size !== STATE_COUNT - WALL_COUNT) continue;
    const distances = distancesFrom(START_STATE, walls);
    const goalStates = [];
    const candidates = shuffled(
      [...reachable].filter((state) => state !== START_STATE && (distances.get(state) ?? 0) >= 3),
    );
    for (const state of candidates) {
      if (goalStates.every((other) => manhattanDistance(state, other) >= 2)) goalStates.push(state);
      if (goalStates.length === GOAL_SPECS.length) break;
    }
    if (goalStates.length !== GOAL_SPECS.length) continue;

    const goals = GOAL_SPECS.map((goal, index) => ({ ...goal, state: goalStates[index] }));
    const reserved = new Set([START_STATE, ...goalStates]);
    const routeCells = new Set(
      goals.flatMap((goal) => shortestPath(goal.state, walls).slice(1, -1)),
    );
    const firstRisk = shuffled([...routeCells].filter((state) => !reserved.has(state)))[0];
    if (firstRisk === undefined) continue;
    const secondRisk = shuffled(
      [...reachable].filter(
        (state) => !reserved.has(state) && state !== firstRisk && !walls.has(state),
      ),
    )[0];
    if (secondRisk === undefined) continue;
    const risks = new Set([firstRisk, secondRisk]);
    if (risks.size !== RISK_COUNT) continue;
    const signature = topologySignature(goals, walls, risks);
    if (signature === previousSignature) continue;
    rememberTopology(signature);
    return { goals, walls, risks, signature, source: 'random', reachableCount: reachable.size };
  }

  const walls = new Set([6, 7, 12, 17, 18]);
  const risks = new Set([10, 23]);
  const fallbackStates = { A: 4, B: 14, C: 2 };
  const goals = GOAL_SPECS.map((goal) => ({ ...goal, state: fallbackStates[goal.id] }));
  const signature = topologySignature(goals, walls, risks);
  rememberTopology(signature);
  return {
    goals,
    walls,
    risks,
    signature,
    source: 'fallback',
    reachableCount: reachableFrom(START_STATE, walls).size,
  };
}

function createBoard() {
  const goalsByState = new Map(GOALS.map((goal) => [goal.state, goal]));
  for (let state = 0; state < STATE_COUNT; state += 1) {
    const goal = goalsByState.get(state);
    const cell = document.createElement(goal ? 'button' : 'div');
    cell.className = 'cell';
    cell.dataset.state = String(state);
    if (goal) {
      cell.type = 'button';
      cell.classList.add('target');
      cell.dataset.goal = goal.id;
      cell.setAttribute('aria-pressed', 'false');
      const label = document.createElement('span');
      label.textContent = goal.id;
      cell.append(label);
      goalButtons.set(goal.id, cell);
    } else {
      cell.setAttribute('aria-hidden', 'true');
    }
    if (WALLS.has(state)) cell.classList.add('wall');
    if (RISKS.has(state)) cell.classList.add('risk');
    const policy = document.createElement('span');
    policy.className = 'policy';
    policy.setAttribute('aria-hidden', 'true');
    cell.append(policy);
    cells.push(cell);
    board.append(cell);
  }
  board.dataset.topology = topology.signature;
  board.dataset.topologySource = topology.source;
  board.dataset.reachableCount = String(topology.reachableCount);
  board.dataset.config = JSON.stringify({
    start: START_STATE,
    walls: [...WALLS].sort((first, second) => first - second),
    risks: [...RISKS].sort((first, second) => first - second),
    goals: GOALS.map(({ id, state }) => ({ id, state })),
  });
}

function goalName(goal) {
  return `${goal.id} · ${t(goal.en, goal.zh)}`;
}

function buildStartPool() {
  if (!selectedGoal) return [START_STATE];
  const distances = distancesFrom(selectedGoal.state, WALLS);
  const candidates = [...distances.keys()]
    .filter((state) => state !== selectedGoal.state)
    .sort(
      (first, second) =>
        (distances.get(second) ?? 0) - (distances.get(first) ?? 0) || first - second,
    );
  return [START_STATE, ...candidates.filter((state) => state !== START_STATE)];
}

function transition(state, action) {
  const row = Math.floor(state / SIZE);
  const column = state % SIZE;
  const nextRow = row + ACTIONS[action].row;
  const nextColumn = column + ACTIONS[action].column;
  if (nextRow < 0 || nextRow >= SIZE || nextColumn < 0 || nextColumn >= SIZE) {
    return { nextState: state, reward: -0.24, done: false };
  }
  const nextState = nextRow * SIZE + nextColumn;
  if (WALLS.has(nextState)) return { nextState: state, reward: -0.24, done: false };
  if (nextState === selectedGoal.state) return { nextState, reward: 1, done: true };
  const progress =
    manhattanDistance(state, selectedGoal.state) - manhattanDistance(nextState, selectedGoal.state);
  const reward = (progress > 0 ? 0.12 : -0.07) - (RISKS.has(nextState) ? 0.22 : 0.02);
  return { nextState, reward, done: false };
}

function policyTrace(start) {
  if (!selectedGoal || learner.experienceCount === 0) return { states: [], success: false };
  let state = start;
  const seen = new Set();
  const states = [];
  for (let step = 0; step < MAX_STEPS; step += 1) {
    if (!learner.hasLearnedState(state) || seen.has(state)) return { states, success: false };
    seen.add(state);
    states.push(state);
    const action = learner.greedyAction(state, [0, 1, 2, 3]);
    const result = transition(state, action);
    state = result.nextState;
    if (result.done) return { states, success: true };
  }
  return { states, success: false };
}

function policyReachesGoal(start) {
  return policyTrace(start).success;
}

function snapshotSuccessfulPolicyRows() {
  const snapshot = new Map();
  startPool.forEach((start) => {
    const trace = policyTrace(start);
    if (!trace.success) return;
    trace.states.forEach((state) => {
      if (snapshot.has(state)) return;
      snapshot.set(state, {
        q: [...learner.q[state]],
        visits: [...learner.visits[state]],
      });
    });
  });
  return snapshot;
}

function restoreProtectedPolicyRows() {
  protectedPolicyRows.forEach((row, state) => {
    learner.q[state] = [...row.q];
    learner.visits[state] = [...row.visits];
  });
}

function evaluatePolicy() {
  if (!selectedGoal || learner.experienceCount === 0) return 0;
  const successes = startPool.filter((start) => policyReachesGoal(start)).length;
  return Math.round((successes / startPool.length) * 100);
}

function nextPlayerStart() {
  const offset = demoEpisodes % startPool.length;
  const orderedStarts = Array.from(
    { length: startPool.length },
    (_, index) => startPool[(offset + index) % startPool.length],
  );
  return (
    orderedStarts.find((start) => !learner.hasLearnedState(start) && !policyReachesGoal(start)) ??
    orderedStarts.find((start) => !policyReachesGoal(start)) ??
    orderedStarts[0]
  );
}

function renderPolicy() {
  cells.forEach((cell, state) => {
    const policy = cell.querySelector('.policy');
    if (!policy) return;
    policy.textContent =
      selectedGoal &&
      !WALLS.has(state) &&
      state !== selectedGoal.state &&
      learner.hasLearnedState(state)
        ? ACTIONS[learner.greedyAction(state, [0, 1, 2, 3])].arrow
        : '';
  });
}

function placeAgent(state) {
  currentState = state;
  cells[state].append(agentMarker);
  board.dataset.currentState = String(currentState);
}

function updateAccessibility() {
  board.setAttribute(
    'aria-label',
    t(
      'Five-by-five routing world. Striped cells are blocked and amber dots mark costly links.',
      '5×5 路由环境。斜纹格不可通行，琥珀色圆点表示高代价链路。',
    ),
  );
  startMarker.textContent = t('S', '起');
  GOALS.forEach((goal) => {
    const button = goalButtons.get(goal.id);
    const selected = selectedGoal?.id === goal.id;
    button.setAttribute('aria-pressed', String(selected));
    button.setAttribute(
      'aria-label',
      t(
        `Target ${goal.id}, ${goal.en}${selected ? ', selected' : ''}`,
        `目标 ${goal.id}，${goal.zh}${selected ? '，已选择' : ''}`,
      ),
    );
    button.disabled = phase === 'player' || phase === 'agent';
  });
  moveButtons.forEach((button) => {
    const action = ACTIONS[Number(button.dataset.action)];
    button.setAttribute('aria-label', t(`Move ${action.en}`, `向${action.zh}移动`));
  });
}

function statusText() {
  const data = statusState.data;
  const activeGoal = selectedGoal ? goalName(selectedGoal) : '';
  const messages = {
    choose: [
      'Choose target A, B, or C. Your route will become the Agent’s first experience.',
      '选择目标 A、B 或 C；你走出的路线会成为 Agent 的第一批经验。',
    ],
    selected: [
      `Target ${activeGoal} selected. Demonstrate one route, then decide who plays next.`,
      `已选择目标 ${activeGoal}。先示范一条路线，再决定下一局由谁操作。`,
    ],
    player: [
      `Your episode: move the packet toward ${activeGoal}. Step ${data.step ?? 0}/${MAX_STEPS}.`,
      `你的回合：把数据包送往 ${activeGoal}。第 ${data.step ?? 0}/${MAX_STEPS} 步。`,
    ],
    agent: [
      `Agent episode in progress. It is acting from ${learner.experienceCount} recorded transitions.`,
      `Agent 正在操作；当前策略来自 ${learner.experienceCount} 条已记录经验。`,
    ],
    successPlayer: [
      `Route delivered. The Agent replayed your demonstration; policy reach is now ${data.readiness}%.`,
      `路由成功。Agent 已用你的示范更新策略，策略可达率升至 ${data.readiness}%。`,
    ],
    failPlayer: [
      `Episode ended before delivery. Failed moves still teach the Agent what to avoid.`,
      '本局未能送达，但失败动作也会告诉 Agent 应该避开什么。',
    ],
    successAgent: [
      `Agent delivered the packet. Its own episode has also joined the replay buffer.`,
      'Agent 已成功送达数据包；它本轮产生的经验也已加入经验池。',
    ],
    failAgent: [
      `Agent did not arrive this time. Add another demonstration or let it explore again.`,
      'Agent 这次尚未到达；你可以再示范一局，也可以让它继续探索。',
    ],
    reset: [
      'Learning reset. The topology stays fixed so you can teach the same routing problem again.',
      '学习记录已清空；拓扑保持不变，可以重新教授同一个路由问题。',
    ],
  };
  const pair = messages[statusState.key] || messages.choose;
  return t(pair[0], pair[1]);
}

function renderRouteSummary() {
  if (!summaryState || !selectedGoal) {
    routeSummary.textContent = '';
    return;
  }
  const directions = summaryState.actions.map((action) =>
    t(ACTIONS[action].en, ACTIONS[action].zh),
  );
  routeSummary.textContent = summaryState.success
    ? t(
        `${summaryState.source === 'player' ? 'Player' : 'Agent'} route reached ${goalName(selectedGoal)}: ${directions.join(', ')}.`,
        `${summaryState.source === 'player' ? '玩家' : 'Agent'} 已到达 ${goalName(selectedGoal)}：${directions.join('、')}。`,
      )
    : t(
        `${summaryState.source === 'player' ? 'Player' : 'Agent'} episode ended after ${summaryState.actions.length} steps.`,
        `${summaryState.source === 'player' ? '玩家' : 'Agent'} 的回合在 ${summaryState.actions.length} 步后结束。`,
      );
}

function render() {
  readiness = evaluatePolicy();
  game.dataset.phase = phase;
  game.dataset.controller = controller;
  game.dataset.stateCount = String(STATE_COUNT);
  game.dataset.decisionStateCount = String(DECISION_STATE_COUNT);
  game.dataset.actionCount = String(ACTIONS.length);
  game.dataset.startPoolSize = String(startPool.length);
  game.dataset.demoEpisodes = String(demoEpisodes);
  game.dataset.agentEpisodes = String(agentEpisodes);
  game.dataset.experienceCount = String(learner.experienceCount);
  game.dataset.stateCoverage = String(learner.stateCoverage);
  game.dataset.policyVersion = String(learner.policyVersion);
  game.dataset.readiness = String(readiness);
  board.dataset.selectedGoal = selectedGoal?.id || '';

  demoOutput.textContent = String(demoEpisodes);
  experienceOutput.textContent = String(learner.experienceCount);
  coverageOutput.textContent = `${learner.stateCoverage}/${DECISION_STATE_COUNT}`;
  readinessOutput.textContent = `${readiness}%`;
  status.textContent = statusText();
  renderRouteSummary();
  agentMarker.dataset.controller = controller;

  const isPlayer = phase === 'player';
  moveButtons.forEach((button) => {
    button.disabled = !isPlayer;
  });
  decisionPanel.hidden = phase !== 'decision';
  agentNextButton.disabled = phase !== 'decision' || learner.experienceCount === 0;
  playerNextButton.disabled = phase !== 'decision' || !selectedGoal;
  playerNextButton.textContent = t(
    demoEpisodes === 0 ? 'I will demonstrate' : 'I will play next',
    demoEpisodes === 0 ? '我先示范一局' : '我继续操作',
  );
  agentNextButton.textContent = t('Let Agent try', '让 Agent 试一局');
  resetLearningButton.textContent = t('Reset learning', '重置学习');
  decisionCopy.textContent =
    readiness === 100
      ? t(
          'Choose next · 19/19 starts reachable; routes may not be optimal',
          '选择下一局 · 19/19 个起点均可达，但路线未必最优',
        )
      : t(
          `Choose next · Greedy policy reaches ${readiness}% of 19 starts`,
          `选择下一局 · 19 个测试起点中，当前策略可达 ${readiness}%`,
        );
  updateAccessibility();
  renderPolicy();
}

function selectGoal(goal) {
  window.clearTimeout(agentTimer);
  selectedGoal = goal;
  learner.reset();
  demoEpisodes = 0;
  agentEpisodes = 0;
  protectedPolicyRows = new Map();
  controller = 'player';
  phase = 'decision';
  startPool = buildStartPool();
  currentState = START_STATE;
  lastPlayerStart = START_STATE;
  cells.forEach((cell) => cell.classList.remove('is-path'));
  cells[START_STATE].append(startMarker, agentMarker);
  board.dataset.startState = String(START_STATE);
  statusState = { key: 'selected', data: { goal: goalName(goal) } };
  summaryState = null;
  game.dataset.lastEpisodeResult = '';
  game.dataset.lastEpisodeController = '';
  render();
}

function startEpisode(nextController) {
  if (!selectedGoal || phase !== 'decision') return;
  window.clearTimeout(agentTimer);
  controller = nextController;
  phase = nextController;
  stepCount = 0;
  episodeExperience = [];
  protectedPolicyRows = nextController === 'player' ? snapshotSuccessfulPolicyRows() : new Map();
  cells.forEach((cell) => cell.classList.remove('is-path'));
  const start = nextController === 'player' ? nextPlayerStart() : lastPlayerStart;
  if (nextController === 'player') lastPlayerStart = start;
  cells[start].append(startMarker);
  board.dataset.startState = String(start);
  placeAgent(start);
  statusState = {
    key: nextController,
    data: { goal: goalName(selectedGoal), step: 0 },
  };
  render();
  if (nextController === 'agent') scheduleAgentStep();
}

function performAction(action) {
  if (phase !== 'player' && phase !== 'agent') return;
  const source = controller;
  const state = currentState;
  const result = transition(state, action);
  stepCount += 1;
  const timedOut = !result.done && stepCount >= MAX_STEPS;
  const experience = {
    state,
    action,
    reward: timedOut ? result.reward - 0.55 : result.reward,
    nextState: result.nextState,
    nextAllowed: [0, 1, 2, 3],
    done: result.done || timedOut,
    source,
  };
  episodeExperience.push(experience);
  learner.observe(experience);
  cells[result.nextState].classList.add('is-path');
  placeAgent(result.nextState);

  if (result.done || timedOut) {
    finishEpisode(result.done);
    return;
  }

  statusState = {
    key: source,
    data: { goal: goalName(selectedGoal), step: stepCount },
  };
  render();
  if (source === 'agent') scheduleAgentStep();
}

function finishEpisode(success) {
  window.clearTimeout(agentTimer);
  const source = controller;
  let replayExperience = episodeExperience;
  if (source === 'player' && success) {
    // Preserve every previously successful greedy route while learning the new demonstration.
    // This makes short-session progress visible without claiming a globally optimal policy.
    restoreProtectedPolicyRows();
    replayExperience = episodeExperience.filter(
      (experience) => !protectedPolicyRows.has(experience.state),
    );
    replayExperience.forEach((experience) => {
      experience.reward = Math.max(experience.reward, 0.05);
    });
  }
  learner.replay(replayExperience, source === 'player' ? (success ? 14 : 8) : 6);
  protectedPolicyRows = new Map();
  if (source === 'player') demoEpisodes += 1;
  else agentEpisodes += 1;
  phase = 'decision';
  readiness = evaluatePolicy();
  statusState = {
    key: `${success ? 'success' : 'fail'}${source === 'player' ? 'Player' : 'Agent'}`,
    data: { readiness },
  };
  summaryState = {
    success,
    source,
    actions: episodeExperience.map((item) => item.action),
  };
  game.dataset.lastEpisodeResult = success ? 'success' : 'failure';
  game.dataset.lastEpisodeController = source;
  render();
}

function scheduleAgentStep() {
  window.clearTimeout(agentTimer);
  const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 70 : 240;
  agentTimer = window.setTimeout(() => {
    if (phase !== 'agent' || document.hidden) return;
    const epsilon = learner.hasLearnedState(currentState) ? 0 : 0.38;
    const action = learner.selectAction(currentState, [0, 1, 2, 3], epsilon);
    performAction(action);
  }, delay);
}

function resetLearning() {
  window.clearTimeout(agentTimer);
  learner.reset();
  demoEpisodes = 0;
  agentEpisodes = 0;
  controller = 'player';
  phase = selectedGoal ? 'decision' : 'choose';
  episodeExperience = [];
  protectedPolicyRows = new Map();
  lastPlayerStart = START_STATE;
  cells.forEach((cell) => cell.classList.remove('is-path'));
  cells[START_STATE].append(startMarker, agentMarker);
  board.dataset.startState = String(START_STATE);
  statusState = { key: selectedGoal ? 'reset' : 'choose', data: {} };
  summaryState = null;
  game.dataset.lastEpisodeResult = '';
  game.dataset.lastEpisodeController = '';
  render();
}

createBoard();
GOALS.forEach((goal) => {
  goalButtons.get(goal.id).addEventListener('click', () => selectGoal(goal));
});
moveButtons.forEach((button) => {
  button.addEventListener('click', () => performAction(Number(button.dataset.action)));
});
playerNextButton.addEventListener('click', () => startEpisode('player'));
agentNextButton.addEventListener('click', () => startEpisode('agent'));
resetLearningButton.addEventListener('click', resetLearning);

document.addEventListener('keydown', (event) => {
  if (phase !== 'player' || event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
  const action = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3 }[event.key];
  if (action === undefined) return;
  event.preventDefault();
  performAction(action);
});

document.addEventListener('visibilitychange', () => {
  if (!document.hidden && phase === 'agent') scheduleAgentStep();
});

runtime.onChange(render);
cells[START_STATE].append(startMarker, agentMarker);
board.dataset.startState = String(START_STATE);
board.dataset.currentState = String(START_STATE);
render();
