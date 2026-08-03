const SVG_NS = 'http://www.w3.org/2000/svg';
const ALICE = Object.freeze({ x: 50, y: 105 });
const ROOM = Object.freeze({ left: 4, right: 356, top: 4, bottom: 206 });
const WALLS = [
  ['left', 'x', ROOM.left],
  ['right', 'x', ROOM.right],
  ['top', 'y', ROOM.top],
  ['bottom', 'y', ROOM.bottom],
].map(([id, axis, coordinate]) => ({ id, axis, coordinate }));
const WALL_COEFFICIENT = 0.46;
const BEAM_WIDTH = 17;
const PANEL_OUTPUT_WIDTH = 21;
const SIMULATED_WAVELENGTH = 36;
const SNR_SCALE = 84;
const CODEWORD_RATE = 1.6;
const REDUNDANCY_RATE = 0.8;

const field = document.querySelector('#field');
const scene = document.querySelector('#scene');
const beam = document.querySelector('#beam');
const beamAxis = document.querySelector('#beam-axis');
const antenna = document.querySelector('#antenna');
const reflectionLayer = document.querySelector('#reflection-layer');
const pathLayer = document.querySelector('#path-layer');
const bobNode = document.querySelector('#bob-node');
const eveNode = document.querySelector('#eve-node');
const bearingOutput = document.querySelector('#bearing');
const bobOutput = document.querySelector('#bob-link');
const eveOutput = document.querySelector('#eve-link');
const secrecyRateOutput = document.querySelector('#secrecy-rate');
const statusOutput = document.querySelector('#status');
const wallToggle = document.querySelector('#wall-mode');
const randomizeButton = document.querySelector('#randomize');
const optimizeButton = document.querySelector('#optimize');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let scenarioNumber = 0;
let scenario = null;
let heading = 0;
let dragging = false;
let wallsEnabled = false;
let optimizing = false;
let optimizationFrame = 0;
let optimizationResult = null;
let lastAction = 'initial';

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
  return normalizeAngle((Math.atan2(second.y - first.y, second.x - first.x) * 180) / Math.PI);
}

function angularDistance(first, second) {
  const distance = Math.abs(normalizeAngle(first) - normalizeAngle(second));
  return Math.min(distance, 360 - distance);
}

function shortestTurn(first, second) {
  return ((normalizeAngle(second) - normalizeAngle(first) + 540) % 360) - 180;
}

function antennaPower(delta) {
  const mainLobe = Math.exp(-0.5 * (delta / BEAM_WIDTH) ** 2);
  return 0.008 + 0.992 * mainLobe;
}

function propagationPower(distance) {
  return (92 / (distance + 62)) ** 2;
}

function wedgePath(origin, angle, halfAngle, range) {
  const first = pointAt(origin, angle - halfAngle, range);
  const second = pointAt(origin, angle + halfAngle, range);
  return `M ${origin.x} ${origin.y} L ${first.x.toFixed(2)} ${first.y.toFixed(2)} A ${range} ${range} 0 0 1 ${second.x.toFixed(2)} ${second.y.toFixed(2)} Z`;
}

function pathComponent(power, length, phaseShift, details = {}) {
  return {
    ...details,
    power: Math.max(0, power),
    length,
    phase: (-2 * Math.PI * length) / SIMULATED_WAVELENGTH + phaseShift,
  };
}

function directComponent(target, angle) {
  const departureAngle = angleTo(ALICE, target);
  const length = distanceBetween(ALICE, target);
  const power = antennaPower(angularDistance(angle, departureAngle)) * propagationPower(length);
  return pathComponent(power, length, 0, { departureAngle });
}

function panelReflectionFor(target, reflector, angle) {
  const departureAngle = angleTo(ALICE, reflector);
  const illumination = antennaPower(angularDistance(angle, departureAngle));
  const outgoingAngle = normalizeAngle(2 * reflector.angle - departureAngle);
  const targetAngle = angleTo(reflector, target);
  const outgoingPower = Math.exp(
    -0.5 * (angularDistance(targetAngle, outgoingAngle) / PANEL_OUTPUT_WIDTH) ** 2,
  );
  const length = distanceBetween(ALICE, reflector) + distanceBetween(reflector, target);
  const power = illumination * outgoingPower * propagationPower(length) * reflector.strength ** 2;
  return pathComponent(power, length, reflector.phaseShift, {
    departureAngle,
    gain: power,
    illumination,
    outgoingAngle,
  });
}

