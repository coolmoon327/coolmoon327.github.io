const runtime = window.PocketRuntime;
const SIZE = 5;
const STATE_COUNT = SIZE * SIZE;
const START_STATE = 20;
const EPISODES = 200;
const MAX_STEPS = 48;
const EVALUATION_EPISODES = 80;
const ALPHA = 0.3;
const GAMMA = 0.94;
const SLIP_CHANCE = 0.08;
const TOPOLOGY_KEY = 'pocket-play.qpath.topology.v1';
const WALL_COUNT = 5;
const RISK_COUNT = 2;
const ACTIONS = [
  { row: -1, column: 0, arrow: '↑' },
  { row: 0, column: 1, arrow: '→' },
  { row: 1, column: 0, arrow: '↓' },
  { row: 0, column: -1, arrow: '←' },
];
const GOAL_SPECS = [
  { id: 'A', en: 'Summit', zh: '峰顶' },
  { id: 'B', en: 'Harbor', zh: '港湾' },
  { id: 'C', en: 'Grove', zh: '林缘' },
];
const topology = createTopology();
const WALLS = topology.walls;
const RISKS = topology.risks;
const GOALS = topology.goals;

const board = document.querySelector('#board');
const metrics = document.querySelector('.metrics');
const trainButton = document.querySelector('#train');
const status = document.querySelector('#status');
const routeSummaryOutput = document.querySelector('#route-summary');
const successOutput = document.querySelector('#success-rate');
const returnOutput = document.querySelector('#average-return');
const stepsOutput = document.querySelector('#path-steps');

board.dataset.topology = topology.signature;
board.dataset.topologySource = topology.source;
board.dataset.reachableCount = String(topology.reachableCount);
board.dataset.config = JSON.stringify({
  start: START_STATE,
  walls: [...WALLS].sort((first, second) => first - second),
  risks: [...RISKS].sort((first, second) => first - second),
  goals: GOALS.map(({ id, state }) => ({ id, state })),
});

const cells = [];
const goalButtons = new Map();
const agent = document.createElement('span');
agent.className = 'agent';
agent.setAttribute('aria-hidden', 'true');

let selectedGoal = null;
let actionMode = 'choose';
let statusState = { key: 'choose', data: {} };
let lastMetrics = null;
let routeSummaryState = null;
let demo = null;
let demoTimer = 0;
let startMarker = null;

function t(english, chinese) {
  return runtime.text(english, chinese);
}

function goalName(goal) {
  return `${goal.id} · ${t(goal.en, goal.zh)}`;
}

