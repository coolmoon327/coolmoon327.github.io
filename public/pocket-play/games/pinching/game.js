const field = document.querySelector("#field");
const pinchLayer = document.querySelector("#pinch-layer");
const coverageLayer = document.querySelector("#coverage-layer");
const overlapLayer = document.querySelector("#overlap-layer");
const overlapDefs = document.querySelector("#overlap-defs");
const userLayer = document.querySelector("#user-layer");
const coverageOutput = document.querySelector("#coverage");
const interferenceOutput = document.querySelector("#interference");
const servedOutput = document.querySelector("#served");
const randomizeButton = document.querySelector("#randomize");
const optimizeButton = document.querySelector("#optimize");
const statusOutput = document.querySelector("#status");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const SVG_NS = "http://www.w3.org/2000/svg";
const FIELD_WIDTH = 1000;
const FIELD_HEIGHT = 560;
const GUIDE_Y = FIELD_HEIGHT / 2;
const COVERAGE_RX = 220;
const COVERAGE_RY = 224;
const COVERAGE_X = COVERAGE_RX / FIELD_WIDTH;
const COVERAGE_Y = COVERAGE_RY / FIELD_HEIGHT;
const USER_COUNT = 18;
const AREA_COLUMNS = 32;
const AREA_ROWS = 18;
const POSITION_MIN = 0.1;
const POSITION_MAX = 0.9;
const OPTIMIZATION_BATCH = 35;

let emitters = [];
let users = [];
let handles = [];
let scenarioId = 0;
let optimizing = false;
let optimizationToken = 0;
let dragState = null;
let latestMetrics = null;
let statusState = { kind: "ready" };

const areaSamples = Array.from(
  { length: AREA_COLUMNS * AREA_ROWS },
  (_, index) => ({
    x: ((index % AREA_COLUMNS) + 0.5) / AREA_COLUMNS,
    y: (Math.floor(index / AREA_COLUMNS) + 0.5) / AREA_ROWS,
  }),
);

function text(english, chinese) {
  return window.PocketRuntime.text(english, chinese);
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function shuffled(values) {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[other]] = [copy[other], copy[index]];
  }
  return copy;
}

function cloneConfiguration(configuration) {
  return configuration.map((emitter) => ({ ...emitter }));
}

function randomEmitters() {
  const directions = shuffled(["up", "up", "down", "down"]);
  const start = 0.12;
  const step = 0.76 / 3;

  return Array.from({ length: 4 }, (_, index) => ({
    x: clamp(
      start + step * index + (Math.random() - 0.5) * 0.08,
      POSITION_MIN,
      POSITION_MAX,
    ),
    direction: directions[index],
  }));
}

function randomUsers() {
  return shuffled(
    Array.from({ length: USER_COUNT }, (_, index) => {
      const upper = index < USER_COUNT / 2;
      return {
        x: 0.05 + Math.random() * 0.9,
        y: upper ? 0.08 + Math.random() * 0.34 : 0.58 + Math.random() * 0.34,
      };
    }),
  );
}

function covers(emitter, user) {
  const forward = emitter.direction === "up" ? 0.5 - user.y : user.y - 0.5;
  if (forward < 0) return false;

  const horizontal = (user.x - emitter.x) / COVERAGE_X;
  const vertical = forward / COVERAGE_Y;
  return horizontal * horizontal + vertical * vertical <= 1;
}

function hitCounts(configuration, points) {
  return points.map((point) =>
    configuration.reduce(
      (count, emitter) => count + Number(covers(emitter, point)),
      0,
    ),
  );
}

function evaluate(configuration) {
  const hits = hitCounts(configuration, users);
  const areaHits = hitCounts(configuration, areaSamples);
  const covered = areaHits.filter((count) => count > 0).length;
  const interfered = areaHits.filter((count) => count > 1).length;
  const served = hits.filter((count) => count === 1).length;

  return {
    hits,
    covered,
    interfered,
    served,
    coverageRate: Math.round((covered / areaSamples.length) * 100),
    interferenceRate: Math.round((interfered / areaSamples.length) * 100),
  };
}

function createSvgElement(name, attributes = {}) {
  const element = document.createElementNS(SVG_NS, name);
  Object.entries(attributes).forEach(([key, value]) =>
    element.setAttribute(key, String(value)),
  );
  return element;
}

function lobePath(emitter) {
  const center = emitter.x * FIELD_WIDTH;
  const sweep = emitter.direction === "up" ? 1 : 0;
  return `M ${center - COVERAGE_RX} ${GUIDE_Y} A ${COVERAGE_RX} ${COVERAGE_RY} 0 0 ${sweep} ${center + COVERAGE_RX} ${GUIDE_Y} L ${center - COVERAGE_RX} ${GUIDE_Y} Z`;
}