function mirrorTarget(target, wall) {
  if (wall.axis === 'x') {
    return { x: 2 * wall.coordinate - target.x, y: target.y };
  }
  return { x: target.x, y: 2 * wall.coordinate - target.y };
}

function wallBouncePoint(target, wall) {
  const mirrored = mirrorTarget(target, wall);
  if (wall.axis === 'x') {
    const t = (wall.coordinate - ALICE.x) / (mirrored.x - ALICE.x);
    return {
      x: wall.coordinate,
      y: ALICE.y + t * (mirrored.y - ALICE.y),
    };
  }
  const t = (wall.coordinate - ALICE.y) / (mirrored.y - ALICE.y);
  return {
    x: ALICE.x + t * (mirrored.x - ALICE.x),
    y: wall.coordinate,
  };
}

function wallReflectionFor(target, wall, angle) {
  const bounce = wallBouncePoint(target, wall);
  const departureAngle = angleTo(ALICE, bounce);
  const illumination = antennaPower(angularDistance(angle, departureAngle));
  const length = distanceBetween(ALICE, bounce) + distanceBetween(bounce, target);
  const power = illumination * propagationPower(length) * WALL_COEFFICIENT ** 2;
  return pathComponent(power, length, Math.PI, {
    wallId: wall.id,
    bounce,
    departureAngle,
    gain: power,
    illumination,
  });
}

function combineComponents(components) {
  let real = 0;
  let imaginary = 0;
  for (const component of components) {
    const amplitude = Math.sqrt(component.power);
    real += amplitude * Math.cos(component.phase);
    imaginary += amplitude * Math.sin(component.phase);
  }
  const receivedPower = real ** 2 + imaginary ** 2;
  const snr = SNR_SCALE * receivedPower;
  return {
    receivedPower,
    snr,
    rate: Math.log2(1 + snr),
  };
}

function linkMetrics(target, angle) {
  const direct = directComponent(target, angle);
  const panelReflections = scenario.reflectors.map((reflector) =>
    panelReflectionFor(target, reflector, angle),
  );
  const wallReflections = wallsEnabled
    ? WALLS.map((wall) => wallReflectionFor(target, wall, angle))
    : [];
  const combined = combineComponents([direct, ...panelReflections, ...wallReflections]);
  return { ...combined, direct, panelReflections, wallReflections };
}

function evaluate(angle) {
  const bob = linkMetrics(scenario.bob, angle);
  const eve = linkMetrics(scenario.eve, angle);
  const bobCovered = bob.rate >= CODEWORD_RATE;
  const eveListening = eve.rate > REDUNDANCY_RATE;
  const secrecyRate = Math.max(bob.rate - eve.rate, 0);
  return {
    bob,
    eve,
    bobCovered,
    eveListening,
    secure: bobCovered && !eveListening,
    secrecyRate,
  };
}

function createSvgElement(name, className) {
  const element = document.createElementNS(SVG_NS, name);
  if (className) element.setAttribute('class', className);
  return element;
}

function setLine(line, start, end) {
  line.setAttribute('x1', start.x.toFixed(2));
  line.setAttribute('y1', start.y.toFixed(2));
  line.setAttribute('x2', end.x.toFixed(2));
  line.setAttribute('y2', end.y.toFixed(2));
}

