const action = document.querySelector("#action");
const satellite = document.querySelector("#satellite");
const score = document.querySelector("#score");
const hint = document.querySelector("#hint");
const assistButton = document.querySelector("#assist");
const assistStatus = document.querySelector("#assist-status");

let running = false;
let startedAt = 0;
let assistEnabled = false;
let assistFrame = 0;
let assistBucket = "";

function orbitCycle() {
  return Number.parseFloat(getComputedStyle(satellite).animationDuration) * 1000;
}

function orbitAngle(now = performance.now()) {
  return (((now - startedAt) % orbitCycle()) / orbitCycle()) * 360;
}

function angularDistance(angle, target = 34) {
  return Math.min(
    Math.abs(angle - target),
    Math.abs(angle - target + 360),
    Math.abs(angle - target - 360),
  );
}

function updateAssist(now) {
  if (!running || !assistEnabled) return;

  const distance = angularDistance(orbitAngle(now));
  const bucket = distance <= 10 ? "target" : distance <= 38 ? "close" : "far";
  if (bucket !== assistBucket) {
    assistBucket = bucket;
    const messages = {
      target: "正对窗口，现在按空格。",
      close: "正在接近窗口。",
      far: "距离窗口还远。",
    };
    assistStatus.textContent = messages[bucket];
  }
  assistFrame = window.requestAnimationFrame(updateAssist);
}

function stopAssist() {
  window.cancelAnimationFrame(assistFrame);
  assistFrame = 0;
  assistBucket = "";
}

function startRound() {
  running = true;
  startedAt = performance.now();
  satellite.style.transform = "";
  satellite.classList.add("running");
  action.textContent = "现在停下";
  score.textContent = "校准中";
  hint.textContent = "看准发光窗口，点击按钮或按空格。";
  if (assistEnabled) assistFrame = window.requestAnimationFrame(updateAssist);
}

function stopRound() {
  const elapsed = performance.now() - startedAt;
  const angle = ((elapsed % orbitCycle()) / orbitCycle()) * 360;
  const target = 34;
  const distance = angularDistance(angle, target);
  const points = Math.max(0, Math.round(100 - distance * 2.4));

  running = false;
  stopAssist();
  satellite.classList.remove("running");
  satellite.style.transform = `rotate(${angle}deg)`;
  score.textContent = `${points} 分`;
  action.textContent = "再来一轮";
  hint.textContent =
    points >= 90
      ? "漂亮！几乎完美重合。"
      : points >= 60
        ? "很接近，再微调一点。"
        : "轨道偏离了，再试一次。";
}

function toggleRound() {
  if (running) {
    stopRound();
  } else {
    startRound();
  }
}

action.addEventListener("click", toggleRound);

assistButton.addEventListener("click", () => {
  assistEnabled = !assistEnabled;
  assistButton.setAttribute("aria-pressed", String(assistEnabled));
  assistStatus.textContent = assistEnabled
    ? "辅助提示已开启。"
    : "辅助提示已关闭。";
  if (!assistEnabled) {
    stopAssist();
  } else if (running) {
    assistFrame = window.requestAnimationFrame(updateAssist);
  }
});

window.addEventListener("keydown", (event) => {
  if (event.code !== "Space" || event.repeat || event.target === assistButton) return;
  event.preventDefault();
  toggleRound();
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden || !running) return;
  running = false;
  stopAssist();
  satellite.classList.remove("running");
  satellite.style.transform = "rotate(0deg)";
  score.textContent = "已暂停";
  action.textContent = "重新开始";
  hint.textContent = "离开页面时已暂停这一轮。";
});
