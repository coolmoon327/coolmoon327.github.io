const SVG_NS = "http://www.w3.org/2000/svg";
const ALICE = { x: 50, y: 105 };
const BEAM_WIDTH = 16;
const BOB_THRESHOLD = 0.36;
const EVE_THRESHOLD = 0.28;

const field = document.querySelector("#field");
const scene = document.querySelector("#scene");
const beam = document.querySelector("#beam");
const beamAxis = document.querySelector("#beam-axis");
const antenna = document.querySelector("#antenna");
const reflectionLayer = document.querySelector("#reflection-layer");
const pathLayer = document.querySelector("#path-layer");
const bobNode = document.querySelector("#bob-node");
const eveNode = document.querySelector("#eve-node");
const bearingOutput = document.querySelector("#bearing");
const bobOutput = document.querySelector("#bob-link");
const eveOutput = document.querySelector("#eve-link");
const scoreOutput = document.querySelector("#secrecy-score");
const statusOutput = document.querySelector("#status");
const randomizeButton = document.querySelector("#randomize");
const optimizeButton = document.querySelector("#optimize");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let scenarioNumber = 0;
let scenario = null;
let heading = 0;
let dragging = false;
let optimizing = false;
let optimizationFrame = 0;
let optimizationTarget = 0;
let lastAction = "initial";

function text(english, chinese) {
  return window.PocketRuntime.text(english, chinese);
}