function renderReflectors(metrics) {
  reflectionLayer.replaceChildren();
  scenario.reflectors.forEach((reflector, index) => {
    const incoming = metrics.bob.panelReflections[index];
    const outgoingEnd = pointAt(reflector, incoming.outgoingAngle, 230);
    const panelStart = pointAt(reflector, reflector.angle, -13);
    const panelEnd = pointAt(reflector, reflector.angle, 13);

    const group = createSvgElement('g', 'reflection-group');
    const coverage = createSvgElement('path', 'reflection-beam');
    coverage.setAttribute(
      'd',
      wedgePath(reflector, incoming.outgoingAngle, PANEL_OUTPUT_WIDTH, 230),
    );
    coverage.style.opacity = String(0.1 + incoming.illumination * 0.45);

    const input = createSvgElement('line', 'reflection-input');
    setLine(input, ALICE, reflector);
    input.style.opacity = String(0.1 + incoming.illumination * 0.5);

    const axis = createSvgElement('line', 'reflection-axis');
    setLine(axis, reflector, outgoingEnd);
    axis.style.opacity = String(0.12 + incoming.illumination * 0.46);

    const panel = createSvgElement('line', 'reflector');
    setLine(panel, panelStart, panelEnd);
    const dot = createSvgElement('circle', 'reflector-dot');
    dot.setAttribute('cx', reflector.x);
    dot.setAttribute('cy', reflector.y);
    dot.setAttribute('r', '4');
    const label = createSvgElement('text', 'reflector-label');
    label.setAttribute('x', reflector.x);
    label.setAttribute('y', reflector.y - 12);
    label.textContent = `R${index + 1}`;

    group.append(coverage, input, axis, panel, dot, label);
    reflectionLayer.append(group);
  });
}

function strongestPanelReflection(link) {
  let bestIndex = -1;
  let bestGain = 0;
  link.panelReflections.forEach(({ gain }, index) => {
    if (gain > bestGain) {
      bestGain = gain;
      bestIndex = index;
    }
  });
  return { index: bestIndex, gain: bestGain };
}

function pathOpacity(power, minimum = 0.1) {
  return clamp(minimum + Math.sqrt(power) * 1.65, minimum, 0.86);
}

function addPaths(target, link, className) {
  const direct = createSvgElement('line', `link-path direct ${className}`);
  setLine(direct, ALICE, target);
  direct.style.opacity = String(pathOpacity(link.direct.power, 0.08));
  pathLayer.append(direct);

  const strongest = strongestPanelReflection(link);
  if (strongest.gain >= 0.0005) {
    const reflector = scenario.reflectors[strongest.index];
    const reflected = createSvgElement(
      'polyline',
      `link-path reflected panel-link-path ${className}`,
    );
    reflected.setAttribute(
      'points',
      `${ALICE.x},${ALICE.y} ${reflector.x.toFixed(2)},${reflector.y.toFixed(2)} ${target.x.toFixed(2)},${target.y.toFixed(2)}`,
    );
    reflected.style.opacity = String(pathOpacity(strongest.gain, 0.12));
    pathLayer.append(reflected);
  }

  for (const reflection of link.wallReflections) {
    const reflected = createSvgElement(
      'polyline',
      `link-path reflected wall-link-path ${className} wall-${reflection.wallId}`,
    );
    reflected.setAttribute(
      'points',
      `${ALICE.x},${ALICE.y} ${reflection.bounce.x.toFixed(2)},${reflection.bounce.y.toFixed(2)} ${target.x.toFixed(2)},${target.y.toFixed(2)}`,
    );
    reflected.dataset.wall = reflection.wallId;
    reflected.style.opacity = String(pathOpacity(reflection.power, 0.09));
    pathLayer.append(reflected);
  }
}

function linkLabel(rate, active, activeEnglish, activeChinese, quietEnglish, quietChinese) {
  const state = active ? text(activeEnglish, activeChinese) : text(quietEnglish, quietChinese);
  return `${state} · ${rate.toFixed(2)} bit/s/Hz`;
}

