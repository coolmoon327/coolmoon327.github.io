'use strict';

const SVG_NS = 'http://www.w3.org/2000/svg';
const TOTAL_SLOTS = 24;
const SLOT_DURATION_MS = 1700;
const CACHE_LIMIT = 4;
const SERVICE_REFERENCE = 82;

const payloadProfiles = {
  light: { fidelity: 72, clearReliability: 0.97, stressedReliability: 0.7 },
  medium: { fidelity: 86, clearReliability: 0.94, stressedReliability: 0.48 },
  heavy: { fidelity: 97, clearReliability: 0.9, stressedReliability: 0.27 },
};

const field = document.querySelector('#field');
const userLayer = document.querySelector('#user-layer');
const packetLayer = document.querySelector('#packet-layer');
const history = document.querySelector('#history');
const slotOutput = document.querySelector('#slot');
const serviceOutput = document.querySelector('#service');
const cacheAgeOutput = document.querySelector('#cache-age');
const recoveryOutput = document.querySelector('#recovery');
const gapOutput = document.querySelector('#service-gap');
const sourceOutput = document.querySelector('#source');
const status = document.querySelector('#status');
const episodeControl = document.querySelector('#episode-control');
const payloadButtons = [...document.querySelectorAll('[data-payload]')];

let selectedPayload = 'medium';
let slot = 0;
let service = 78;
let serviceSum = 0;
let cacheAge = null;
let cacheReady = false;
let cumulativeGap = 0;
let source = 'idle';
let running = false;
let paused = false;
let complete = false;
let timer = 0;
let historySources = [];
let hiddenPressureStart = 0;
let hiddenPressureEnd = 0;
let recoveryStartedAt = null;
let recoverySlots = null;
let recoveryCandidateFresh = 0;
let degradationEvidence = 0;

function text(english, chinese) {
  return window.PocketRuntime.text(english, chinese);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function createSvg(tag, attributes = {}) {
  const node = document.createElementNS(SVG_NS, tag);
  Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, String(value)));
  return node;
}

function makeHistory() {
  history.replaceChildren();
  for (let index = 0; index < TOTAL_SLOTS; index += 1) {
    const cell = document.createElement('span');
    cell.dataset.slot = String(index + 1);
    history.append(cell);
  }
}

function makeUsers() {
  userLayer.replaceChildren();
  const positions = [
    [25, 151],
    [55, 142],
    [88, 156],
    [125, 143],
    [169, 155],
    [215, 145],
    [258, 156],
    [331, 149],
  ];
  positions.forEach(([x, y], index) => {
    const node = createSvg('g', { class: 'user-node', transform: `translate(${x} ${y})` });
    node.append(createSvg('line', { x1: -4, y1: 7, x2: 4, y2: 7 }));
    node.append(createSvg('circle', { r: 3.2 }));
    node.dataset.index = String(index);
    userLayer.append(node);
  });
}

function makePackets() {
  packetLayer.replaceChildren();
  [0, 1, 2].forEach((index) => {
    packetLayer.append(
      createSvg('circle', {
        class: `packet packet-${['one', 'two', 'three'][index]}`,
        cx: 112,
        cy: 77,
        r: 3,
      }),
    );
  });
}

function cacheAgeLabel() {
  if (cacheAge === null) return '—';
  if (source === 'hold' && cacheAge > CACHE_LIMIT) return text('expired', '已过期');
  return text(`${cacheAge} slots`, `${cacheAge} 槽`);
}

function recoveryLabel() {
  if (recoverySlots !== null) return text(`${recoverySlots} slots`, `${recoverySlots} 槽`);
  if (complete && recoveryStartedAt !== null) return text('not recovered', '尚未恢复');
  if (recoveryStartedAt !== null) return text('recovering', '恢复中');
  return '—';
}

function sourceLabel() {
  if (source === 'fresh') return text('Fresh', '新鲜状态');
  if (source === 'predicted') return text('Predicted', '预测缓存');
  if (source === 'hold') return text('Safe hold', '安全保持');
  return text('Standby', '待机');
}

