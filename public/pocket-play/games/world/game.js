'use strict';

const SVG_NS = 'http://www.w3.org/2000/svg';
const USER_COUNT = 9;
const MODEL_ALPHA = 0.46;
const HEIGHT_STEP = 0.14;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const field = document.querySelector('#field');
const userLayer = document.querySelector('#user-layer');
const ghostLayer = document.querySelector('#ghost-layer');
const coverage = document.querySelector('#coverage');
const predictedCoverage = document.querySelector('#predicted-coverage');
const roundOutput = document.querySelector('#round');
const errorOutput = document.querySelector('#prediction-error');
const serviceOutput = document.querySelector('#service-rate');
const phaseOutput = document.querySelector('#phase');
const heightOutput = document.querySelector('#height');
const status = document.querySelector('#status');
const resetButton = document.querySelector('#reset');
const actionButtons = [...document.querySelectorAll('[data-action]')];

let users = [];
let truth = null;
let model = null;
let uavHeight = 0.5;
let round = 0;
let busy = false;
let phase = 'ready';
let lastError = null;
let generation = 0;

function text(english, chinese) {
  return window.PocketRuntime.text(english, chinese);
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function createSvg(tag, attributes = {}) {
  const node = document.createElementNS(SVG_NS, tag);
  Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, String(value)));
  return node;
}

function makeUsers() {
  const points = [];
  for (let index = 0; index < USER_COUNT; index += 1) {
    const angle = (Math.PI * 2 * index) / USER_COUNT + randomBetween(-0.22, 0.22);
    const radius = randomBetween(0.12, 0.33);
    points.push({
      x: clamp(0.5 + Math.cos(angle) * radius + randomBetween(-0.035, 0.035), 0.1, 0.9),
      y: clamp(0.5 + Math.sin(angle) * radius + randomBetween(-0.035, 0.035), 0.12, 0.88),
    });
  }
  return points;
}

function makeTruth() {
  return {
    dx: randomBetween(-0.018, 0.018),
    dy: randomBetween(-0.014, 0.014),
    growth: randomBetween(-0.015, 0.015),
    turn: randomBetween(-0.045, 0.045),
  };
}

function blankModel() {
  return { dx: 0, dy: 0, growth: 0, turn: 0 };
}

function centroid(points) {
  return points.reduce(
    (sum, point) => ({ x: sum.x + point.x / points.length, y: sum.y + point.y / points.length }),
    { x: 0, y: 0 },
  );
}

function advance(points, dynamics, withNoise = false) {
  const center = centroid(points);
  const cos = Math.cos(dynamics.turn);
  const sin = Math.sin(dynamics.turn);
  return points.map((point) => {
    const relX = point.x - center.x;
    const relY = point.y - center.y;
    const rotatedX = (relX * cos - relY * sin) * (1 + dynamics.growth);
    const rotatedY = (relX * sin + relY * cos) * (1 + dynamics.growth);
    const noiseX = withNoise ? randomBetween(-0.0025, 0.0025) : 0;
    const noiseY = withNoise ? randomBetween(-0.0025, 0.0025) : 0;
    return {
      x: clamp(center.x + dynamics.dx + rotatedX + noiseX, 0.07, 0.93),
      y: clamp(center.y + dynamics.dy + rotatedY + noiseY, 0.09, 0.91),
    };
  });
}

function project(point, height = uavHeight) {
  const scale = 1.2 - height * 0.34;
  return {
    x: 180 + (point.x - 0.5) * 332 * scale,
    y: 110 + (point.y - 0.5) * 194 * scale,
  };
}

function coverageRadii(height = uavHeight) {
  const radiusWorld = 0.19 + height * 0.27;
  const scale = 1.2 - height * 0.34;
  return {
    x: radiusWorld * 332 * scale,
    y: radiusWorld * 194 * scale,
  };
}

function serviceRate(points, height = uavHeight) {
  const radiusWorld = 0.19 + height * 0.27;
  const heightQuality = 1 - height * 0.22;
  const total = points.reduce((sum, point) => {
    const distance = Math.hypot(point.x - 0.5, point.y - 0.5);
    if (distance > radiusWorld) return sum;
    const edgeQuality = 0.58 + 0.42 * (1 - distance / radiusWorld);
    return sum + edgeQuality * heightQuality;
  }, 0);
  return (100 * total) / points.length;
}