function statusText(metrics) {
  if (optimizing) {
    return text(
      'Scanning all bearings for maximum secrecy rate…',
      '正在扫描全部方位，搜索最高保密速率…',
    );
  }
  if (lastAction === 'optimized') {
    return text(
      `Maximum found: Rₛ = ${metrics.secrecyRate.toFixed(2)} bit/s/Hz.`,
      `搜索完成：最高保密速率为 ${metrics.secrecyRate.toFixed(2)} bit/s/Hz。`,
    );
  }
  if (lastAction === 'walls') {
    return wallsEnabled
      ? text(
          'Four-wall multipath on: reflections can reinforce or cancel.',
          '已启用四墙多径：反射信号可能相长或相消。',
        )
      : text(
          'Four-wall multipath off; reflector paths remain.',
          '已关闭四墙多径；反射板仍然生效。',
        );
  }
  if (lastAction === 'randomized') {
    return text(
      'New channel ready. Steer Alice or run the search.',
      '新信道已生成，可手动调节波束或直接搜索。',
    );
  }
  if (metrics.secure) {
    return text(
      "Secure conditions met: Bob's achievable rate meets the codeword rate; Eve stays below redundancy.",
      '安全传输条件满足：Bob 的可达速率达到码字传输速率，Eve 的可达速率低于冗余速率。',
    );
  }
  if (!metrics.bobCovered) {
    return text(
      "Bob's achievable rate is below the codeword rate. Steer toward a stronger path.",
      'Bob 的可达速率低于码字传输速率，请调整波束以增强链路。',
    );
  }
  if (metrics.eveListening) {
    return text(
      "Eve's achievable rate exceeds the redundancy rate. Increase the Bob–Eve gap.",
      'Eve 的可达速率已超过冗余速率，请扩大 Bob 与 Eve 的速率差。',
    );
  }
  return text(
    'The secrecy rate is positive, but a link constraint still fails.',
    '保密速率为正，但仍有一项链路判据未满足。',
  );
}

function wallReflectionData(metrics) {
  const compact = (receiver, reflection) => ({
    receiver,
    wall: reflection.wallId,
    bounce: [Number(reflection.bounce.x.toFixed(3)), Number(reflection.bounce.y.toFixed(3))],
    power: Number(reflection.power.toFixed(8)),
  });
  return [
    ...metrics.bob.wallReflections.map((reflection) => compact('bob', reflection)),
    ...metrics.eve.wallReflections.map((reflection) => compact('eve', reflection)),
  ];
}

