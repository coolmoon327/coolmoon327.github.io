const action = document.querySelector('#action');
const field = document.querySelector('#field');
const targetZone = document.querySelector('.target-zone');
const satellite = document.querySelector('#satellite');
const score = document.querySelector('#score');
const hint = document.querySelector('#hint');
const assistButton = document.querySelector('#assist');
const assistStatus = document.querySelector('#assist-status');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const TARGET_TOLERANCE = 16;
const MIN_TARGET_SHIFT = 60;
const NORMAL_CYCLE_MS = 2150;
const REDUCED_CYCLE_MS = 4800;

let running = false;
let startedAt = 0;
let targetAngle = Math.round(Math.random() * 359);
let currentAngle = 0;
let motionFrame = 0;
let assistEnabled = false;
let assistBucket = '';
let assistNotice = null;
let viewState = 'idle';
let lastPoints = 0;
let lastHit = false;

function text(english, chinese) {
  return window.PocketRuntime.text(english, chinese);
}

function normalizeAngle(angle) {
  return ((angle % 360) + 360) % 360;
}

function orbitCycle() {
  return reducedMotion.matches ? REDUCED_CYCLE_MS : NORMAL_CYCLE_MS;
}

function orbitAngle(now = performance.now()) {
  return normalizeAngle(((now - startedAt) / orbitCycle()) * 360);
}

function angularDistance(angle, target = targetAngle) {
  const distance = Math.abs(normalizeAngle(angle) - normalizeAngle(target));
  return Math.min(distance, 360 - distance);
}

function nextTarget(previous) {
  const safeArc = 360 - MIN_TARGET_SHIFT * 2;
  return normalizeAngle(previous + MIN_TARGET_SHIFT + Math.random() * safeArc);
}

function renderTarget() {
  const start = normalizeAngle(targetAngle - TARGET_TOLERANCE);
  targetZone.style.setProperty('--target-start', `${start}deg`);
  targetZone.style.setProperty('--target-span', `${TARGET_TOLERANCE * 2}deg`);
  field.dataset.targetAngle = targetAngle.toFixed(2);
  field.dataset.targetTolerance = String(TARGET_TOLERANCE);
}

function renderAngle(angle) {
  currentAngle = normalizeAngle(angle);
  satellite.style.transform = `rotate(${currentAngle}deg)`;
  field.dataset.currentAngle = currentAngle.toFixed(2);
}

function resultHint() {
  if (lastHit && lastPoints >= 90) {
    return text('Beautiful — almost perfectly aligned.', '太准了，几乎完美重合！');
  }
  if (lastHit) {
    return text('Aligned — the moon is inside the window.', '对准成功，月球已停在窗口内。');
  }
  return text('The moon stopped outside the window. Try again.', '月球停在窗口之外，再试一次。');
}

function assistMessage(bucket) {
  const messages = {
    target: text('Inside the window. Stop now!', '已进入窗口，现在停下！'),
    close: text(
      'The moon is near the window.',
      '月球就在窗口附近。',
    ),
    far: text(
      'The moon is still far from the window.',
      '月球距离窗口还远。',
    ),
  };
  return messages[bucket];
}

function clearAssistVisual() {
  delete hint.dataset.assistState;
  delete field.dataset.assistState;
}

function renderAssistStatus() {
  clearAssistVisual();

  if (!assistNotice) {
    if (assistStatus.textContent) assistStatus.textContent = '';
    return;
  }

  if (assistNotice.kind === 'toggle') {
    const announcement = assistNotice.enabled
      ? text('Assist cues are on.', '辅助提示已开启。')
      : text('Assist cues are off.', '辅助提示已关闭。');
    if (assistStatus.textContent !== announcement) assistStatus.textContent = announcement;
    hint.textContent = assistNotice.enabled
      ? text(
          'Assist is on — start a round to see distance cues.',
          '辅助提示已开启；开始后会显示距离提示。',
        )
      : text(
          'Assist is off — stop the moon by watching the window.',
          '辅助提示已关闭，请看准窗口位置，手动让月球停下。',
        );
    hint.dataset.assistState = assistNotice.enabled ? 'toggle-on' : 'toggle-off';
    return;
  }

  const message = assistMessage(assistNotice.bucket);
  if (assistStatus.textContent !== message) assistStatus.textContent = message;
  hint.textContent = message;
  hint.dataset.assistState = assistNotice.bucket;
  field.dataset.assistState = assistNotice.bucket;
}

