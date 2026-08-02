const runtime = window.PocketRuntime;
const track = document.querySelector('#track');
const agent = document.querySelector('#agent');
const entitiesLayer = document.querySelector('#entities');
const episodeOutput = document.querySelector('#episode');
const returnOutput = document.querySelector('#return');
const bestOutput = document.querySelector('#best');
const promptOutput = document.querySelector('#track-prompt');
const statusOutput = document.querySelector('#status');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const BEST_KEY = 'pocket-play.runner.best.v1';
const GROUND = 24;
const AGENT_WIDTH = 24;
const AGENT_HEIGHT = 30;
const GRAVITY = 1320;
const JUMP_VELOCITY = 470;
const OBSTACLE_MIN_HEIGHT = 20;
const OBSTACLE_MAX_HEIGHT = 48;

track.dataset.obstacleMinHeight = String(OBSTACLE_MIN_HEIGHT);
track.dataset.obstacleMaxHeight = String(OBSTACLE_MAX_HEIGHT);
track.dataset.gravity = String(GRAVITY);
track.dataset.jumpVelocity = String(JUMP_VELOCITY);

let phase = 'idle';
let statusKind = 'ready';
let episode = 0;
let episodeReturn = 0;
let best = readBest();
let agentY = 0;
let velocity = 0;
let elapsed = 0;
let spawnIn = 0;
let lastTime = 0;
let frame = 0;
let entities = [];

function text(english, chinese) {
  return runtime.text(english, chinese);
}

function signed(value) {
  return value > 0 ? `+${value}` : String(value);
}

function readBest() {
  try {
    const stored = Number.parseInt(window.localStorage.getItem(BEST_KEY), 10);
    return Number.isFinite(stored) && stored >= 0 ? stored : 0;
  } catch {
    return 0;
  }
}

function saveBest() {
  try {
    window.localStorage.setItem(BEST_KEY, String(best));
  } catch {
    // A sandboxed iframe may intentionally deny storage.
  }
}

function promptText() {
  const prompts = {
    idle: text('Click to run', '点击开跑'),
    running: text('Tap to jump', '点击跳跃'),
    paused: text('Click to resume', '点击继续'),
    over: text('Click to retry', '点击重试'),
  };
  return prompts[phase];
}

function statusText() {
  if (statusKind === 'reward') {
    return text(
      `Reward +1 · episode return ${signed(episodeReturn)}.`,
      `获得奖励 +1 · 本回合回报 ${signed(episodeReturn)}。`,
    );
  }

  if (phase === 'running') {
    return text(
      `Episode ${episode} is running. Jump for +1 rewards.`,
      `第 ${episode} 回合进行中。跳跃可收集 +1 奖励。`,
    );
  }

  if (phase === 'paused') {
    return text(
      'The episode is paused. Activate the track to resume.',
      '回合已暂停。激活跑道即可继续。',
    );
  }

  if (phase === 'over') {
    return text(
      `Obstacle −1 · return ${signed(episodeReturn)}, best ${signed(best)}.`,
      `撞上障碍 −1 · 回报 ${signed(episodeReturn)}，最佳 ${signed(best)}。`,
    );
  }

  return text(
    'Start an episode. Rewards give +1; an obstacle gives −1.',
    '开始本回合：收集奖励得 +1，撞上障碍得 −1。',
  );
}

function updateCopy() {
  episodeOutput.textContent = String(episode);
  returnOutput.textContent = signed(episodeReturn);
  bestOutput.textContent = signed(best);
  promptOutput.textContent = promptText();
  statusOutput.textContent = statusText();
  track.dataset.phase = phase;
  track.setAttribute(
    'aria-label',
    text(
      `Reward Runner track. Episode ${episode}, return ${signed(episodeReturn)}, best ${signed(best)}. ${promptText()}.`,
      `奖励跑酷。第 ${episode} 回合，回报 ${signed(episodeReturn)}，最佳 ${signed(best)}。${promptText()}。`,
    ),
  );
}

function clearEntities() {
  entities.forEach((entity) => entity.node.remove());
  entities = [];
}

function createEntity(type, x, y, width, height) {
  const node = document.createElement('span');
  node.className = `entity ${type}`;
  node.textContent = text(type === 'reward' ? '+1' : '−1', type === 'reward' ? '+1' : '−1');
  node.style.width = `${width}px`;
  node.style.height = `${height}px`;
  node.style.bottom = `${GROUND + y}px`;
  entitiesLayer.append(node);

  const entity = { node, type, x, y, width, height };
  entities.push(entity);
  return entity;
}