function statusLabel() {
  if (complete) {
    return text(
      'Episode complete. Compare mean service, recovery time, and the accumulated gap.',
      '本局结束，请结合平均服务率、恢复用时与累计缺口评估韧性。',
    );
  }
  if (paused) {
    return text('Episode paused. Resume when you are ready.', '本局已暂停，准备好后可继续。');
  }
  if (!running) {
    return text(
      'Choose a payload, then start. Keys 1–3 switch payloads during the episode.',
      '先选择语义载荷，再开始实验；运行中可按 1–3 切换载荷。',
    );
  }
  if (source === 'fresh') {
    return text(
      'Fresh semantic state arrived; the prediction cache has been refreshed.',
      '新鲜语义状态到达，预测缓存已同步刷新。',
    );
  }
  if (source === 'predicted') {
    return text(
      'Synchronization missed. The prediction cache is carrying control.',
      '本时隙同步失败，预测缓存正在接管控制。',
    );
  }
  if (source === 'hold') {
    return text(
      'No usable cache remains. Safe hold prevents an uninformed control update.',
      '可用缓存已经耗尽，系统进入安全保持，避免盲目更新控制。',
    );
  }
  return text('Waiting for the next semantic update.', '正在等待下一次语义更新。');
}

function controlLabel() {
  if (complete) return text('New episode', '再来一局');
  if (paused) return text('Resume episode', '继续实验');
  if (running) return text('Pause episode', '暂停实验');
  return text('Start episode', '开始实验');
}

function renderHistory() {
  [...history.children].forEach((cell, index) => {
    cell.className = historySources[index] || '';
    if (!historySources[index]) {
      cell.removeAttribute('title');
      return;
    }
    const label =
      historySources[index] === 'fresh'
        ? text('Fresh state', '新鲜状态')
        : historySources[index] === 'predicted'
          ? text('Prediction cache', '预测缓存')
          : text('Safe hold', '安全保持');
    cell.title = text(`Slot ${index + 1}: ${label}`, `时隙 ${index + 1}：${label}`);
  });
  const freshCount = historySources.filter((value) => value === 'fresh').length;
  const predictedCount = historySources.filter((value) => value === 'predicted').length;
  const holdCount = historySources.filter((value) => value === 'hold').length;
  history.setAttribute(
    'aria-label',
    text(
      `Recent control sources: ${freshCount} fresh, ${predictedCount} predicted, ${holdCount} safe hold`,
      `近期控制来源：${freshCount} 次新鲜状态、${predictedCount} 次预测缓存、${holdCount} 次安全保持`,
    ),
  );
}

function renderUsers() {
  const activeCount = Math.round((service / 100) * userLayer.children.length);
  [...userLayer.children].forEach((node, index) => {
    node.classList.toggle('is-dim', index >= activeCount);
  });
}

function renderUi() {
  slotOutput.textContent = `${slot} / ${TOTAL_SLOTS}`;
  const meanService = slot === 0 ? null : serviceSum / slot;
  serviceOutput.textContent = meanService === null ? '—' : `${Math.round(meanService)}%`;
  cacheAgeOutput.textContent = cacheAgeLabel();
  recoveryOutput.textContent = recoveryLabel();
  gapOutput.textContent = cumulativeGap.toFixed(1);
  sourceOutput.textContent = sourceLabel();
  status.textContent = statusLabel();
  status.dataset.source = source;
  field.dataset.source = source;
  field.dataset.meanService = meanService === null ? '' : meanService.toFixed(2);
  episodeControl.textContent = controlLabel();
  payloadButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.payload === selectedPayload));
  });
  renderUsers();
  renderHistory();
}

function isHiddenPressure() {
  return slot >= hiddenPressureStart && slot <= hiddenPressureEnd;
}

function updateRecovery() {
  const materiallyDegraded = source === 'hold' || service < SERVICE_REFERENCE * 0.72;
  degradationEvidence = materiallyDegraded
    ? degradationEvidence + 1
    : Math.max(0, degradationEvidence - 1);

  if (
    degradationEvidence >= 2 &&
    recoveryStartedAt === null &&
    recoverySlots === null &&
    slot >= 3
  ) {
    recoveryStartedAt = slot - 1;
    recoveryCandidateFresh = 0;
  }
  if (recoveryStartedAt === null || recoverySlots !== null) return;

  if (source === 'fresh' && service >= SERVICE_REFERENCE * 0.9) {
    recoveryCandidateFresh += 1;
  } else {
    recoveryCandidateFresh = 0;
  }
  if (recoveryCandidateFresh >= 2) {
    recoverySlots = Math.max(1, slot - recoveryStartedAt + 1);
    recoveryStartedAt = null;
  }
}