function render() {
  const metrics = evaluate(heading);
  const beamEnd = pointAt(ALICE, heading, 330);

  beam.setAttribute('d', wedgePath(ALICE, heading, BEAM_WIDTH, 330));
  setLine(beamAxis, ALICE, beamEnd);
  antenna.setAttribute('transform', `rotate(${heading} 0 0)`);
  bobNode.setAttribute('transform', `translate(${scenario.bob.x} ${scenario.bob.y})`);
  eveNode.setAttribute('transform', `translate(${scenario.eve.x} ${scenario.eve.y})`);
  bobNode.classList.toggle('is-active', metrics.bobCovered);
  eveNode.classList.toggle('is-active', metrics.eveListening);

  renderReflectors(metrics);
  pathLayer.replaceChildren();
  addPaths(scenario.bob, metrics.bob, 'bob-path');
  addPaths(scenario.eve, metrics.eve, 'eve-path');

  const roundedHeading = Math.round(normalizeAngle(heading)) % 360;
  bearingOutput.textContent = `${roundedHeading}°`;
  bobOutput.textContent = linkLabel(
    metrics.bob.rate,
    metrics.bobCovered,
    'Codeword rate met',
    '满足码字传输速率',
    'Below codeword rate',
    '低于码字传输速率',
  );
  eveOutput.textContent = linkLabel(
    metrics.eve.rate,
    metrics.eveListening,
    'Eavesdropping risk',
    '存在窃听风险',
    'Below redundancy',
    '低于冗余速率',
  );
  secrecyRateOutput.textContent = metrics.secrecyRate.toFixed(2);
  secrecyRateOutput.setAttribute(
    'aria-label',
    text(
      `Secrecy rate: ${metrics.secrecyRate.toFixed(2)} bits per second per hertz`,
      `保密速率：${metrics.secrecyRate.toFixed(2)} 比特每秒每赫兹`,
    ),
  );
  bobOutput.setAttribute(
    'aria-label',
    text(`Bob link: ${bobOutput.textContent}`, `Bob 链路：${bobOutput.textContent}`),
  );
  eveOutput.setAttribute(
    'aria-label',
    text(`Eve link: ${eveOutput.textContent}`, `Eve 链路：${eveOutput.textContent}`),
  );

  statusOutput.textContent = statusText(metrics);
  statusOutput.dataset.state = metrics.secure
    ? 'secure'
    : metrics.eveListening
      ? 'exposed'
      : 'weak';

  field.dataset.objective = 'secrecy-rate';
  field.dataset.angle = String(roundedHeading);
  field.dataset.optimizing = String(optimizing);
  field.dataset.walls = String(wallsEnabled);
  field.dataset.wallReflectionCount = String(
    metrics.bob.wallReflections.length + metrics.eve.wallReflections.length,
  );
  field.dataset.wallReflections = JSON.stringify(wallReflectionData(metrics));
  field.dataset.bobSnr = metrics.bob.snr.toFixed(8);
  field.dataset.eveSnr = metrics.eve.snr.toFixed(8);
  field.dataset.bobRate = metrics.bob.rate.toFixed(8);
  field.dataset.eveRate = metrics.eve.rate.toFixed(8);
  field.dataset.secrecyRate = metrics.secrecyRate.toFixed(8);
  field.dataset.codewordRate = String(CODEWORD_RATE);
  field.dataset.redundancyRate = String(REDUNDANCY_RATE);
  field.dataset.bobCovered = String(metrics.bobCovered);
  field.dataset.eveListening = String(metrics.eveListening);
  field.dataset.secure = String(metrics.secure);
  field.setAttribute('aria-valuenow', String(roundedHeading));
  field.setAttribute(
    'aria-valuetext',
    text(
      `${roundedHeading} degrees. Secrecy rate ${metrics.secrecyRate.toFixed(2)}. Bob ${metrics.bobCovered ? 'meets the codeword rate' : 'is below the codeword rate'}; Eve ${metrics.eveListening ? 'has eavesdropping risk' : 'is below redundancy'}.`,
      `${roundedHeading} 度。保密速率 ${metrics.secrecyRate.toFixed(2)}。Bob ${metrics.bobCovered ? '满足码字传输速率' : '低于码字传输速率'}；Eve ${metrics.eveListening ? '存在窃听风险' : '低于冗余速率'}。`,
    ),
  );

  randomizeButton.disabled = optimizing;
  optimizeButton.disabled = optimizing;
  wallToggle.disabled = optimizing;
  optimizeButton.textContent = optimizing
    ? text('Searching…', '搜索中…')
    : text('Maximize secrecy rate', '最大化保密速率');
  randomizeButton.textContent = text('New scene', '随机场景');
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
    const angleGap = angularDistance(angleTo(ALICE, bob), angleTo(ALICE, eve)) >= 10;
    if (separated && angleGap) break;
    eve = makeTarget();
  }

  const reflectorCount = Math.random() < 0.52 ? 1 : 2;
  const reflectors = [];
  for (let attempts = 0; reflectors.length < reflectorCount && attempts < 160; attempts += 1) {
    const candidate = {
      x: Math.round(randomBetween(126, 228)),
      y: Math.round(randomBetween(34, 176)),
      angle: Math.round(randomBetween(0, 179)),
      strength: randomBetween(0.52, 0.72),
      phaseShift: randomBetween(-Math.PI, Math.PI),
    };
    const clearOfTargets =
      distanceBetween(candidate, bob) > 46 && distanceBetween(candidate, eve) > 46;
    const clearOfPanels = reflectors.every(
      (reflector) => distanceBetween(candidate, reflector) > 48,
    );
    if (clearOfTargets && clearOfPanels) reflectors.push(candidate);
  }
  const fallbacks = [
    { x: 145, y: 45, angle: 35, strength: 0.6, phaseShift: 0.7 },
    { x: 195, y: 168, angle: 140, strength: 0.6, phaseShift: -1.1 },
  ];
  while (reflectors.length < reflectorCount) {
    reflectors.push(fallbacks[reflectors.length]);
  }

  scenario = { bob, eve, reflectors };
  heading = normalizeAngle(angleTo(ALICE, bob) + randomBetween(-42, 42));
  field.dataset.config = JSON.stringify({
    scene: scenarioNumber,
    bob: [bob.x, bob.y],
    eve: [eve.x, eve.y],
    reflectors: reflectors.map(({ x, y, angle, phaseShift }) => [
      x,
      y,
      angle,
      Number(phaseShift.toFixed(4)),
    ]),
  });
}