function removeEntity(entity) {
  entity.node.remove();
  entities = entities.filter((candidate) => candidate !== entity);
}

function spawnGroup() {
  const x = track.clientWidth + 16;
  const obstacleWidth = 20 + Math.round(Math.random() * 8);
  const obstacleHeight =
    OBSTACLE_MIN_HEIGHT +
    Math.floor(Math.random() * (OBSTACLE_MAX_HEIGHT - OBSTACLE_MIN_HEIGHT + 1));
  const rewardSize = 26;

  createEntity('reward', x + 1, obstacleHeight + 22, rewardSize, rewardSize);
  createEntity('obstacle', x, 0, obstacleWidth, obstacleHeight);
  spawnIn = (reducedMotion.matches ? 1.6 : 1.2) + Math.random() * 0.45;
}

function agentX() {
  return track.clientWidth * 0.1;
}

function overlaps(entity) {
  const x = agentX();
  return (
    x + AGENT_WIDTH - 4 > entity.x &&
    x + 4 < entity.x + entity.width &&
    agentY + AGENT_HEIGHT - 3 > entity.y &&
    agentY + 3 < entity.y + entity.height
  );
}

function renderWorld() {
  agent.style.transform = `translate3d(0, ${Math.round(-agentY)}px, 0)`;
  entities.forEach((entity) => {
    entity.node.style.transform = `translate3d(${Math.round(entity.x)}px, 0, 0)`;
  });
}

function collectRewards() {
  entities
    .filter((entity) => entity.type === 'reward' && overlaps(entity))
    .forEach((entity) => {
      removeEntity(entity);
      episodeReturn += 1;
      statusKind = 'reward';
      updateCopy();
    });
}

function finishEpisode() {
  phase = 'over';
  statusKind = 'over';
  episodeReturn -= 1;
  velocity = 0;
  window.cancelAnimationFrame(frame);
  frame = 0;

  if (episodeReturn > best) {
    best = episodeReturn;
    saveBest();
  }

  updateCopy();
}

function advanceEntities(distance) {
  entities.forEach((entity) => {
    entity.x -= distance;
  });

  collectRewards();

  if (entities.some((entity) => entity.type === 'obstacle' && overlaps(entity))) {
    finishEpisode();
    return true;
  }

  entities.filter((entity) => entity.x + entity.width < -12).forEach(removeEntity);
  return false;
}

function tick(now) {
  if (phase !== 'running') return;

  const delta = Math.min((now - lastTime) / 1000, 0.032);
  lastTime = now;
  elapsed += delta;
  spawnIn -= delta;

  velocity -= GRAVITY * delta;
  agentY += velocity * delta;
  if (agentY <= 0) {
    agentY = 0;
    velocity = 0;
  }

  if (spawnIn <= 0) spawnGroup();

  const baseSpeed = reducedMotion.matches ? 112 : 156;
  const speedCap = reducedMotion.matches ? 176 : 248;
  const speed = Math.min(speedCap, baseSpeed + elapsed * 2.8);
  if (advanceEntities(speed * delta)) {
    renderWorld();
    return;
  }

  renderWorld();
  frame = window.requestAnimationFrame(tick);
}

function startEpisode() {
  window.cancelAnimationFrame(frame);
  clearEntities();
  episode += 1;
  episodeReturn = 0;
  agentY = 0;
  velocity = 0;
  elapsed = 0;
  spawnIn = 0.62;
  phase = 'running';
  statusKind = 'running';
  lastTime = performance.now();
  updateCopy();
  renderWorld();
  frame = window.requestAnimationFrame(tick);
}

function jump() {
  if (agentY > 1) return;
  velocity = JUMP_VELOCITY;
  statusKind = 'running';
}

function pauseEpisode() {
  if (phase !== 'running') return;
  window.cancelAnimationFrame(frame);
  frame = 0;
  phase = 'paused';
  statusKind = 'paused';
  updateCopy();
}

function resumeEpisode() {
  phase = 'running';
  statusKind = 'running';
  lastTime = performance.now();
  updateCopy();
  frame = window.requestAnimationFrame(tick);
}

function activateTrack() {
  if (phase === 'idle' || phase === 'over') {
    startEpisode();
  } else if (phase === 'paused') {
    resumeEpisode();
  } else {
    jump();
  }
}

track.addEventListener('click', activateTrack);

track.addEventListener('keydown', (event) => {
  if (document.activeElement !== track || event.key !== 'ArrowUp' || event.repeat) return;
  event.preventDefault();
  activateTrack();
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) pauseEpisode();
});

runtime.onChange(updateCopy);
updateCopy();
renderWorld();
