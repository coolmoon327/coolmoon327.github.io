'use strict';

const SVG_NS = 'http://www.w3.org/2000/svg';
const USER_COUNT = 9;
const MODEL_ALPHA = 0.46;
const HEIGHT_STEP = 0.14;
const MOVE_STEP = 0.075;
const LOCK_SERVICE = 62;
const LOCK_ROUNDS = 3;
const UAV_BOUNDS = Object.freeze({
  minX: 0.1,
  maxX: 0.9,
  minY: 0.12,
  maxY: 0.88,
  minHeight: 0.22,
  maxHeight: 0.78,
});
const ACTIONS = Object.freeze({
  north: Object.freeze({ dx: 0, dy: -MOVE_STEP, dh: 0 }),
  south: Object.freeze({ dx: 0, dy: MOVE_STEP, dh: 0 }),
  west: Object.freeze({ dx: -MOVE_STEP, dy: 0, dh: 0 }),
  east: Object.freeze({ dx: MOVE_STEP, dy: 0, dh: 0 }),
  descend: Object.freeze({ dx: 0, dy: 0, dh: -HEIGHT_STEP }),
  hold: Object.freeze({ dx: 0, dy: 0, dh: 0 }),
  climb: Object.freeze({ dx: 0, dy: 0, dh: HEIGHT_STEP }),
});
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const field = document.querySelector('#field');
const userLayer = document.querySelector('#user-layer');
const ghostLayer = document.querySelector('#ghost-layer');
const coverage = document.querySelector('#coverage');
const predictedCoverage = document.querySelector('#predicted-coverage');
const uavNode = document.querySelector('#uav');
const predictedUav = document.querySelector('#predicted-uav');
const uavVector = document.querySelector('#uav-vector');
const roundOutput = document.querySelector('#round');
const errorOutput = document.querySelector('#prediction-error');
const serviceOutput = document.querySelector('#service-rate');
const phaseOutput = document.querySelector('#phase');
const heightOutput = document.querySelector('#height');
const lockChip = document.querySelector('#lock-chip');
const lockOutput = document.querySelector('#lock-count');
const lockPips = [...document.querySelectorAll('.lock-pips i')];
const status = document.querySelector('#status');
const resetButton = document.querySelector('#reset');
const actionButtons = [...document.querySelectorAll('[data-action]')];

let users = [];
let truth = null;
let model = null;
let uav = { x: 0.5, y: 0.5, height: 0.5 };
let round = 0;
let busy = false;
let phase = 'ready';
let lastError = null;
let lastServiceDelta = null;
let lockStreak = 0;
let lastAction = 'hold';
let lastActionClamped = false;
let forecastService = null;
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

function project(point, height = uav.height) {
  const scale = 1.2 - height * 0.34;
  return {
    x: 180 + (point.x - 0.5) * 332 * scale,
    y: 110 + (point.y - 0.5) * 194 * scale,
  };
}

function coverageRadii(height = uav.height) {
  const radiusWorld = 0.19 + height * 0.27;
  const scale = 1.2 - height * 0.34;
  return {
    x: radiusWorld * 332 * scale,
    y: radiusWorld * 194 * scale,
  };
}

function serviceRate(points, state = uav) {
  const radiusWorld = 0.19 + state.height * 0.27;
  const heightQuality = 1 - state.height * 0.22;
  const total = points.reduce((sum, point) => {
    const distance = Math.hypot(point.x - state.x, point.y - state.y);
    if (distance > radiusWorld) return sum;
    const edgeQuality = 0.58 + 0.42 * (1 - distance / radiusWorld);
    return sum + edgeQuality * heightQuality;
  }, 0);
  return (100 * total) / points.length;
}

function renderUsers(points = users, state = uav) {
  userLayer.replaceChildren();
  const servedRadius = 0.19 + state.height * 0.27;
  points.forEach((point) => {
    const shown = project(point, state.height);
    const group = createSvg('g', {
      class: `user-node${Math.hypot(point.x - state.x, point.y - state.y) <= servedRadius ? ' is-served' : ''}`,
      transform: `translate(${shown.x.toFixed(2)} ${shown.y.toFixed(2)})`,
    });
    group.append(createSvg('circle', { class: 'user-halo', r: 8 }));
    group.append(createSvg('circle', { class: 'user-core', r: 3.5 }));
    userLayer.append(group);
  });
  const center = project(state, state.height);
  const radii = coverageRadii(state.height);
  coverage.setAttribute('cx', center.x.toFixed(2));
  coverage.setAttribute('cy', center.y.toFixed(2));
  coverage.setAttribute('rx', radii.x.toFixed(2));
  coverage.setAttribute('ry', radii.y.toFixed(2));
  uavNode.setAttribute('transform', `translate(${center.x.toFixed(2)} ${center.y.toFixed(2)})`);
}