function stepEpisode() {
  if (!running) return;
  slot += 1;
  const profile = payloadProfiles[selectedPayload];
  const reliability = isHiddenPressure() ? profile.stressedReliability : profile.clearReliability;
  const synchronizationSucceeded = Math.random() < reliability;

  if (synchronizationSucceeded) {
    source = 'fresh';
    cacheReady = true;
    cacheAge = 0;
    const target = profile.fidelity;
    service += 0.56 * (target - service);
  } else if (cacheReady && cacheAge !== null && cacheAge < CACHE_LIMIT) {
    source = 'predicted';
    cacheAge += 1;
    const predictionTarget = Math.max(42, profile.fidelity - 8 - cacheAge * 7);
    service += 0.52 * (predictionTarget - service);
  } else {
    source = 'hold';
    cacheAge = cacheAge === null ? CACHE_LIMIT + 1 : cacheAge + 1;
    service += 0.58 * (30 - service);
  }

  service = clamp(service, 0, 100);
  serviceSum += service;
  cumulativeGap += Math.max(0, SERVICE_REFERENCE - service) / 10;
  historySources.push(source);
  updateRecovery();

  if (slot >= TOTAL_SLOTS) {
    finishEpisode();
  } else {
    scheduleNextSlot();
  }
  renderUi();
}

function scheduleNextSlot() {
  window.clearTimeout(timer);
  if (!running) return;
  timer = window.setTimeout(stepEpisode, SLOT_DURATION_MS);
}

function startEpisode() {
  if (complete) resetEpisode();
  running = true;
  paused = false;
  scheduleNextSlot();
  renderUi();
}

function pauseEpisode() {
  running = false;
  paused = true;
  window.clearTimeout(timer);
  renderUi();
}

function finishEpisode() {
  running = false;
  paused = false;
  complete = true;
  window.clearTimeout(timer);
  if (recoveryStartedAt !== null && recoverySlots === null) {
    recoveryOutput.setAttribute('data-unrecovered', 'true');
  }
}

function toggleEpisode() {
  if (running) {
    pauseEpisode();
  } else {
    startEpisode();
  }
}

function resetEpisode() {
  window.clearTimeout(timer);
  slot = 0;
  service = 78;
  serviceSum = 0;
  cacheAge = null;
  cacheReady = false;
  cumulativeGap = 0;
  source = 'idle';
  running = false;
  paused = false;
  complete = false;
  historySources = [];
  hiddenPressureStart = 6 + Math.floor(Math.random() * 4);
  hiddenPressureEnd = hiddenPressureStart + 6 + Math.floor(Math.random() * 3);
  recoveryStartedAt = null;
  recoverySlots = null;
  recoveryCandidateFresh = 0;
  degradationEvidence = 0;
  recoveryOutput.removeAttribute('data-unrecovered');
  renderUi();
}

function selectPayload(payload) {
  if (!(payload in payloadProfiles)) return;
  selectedPayload = payload;
  renderUi();
}

payloadButtons.forEach((button) => {
  button.addEventListener('click', () => selectPayload(button.dataset.payload));
});

episodeControl.addEventListener('click', toggleEpisode);

window.addEventListener('keydown', (event) => {
  if (event.repeat) return;
  const payloadKeys = { Digit1: 'light', Digit2: 'medium', Digit3: 'heavy' };
  if (event.code in payloadKeys) {
    event.preventDefault();
    selectPayload(payloadKeys[event.code]);
    return;
  }
  if (event.code === 'Space') {
    event.preventDefault();
    toggleEpisode();
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden && running) pauseEpisode();
});

window.PocketRuntime.onChange(renderUi);
makeHistory();
makeUsers();
makePackets();
resetEpisode();