function renderUsers(points = users, height = uavHeight) {
  userLayer.replaceChildren();
  const servedRadius = 0.19 + height * 0.27;
  points.forEach((point) => {
    const shown = project(point, height);
    const group = createSvg('g', {
      class: `user-node${Math.hypot(point.x - 0.5, point.y - 0.5) <= servedRadius ? ' is-served' : ''}`,
      transform: `translate(${shown.x.toFixed(2)} ${shown.y.toFixed(2)})`,
    });
    group.append(createSvg('circle', { class: 'user-halo', r: 8 }));
    group.append(createSvg('circle', { class: 'user-core', r: 3.5 }));
    userLayer.append(group);
  });
  const radii = coverageRadii(height);
  coverage.setAttribute('rx', radii.x.toFixed(2));
  coverage.setAttribute('ry', radii.y.toFixed(2));
}

function renderForecast(forecasts) {
  ghostLayer.replaceChildren();
  forecasts.forEach((forecast, horizonIndex) => {
    forecast.points.forEach((point) => {
      const shown = project(point, forecast.height);
      ghostLayer.append(
        createSvg('circle', {
          class: `ghost-node ghost-step-${horizonIndex + 1}`,
          cx: shown.x.toFixed(2),
          cy: shown.y.toFixed(2),
          r: Math.max(2.4, 4.5 - horizonIndex * 0.65),
        }),
      );
    });
  });
  const firstRadii = coverageRadii(forecasts[0].height);
  predictedCoverage.setAttribute('rx', firstRadii.x.toFixed(2));
  predictedCoverage.setAttribute('ry', firstRadii.y.toFixed(2));
}

function clearForecast() {
  ghostLayer.replaceChildren();
}

function heightLabel() {
  if (uavHeight < 0.4) return text('Low', '低空');
  if (uavHeight > 0.6) return text('High', '高空');
  return text('Mid', '中空');
}

function phaseLabel() {
  if (phase === 'forecast') return text('Forecasting', '预测中');
  if (phase === 'observed') return text('Observed', '已观测');
  return text('Ready', '待预测');
}

function statusLabel() {
  if (phase === 'forecast') {
    return text(
      'Three latent ghosts are rolling forward. The next observation is still hidden.',
      '三步潜状态正在向前推演，下一次真实观测仍被隐藏。',
    );
  }
  if (phase === 'observed') {
    return text(
      'Observation revealed. Balance a lower latent error against a higher all-user service score.',
      '真实观测已揭示：请同时关注更低的潜状态误差与更高的全用户服务得分。',
    );
  }
  return text(
    'Choose a height action. The joint user-and-UAV latent state rolls forward before the sea moves.',
    '选择高度动作；用户与无人机的联合潜状态会在海上用户移动前先向前推演。',
  );
}

function renderUi() {
  roundOutput.textContent = String(round);
  errorOutput.textContent = lastError === null ? '—' : lastError.toFixed(2);
  errorOutput.setAttribute(
    'aria-label',
    lastError === null
      ? text('Prediction error not measured yet', '尚未测量预测误差')
      : text(`Prediction error ${lastError.toFixed(2)}`, `预测误差 ${lastError.toFixed(2)}`),
  );
  const service = serviceRate(users, uavHeight);
  serviceOutput.textContent = `${Math.round(service)}%`;
  phaseOutput.textContent = phaseLabel();
  heightOutput.textContent = heightLabel();
  status.textContent = statusLabel();
  status.dataset.state = phase;
  field.dataset.phase = phase;
  actionButtons.forEach((button) => {
    button.disabled = busy;
  });
  resetButton.disabled = busy;
}

function forecastFrom(points, action, height) {
  const forecasts = [];
  let cursor = points.map((point) => ({ ...point }));
  let predictedHeight = height;
  for (let horizon = 0; horizon < 3; horizon += 1) {
    if (horizon === 0) {
      predictedHeight = clamp(predictedHeight + action * HEIGHT_STEP, 0.22, 0.78);
    }
    cursor = advance(cursor, model, false);
    forecasts.push({
      points: cursor,
      height: predictedHeight,
    });
  }
  return forecasts;
}