function renderForecast(forecasts) {
  ghostLayer.replaceChildren();
  forecasts.forEach((forecast, horizonIndex) => {
    forecast.points.forEach((point) => {
      const shown = project(point, forecast.uav.height);
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
  const firstForecast = forecasts[0];
  const firstCenter = project(firstForecast.uav, firstForecast.uav.height);
  const currentCenter = project(uav, uav.height);
  const firstRadii = coverageRadii(firstForecast.uav.height);
  predictedCoverage.setAttribute('cx', firstCenter.x.toFixed(2));
  predictedCoverage.setAttribute('cy', firstCenter.y.toFixed(2));
  predictedCoverage.setAttribute('rx', firstRadii.x.toFixed(2));
  predictedCoverage.setAttribute('ry', firstRadii.y.toFixed(2));
  predictedUav.setAttribute('cx', firstCenter.x.toFixed(2));
  predictedUav.setAttribute('cy', firstCenter.y.toFixed(2));
  uavVector.setAttribute('x1', currentCenter.x.toFixed(2));
  uavVector.setAttribute('y1', currentCenter.y.toFixed(2));
  uavVector.setAttribute('x2', firstCenter.x.toFixed(2));
  uavVector.setAttribute('y2', firstCenter.y.toFixed(2));
}

function clearForecast() {
  ghostLayer.replaceChildren();
}

function heightLabel() {
  if (uav.height < 0.4) return text('Low', '低空');
  if (uav.height > 0.6) return text('High', '高空');
  return text('Mid', '中空');
}

function phaseLabel() {
  if (phase === 'forecast') return text('Forecasting', '推演中');
  if (phase === 'observed') return text('Observed', '观测已返回');
  return text('Ready', '等待操作');
}

function actionLabel(actionName) {
  const labels = {
    north: text('North', '向北'),
    south: text('South', '向南'),
    west: text('West', '向西'),
    east: text('East', '向东'),
    descend: text('Descend', '降低高度'),
    hold: text('Hover', '悬停'),
    climb: text('Climb', '提升高度'),
  };
  return labels[actionName] ?? labels.hold;
}

function serviceChangeLabel() {
  if (lastServiceDelta === null || Math.abs(lastServiceDelta) < 0.05) {
    return text('service held steady', '服务得分基本不变');
  }
  const amount = Math.abs(lastServiceDelta).toFixed(1);
  return lastServiceDelta > 0
    ? text(`service gained ${amount} points`, `服务得分提升 ${amount} 个百分点`)
    : text(`service lost ${amount} points`, `服务得分下降 ${amount} 个百分点`);
}

function statusLabel() {
  if (phase === 'forecast') {
    if (lastActionClamped) {
      return text(
        `${actionLabel(lastAction)} reaches the flight boundary. The UAV holds at the edge while three latent forecasts roll forward.`,
        `${actionLabel(lastAction)}已触及飞行边界。无人机将在边缘保持位置，同时继续完成三步潜状态推演。`,
      );
    }
    return text(
      `${actionLabel(lastAction)} selected. Three latent forecasts project about ${Math.round(forecastService)}% service before the observation arrives.`,
      `已选择${actionLabel(lastAction)}。三步潜状态推演预计服务得分约为 ${Math.round(forecastService)}%，真实观测尚未返回。`,
    );
  }
  if (phase === 'observed') {
    if (lockStreak >= LOCK_ROUNDS) {
      return text(
        `Link locked: service stayed at or above ${LOCK_SERVICE}% for ${LOCK_ROUNDS} rounds. Keep tracking the moving users.`,
        `链路已锁定：服务得分已连续 ${LOCK_ROUNDS} 轮不低于 ${LOCK_SERVICE}%。继续追踪移动中的用户群。`,
      );
    }
    const lockGuidance =
      lockStreak > 0
        ? text(
            `${LOCK_ROUNDS - lockStreak} more high-service ${LOCK_ROUNDS - lockStreak === 1 ? 'round' : 'rounds'} to lock.`,
            `再保持 ${LOCK_ROUNDS - lockStreak} 轮高服务即可锁定链路。`,
          )
        : text(
            `Reach ${LOCK_SERVICE}% service to start a ${LOCK_ROUNDS}-round lock.`,
            `将服务得分提升至 ${LOCK_SERVICE}% 即可开始累计 ${LOCK_ROUNDS} 轮链路锁定。`,
          );
    return text(
      `${actionLabel(lastAction)}: ${serviceChangeLabel()}. ${lockGuidance}`,
      `${actionLabel(lastAction)}后，${serviceChangeLabel()}。${lockGuidance}`,
    );
  }
  return text(
    `Move the relay or change altitude. Hold at least ${LOCK_SERVICE}% service for ${LOCK_ROUNDS} consecutive rounds to lock the link.`,
    `移动空中中继或调整高度，并将服务得分连续 ${LOCK_ROUNDS} 轮保持在 ${LOCK_SERVICE}% 以上，以锁定链路。`,
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
  const service = serviceRate(users, uav);
  serviceOutput.textContent = `${Math.round(service)}%`;
  phaseOutput.textContent = phaseLabel();
  heightOutput.textContent = heightLabel();
  lockOutput.textContent = `${lockStreak} / ${LOCK_ROUNDS}`;
  const lockAria = text(
    `High-service link lock: ${lockStreak} of ${LOCK_ROUNDS} rounds at ${LOCK_SERVICE}% or above`,
    `高服务链路锁定：已完成 ${lockStreak}/${LOCK_ROUNDS} 轮，目标为服务得分不低于 ${LOCK_SERVICE}%`,
  );
  lockChip.setAttribute('aria-label', lockAria);
  lockOutput.setAttribute('aria-label', lockAria);
  lockChip.dataset.state = lockStreak >= LOCK_ROUNDS ? 'locked' : 'tracking';
  lockPips.forEach((pip, index) => pip.classList.toggle('is-active', index < lockStreak));
  status.textContent = statusLabel();
  status.dataset.state = phase;
  const outcome =
    phase !== 'observed' || lastServiceDelta === null || Math.abs(lastServiceDelta) < 0.5
      ? 'steady'
      : lastServiceDelta > 0
        ? 'gain'
        : 'loss';
  status.dataset.outcome = outcome;
  field.dataset.phase = phase;
  field.dataset.outcome = outcome;
  field.dataset.uavX = uav.x.toFixed(3);
  field.dataset.uavY = uav.y.toFixed(3);
  field.dataset.uavHeight = uav.height.toFixed(3);
  field.dataset.service = service.toFixed(2);
  field.dataset.lockStreak = String(lockStreak);
  field.dataset.locked = String(lockStreak >= LOCK_ROUNDS);
  field.dataset.clamped = String(lastActionClamped);
  actionButtons.forEach((button) => {
    button.disabled = busy;
  });
  resetButton.disabled = busy;
}

function transitionUav(state, actionName) {
  const action = ACTIONS[actionName] ?? ACTIONS.hold;
  const desired = {
    x: state.x + action.dx,
    y: state.y + action.dy,
    height: state.height + action.dh,
  };
  const next = {
    x: clamp(desired.x, UAV_BOUNDS.minX, UAV_BOUNDS.maxX),
    y: clamp(desired.y, UAV_BOUNDS.minY, UAV_BOUNDS.maxY),
    height: clamp(desired.height, UAV_BOUNDS.minHeight, UAV_BOUNDS.maxHeight),
  };
  const clamped =
    Math.abs(next.x - desired.x) > 1e-8 ||
    Math.abs(next.y - desired.y) > 1e-8 ||
    Math.abs(next.height - desired.height) > 1e-8;
  return { next, clamped };
}

function forecastFrom(points, actionName, state) {
  const forecasts = [];
  let cursor = points.map((point) => ({ ...point }));
  const transition = transitionUav(state, actionName);
  for (let horizon = 0; horizon < 3; horizon += 1) {
    cursor = advance(cursor, model, false);
    forecasts.push({
      points: cursor,
      uav: { ...transition.next },
    });
  }
  return { forecasts, clamped: transition.clamped };
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

function animateObservation(before, after, fromUav, toUav, token) {
  const duration = reducedMotion.matches ? 0 : 560;
  if (duration === 0) {
    renderUsers(after, toUav);
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
      const shownUav = {
        x: fromUav.x + (toUav.x - fromUav.x) * eased,
        y: fromUav.y + (toUav.y - fromUav.y) * eased,
        height: fromUav.height + (toUav.height - fromUav.height) * eased,
      };
      renderUsers(interpolated, shownUav);
      if (progress < 1) {
        window.requestAnimationFrame(frame);
      } else {
        resolve();
      }
    }
    window.requestAnimationFrame(frame);
  });
}

async function takeAction(actionName) {
  if (busy || !(actionName in ACTIONS)) return;
  busy = true;
  const token = generation;
  const before = users.map((point) => ({ ...point }));
  const beforeUav = { ...uav };
  const beforeService = serviceRate(before, beforeUav);
  const forecast = forecastFrom(before, actionName, beforeUav);
  const targetUav = forecast.forecasts[0].uav;
  lastAction = actionName;
  lastActionClamped = forecast.clamped;
  forecastService = serviceRate(forecast.forecasts[0].points, targetUav);

  phase = 'forecast';
  field.dataset.action = actionName;
  renderForecast(forecast.forecasts);
  renderUi();
  await wait(reducedMotion.matches ? 120 : 650);
  if (token !== generation) return;

  truth.dx = clamp(truth.dx + randomBetween(-0.0012, 0.0012), -0.022, 0.022);
  truth.dy = clamp(truth.dy + randomBetween(-0.001, 0.001), -0.018, 0.018);
  truth.growth = clamp(truth.growth + randomBetween(-0.0015, 0.0015), -0.02, 0.02);
  truth.turn = clamp(truth.turn + randomBetween(-0.003, 0.003), -0.055, 0.055);
  const after = advance(before, truth, true);

  await animateObservation(before, after, beforeUav, targetUav, token);
  if (token !== generation) return;
  users = after;
  uav = { ...targetUav };
  lastError = predictionError(forecast.forecasts[0].points, after);
  const observedService = serviceRate(users, uav);
  lastServiceDelta = observedService - beforeService;
  lockStreak = observedService >= LOCK_SERVICE ? Math.min(LOCK_ROUNDS, lockStreak + 1) : 0;
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
  uav = { x: 0.5, y: 0.5, height: 0.5 };
  round = 0;
  busy = false;
  phase = 'ready';
  lastError = null;
  lastServiceDelta = null;
  lockStreak = 0;
  lastAction = 'hold';
  lastActionClamped = false;
  forecastService = null;
  field.removeAttribute('data-action');
  clearForecast();
  renderUsers();
  const center = project(uav, uav.height);
  const radii = coverageRadii();
  predictedCoverage.setAttribute('cx', center.x.toFixed(2));
  predictedCoverage.setAttribute('cy', center.y.toFixed(2));
  predictedCoverage.setAttribute('rx', radii.x.toFixed(2));
  predictedCoverage.setAttribute('ry', radii.y.toFixed(2));
  predictedUav.setAttribute('cx', center.x.toFixed(2));
  predictedUav.setAttribute('cy', center.y.toFixed(2));
  uavVector.setAttribute('x1', center.x.toFixed(2));
  uavVector.setAttribute('y1', center.y.toFixed(2));
  uavVector.setAttribute('x2', center.x.toFixed(2));
  uavVector.setAttribute('y2', center.y.toFixed(2));
  renderUi();
}

actionButtons.forEach((button) => {
  button.addEventListener('click', () => takeAction(button.dataset.action));
});

resetButton.addEventListener('click', resetGame);

window.addEventListener('keydown', (event) => {
  if (event.repeat) return;
  const keyActions = {
    ArrowUp: 'north',
    ArrowDown: 'south',
    ArrowLeft: 'west',
    ArrowRight: 'east',
    PageDown: 'descend',
    Space: 'hold',
    PageUp: 'climb',
  };
  if (!(event.code in keyActions)) return;
  if (
    event.code === 'Space' &&
    event.target instanceof Element &&
    event.target.closest('button, a, input, select, textarea, [contenteditable="true"]')
  ) {
    return;
  }
  event.preventDefault();
  takeAction(keyActions[event.code]);
});

window.__worldDebug = Object.freeze({
  actions: Object.keys(ACTIONS),
  bounds: UAV_BOUNDS,
  snapshot: () => ({
    action: lastAction,
    clamped: lastActionClamped,
    lockStreak,
    phase,
    round,
    service: serviceRate(users, uav),
    uav: { ...uav },
  }),
});

window.PocketRuntime.onChange(renderUi);
resetGame();