function renderCoverage() {
  overlapDefs.replaceChildren();
  coverageLayer.replaceChildren();
  overlapLayer.replaceChildren();

  emitters.forEach((emitter, index) => {
    const path = createSvgElement("path", {
      class: "coverage-lobe",
      d: lobePath(emitter),
      "data-pinch": index + 1,
    });
    coverageLayer.append(path);
  });

  for (let first = 0; first < emitters.length; first += 1) {
    for (let second = first + 1; second < emitters.length; second += 1) {
      if (emitters[first].direction !== emitters[second].direction) continue;

      const clipId = `pinch-overlap-${first}-${second}`;
      const clip = createSvgElement("clipPath", {
        id: clipId,
        clipPathUnits: "userSpaceOnUse",
      });
      clip.append(createSvgElement("path", { d: lobePath(emitters[first]) }));
      overlapDefs.append(clip);

      overlapLayer.append(
        createSvgElement("path", {
          class: "interference-zone",
          d: lobePath(emitters[second]),
          "clip-path": `url(#${clipId})`,
        }),
      );
    }
  }
}

function renderUsers() {
  const fragment = document.createDocumentFragment();
  users.forEach((user, index) => {
    const hitCount = latestMetrics.hits[index];
    const state =
      hitCount === 0 ? "missed" : hitCount === 1 ? "clean" : "interfered";
    fragment.append(
      createSvgElement("circle", {
        class: `user user-${state}`,
        cx: user.x * FIELD_WIDTH,
        cy: user.y * FIELD_HEIGHT,
        r: 9,
      }),
    );
  });
  userLayer.replaceChildren(fragment);
}

function directionName(direction) {
  return direction === "up" ? text("upward", "向上") : text("downward", "向下");
}

function handleLabel(emitter, index) {
  const position = Math.round(emitter.x * 100);
  return text(
    `Pinch ${index + 1}, ${position} percent along the guide, radiating ${directionName(emitter.direction)}. Use left and right arrows to move, or up and down arrows to aim.`,
    `夹持点 ${index + 1}，位于波导 ${position}%，${directionName(emitter.direction)}发射。使用左右方向键移动，上下方向键切换发射方向。`,
  );
}

function renderHandles() {
  handles.forEach((handle, index) => {
    const emitter = emitters[index];
    handle.style.setProperty("--pinch-x", `${emitter.x * 100}%`);
    handle.dataset.direction = emitter.direction;
    handle.disabled = optimizing;
    handle.setAttribute("aria-label", handleLabel(emitter, index));
    handle.querySelector(".pinch-arrow").textContent =
      emitter.direction === "up" ? "↑" : "↓";
  });
}

function configurationValue() {
  const layout = emitters
    .map(
      (emitter) =>
        `${emitter.x.toFixed(3)}${emitter.direction === "up" ? "u" : "d"}`,
    )
    .join(",");
  return `s${scenarioId}:${layout}`;
}

function renderMetrics() {
  coverageOutput.textContent = `${latestMetrics.coverageRate}%`;
  interferenceOutput.textContent = `${latestMetrics.interferenceRate}%`;
  servedOutput.textContent = `${latestMetrics.served} / ${users.length}`;

  coverageOutput.setAttribute(
    "aria-label",
    text(
      `Coverage rate: ${latestMetrics.coverageRate} percent`,
      `覆盖率：${latestMetrics.coverageRate}%`,
    ),
  );
  interferenceOutput.setAttribute(
    "aria-label",
    text(
      `Interference rate: ${latestMetrics.interferenceRate} percent`,
      `干扰率：${latestMetrics.interferenceRate}%`,
    ),
  );
  servedOutput.setAttribute(
    "aria-label",
    text(
      `${latestMetrics.served} of ${users.length} users served without interference`,
      `${users.length} 位用户中有 ${latestMetrics.served} 位无干扰成功`,
    ),
  );
}

function statusMessage() {
  const details = text(
    `${latestMetrics.served} of ${users.length} users are cleanly served.`,
    `${users.length} 位用户中有 ${latestMetrics.served} 位无干扰成功。`,
  );

  if (statusState.kind === "randomized") {
    return text(`New random scene. ${details}`, `已生成随机场景。${details}`);
  }
  if (statusState.kind === "adjusted") {
    const emitter = emitters[statusState.index];
    return text(
      `Pinch ${statusState.index + 1} now aims ${directionName(emitter.direction)} at ${Math.round(emitter.x * 100)} percent. ${details}`,
      `夹持点 ${statusState.index + 1} 已移至 ${Math.round(emitter.x * 100)}%，并${directionName(emitter.direction)}发射。${details}`,
    );
  }
  if (statusState.kind === "optimizing") {
    return text(
      "Searching 560 spaced layouts for the most cleanly served users…",
      "正在搜索 560 种分散布局，尽量增加无干扰成功用户…",
    );
  }
  if (statusState.kind === "optimized") {
    return text(
      `Best grid layout found: ${details} Coverage ${latestMetrics.coverageRate} percent; interference ${latestMetrics.interferenceRate} percent.`,
      `已找到离散网格最优布局：${details}覆盖率 ${latestMetrics.coverageRate}%，干扰率 ${latestMetrics.interferenceRate}%。`,
    );
  }
  if (statusState.kind === "paused") {
    return text(
      `The search stopped when the page was hidden. ${details}`,
      `页面隐藏后搜索已停止。${details}`,
    );
  }
  return text(
    "Move the four pinches to serve each user with exactly one beam.",
    "移动四个夹持点，让每位用户只被一束波束覆盖。",
  );
}