function shuffled(values) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function neighbors(state, walls) {
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
    neighbors(queue[index], walls).forEach((nextState) => {
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
    neighbors(queue[index], walls).forEach((nextState) => {
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
    neighbors(state, walls).forEach((nextState) => {
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

function readPreviousTopology() {
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
    // A sandboxed iframe may intentionally deny storage.
  }
}

function createTopology() {
  const previousSignature = readPreviousTopology();
  const allStates = Array.from({ length: STATE_COUNT }, (_, state) => state);

  for (let attempt = 0; attempt < 200; attempt += 1) {
    const walls = new Set(
      shuffled(allStates.filter((state) => state !== START_STATE)).slice(0, WALL_COUNT),
    );
    if (neighbors(START_STATE, walls).length < 2) continue;

    const reachable = reachableFrom(START_STATE, walls);
    if (reachable.size !== STATE_COUNT - WALL_COUNT) continue;

    const distances = distancesFrom(START_STATE, walls);
    const goalStates = [];
    const goalCandidates = shuffled(
      [...reachable].filter((state) => state !== START_STATE && (distances.get(state) ?? 0) >= 3),
    );
    for (const state of goalCandidates) {
      if (goalStates.every((other) => manhattanDistance(state, other) >= 2)) {
        goalStates.push(state);
      }
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

function renderRouteSummary() {
  if (!routeSummaryState) {
    routeSummaryOutput.textContent = '';
    return;
  }

  const directionNames = {
    [-SIZE]: t('up', '上'),
    1: t('right', '右'),
    [SIZE]: t('down', '下'),
    [-1]: t('left', '左'),
    0: t('stay', '原地'),
  };
  const directions = routeSummaryState.path
    .slice(1)
    .map((state, index) => directionNames[state - routeSummaryState.path[index]]);
  const route = directions.join(runtime.lang === 'zh' ? '、' : ', ');
  const destination = goalName(routeSummaryState.goal);

  routeSummaryOutput.textContent = routeSummaryState.reached
    ? t(
        `Learned greedy route to ${destination}: ${route}.`,
        `学到的贪心航线通往 ${destination}：${route}。`,
      )
    : t(
        `Current greedy attempt toward ${destination} did not arrive: ${route}.`,
        `当前通往 ${destination} 的贪心尝试尚未到达：${route}。`,
      );
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
      label.className = 'target-label';
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

    if (state === START_STATE) {
      startMarker = document.createElement('span');
      startMarker.className = 'start-marker';
      startMarker.setAttribute('aria-hidden', 'true');
      cell.append(startMarker);
    }

    cells.push(cell);
    board.append(cell);
  }

  cells[START_STATE].append(agent);
}

function clearDemoTimer() {
  window.clearTimeout(demoTimer);
  demoTimer = 0;
}

function clearRoute() {
  cells.forEach((cell) => {
    cell.classList.remove('is-path');
    const policy = cell.querySelector('.policy');
    if (policy) policy.textContent = '';
  });
  cells[START_STATE].append(agent);
}

function cancelDemo() {
  clearDemoTimer();
  demo = null;
}

function resetMetrics() {
  lastMetrics = null;
  successOutput.textContent = '—';
  returnOutput.textContent = '—';
  stepsOutput.textContent = '—';
}

function renderMetrics() {
  if (!lastMetrics) return;
  const locale = runtime.lang === 'zh' ? 'zh-CN' : 'en';
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  successOutput.textContent = `${lastMetrics.successRate}%`;
  returnOutput.textContent = formatter.format(lastMetrics.averageReturn);
  stepsOutput.textContent = lastMetrics.pathSteps ?? '—';
}

function statusMessage(key, data) {
  const goal = data.goal ? goalName(data.goal) : '';
  const rate = Number.isFinite(data.rate) ? `${data.rate}%` : '';
  const messages = {
    choose: ['Choose target A, B, or C, then train the route.', '选择目标 A、B 或 C，再训练航线。'],
    selected: [`Target ${goal} selected. Train when ready.`, `已选择目标 ${goal}，可以开始训练。`],
    training: [
      `Training 200 episodes toward target ${goal}…`,
      `正在向目标 ${goal} 训练 200 个回合…`,
    ],
    demoStable: [
      `Evaluation success is ${rate}. The agent is following its greedy route.`,
      `评估成功率为 ${rate}，智能体正沿贪心航线前进。`,
    ],
    demoUnstable: [
      `Not yet stable at ${rate}. Showing the current greedy attempt honestly.`,
      `当前成功率 ${rate}，策略尚未稳定；正在如实演示本次贪心尝试。`,
    ],
    complete: [
      `Route complete. The greedy policy reached target ${goal}.`,
      `航线完成，贪心策略已到达目标 ${goal}。`,
    ],
    completeUnstable: [
      `This route reached ${goal}, but evaluation remains unstable at ${rate}.`,
      `本次航线到达了 ${goal}，但评估成功率 ${rate}，仍未稳定。`,
    ],
    stalled: [
      `The learned policy stopped before ${goal}. Train again for a new sample.`,
      `学到的策略未能到达 ${goal}；可重新训练获取新样本。`,
    ],
    paused: ['Tab hidden. Route demonstration paused.', '页面已隐藏，航线演示已暂停。'],
    reducedStable: [
      `Reduced motion is on. The full route to ${goal} is shown.`,
      `已启用减少动态，通往 ${goal} 的完整路径已直接显示。`,
    ],
    reducedUnstable: [
      `Reduced motion is on. The current unstable attempt (${rate}) is shown at once.`,
      `已启用减少动态；当前未稳定的尝试（${rate}）已直接显示。`,
    ],
  };
  const pair = messages[key] || messages.choose;
  return t(pair[0], pair[1]);
}

function setStatus(key, data = {}) {
  statusState = { key, data };
  status.textContent = statusMessage(key, data);
}

function renderStatus() {
  status.textContent = statusMessage(statusState.key, statusState.data);
}

function renderAction() {
  const labels = {
    choose: ['Choose a target', '请先选择目标'],
    ready: ['Train & depart', '训练并出发'],
    trained: ['Train again', '重新训练'],
    training: ['Training…', '训练中…'],
  };
  const pair = labels[actionMode];
  trainButton.textContent = t(pair[0], pair[1]);
  trainButton.disabled = actionMode === 'choose' || actionMode === 'training';
  trainButton.setAttribute('aria-busy', String(actionMode === 'training'));
}

function syncAccessibility() {
  const boardLabel = t(
    'Five-by-five Q-learning world. The agent starts at the lower-left S. Striped cells are blocked and amber dots mark costly cells. Choose one of three target buttons.',
    '五乘五 Q 学习世界。智能体从左下角的“起”出发；斜纹格不可通行，琥珀色圆点表示高代价格。请选择三个目标按钮之一。',
  );
  board.setAttribute('aria-label', boardLabel);
  metrics.setAttribute('aria-label', t('Evaluation metrics', '评估指标'));
  startMarker.textContent = t('S', '起');

  GOALS.forEach((goal) => {
    const row = Math.floor(goal.state / SIZE) + 1;
    const column = (goal.state % SIZE) + 1;
    const selected = selectedGoal?.id === goal.id;
    const label = t(
      `Target ${goal.id}, ${goal.en}, row ${row}, column ${column}${selected ? ', selected' : ''}`,
      `目标 ${goal.id}，${goal.zh}，第 ${row} 行第 ${column} 列${selected ? '，已选择' : ''}`,
    );
    const button = goalButtons.get(goal.id);
    button.setAttribute('aria-label', label);
    button.title = goalName(goal);
  });
}

function syncTargets() {
  GOALS.forEach((goal) => {
    goalButtons.get(goal.id).setAttribute('aria-pressed', String(selectedGoal?.id === goal.id));
  });
  syncAccessibility();
}

function selectGoal(goal) {
  selectedGoal = goal;
  actionMode = 'ready';
  cancelDemo();
  clearRoute();
  routeSummaryState = null;
  renderRouteSummary();
  resetMetrics();
  syncTargets();
  renderAction();
  setStatus('selected', { goal });
}

function greedyAction(values, randomizeTies = false) {
  let best = -Infinity;
  const candidates = [];

  values.forEach((value, action) => {
    if (value > best + Number.EPSILON) {
      best = value;
      candidates.length = 0;
      candidates.push(action);
    } else if (Math.abs(value - best) <= Number.EPSILON) {
      candidates.push(action);
    }
  });

  return randomizeTies ? candidates[Math.floor(Math.random() * candidates.length)] : candidates[0];
}

function transition(state, requestedAction, stochastic) {
  let action = requestedAction;
  if (stochastic && Math.random() < SLIP_CHANCE) {
    action = (action + (Math.random() < 0.5 ? 1 : 3)) % ACTIONS.length;
  }

  const row = Math.floor(state / SIZE);
  const column = state % SIZE;
  const nextRow = row + ACTIONS[action].row;
  const nextColumn = column + ACTIONS[action].column;

  if (nextRow < 0 || nextRow >= SIZE || nextColumn < 0 || nextColumn >= SIZE) {
    return { state, reward: -0.14, done: false };
  }

  const nextState = nextRow * SIZE + nextColumn;
  if (WALLS.has(nextState)) return { state, reward: -0.14, done: false };
  if (nextState === selectedGoal.state) return { state: nextState, reward: 1, done: true };
  return { state: nextState, reward: RISKS.has(nextState) ? -0.26 : -0.03, done: false };
}

function trainQTable() {
  const table = Array.from({ length: STATE_COUNT }, () => new Float64Array(ACTIONS.length));

  for (let episode = 0; episode < EPISODES; episode += 1) {
    let state = START_STATE;
    const progress = episode / (EPISODES - 1);
    const epsilon = 0.05 + 0.85 * (1 - progress) ** 2;

    for (let step = 0; step < MAX_STEPS; step += 1) {
      const action =
        Math.random() < epsilon
          ? Math.floor(Math.random() * ACTIONS.length)
          : greedyAction(table[state], true);
      const result = transition(state, action, true);
      const nextBest = result.done ? 0 : Math.max(...table[result.state]);
      const target = result.reward + GAMMA * nextBest;
      table[state][action] += ALPHA * (target - table[state][action]);
      state = result.state;
      if (result.done) break;
    }
  }

  return table;
}

function evaluate(table) {
  let successes = 0;
  let totalReturn = 0;

  for (let episode = 0; episode < EVALUATION_EPISODES; episode += 1) {
    let state = START_STATE;
    let episodeReturn = 0;

    for (let step = 0; step < MAX_STEPS; step += 1) {
      const action = greedyAction(table[state]);
      const result = transition(state, action, true);
      episodeReturn += result.reward;
      state = result.state;
      if (result.done) {
        successes += 1;
        break;
      }
    }
    totalReturn += episodeReturn;
  }

  return {
    successRate: Math.round((successes / EVALUATION_EPISODES) * 100),
    averageReturn: totalReturn / EVALUATION_EPISODES,
  };
}

function greedyPath(table) {
  const path = [START_STATE];
  const visited = new Set(path);
  let state = START_STATE;

  for (let step = 0; step < MAX_STEPS; step += 1) {
    const action = greedyAction(table[state]);
    const result = transition(state, action, false);
    path.push(result.state);

    if (result.done) return { path, reached: true };
    if (result.state === state || visited.has(result.state)) return { path, reached: false };

    state = result.state;
    visited.add(state);
  }

  return { path, reached: false };
}

function renderPolicy(table) {
  cells.forEach((cell, state) => {
    const policy = cell.querySelector('.policy');
    if (WALLS.has(state) || state === selectedGoal.state) {
      policy.textContent = '';
      return;
    }
    policy.textContent = ACTIONS[greedyAction(table[state])].arrow;
  });
}

function placeAgent(state) {
  cells[state].append(agent);
  cells[state].classList.add('is-path');
}

function demoNarration() {
  if (demo.stable) {
    setStatus('demoStable', { goal: selectedGoal, rate: demo.rate });
  } else {
    setStatus('demoUnstable', { goal: selectedGoal, rate: demo.rate });
  }
}

function finishDemo() {
  demo.running = false;
  if (!demo.reached) {
    setStatus('stalled', { goal: selectedGoal, rate: demo.rate });
  } else if (!demo.stable) {
    setStatus('completeUnstable', { goal: selectedGoal, rate: demo.rate });
  } else {
    setStatus('complete', { goal: selectedGoal, rate: demo.rate });
  }
}

function scheduleDemoStep() {
  clearDemoTimer();
  if (!demo?.running || document.hidden) return;
  demoTimer = window.setTimeout(() => {
    demo.index += 1;
    placeAgent(demo.path[demo.index]);
    if (demo.index >= demo.path.length - 1) {
      finishDemo();
    } else {
      scheduleDemoStep();
    }
  }, 230);
}

function startDemo(pathResult, stable, rate) {
  cells.forEach((cell) => cell.classList.remove('is-path'));
  placeAgent(pathResult.path[0]);
  demo = {
    path: pathResult.path,
    index: 0,
    reached: pathResult.reached,
    stable,
    rate,
    running: false,
    paused: false,
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    pathResult.path.forEach((state) => cells[state].classList.add('is-path'));
    placeAgent(pathResult.path.at(-1));
    setStatus(stable ? 'reducedStable' : 'reducedUnstable', {
      goal: selectedGoal,
      rate,
    });
    return;
  }

  if (pathResult.path.length <= 1) {
    finishDemo();
    return;
  }

  demo.running = true;
  demoNarration();
  scheduleDemoStep();
}

function trainAndDepart() {
  if (!selectedGoal) {
    setStatus('choose');
    goalButtons.get(GOALS[0].id).focus();
    return;
  }

  cancelDemo();
  clearRoute();
  actionMode = 'training';
  renderAction();
  setStatus('training', { goal: selectedGoal });

  const table = trainQTable();
  const evaluation = evaluate(table);
  const pathResult = greedyPath(table);
  const stable = pathResult.reached && evaluation.successRate >= 85;

  renderPolicy(table);
  routeSummaryState = {
    goal: selectedGoal,
    path: pathResult.path,
    reached: pathResult.reached,
  };
  renderRouteSummary();
  lastMetrics = {
    ...evaluation,
    pathSteps: pathResult.reached ? pathResult.path.length - 1 : null,
  };
  renderMetrics();
  actionMode = 'trained';
  renderAction();
  startDemo(pathResult, stable, evaluation.successRate);
}

createBoard();

GOALS.forEach((goal) => {
  const button = goalButtons.get(goal.id);
  button.addEventListener('click', () => selectGoal(goal));
});

trainButton.addEventListener('click', trainAndDepart);

document.addEventListener('visibilitychange', () => {
  if (document.hidden && demo?.running) {
    clearDemoTimer();
    demo.running = false;
    demo.paused = true;
    setStatus('paused', { goal: selectedGoal, rate: demo.rate });
    return;
  }

  if (!document.hidden && demo?.paused) {
    demo.paused = false;
    demo.running = true;
    demoNarration();
    scheduleDemoStep();
  }
});

runtime.onChange(() => {
  syncAccessibility();
  renderAction();
  renderStatus();
  renderMetrics();
  renderRouteSummary();
});

syncTargets();
renderAction();
renderStatus();
renderRouteSummary();
