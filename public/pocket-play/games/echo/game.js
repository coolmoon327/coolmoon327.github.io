const params = new URLSearchParams(window.location.search);

if (params.get('embed') === '1') {
  document.documentElement.dataset.embed = 'true';
}

const TARGET_ROUNDS = 10;
const pads = Array.from(document.querySelectorAll('.echo-pad'));
const grid = document.querySelector('#echo-grid');
const roundMeter = document.querySelector('.round-meter');
const roundOutput = document.querySelector('#round');
const progress = document.querySelector('#progress');
const status = document.querySelector('#status');
const action = document.querySelector('#action');
const assist = document.querySelector('#assist');
const instructions = document.querySelector('#instructions');
const padNames = [
  { en: 'Coral', zh: '珊瑚' },
  { en: 'Gold', zh: '金色' },
  { en: 'Mint', zh: '薄荷' },
  { en: 'Blue', zh: '蓝色' },
];

const timers = new Set();
let sequence = [];
let round = 0;
let inputIndex = 0;
let phase = 'idle';
let pausedFrom = null;
let assistEnabled = false;
let statusState = { kind: 'idle' };
let instructionState = { kind: 'idle' };

function text(english, chinese) {
  return window.PocketRuntime.text(english, chinese);
}

function padName(index) {
  const name = padNames[index];
  return text(name.en, name.zh);
}

function schedule(callback, delay) {
  const timer = window.setTimeout(() => {
    timers.delete(timer);
    callback();
  }, delay);
  timers.add(timer);
}

function clearScheduledWork() {
  timers.forEach((timer) => window.clearTimeout(timer));
  timers.clear();
  pads.forEach((pad) => pad.classList.remove('is-active'));
  grid.classList.remove('is-wrong');
}

function setPadsEnabled(enabled) {
  pads.forEach((pad) => {
    pad.disabled = !enabled;
  });
}

function setProgress(completed = 0) {
  const percent = sequence.length === 0 ? 0 : (completed / sequence.length) * 100;
  progress.style.width = `${percent}%`;
}

function pulsePad(index) {
  const pad = pads[index];
  pad.classList.add('is-active');
  schedule(() => pad.classList.remove('is-active'), 170);
}

function statusText() {
  if (statusState.kind === 'input') {
    return text(
      `Your turn · repeat ${sequence.length} steps`,
      `轮到你 · 复现 ${sequence.length} 步`,
    );
  }
  if (statusState.kind === 'playback') {
    return text(`Watch · round ${round}`, `观察序列 · 第 ${round} 轮`);
  }
  if (statusState.kind === 'assist-step') {
    return text(
      `Cue ${statusState.position + 1} / ${sequence.length}: ${padName(statusState.padIndex)}`,
      `辅助提示 ${statusState.position + 1} / ${sequence.length}：${padName(statusState.padIndex)}`,
    );
  }
  if (statusState.kind === 'won') {
    return text('All ten rounds repeated · echo complete', '十轮全部复现 · 挑战完成');
  }
  if (statusState.kind === 'over') {
    return text(`Echo lost · reached round ${round}`, `顺序有误 · 坚持到第 ${round} 轮`);
  }
  if (statusState.kind === 'round-complete') {
    return text(`Round ${round} complete`, `第 ${round} 轮完成`);
  }
  if (statusState.kind === 'preparing') {
    return text('Preparing the first echo', '准备第一段序列');
  }
  if (statusState.kind === 'paused') {
    return text('Page hidden · game paused', '页面已隐藏 · 游戏暂停');
  }
  if (statusState.kind === 'resuming') {
    return text('Continuing game', '继续游戏');
  }
  if (statusState.kind === 'assist-on') {
    return text(
      'Assist cues are on; the sequence will slow down and name each pad on screen.',
      '辅助提示已开启，序列播放会放慢，并逐项显示色块名称。',
    );
  }
  if (statusState.kind === 'assist-off') {
    return text('Assist cues are off.', '辅助提示已关闭。');
  }
  return text('Ready', '等待开始');
}

function instructionText() {
  if (instructionState.kind === 'input') {
    return text(
      'Select the pads in order, or use number keys 1–4.',
      '按顺序点击色块，或使用键盘数字 1–4。',
    );
  }
  if (instructionState.kind === 'playback') {
    return text(
      'Watch the sequence first, then repeat it after playback.',
      '先观察亮起顺序，播放结束后再复现。',
    );
  }
  if (instructionState.kind === 'won') {
    return text(
      'Memory aligned. Select restart to try another sequence.',
      '记忆挑战完成。想再玩一次，请点击重新开始。',
    );
  }
  if (instructionState.kind === 'over') {
    return text(
      'The sequence drifted. Select restart and try again.',
      '顺序有一点偏差。点击重新开始，再试一次。',
    );
  }
  if (instructionState.kind === 'round-complete') {
    return text('The next echo adds one step.', '下一段序列会增加一步。');
  }
  if (instructionState.kind === 'paused') {
    return text(
      'Select continue when you return; the current echo will replay from the start.',
      '回来后点击继续；当前序列会从头播放。',
    );
  }
  if (instructionState.kind === 'resuming') {
    return text('The next echo will begin shortly.', '下一段序列即将开始。');
  }
  return text(
    'Click a pad or use keys 1–4. You can restart at any time.',
    '点击色块，或使用键盘数字 1–4。游戏进行中可随时重新开始。',
  );
}