function renderStatus() {
  statusOutput.textContent = statusMessage();
}

function renderScene() {
  latestMetrics = evaluate(emitters);
  field.dataset.optimizing = String(optimizing);
  field.dataset.config = configurationValue();
  field.setAttribute("aria-busy", String(optimizing));
  field.setAttribute(
    "aria-label",
    text(
      `Waveguide field with four movable pinches and ${users.length} users`,
      `包含四个可移动夹持点和 ${users.length} 位用户的波导场景`,
    ),
  );

  renderCoverage();
  renderUsers();
  renderHandles();
  renderMetrics();

  randomizeButton.disabled = optimizing;
  optimizeButton.disabled = optimizing;
  optimizeButton.textContent = optimizing
    ? text("Searching…", "搜索中…")
    : text("Find optimum", "一键最优搜索");
}

function renderAll() {
  renderScene();
  renderStatus();
}

function buildHandles() {
  handles = emitters.map((_, index) => {
    const button = document.createElement("button");
    const core = document.createElement("span");
    const number = document.createElement("span");
    const arrow = document.createElement("span");

    button.type = "button";
    button.className = "pinch";
    button.dataset.index = String(index);
    button.setAttribute(
      "aria-keyshortcuts",
      "ArrowLeft ArrowRight ArrowUp ArrowDown Home End",
    );
    button.setAttribute("aria-describedby", "field-help");
    core.className = "pinch-core";
    number.className = "pinch-number";
    number.textContent = String(index + 1);
    arrow.className = "pinch-arrow";
    arrow.setAttribute("aria-hidden", "true");
    core.append(number, arrow);
    button.append(core);

    button.addEventListener("pointerdown", beginDrag);
    button.addEventListener("pointermove", moveDrag);
    button.addEventListener("pointerup", endDrag);
    button.addEventListener("pointercancel", cancelDrag);
    button.addEventListener("click", toggleDirection);
    button.addEventListener("keydown", moveWithKeyboard);
    pinchLayer.append(button);
    return button;
  });
}

function indexFromHandle(handle) {
  return Number.parseInt(handle.dataset.index, 10);
}

function beginDrag(event) {
  if (optimizing || (event.pointerType === "mouse" && event.button !== 0))
    return;
  event.preventDefault();
  const handle = event.currentTarget;
  handle.setPointerCapture(event.pointerId);
  handle.classList.add("is-dragging");
  dragState = {
    handle,
    index: indexFromHandle(handle),
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    moved: false,
  };
}

function pointerConfiguration(event) {
  const bounds = field.getBoundingClientRect();
  const x = clamp(
    (event.clientX - bounds.left) / bounds.width,
    POSITION_MIN,
    POSITION_MAX,
  );
  const middle = bounds.top + bounds.height / 2;
  return { x, direction: event.clientY < middle ? "up" : "down" };
}

function moveDrag(event) {
  if (!dragState || event.pointerId !== dragState.pointerId) return;
  const distance = Math.hypot(
    event.clientX - dragState.startX,
    event.clientY - dragState.startY,
  );
  if (distance > 3) dragState.moved = true;

  emitters[dragState.index] = pointerConfiguration(event);
  renderScene();
}

function finishDrag(event, announce) {
  if (!dragState || event.pointerId !== dragState.pointerId) return;
  const { handle, index, moved } = dragState;
  if (handle.hasPointerCapture(event.pointerId))
    handle.releasePointerCapture(event.pointerId);
  handle.classList.remove("is-dragging");
  dragState = null;

  if (moved) {
    handle.dataset.suppressClickUntil = String(performance.now() + 350);
    if (announce) {
      statusState = { kind: "adjusted", index };
      renderStatus();
    }
  }
}

function endDrag(event) {
  finishDrag(event, true);
}

function cancelDrag(event) {
  finishDrag(event, false);
}

