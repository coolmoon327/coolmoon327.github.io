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
const agentUntilButton = document.querySelector('#agent-until-success');
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
let lastEpisodeStart = null;
let phase = 'choose';
let controller = 'player';
let stepCount = 0;
let demoEpisodes = 0;
let agentEpisodes = 0;
let episodeExperience = [];
let agentTimer = 0;
let agentRunMode = 'idle';
let autoAttempts = 0;
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
    return { nextState: state, reward: -0.24, done: false, success: false, cause: 'edge' };
  }
  const nextState = nextRow * SIZE + nextColumn;
  if (WALLS.has(nextState)) {
    return {
      nextState: state,
      reward: -1,
      done: true,
      success: false,
      cause: 'obstacle',
      crashState: nextState,
    };
  }
  if (nextState === selectedGoal.state) {
    return { nextState, reward: 1, done: true, success: true, cause: 'goal' };
  }
  const progress =
    manhattanDistance(state, selectedGoal.state) - manhattanDistance(nextState, selectedGoal.state);
  const reward = (progress > 0 ? 0.12 : -0.07) - (RISKS.has(nextState) ? 0.22 : 0.02);
  return { nextState, reward, done: false, success: false, cause: 'move' };
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
    if (result.done) return { states, success: result.success };
  }
  return { states, success: false };
}

function policyReachesGoal(start) {
  return policyTrace(start).success;
}

function evaluatePolicy() {
  if (!selectedGoal || learner.experienceCount === 0) return 0;
  const successes = startPool.filter((start) => policyReachesGoal(start)).length;
  return Math.round((successes / startPool.length) * 100);
}

