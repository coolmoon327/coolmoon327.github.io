const sky = document.querySelector("#sky");
const lines = document.querySelector("#lines");
const count = document.querySelector("#count");
const prompt = document.querySelector("#prompt");
const message = document.querySelector("#message");

const maxPoints = 7;
const points = [];
const keyboardPoints = [
  { x: 17, y: 60 },
  { x: 30, y: 34 },
  { x: 44, y: 49 },
  { x: 57, y: 24 },
  { x: 73, y: 39 },
  { x: 64, y: 69 },
  { x: 84, y: 57 },
];
const fortunes = [
  "愿你慢一点，也仍然抵达。",
  "今晚的微光，刚好替你留着。",
  "别急，属于你的星会自己亮起来。",
  "愿这条小路，通向一点好心情。",
  "你随手落下的光，也算一种方向。",
  "今天已经够努力了，歇一会儿吧。",
];

let mode = "sleeping";

if (new URLSearchParams(window.location.search).get("embed") === "1") {
  document.documentElement.dataset.embed = "true";
}

function updateCount() {
  count.textContent = `${points.length} / ${maxPoints}`;
}

function setDrawingStatus(text) {
  prompt.textContent = text;
  sky.setAttribute(
    "aria-label",
    `星屑签名画布，已放置 ${points.length} 颗星。点击或按 Enter 添加下一颗。`,
  );
}

function awaken() {
  mode = "drawing";
  sky.classList.add("is-awake");
  prompt.textContent = "下一次点击，会留下第一颗星";
  message.textContent = "夜色醒了。慢慢写下你的星点吧。";
  sky.setAttribute("aria-label", "星屑签名画布已唤醒。点击或按 Enter 放置第一颗星。");
}

function clearSignature() {
  points.length = 0;
  lines.replaceChildren();
  sky.querySelectorAll(".star").forEach((star) => star.remove());
  sky.classList.remove("is-complete");
  updateCount();
  message.textContent = "星纸换新了。落下第一颗星吧。";
  setDrawingStatus("星纸换新 · 落下第一颗星");
}

function pointFromEvent(event) {
  if (event.detail === 0) {
    return keyboardPoints[points.length];
  }

  const bounds = sky.getBoundingClientRect();
  const marginX = Math.min(12, (22 / bounds.width) * 100);
  const marginY = Math.min(20, (22 / bounds.height) * 100);
  const x = ((event.clientX - bounds.left) / bounds.width) * 100;
  const y = ((event.clientY - bounds.top) / bounds.height) * 100;

  return {
    x: Math.max(marginX, Math.min(100 - marginX, x)),
    y: Math.max(marginY, Math.min(100 - marginY, y)),
  };
}

function drawConnection(from, to) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.classList.add("connection");
  line.setAttribute("x1", from.x);
  line.setAttribute("y1", from.y);
  line.setAttribute("x2", to.x);
  line.setAttribute("y2", to.y);
  line.setAttribute("pathLength", "1");
  lines.append(line);
}

function drawStar(point) {
  const star = document.createElement("span");
  star.className = "star";
  star.style.left = `${point.x}%`;
  star.style.top = `${point.y}%`;
  sky.append(star);
}

function finishSignature() {
  mode = "complete";
  const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
  sky.classList.add("is-complete");
  prompt.textContent = "签名完成 · 再点一次重写";
  message.textContent = fortune;
  sky.setAttribute(
    "aria-label",
    `星屑签名已完成。签语：${fortune} 再次激活画布可以清空并重写。`,
  );
}

function addPoint(point) {
  const previous = points.at(-1);
  points.push(point);
  if (previous) drawConnection(previous, point);
  drawStar(point);
  updateCount();

  if (points.length === maxPoints) {
    finishSignature();
  } else {
    message.textContent = `第 ${points.length} 颗星，落好了。`;
    setDrawingStatus(`继续写下星点 · ${points.length} / ${maxPoints}`);
  }
}

sky.addEventListener("click", (event) => {
  if (mode === "sleeping") {
    awaken();
    return;
  }

  if (mode === "complete") {
    mode = "drawing";
    clearSignature();
    return;
  }

  addPoint(pointFromEvent(event));
});