function renderUI() {
  let actionLabel;
  let scoreLabel;
  let hintLabel;

  if (viewState === 'running') {
    actionLabel = text('Stop now', '现在停下');
    scoreLabel = text('Aligning', '对准中');
    hintLabel = text(
      'Watch the bright window, then click the button or press Space.',
      '看准发光窗口，点击按钮或按空格。',
    );
  } else if (viewState === 'result') {
    actionLabel = text('Try again', '再来一轮');
    scoreLabel = text(`${lastPoints} points`, `${lastPoints} 分`);
    hintLabel = resultHint();
  } else if (viewState === 'paused') {
    actionLabel = text('Restart', '重新开始');
    scoreLabel = text('Paused', '已暂停');
    hintLabel = text('This round paused when the page was hidden.', '离开页面时已暂停这一轮。');
  } else {
    actionLabel = text('Start alignment', '开始对准');
    scoreLabel = text('Ready', '等待开始');
    hintLabel = text(
      'Click again when the moon enters the bright window.',
      '月球进入发光窗口时再点一下，让它停住。',
    );
  }

  action.textContent = actionLabel;
  action.setAttribute('aria-label', actionLabel);
  score.textContent = scoreLabel;
  score.setAttribute(
    'aria-label',
    text(`Alignment status: ${scoreLabel}`, `对准状态：${scoreLabel}`),
  );
  hint.textContent = hintLabel;
  assistButton.textContent = text('Assist', '辅助提示');
  assistButton.setAttribute('aria-pressed', String(assistEnabled));
  assistButton.setAttribute(
    'aria-label',
    assistEnabled
      ? text('Turn assist cues off', '关闭辅助提示')
      : text('Turn assist cues on', '开启辅助提示'),
  );
  renderAssistStatus();
}

function updateAssist(angle) {
  if (!running || !assistEnabled) return;

  const distance = angularDistance(angle);
  const bucket =
    distance <= TARGET_TOLERANCE ? 'target' : distance <= TARGET_TOLERANCE + 24 ? 'close' : 'far';
  if (bucket !== assistBucket) {
    assistBucket = bucket;
    assistNotice = { kind: 'bucket', bucket };
    renderAssistStatus();
  }
}

function updateMotion(now) {
  if (!running) return;
  const angle = orbitAngle(now);
  renderAngle(angle);
  updateAssist(angle);
  motionFrame = window.requestAnimationFrame(updateMotion);
}

function stopMotion() {
  window.cancelAnimationFrame(motionFrame);
  motionFrame = 0;
  assistBucket = '';
}

function startRound() {
  stopMotion();
  targetAngle = nextTarget(targetAngle);
  renderTarget();
  renderAngle(0);
  running = true;
  viewState = 'running';
  startedAt = performance.now();
  assistNotice = null;
  field.dataset.result = 'running';
  renderUI();
  motionFrame = window.requestAnimationFrame(updateMotion);
}

function stopRound() {
  const angle = orbitAngle();
  const distance = angularDistance(angle);

  renderAngle(angle);
  lastHit = distance <= TARGET_TOLERANCE;
  lastPoints = Math.max(0, Math.round(100 - distance * (40 / TARGET_TOLERANCE)));
  running = false;
  viewState = 'result';
  field.dataset.result = lastHit ? 'hit' : 'miss';
  stopMotion();
  assistNotice = null;
  renderUI();
}

function toggleRound() {
  if (running) {
    stopRound();
  } else {
    startRound();
  }
}

action.addEventListener('click', toggleRound);

assistButton.addEventListener('click', () => {
  assistEnabled = !assistEnabled;
  assistNotice = { kind: 'toggle', enabled: assistEnabled };
  if (!assistEnabled) {
    assistBucket = '';
  } else if (running) {
    updateAssist(currentAngle);
  }
  renderUI();
});

window.addEventListener('keydown', (event) => {
  if (event.code !== 'Space' || event.repeat || event.target === assistButton) return;
  event.preventDefault();
  toggleRound();
});

document.addEventListener('visibilitychange', () => {
  if (!document.hidden || !running) return;
  renderAngle(orbitAngle());
  running = false;
  viewState = 'paused';
  field.dataset.result = 'paused';
  stopMotion();
  assistNotice = null;
  renderUI();
});

reducedMotion.addEventListener('change', () => {
  if (!running) return;
  const now = performance.now();
  startedAt = now - (currentAngle / 360) * orbitCycle();
});

window.PocketRuntime.onChange(renderUI);
renderTarget();
renderAngle(0);
field.dataset.result = 'idle';
renderUI();