function renderMessages() {
  status.textContent = statusText();
  instructions.textContent = instructionText();
}

function renderUI() {
  const actionLabel =
    phase === 'idle'
      ? text('Start game', '开始游戏')
      : phase === 'paused'
        ? text('Continue', '继续')
        : text('Restart', '重新开始');

  action.textContent = actionLabel;
  action.setAttribute('aria-label', actionLabel);
  assist.textContent = text('Assist cues', '辅助提示');
  assist.setAttribute('aria-pressed', String(assistEnabled));
  assist.setAttribute(
    'aria-label',
    assistEnabled
      ? text('Turn assist cues off', '关闭辅助提示')
      : text('Turn assist cues on', '开启辅助提示'),
  );
  roundMeter.setAttribute('aria-label', text('Current round', '当前轮数'));
  grid.setAttribute('aria-label', text('Four echo pads', '四个色块按钮'));
  pads.forEach((pad, index) => {
    pad.setAttribute(
      'aria-label',
      text(`${padName(index)} echo, key ${index + 1}`, `${padName(index)}色块，按键 ${index + 1}`),
    );
  });
  renderMessages();
}

function beginInput() {
  if (phase !== 'playback') return;

  phase = 'input';
  inputIndex = 0;
  statusState = { kind: 'input' };
  instructionState = { kind: 'input' };
  setProgress();
  setPadsEnabled(true);
  renderUI();
}

function playSequence() {
  clearScheduledWork();
  phase = 'playback';
  inputIndex = 0;
  statusState = { kind: 'playback' };
  instructionState = { kind: 'playback' };
  setProgress();
  setPadsEnabled(false);
  renderUI();

  const leadIn = 380;
  const litTime = assistEnabled ? 760 : Math.max(300, 500 - round * 18);
  const stepTime = litTime + (assistEnabled ? 300 : 150);

  sequence.forEach((padIndex, position) => {
    const startsAt = leadIn + position * stepTime;
    schedule(() => {
      pads[padIndex].classList.add('is-active');
      if (assistEnabled) {
        statusState = { kind: 'assist-step', position, padIndex };
        renderMessages();
      }
    }, startsAt);
    schedule(() => pads[padIndex].classList.remove('is-active'), startsAt + litTime);
  });

  schedule(beginInput, leadIn + sequence.length * stepTime + 80);
}

function nextRound() {
  if (phase !== 'transition') return;

  round += 1;
  roundOutput.textContent = String(round);
  sequence.push(Math.floor(Math.random() * pads.length));
  playSequence();
}

function finishGame(won) {
  phase = won ? 'won' : 'over';
  statusState = { kind: won ? 'won' : 'over' };
  instructionState = { kind: won ? 'won' : 'over' };
  setPadsEnabled(false);
  setProgress(won ? sequence.length : inputIndex);

  if (!won) {
    grid.classList.add('is-wrong');
    schedule(() => grid.classList.remove('is-wrong'), 260);
  }
  renderUI();
}

function choosePad(index) {
  if (phase !== 'input') return;

  pulsePad(index);

  if (sequence[inputIndex] !== index) {
    finishGame(false);
    return;
  }

  inputIndex += 1;
  setProgress(inputIndex);

  if (inputIndex < sequence.length) return;

  setPadsEnabled(false);

  if (round >= TARGET_ROUNDS) {
    finishGame(true);
    return;
  }

  phase = 'transition';
  statusState = { kind: 'round-complete' };
  instructionState = { kind: 'round-complete' };
  renderUI();
  schedule(nextRound, 720);
}

function startGame() {
  clearScheduledWork();
  sequence = [];
  round = 0;
  inputIndex = 0;
  pausedFrom = null;
  phase = 'transition';
  statusState = { kind: 'preparing' };
  instructionState = { kind: 'playback' };
  roundOutput.textContent = '0';
  setProgress();
  setPadsEnabled(false);
  renderUI();
  schedule(nextRound, 600);
}

function pauseGame() {
  if (!['playback', 'input', 'transition'].includes(phase)) return;

  pausedFrom = phase;
  clearScheduledWork();
  phase = 'paused';
  statusState = { kind: 'paused' };
  instructionState = { kind: 'paused' };
  setPadsEnabled(false);
  renderUI();
}

function resumeGame() {
  if (phase !== 'paused') return;

  const previousPhase = pausedFrom;
  pausedFrom = null;

  if (previousPhase === 'transition') {
    phase = 'transition';
    statusState = { kind: 'resuming' };
    instructionState = { kind: 'resuming' };
    renderUI();
    schedule(nextRound, 420);
    return;
  }

  playSequence();
}

pads.forEach((pad, index) => {
  pad.addEventListener('click', () => choosePad(index));
});

action.addEventListener('click', () => {
  if (phase === 'paused') {
    resumeGame();
  } else {
    startGame();
  }
});

assist.addEventListener('click', () => {
  assistEnabled = !assistEnabled;
  statusState = { kind: assistEnabled ? 'assist-on' : 'assist-off' };
  renderUI();
});

window.addEventListener('keydown', (event) => {
  if (phase !== 'input' || event.repeat || event.altKey || event.ctrlKey || event.metaKey) {
    return;
  }

  const index = Number(event.key) - 1;
  if (!Number.isInteger(index) || index < 0 || index >= pads.length) return;

  event.preventDefault();
  choosePad(index);
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) pauseGame();
});

window.PocketRuntime.onChange(renderUI);
setPadsEnabled(false);
renderUI();