function toggleDirection(event) {
  if (optimizing) return;
  const handle = event.currentTarget;
  const suppressUntil = Number.parseFloat(
    handle.dataset.suppressClickUntil || "0",
  );
  if (event.detail !== 0 && performance.now() < suppressUntil) return;

  const index = indexFromHandle(handle);
  emitters[index].direction =
    emitters[index].direction === "up" ? "down" : "up";
  statusState = { kind: "adjusted", index };
  renderAll();
}

function moveWithKeyboard(event) {
  if (optimizing) return;
  const horizontalKeys = ["ArrowLeft", "ArrowRight", "Home", "End"];
  const directionKeys = ["ArrowUp", "ArrowDown"];
  if (!horizontalKeys.includes(event.key) && !directionKeys.includes(event.key))
    return;

  event.preventDefault();
  const index = indexFromHandle(event.currentTarget);
  const emitter = emitters[index];
  const step = event.shiftKey ? 0.01 : 0.025;

  if (event.key === "ArrowLeft")
    emitter.x = clamp(emitter.x - step, POSITION_MIN, POSITION_MAX);
  if (event.key === "ArrowRight")
    emitter.x = clamp(emitter.x + step, POSITION_MIN, POSITION_MAX);
  if (event.key === "Home") emitter.x = POSITION_MIN;
  if (event.key === "End") emitter.x = POSITION_MAX;
  if (event.key === "ArrowUp") emitter.direction = "up";
  if (event.key === "ArrowDown") emitter.direction = "down";

  statusState = { kind: "adjusted", index };
  renderAll();
}

function newScenario(initial = false) {
  optimizationToken += 1;
  optimizing = false;
  scenarioId += 1;
  emitters = randomEmitters();
  users = randomUsers();
  statusState = { kind: initial ? "ready" : "randomized" };
  renderAll();
}

function candidateLayouts() {
  const positions = [0.12, 0.24, 0.36, 0.5, 0.64, 0.76, 0.88];
  const combinations = [];

  function choose(start, selected) {
    if (selected.length === 4) {
      combinations.push([...selected]);
      return;
    }
    for (
      let index = start;
      index <= positions.length - (4 - selected.length);
      index += 1
    ) {
      selected.push(positions[index]);
      choose(index + 1, selected);
      selected.pop();
    }
  }

  choose(0, []);
  const candidates = [];
  combinations.forEach((combination) => {
    for (let mask = 0; mask < 16; mask += 1) {
      candidates.push(
        combination.map((x, index) => ({
          x,
          direction: mask & (1 << index) ? "up" : "down",
        })),
      );
    }
  });
  return shuffled(candidates);
}

function isBetter(candidate, best) {
  if (!best) return true;
  if (candidate.metrics.served !== best.metrics.served) {
    return candidate.metrics.served > best.metrics.served;
  }
  if (candidate.metrics.covered !== best.metrics.covered) {
    return candidate.metrics.covered > best.metrics.covered;
  }
  return candidate.metrics.interfered < best.metrics.interfered;
}

function completeOptimization(best, token) {
  if (token !== optimizationToken) return;
  emitters = cloneConfiguration(best.configuration);
  optimizing = false;
  statusState = { kind: "optimized" };
  renderAll();
}

function optimizeLayout() {
  if (optimizing) return;
  const token = ++optimizationToken;
  const candidates = candidateLayouts();
  let cursor = 0;
  let best = null;

  optimizing = true;
  statusState = { kind: "optimizing" };
  renderAll();

  if (reducedMotion.matches) {
    candidates.forEach((configuration) => {
      const candidate = { configuration, metrics: evaluate(configuration) };
      if (isBetter(candidate, best)) best = candidate;
    });
    completeOptimization(best, token);
    return;
  }

  function searchBatch() {
    if (token !== optimizationToken) return;
    const end = Math.min(cursor + OPTIMIZATION_BATCH, candidates.length);
    for (; cursor < end; cursor += 1) {
      const configuration = candidates[cursor];
      const candidate = { configuration, metrics: evaluate(configuration) };
      if (isBetter(candidate, best)) best = candidate;
    }

    emitters = cloneConfiguration(candidates[end - 1]);
    renderScene();

    if (cursor < candidates.length) {
      window.setTimeout(() => window.requestAnimationFrame(searchBatch), 48);
    } else {
      completeOptimization(best, token);
    }
  }

  window.requestAnimationFrame(searchBatch);
}

randomizeButton.addEventListener("click", () => newScenario(false));
optimizeButton.addEventListener("click", optimizeLayout);

document.addEventListener("visibilitychange", () => {
  if (!document.hidden || !optimizing) return;
  optimizationToken += 1;
  optimizing = false;
  statusState = { kind: "paused" };
  renderAll();
});

window.PocketRuntime.onChange(renderAll);

emitters = randomEmitters();
users = randomUsers();
scenarioId = 1;
buildHandles();
renderAll();