function nextEpisodeStart() {
  const offset = (demoEpisodes + agentEpisodes) % startPool.length;
  const orderedStarts = Array.from(
    { length: startPool.length },
    (_, index) => startPool[(offset + index) % startPool.length],
  );
  const rankedStarts = [
    ...orderedStarts.filter(
      (start) => !learner.hasLearnedState(start) && !policyReachesGoal(start),
    ),
    ...orderedStarts.filter((start) => !policyReachesGoal(start)),
    ...orderedStarts,
  ];
  const uniqueStarts = [...new Set(rankedStarts)];
  return uniqueStarts.find((start) => start !== lastEpisodeStart) ?? uniqueStarts[0];
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
      'Five-by-five world. Stripes are fatal obstacles; amber dots are costly links.',
      '5×5 路由环境。斜纹是致命障碍，琥珀色圆点是高代价链路。',
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
    choose: ['Choose a target, then choose the first explorer.', '选择目标，再决定由谁先探索。'],
    selected: [
      `Target ${activeGoal} ready. Either explorer can start.`,
      `目标 ${activeGoal} 已就绪，双方均可开局。`,
    ],
    player: [
      `Human episode to ${activeGoal} · step ${data.step ?? 0}/${MAX_STEPS}.`,
      `玩家回合，目标 ${activeGoal} · 第 ${data.step ?? 0}/${MAX_STEPS} 步。`,
    ],
    agent: [
      `Agent episode · ${learner.experienceCount} transitions learned.`,
      `Agent 回合 · 已学习 ${learner.experienceCount} 条经验。`,
    ],
    successPlayer: [
      `Human delivered; shared-policy reach is ${data.readiness}%.`,
      `玩家已送达；共享策略可达率为 ${data.readiness}%。`,
    ],
    failPlayer: [
      'No delivery; every move still updated the policy.',
      '本局未送达，但每一步仍然更新了策略。',
    ],
    successAgent: [
      `Agent delivered${data.attempts ? ` after ${data.attempts} tries` : ''}; its route updated the policy.`,
      `Agent 已送达${data.attempts ? `（共 ${data.attempts} 局）` : ''}，并更新了策略。`,
    ],
    failAgent: [
      'Agent missed, but every transition still updated its policy.',
      'Agent 尚未到达，但每一步仍然更新了策略。',
    ],
    crashPlayer: [
      'Obstacle hit: episode over with a −1 penalty.',
      '撞上障碍：本局立即终止，并获得 −1 惩罚。',
    ],
    crashAgent: [
      'Agent hit an obstacle; the terminal −1 updated its policy.',
      'Agent 撞上障碍；带 −1 惩罚的终止经验已更新策略。',
    ],
    retryAgent: [
      `Try ${data.attempts} failed; Agent is starting a new episode.`,
      `第 ${data.attempts} 局未成功；Agent 将开启新一局。`,
    ],
    autoStopped: [
      'Continuous exploration stopped; completed experience is retained.',
      '连续探索已停止；此前的经验全部保留。',
    ],
    reset: ['Learning reset; topology unchanged.', '学习记录已清空，拓扑保持不变。'],
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
  const failureEnding =
    summaryState.cause === 'obstacle'
      ? t('after hitting an obstacle', '因撞上障碍而终止')
      : t('before delivery', '但未能送达');
  routeSummary.textContent = summaryState.success
    ? t(
        `${summaryState.source === 'player' ? 'Player' : 'Agent'} route reached ${goalName(selectedGoal)}: ${directions.join(', ')}.`,
        `${summaryState.source === 'player' ? '玩家' : 'Agent'} 已到达 ${goalName(selectedGoal)}：${directions.join('、')}。`,
      )
    : t(
        `${summaryState.source === 'player' ? 'Player' : 'Agent'} episode ended ${failureEnding} after ${summaryState.actions.length} steps.`,
        `${summaryState.source === 'player' ? '玩家' : 'Agent'} 的回合在 ${summaryState.actions.length} 步后${failureEnding}。`,
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
  game.dataset.agentRunMode = agentRunMode;
  game.dataset.agentRunAttempts = String(autoAttempts);
  game.dataset.experienceCount = String(learner.experienceCount);
  game.dataset.playerExperienceCount = String(learner.playerExperienceCount);
  game.dataset.agentExperienceCount = String(learner.agentExperienceCount);
  game.dataset.multiActionStateCount = String(learner.multiActionStateCount);
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
  const continuousAgent = agentRunMode === 'until-success';
  moveButtons.forEach((button) => {
    button.disabled = !isPlayer;
  });
  decisionPanel.hidden = phase !== 'decision' && !(phase === 'agent' && continuousAgent);
  agentNextButton.disabled = phase !== 'decision' || !selectedGoal;
  playerNextButton.disabled = phase !== 'decision' || !selectedGoal;
  playerNextButton.textContent = t('Human explores', '玩家探索一局');
  agentNextButton.textContent = t('Agent explores once', 'Agent 探索一局');
  agentUntilButton.disabled =
    !selectedGoal || (phase !== 'decision' && !(phase === 'agent' && continuousAgent));
  agentUntilButton.setAttribute('aria-pressed', String(continuousAgent));
  agentUntilButton.textContent = continuousAgent
    ? t(
        phase === 'agent' ? 'Stop after this episode' : 'Stop continuous run',
        phase === 'agent' ? '本局结束后停止' : '停止连续探索',
      )
    : t('Agent until success', 'Agent 探索至成功');
  resetLearningButton.textContent = t('Reset learning', '重置学习');
  decisionCopy.textContent = continuousAgent
    ? t(
        `Agent repeats fresh episodes until delivery · try ${autoAttempts}`,
        `Agent 将从新起点持续探索至送达 · 第 ${autoAttempts} 局`,
      )
    : readiness === 100
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
  agentRunMode = 'idle';
  autoAttempts = 0;
  controller = 'player';
  phase = 'decision';
  startPool = buildStartPool();
  currentState = START_STATE;
  lastEpisodeStart = null;
  cells.forEach((cell) => cell.classList.remove('is-path', 'is-crash'));
  agentMarker.classList.remove('is-crashed');
  cells[START_STATE].append(startMarker, agentMarker);
  board.dataset.startState = String(START_STATE);
  statusState = { key: 'selected', data: { goal: goalName(goal) } };
  summaryState = null;
  game.dataset.lastEpisodeResult = '';
  game.dataset.lastEpisodeController = '';
  game.dataset.lastEpisodeCause = '';
  game.dataset.lastEpisodeReturn = '';
  render();
}

function startEpisode(nextController) {
  if (!selectedGoal || phase !== 'decision') return;
  window.clearTimeout(agentTimer);
  if (nextController === 'player') {
    agentRunMode = 'idle';
    autoAttempts = 0;
  } else if (agentRunMode === 'idle') {
    agentRunMode = 'single';
  }
  controller = nextController;
  phase = nextController;
  stepCount = 0;
  episodeExperience = [];
  cells.forEach((cell) => cell.classList.remove('is-path', 'is-crash'));
  agentMarker.classList.remove('is-crashed');
  const start = nextEpisodeStart();
  lastEpisodeStart = start;
  if (nextController === 'agent' && agentRunMode === 'until-success') autoAttempts += 1;
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
  if (result.cause === 'obstacle') {
    cells[result.crashState].classList.add('is-crash');
    agentMarker.classList.add('is-crashed');
  }
  cells[result.nextState].classList.add('is-path');
  placeAgent(result.nextState);

  if (result.done || timedOut) {
    finishEpisode(result.success, timedOut ? 'timeout' : result.cause);
    return;
  }

  statusState = {
    key: source,
    data: { goal: goalName(selectedGoal), step: stepCount },
  };
  render();
  if (source === 'agent') scheduleAgentStep();
}

function finishEpisode(success, cause) {
  window.clearTimeout(agentTimer);
  const source = controller;
  learner.replay(episodeExperience, 8);
  if (source === 'player') demoEpisodes += 1;
  else agentEpisodes += 1;
  phase = 'decision';
  readiness = evaluatePolicy();
  const shouldRetry = source === 'agent' && agentRunMode === 'until-success' && !success;
  const statusKey = shouldRetry
    ? 'retryAgent'
    : cause === 'obstacle'
      ? `crash${source === 'player' ? 'Player' : 'Agent'}`
      : `${success ? 'success' : 'fail'}${source === 'player' ? 'Player' : 'Agent'}`;
  statusState = { key: statusKey, data: { readiness, attempts: autoAttempts } };
  summaryState = {
    success,
    source,
    cause,
    actions: episodeExperience.map((item) => item.action),
  };
  const episodeReturn = episodeExperience.reduce((total, item) => total + item.reward, 0);
  game.dataset.lastEpisodeResult = success ? 'success' : 'failure';
  game.dataset.lastEpisodeController = source;
  game.dataset.lastEpisodeCause = cause;
  game.dataset.lastEpisodeReward = String(episodeExperience.at(-1)?.reward ?? 0);
  game.dataset.lastEpisodeReturn = String(episodeReturn);
  if (source === 'agent' && !shouldRetry) agentRunMode = 'idle';
  render();
  if (shouldRetry) scheduleAgentRetry();
}

function scheduleAgentRetry() {
  window.clearTimeout(agentTimer);
  const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 100 : 360;
  agentTimer = window.setTimeout(() => {
    if (document.hidden || phase !== 'decision' || agentRunMode !== 'until-success') return;
    startEpisode('agent');
  }, delay);
}

function scheduleAgentStep() {
  window.clearTimeout(agentTimer);
  const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 70 : 240;
  agentTimer = window.setTimeout(() => {
    if (phase !== 'agent' || document.hidden) return;
    const stateVisits = learner.visits[currentState].reduce((total, visits) => total + visits, 0);
    const epsilon = learner.hasLearnedState(currentState)
      ? Math.max(0.1, 0.45 / Math.sqrt(1 + stateVisits))
      : 1;
    const action = learner.selectAction(currentState, [0, 1, 2, 3], epsilon);
    performAction(action);
  }, delay);
}

function resetLearning() {
  window.clearTimeout(agentTimer);
  learner.reset();
  demoEpisodes = 0;
  agentEpisodes = 0;
  agentRunMode = 'idle';
  autoAttempts = 0;
  controller = 'player';
  phase = selectedGoal ? 'decision' : 'choose';
  episodeExperience = [];
  lastEpisodeStart = null;
  cells.forEach((cell) => cell.classList.remove('is-path', 'is-crash'));
  agentMarker.classList.remove('is-crashed');
  cells[START_STATE].append(startMarker, agentMarker);
  board.dataset.startState = String(START_STATE);
  statusState = { key: selectedGoal ? 'reset' : 'choose', data: {} };
  summaryState = null;
  game.dataset.lastEpisodeResult = '';
  game.dataset.lastEpisodeController = '';
  game.dataset.lastEpisodeCause = '';
  game.dataset.lastEpisodeReturn = '';
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
agentNextButton.addEventListener('click', () => {
  agentRunMode = 'single';
  autoAttempts = 0;
  startEpisode('agent');
});
agentUntilButton.addEventListener('click', () => {
  if (agentRunMode === 'until-success') {
    if (phase === 'agent') {
      agentRunMode = 'single';
    } else {
      window.clearTimeout(agentTimer);
      agentRunMode = 'idle';
      statusState = { key: 'autoStopped', data: {} };
    }
    render();
    return;
  }
  if (phase !== 'decision' || !selectedGoal) return;
  agentRunMode = 'until-success';
  autoAttempts = 0;
  startEpisode('agent');
});
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
  if (!document.hidden && phase === 'decision' && agentRunMode === 'until-success') {
    scheduleAgentRetry();
  }
});

runtime.onChange(render);
cells[START_STATE].append(startMarker, agentMarker);
board.dataset.startState = String(START_STATE);
board.dataset.currentState = String(START_STATE);
render();