function inferDynamics(before, after) {
  const centerBefore = centroid(before);
  const centerAfter = centroid(after);
  let growthTotal = 0;
  let turnSin = 0;
  let turnCos = 0;
  let count = 0;

  before.forEach((point, index) => {
    const next = after[index];
    const beforeVector = { x: point.x - centerBefore.x, y: point.y - centerBefore.y };
    const afterVector = { x: next.x - centerAfter.x, y: next.y - centerAfter.y };
    const beforeRadius = Math.hypot(beforeVector.x, beforeVector.y);
    const afterRadius = Math.hypot(afterVector.x, afterVector.y);
    if (beforeRadius < 0.01 || afterRadius < 0.01) return;
    growthTotal += afterRadius / beforeRadius - 1;
    const angle =
      Math.atan2(afterVector.y, afterVector.x) - Math.atan2(beforeVector.y, beforeVector.x);
    turnSin += Math.sin(angle);
    turnCos += Math.cos(angle);
    count += 1;
  });

  return {
    dx: centerAfter.x - centerBefore.x,
    dy: centerAfter.y - centerBefore.y,
    growth: count ? growthTotal / count : 0,
    turn: count ? Math.atan2(turnSin / count, turnCos / count) : 0,
  };
}

function updateModel(observed) {
  Object.keys(model).forEach((key) => {
    model[key] = (1 - MODEL_ALPHA) * model[key] + MODEL_ALPHA * observed[key];
  });
}

function predictionError(predicted, actual) {
  const total = predicted.reduce((sum, point, index) => {
    return sum + Math.hypot(point.x - actual[index].x, point.y - actual[index].y);
  }, 0);
  return (total / predicted.length) * 100;
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function animateObservation(before, after, fromHeight, toHeight, token) {
  const duration = reducedMotion.matches ? 0 : 560;
  if (duration === 0) {
    renderUsers(after, toHeight);
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const startedAt = performance.now();
    function frame(now) {
      if (token !== generation) {
        resolve();
        return;
      }
      const progress = clamp((now - startedAt) / duration, 0, 1);
      const eased = 1 - (1 - progress) ** 3;
      const interpolated = before.map((point, index) => ({
        x: point.x + (after[index].x - point.x) * eased,
        y: point.y + (after[index].y - point.y) * eased,
      }));
      const shownHeight = fromHeight + (toHeight - fromHeight) * eased;
      renderUsers(interpolated, shownHeight);
      if (progress < 1) {
        window.requestAnimationFrame(frame);
      } else {
        resolve();
      }
    }
    window.requestAnimationFrame(frame);
  });
}

async function takeAction(action) {
  if (busy) return;
  busy = true;
  const token = generation;
  const before = users.map((point) => ({ ...point }));
  const beforeHeight = uavHeight;
  const forecasts = forecastFrom(before, action, beforeHeight);
  const targetHeight = forecasts[0].height;

  phase = 'forecast';
  field.dataset.action = String(action);
  renderForecast(forecasts);
  renderUi();
  await wait(reducedMotion.matches ? 120 : 650);
  if (token !== generation) return;

  truth.dx = clamp(truth.dx + randomBetween(-0.0012, 0.0012), -0.022, 0.022);
  truth.dy = clamp(truth.dy + randomBetween(-0.001, 0.001), -0.018, 0.018);
  truth.growth = clamp(truth.growth + randomBetween(-0.0015, 0.0015), -0.02, 0.02);
  truth.turn = clamp(truth.turn + randomBetween(-0.003, 0.003), -0.055, 0.055);
  const after = advance(before, truth, true);

  await animateObservation(before, after, beforeHeight, targetHeight, token);
  if (token !== generation) return;
  users = after;
  uavHeight = targetHeight;
  lastError = predictionError(forecasts[0].points, after);
  updateModel(inferDynamics(before, after));
  round += 1;
  phase = 'observed';
  busy = false;
  clearForecast();
  renderUsers();
  renderUi();
}

function resetGame() {
  generation += 1;
  users = makeUsers();
  truth = makeTruth();
  model = blankModel();
  uavHeight = 0.5;
  round = 0;
  busy = false;
  phase = 'ready';
  lastError = null;
  field.removeAttribute('data-action');
  clearForecast();
  renderUsers();
  const radii = coverageRadii();
  predictedCoverage.setAttribute('rx', radii.x.toFixed(2));
  predictedCoverage.setAttribute('ry', radii.y.toFixed(2));
  renderUi();
}

actionButtons.forEach((button) => {
  button.addEventListener('click', () => takeAction(Number(button.dataset.action)));
});

resetButton.addEventListener('click', resetGame);

window.addEventListener('keydown', (event) => {
  if (event.repeat) return;
  const keyActions = { ArrowDown: -1, Space: 0, ArrowUp: 1 };
  if (!(event.code in keyActions)) return;
  event.preventDefault();
  takeAction(keyActions[event.code]);
});

window.PocketRuntime.onChange(renderUi);
resetGame();