function clearBestResult() {
  optimizationResult = null;
  delete field.dataset.bestAngle;
  delete field.dataset.bestSecrecyRate;
}

function cancelOptimization() {
  window.cancelAnimationFrame(optimizationFrame);
  optimizationFrame = 0;
  optimizing = false;
}

function setHeading(nextHeading, action = 'manual') {
  if (action === 'manual') {
    cancelOptimization();
    clearBestResult();
  }
  heading = normalizeAngle(nextHeading);
  lastAction = action;
  render();
}

function betterCandidate(candidate, best) {
  if (!best) return true;
  if (Math.abs(candidate.secrecyRate - best.secrecyRate) > 1e-9) {
    return candidate.secrecyRate > best.secrecyRate;
  }
  if (Math.abs(candidate.bob.rate - best.bob.rate) > 1e-9) {
    return candidate.bob.rate > best.bob.rate;
  }
  if (Math.abs(candidate.eve.rate - best.eve.rate) > 1e-9) {
    return candidate.eve.rate < best.eve.rate;
  }
  return candidate.angle < best.angle;
}

function bestBearing() {
  let best = null;
  for (let angle = 0; angle < 360; angle += 1) {
    const metrics = evaluate(angle);
    const candidate = { angle, ...metrics };
    if (betterCandidate(candidate, best)) best = candidate;
  }
  return best;
}

function finishOptimization() {
  window.cancelAnimationFrame(optimizationFrame);
  optimizationFrame = 0;
  if (!optimizationResult) return;
  heading = optimizationResult.angle;
  optimizing = false;
  lastAction = 'optimized';
  field.dataset.bestAngle = String(optimizationResult.angle);
  field.dataset.bestSecrecyRate = optimizationResult.secrecyRate.toFixed(8);
  render();
}

function optimizeBearing() {
  cancelOptimization();
  clearBestResult();
  const startingHeading = heading;
  optimizationResult = bestBearing();
  optimizing = true;
  lastAction = 'optimizing';
  render();

  if (reducedMotion.matches) {
    finishOptimization();
    return;
  }

  const startedAt = performance.now();
  const duration = 920;
  const settleTurn = shortestTurn(startingHeading, optimizationResult.angle);

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
  setHeading(angleTo(ALICE, scenePoint(event)));
}

field.addEventListener('pointerdown', (event) => {
  if (event.button !== 0) return;
  dragging = true;
  field.setPointerCapture(event.pointerId);
  aimFromPointer(event);
});

field.addEventListener('pointermove', (event) => {
  if (dragging) aimFromPointer(event);
});

field.addEventListener('pointerup', (event) => {
  dragging = false;
  if (field.hasPointerCapture(event.pointerId)) {
    field.releasePointerCapture(event.pointerId);
  }
});

field.addEventListener('pointercancel', () => {
  dragging = false;
});

field.addEventListener('keydown', (event) => {
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

wallToggle.addEventListener('change', () => {
  cancelOptimization();
  clearBestResult();
  wallsEnabled = wallToggle.checked;
  lastAction = 'walls';
  render();
});

randomizeButton.addEventListener('click', () => {
  cancelOptimization();
  clearBestResult();
  newScenario();
  lastAction = 'randomized';
  render();
});

optimizeButton.addEventListener('click', optimizeBearing);

document.addEventListener('visibilitychange', () => {
  if (document.hidden && optimizing) finishOptimization();
});

reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches && optimizing) finishOptimization();
});

window.PocketRuntime.onChange(render);
wallToggle.checked = false;
newScenario();
render();