function clamp(value, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function normalizeAngle(angle) {
  return ((angle % 360) + 360) % 360;
}

function toRadians(angle) {
  return (angle * Math.PI) / 180;
}

function randomBetween(minimum, maximum) {
  return minimum + Math.random() * (maximum - minimum);
}

function pointAt(origin, angle, distance) {
  const radians = toRadians(angle);
  return {
    x: origin.x + Math.cos(radians) * distance,
    y: origin.y + Math.sin(radians) * distance,
  };
}

function distanceBetween(first, second) {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

function angleTo(first, second) {
  return normalizeAngle(
    (Math.atan2(second.y - first.y, second.x - first.x) * 180) / Math.PI,
  );
}

function angularDistance(first, second) {
  const distance = Math.abs(normalizeAngle(first) - normalizeAngle(second));
  return Math.min(distance, 360 - distance);
}

function shortestTurn(first, second) {
  return ((normalizeAngle(second) - normalizeAngle(first) + 540) % 360) - 180;
}

function directionalGain(delta, width) {
  return Math.exp(-0.5 * (delta / width) ** 2);
}

function pathGain(distance) {
  return clamp(1 / (0.66 + (distance / 300) * 0.78));
}

function wedgePath(origin, angle, halfAngle, range) {
  const first = pointAt(origin, angle - halfAngle, range);
  const second = pointAt(origin, angle + halfAngle, range);
  return `M ${origin.x} ${origin.y} L ${first.x.toFixed(2)} ${first.y.toFixed(2)} A ${range} ${range} 0 0 1 ${second.x.toFixed(2)} ${second.y.toFixed(2)} Z`;
}

function directGain(target, angle) {
  const offset = angularDistance(angle, angleTo(ALICE, target));
  return clamp(
    directionalGain(offset, BEAM_WIDTH) *
      pathGain(distanceBetween(ALICE, target)),
  );
}

function reflectionFor(target, reflector, angle) {
  const incomingAngle = angleTo(ALICE, reflector);
  const illumination =
    directionalGain(angularDistance(angle, incomingAngle), BEAM_WIDTH + 3) *
    pathGain(distanceBetween(ALICE, reflector));
  const outgoingAngle = normalizeAngle(2 * reflector.angle - incomingAngle);
  const targetAngle = angleTo(reflector, target);
  const outgoingGain = directionalGain(
    angularDistance(targetAngle, outgoingAngle),
    21,
  );
  const gain = clamp(
    illumination *
      outgoingGain *
      pathGain(distanceBetween(reflector, target)) *
      reflector.strength,
  );
  return { gain, illumination, outgoingAngle };
}

function linkQuality(target, angle) {
  const direct = directGain(target, angle);
  const reflections = scenario.reflectors.map((reflector) =>
    reflectionFor(target, reflector, angle),
  );
  const combined =
    1 -
    [direct, ...reflections.map(({ gain }) => gain)].reduce(
      (remaining, contribution) => remaining * (1 - clamp(contribution)),
      1,
    );
  return { quality: clamp(combined), direct, reflections };
}

function evaluate(angle) {
  const bob = linkQuality(scenario.bob, angle);
  const eve = linkQuality(scenario.eve, angle);
  const bobCovered = bob.quality >= BOB_THRESHOLD;
  const eveListening = eve.quality >= EVE_THRESHOLD;
  const secure = bobCovered && !eveListening;
  const scoreValue = bobCovered
    ? 0.15 + bob.quality * 0.85 - eve.quality * 0.72
    : bob.quality * 0.4;
  return {
    bob,
    eve,
    bobCovered,
    eveListening,
    secure,
    margin: bob.quality - eve.quality,
    score: Math.round(clamp(scoreValue) * 100),
  };
}

function createSvgElement(name, className) {
  const element = document.createElementNS(SVG_NS, name);
  if (className) element.setAttribute("class", className);
  return element;
}

function setLine(line, start, end) {
  line.setAttribute("x1", start.x.toFixed(2));
  line.setAttribute("y1", start.y.toFixed(2));
  line.setAttribute("x2", end.x.toFixed(2));
  line.setAttribute("y2", end.y.toFixed(2));
}

function renderReflectors(metrics) {
  reflectionLayer.replaceChildren();

  scenario.reflectors.forEach((reflector, index) => {
    const incoming = metrics.bob.reflections[index];
    const outgoingEnd = pointAt(reflector, incoming.outgoingAngle, 230);
    const panelStart = pointAt(reflector, reflector.angle, -13);
    const panelEnd = pointAt(reflector, reflector.angle, 13);

    const group = createSvgElement("g", "reflection-group");
    const coverage = createSvgElement("path", "reflection-beam");
    coverage.setAttribute(
      "d",
      wedgePath(reflector, incoming.outgoingAngle, 20, 230),
    );
    coverage.style.opacity = String(0.18 + incoming.illumination * 0.62);

    const input = createSvgElement("line", "reflection-input");
    setLine(input, ALICE, reflector);
    input.style.opacity = String(0.12 + incoming.illumination * 0.6);

    const axis = createSvgElement("line", "reflection-axis");
    setLine(axis, reflector, outgoingEnd);
    axis.style.opacity = String(0.16 + incoming.illumination * 0.56);

    const panel = createSvgElement("line", "reflector");
    setLine(panel, panelStart, panelEnd);
    const dot = createSvgElement("circle", "reflector-dot");
    dot.setAttribute("cx", reflector.x);
    dot.setAttribute("cy", reflector.y);
    dot.setAttribute("r", "4");
    const label = createSvgElement("text", "reflector-label");
    label.setAttribute("x", reflector.x);
    label.setAttribute("y", reflector.y - 12);
    label.textContent = `R${index + 1}`;

    group.append(coverage, input, axis, panel, dot, label);
    reflectionLayer.append(group);
  });
}

function strongestReflection(link) {
  let bestIndex = -1;
  let bestGain = 0;
  link.reflections.forEach(({ gain }, index) => {
    if (gain > bestGain) {
      bestGain = gain;
      bestIndex = index;
    }
  });
  return { index: bestIndex, gain: bestGain };
}

function addPath(target, link, className) {
  const direct = createSvgElement("line", `link-path ${className}`);
  setLine(direct, ALICE, target);
  direct.style.opacity = String(0.08 + link.direct * 0.82);
  pathLayer.append(direct);

  const reflected = strongestReflection(link);
  if (reflected.gain < 0.035) return;
  const reflector = scenario.reflectors[reflected.index];
  const path = createSvgElement("polyline", `link-path reflected ${className}`);
  path.setAttribute(
    "points",
    `${ALICE.x},${ALICE.y} ${reflector.x.toFixed(2)},${reflector.y.toFixed(2)} ${target.x.toFixed(2)},${target.y.toFixed(2)}`,
  );
  path.style.opacity = String(0.2 + reflected.gain * 0.78);
  pathLayer.append(path);
}

function qualityLabel(
  quality,
  active,
  activeEnglish,
  activeChinese,
  quietEnglish,
  quietChinese,
) {
  const percent = Math.round(quality * 100);
  const state = active
    ? text(activeEnglish, activeChinese)
    : text(quietEnglish, quietChinese);
  return `${state} · ${percent}%`;
}

function statusText(metrics) {
  if (optimizing)
    return text("Scanning all antenna bearings…", "正在扫描所有天线方位…");
  if (lastAction === "optimized") {
    return metrics.secure
      ? text(
          "Best bearing found: Bob is covered and Eve stays quiet.",
          "已找到最佳方位：Bob 有效覆盖，Eve 保持静默。",
        )
      : text(
          "Best available bearing found for this reflected channel.",
          "已找到当前反射信道下的最佳可用方位。",
        );
  }
  if (lastAction === "randomized") {
    return text(
      "New channel drawn. Aim Alice toward a secure path.",
      "已生成新信道，请调整 Alice 寻找保密路径。",
    );
  }
  if (metrics.secure) {
    return text(
      "Secrecy link established — Bob is covered without Eve.",
      "保密链路已建立：Bob 有效覆盖，Eve 无法窃听。",
    );
  }
  if (!metrics.bobCovered) {
    return text(
      "Bob is outside effective coverage. Rotate the antenna.",
      "Bob 尚未得到有效覆盖，请旋转天线。",
    );
  }
  if (metrics.eveListening) {
    return text(
      "Eve can intercept this bearing. Steer or use a reflection.",
      "Eve 可窃听当前方位，请转向或利用反射路径。",
    );
  }
  return text(
    "Bob is linked, but the secrecy margin is still thin.",
    "Bob 已连接，但保密余量仍然较小。",
  );
}

function render() {
  const metrics = evaluate(heading);
  const beamEnd = pointAt(ALICE, heading, 330);

  beam.setAttribute("d", wedgePath(ALICE, heading, BEAM_WIDTH, 330));
  setLine(beamAxis, ALICE, beamEnd);
  antenna.setAttribute("transform", `rotate(${heading} 0 0)`);
  bobNode.setAttribute(
    "transform",
    `translate(${scenario.bob.x} ${scenario.bob.y})`,
  );
  eveNode.setAttribute(
    "transform",
    `translate(${scenario.eve.x} ${scenario.eve.y})`,
  );
  bobNode.classList.toggle("is-active", metrics.bobCovered);
  eveNode.classList.toggle("is-active", metrics.eveListening);

  renderReflectors(metrics);
  pathLayer.replaceChildren();
  addPath(scenario.bob, metrics.bob, "bob-path");
  addPath(scenario.eve, metrics.eve, "eve-path");

  const roundedHeading = Math.round(normalizeAngle(heading)) % 360;
  bearingOutput.textContent = `${roundedHeading}°`;
  bobOutput.textContent = qualityLabel(
    metrics.bob.quality,
    metrics.bobCovered,
    "Covered",
    "有效覆盖",
    "Weak",
    "信号较弱",
  );
  eveOutput.textContent = qualityLabel(
    metrics.eve.quality,
    metrics.eveListening,
    "Intercepting",
    "正在窃听",
    "Quiet",
    "保持静默",
  );
  scoreOutput.textContent = `${metrics.score}`;
  scoreOutput.setAttribute(
    "aria-label",
    text(
      `Secrecy score: ${metrics.score} out of 100`,
      `保密得分：${metrics.score}，满分 100`,
    ),
  );
  bobOutput.setAttribute(
    "aria-label",
    text(
      `Bob link: ${bobOutput.textContent}`,
      `Bob 链路：${bobOutput.textContent}`,
    ),
  );
  eveOutput.setAttribute(
    "aria-label",
    text(
      `Eve link: ${eveOutput.textContent}`,
      `Eve 链路：${eveOutput.textContent}`,
    ),
  );

  statusOutput.textContent = statusText(metrics);
  statusOutput.dataset.state = metrics.secure
    ? "secure"
    : metrics.eveListening
      ? "exposed"
      : "weak";
  field.dataset.angle = String(roundedHeading);
  field.dataset.optimizing = String(optimizing);
  field.dataset.bobCovered = String(metrics.bobCovered);
  field.dataset.eveListening = String(metrics.eveListening);
  field.dataset.secure = String(metrics.secure);
  field.setAttribute("aria-valuenow", String(roundedHeading));
  field.setAttribute(
    "aria-valuetext",
    text(
      `${roundedHeading} degrees. Bob ${metrics.bobCovered ? "covered" : "weak"}; Eve ${metrics.eveListening ? "intercepting" : "quiet"}.`,
      `${roundedHeading} 度。Bob ${metrics.bobCovered ? "有效覆盖" : "信号较弱"}；Eve ${metrics.eveListening ? "正在窃听" : "保持静默"}。`,
    ),
  );

  randomizeButton.disabled = optimizing;
  optimizeButton.disabled = optimizing;
  optimizeButton.textContent = optimizing
    ? text("Searching…", "搜索中…")
    : text("Find best bearing", "搜索最佳方位");
  randomizeButton.textContent = text("New scene", "随机场景");
}

function makeTarget() {
  return {
    x: Math.round(randomBetween(248, 324)),
    y: Math.round(randomBetween(38, 174)),
  };
}

function newScenario() {
  scenarioNumber += 1;
  const bob = makeTarget();
  let eve = makeTarget();
  for (let attempts = 0; attempts < 30; attempts += 1) {
    const separated = distanceBetween(bob, eve) >= 52;
    const angleGap =
      angularDistance(angleTo(ALICE, bob), angleTo(ALICE, eve)) >= 10;
    if (separated && angleGap) break;
    eve = makeTarget();
  }

  const reflectorCount = Math.random() < 0.52 ? 1 : 2;
  const reflectors = [];
  for (
    let attempts = 0;
    reflectors.length < reflectorCount && attempts < 160;
    attempts += 1
  ) {
    const candidate = {
      x: Math.round(randomBetween(126, 228)),
      y: Math.round(randomBetween(34, 176)),
      angle: Math.round(randomBetween(0, 179)),
      strength: randomBetween(0.52, 0.72),
    };
    const clearOfTargets =
      distanceBetween(candidate, bob) > 46 &&
      distanceBetween(candidate, eve) > 46;
    const clearOfPanels = reflectors.every(
      (reflector) => distanceBetween(candidate, reflector) > 48,
    );
    if (clearOfTargets && clearOfPanels) reflectors.push(candidate);
  }
  const fallbacks = [
    { x: 145, y: 45, angle: 35, strength: 0.6 },
    { x: 195, y: 168, angle: 140, strength: 0.6 },
  ];
  while (reflectors.length < reflectorCount)
    reflectors.push(fallbacks[reflectors.length]);

  scenario = { bob, eve, reflectors };
  heading = normalizeAngle(angleTo(ALICE, bob) + randomBetween(-42, 42));
  field.dataset.config = JSON.stringify({
    scene: scenarioNumber,
    bob: [bob.x, bob.y],
    eve: [eve.x, eve.y],
    reflectors: reflectors.map(({ x, y, angle }) => [x, y, angle]),
  });
}

function cancelOptimization() {
  window.cancelAnimationFrame(optimizationFrame);
  optimizationFrame = 0;
  optimizing = false;
}

function setHeading(nextHeading, action = "manual") {
  if (action === "manual") cancelOptimization();
  heading = normalizeAngle(nextHeading);
  lastAction = action;
  render();
}

function bestBearing() {
  let best = { angle: 0, rank: -Infinity };
  for (let angle = 0; angle < 360; angle += 2) {
    const metrics = evaluate(angle);
    const rank =
      (metrics.secure ? 240 : 0) +
      (metrics.bobCovered ? 55 : 0) +
      metrics.score +
      metrics.margin * 35;
    if (rank > best.rank) best = { angle, rank };
  }
  return best.angle;
}

function finishOptimization() {
  window.cancelAnimationFrame(optimizationFrame);
  optimizationFrame = 0;
  heading = optimizationTarget;
  optimizing = false;
  lastAction = "optimized";
  field.dataset.bestAngle = String(Math.round(optimizationTarget));
  render();
}

function optimizeBearing() {
  cancelOptimization();
  const startingHeading = heading;
  optimizationTarget = bestBearing();
  optimizing = true;
  lastAction = "optimizing";
  render();

  if (reducedMotion.matches) {
    finishOptimization();
    return;
  }

  const startedAt = performance.now();
  const duration = 920;
  const settleTurn = shortestTurn(startingHeading, optimizationTarget);

  function animate(now) {
    const progress = clamp((now - startedAt) / duration);
    if (progress < 0.72) {
      const sweep = 1 - (1 - progress / 0.72) ** 3;
      heading = normalizeAngle(startingHeading + sweep * 360);
    } else {
      const settle = (progress - 0.72) / 0.28;
      const eased = 1 - (1 - settle) ** 3;
      heading = normalizeAngle(startingHeading + settleTurn * eased);
    }
    render();
    if (progress < 1) {
      optimizationFrame = window.requestAnimationFrame(animate);
    } else {
      finishOptimization();
    }
  }

  optimizationFrame = window.requestAnimationFrame(animate);
}

function scenePoint(event) {
  const point = scene.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  const matrix = scene.getScreenCTM();
  return matrix ? point.matrixTransform(matrix.inverse()) : ALICE;
}

function aimFromPointer(event) {
  const point = scenePoint(event);
  setHeading(angleTo(ALICE, point));
}

field.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  dragging = true;
  field.setPointerCapture(event.pointerId);
  aimFromPointer(event);
});

field.addEventListener("pointermove", (event) => {
  if (!dragging) return;
  aimFromPointer(event);
});

field.addEventListener("pointerup", (event) => {
  dragging = false;
  if (field.hasPointerCapture(event.pointerId))
    field.releasePointerCapture(event.pointerId);
});

field.addEventListener("pointercancel", () => {
  dragging = false;
});

field.addEventListener("keydown", (event) => {
  const step = event.shiftKey ? 12 : 3;
  const changes = {
    ArrowLeft: -step,
    ArrowDown: -step,
    ArrowRight: step,
    ArrowUp: step,
    Home: -heading,
    End: 359 - heading,
  };
  if (!(event.key in changes)) return;
  event.preventDefault();
  setHeading(heading + changes[event.key]);
});

randomizeButton.addEventListener("click", () => {
  cancelOptimization();
  newScenario();
  lastAction = "randomized";
  render();
});

optimizeButton.addEventListener("click", optimizeBearing);

document.addEventListener("visibilitychange", () => {
  if (document.hidden && optimizing) finishOptimization();
});

reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches && optimizing) finishOptimization();
});

window.PocketRuntime.onChange(render);
newScenario();
render();
