const params = new URLSearchParams(window.location.search);

if (params.get("embed") === "1") {
  document.documentElement.dataset.embed = "true";
}

const TARGET_ROUNDS = 10;
const pads = Array.from(document.querySelectorAll(".echo-pad"));
const grid = document.querySelector("#echo-grid");
const roundOutput = document.querySelector("#round");
const progress = document.querySelector("#progress");
const status = document.querySelector("#status");
const action = document.querySelector("#action");
const assist = document.querySelector("#assist");
const instructions = document.querySelector("#instructions");
const padNames = ["珊瑚", "金色", "薄荷", "蓝色"];

const timers = new Set();
let sequence = [];
let round = 0;
let inputIndex = 0;
let phase = "idle";
let pausedFrom = null;
let assistEnabled = false;

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
  pads.forEach((pad) => pad.classList.remove("is-active"));
  grid.classList.remove("is-wrong");
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
  pad.classList.add("is-active");
  schedule(() => pad.classList.remove("is-active"), 170);
}

function beginInput() {
  if (phase !== "playback") return;

  phase = "input";
  inputIndex = 0;
  setProgress();
  setPadsEnabled(true);
  status.textContent = `轮到你 · 复现 ${sequence.length} 步`;
  instructions.textContent = "按顺序点击色块，或使用键盘数字 1–4。";
}

function playSequence() {
  clearScheduledWork();
  phase = "playback";
  inputIndex = 0;
  setProgress();
  setPadsEnabled(false);
  action.textContent = "重新开始";
  status.textContent = `听回声 · 第 ${round} 轮`;
  instructions.textContent = "先观察亮起顺序，播放结束后再复现。";

  const leadIn = 380;
  const litTime = assistEnabled ? 760 : Math.max(300, 500 - round * 18);
  const stepTime = litTime + (assistEnabled ? 300 : 150);

  sequence.forEach((padIndex, position) => {
    const startsAt = leadIn + position * stepTime;
    schedule(() => {
      pads[padIndex].classList.add("is-active");
      if (assistEnabled) {
        status.textContent = `辅助播报 ${position + 1} / ${sequence.length}：${padNames[padIndex]}`;
      }
    }, startsAt);
    schedule(() => pads[padIndex].classList.remove("is-active"), startsAt + litTime);
  });

  schedule(beginInput, leadIn + sequence.length * stepTime + 80);
}

function nextRound() {
  if (phase !== "transition") return;

  round += 1;
  roundOutput.textContent = String(round);
  sequence.push(Math.floor(Math.random() * pads.length));
  playSequence();
}

function finishGame(won) {
  phase = won ? "won" : "over";
  setPadsEnabled(false);
  setProgress(won ? sequence.length : inputIndex);
  action.textContent = "重新开始";

  if (won) {
    status.textContent = "十轮全部复现 · 回声完整";
    instructions.textContent = "记忆校准完成。想再挑战一次，点击重新开始。";
    return;
  }

  grid.classList.add("is-wrong");
  schedule(() => grid.classList.remove("is-wrong"), 260);
  status.textContent = `回声断开 · 到达第 ${round} 轮`;
  instructions.textContent = "顺序有一点偏差。点击重新开始，再试一次。";
}

function choosePad(index) {
  if (phase !== "input") return;

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

  phase = "transition";
  status.textContent = `第 ${round} 轮完成`;
  instructions.textContent = "下一段回声会多一步。";
  schedule(nextRound, 720);
}

function startGame() {
  clearScheduledWork();
  sequence = [];
  round = 0;
  inputIndex = 0;
  pausedFrom = null;
  phase = "transition";
  roundOutput.textContent = "0";
  setProgress();
  setPadsEnabled(false);
  action.textContent = "重新开始";
  status.textContent = "准备第一段回声";
  instructions.textContent = "先观察亮起顺序，播放结束后再复现。";
  schedule(nextRound, 600);
}

function pauseGame() {
  if (!["playback", "input", "transition"].includes(phase)) return;

  pausedFrom = phase;
  clearScheduledWork();
  phase = "paused";
  setPadsEnabled(false);
  action.textContent = "继续";
  status.textContent = "页面已隐藏 · 游戏暂停";
  instructions.textContent = "回来后点击继续；当前回声会从头播放。";
}

function resumeGame() {
  if (phase !== "paused") return;

  const previousPhase = pausedFrom;
  pausedFrom = null;
  action.textContent = "重新开始";

  if (previousPhase === "transition") {
    phase = "transition";
    status.textContent = "继续游戏";
    instructions.textContent = "下一段回声即将开始。";
    schedule(nextRound, 420);
    return;
  }

  playSequence();
}

pads.forEach((pad, index) => {
  pad.addEventListener("click", () => choosePad(index));
});

action.addEventListener("click", () => {
  if (phase === "paused") {
    resumeGame();
  } else {
    startGame();
  }
});

assist.addEventListener("click", () => {
  assistEnabled = !assistEnabled;
  assist.setAttribute("aria-pressed", String(assistEnabled));
  assist.setAttribute("aria-label", `辅助播报${assistEnabled ? "开启" : "关闭"}`);
  status.textContent = assistEnabled
    ? "辅助播报已开启，序列会放慢并逐项读出。"
    : "辅助播报已关闭。";
});

window.addEventListener("keydown", (event) => {
  if (
    phase !== "input" ||
    event.repeat ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey
  ) {
    return;
  }

  const index = Number(event.key) - 1;
  if (!Number.isInteger(index) || index < 0 || index >= pads.length) return;

  event.preventDefault();
  choosePad(index);
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) pauseGame();
});

setPadsEnabled(false);
