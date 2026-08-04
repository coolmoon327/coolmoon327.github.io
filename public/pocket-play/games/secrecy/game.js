const SVG_NS = 'http://www.w3.org/2000/svg';
const ALICE = Object.freeze({ x: 50, y: 105 });
const ROOM = Object.freeze({ left: 4, right: 356, top: 4, bottom: 206 });
const VIEWBOX = Object.freeze({ width: 360, height: 210 });
const REFLECTION_MODEL = 'lossy-specular';
const POWER_COMBINATION = 'incoherent';
const REFLECTION_COEFFICIENT = 0.46;
const REFLECTION_POWER = REFLECTION_COEFFICIENT ** 2;
const MAX_BOUNCES = 3;
const DB_FLOOR = -36;
const DB_CEILING = 0;
const HEATMAP_WIDTH = 120;
const HEATMAP_HEIGHT = 70;
const BEAM_WIDTH = 17;
const SNR_SCALE = 84;
const CODEWORD_RATE = 1.6;
const REDUNDANCY_RATE = 0.8;
const EPSILON = 1e-6;

const makeSurface = (id, kind, a, b) => ({ id, kind, a, b });
const WALLS = Object.freeze([
  makeSurface('wall-left', 'wall', { x: ROOM.left, y: ROOM.top }, { x: ROOM.left, y: ROOM.bottom }),
  makeSurface('wall-right', 'wall', { x: ROOM.right, y: ROOM.top }, { x: ROOM.right, y: ROOM.bottom }),
  makeSurface('wall-top', 'wall', { x: ROOM.left, y: ROOM.top }, { x: ROOM.right, y: ROOM.top }),
  makeSurface('wall-bottom', 'wall', { x: ROOM.left, y: ROOM.bottom }, { x: ROOM.right, y: ROOM.bottom }),
]);

const field = document.querySelector('#field');
const scene = document.querySelector('#scene');
const heatmap = document.querySelector('#energy-map');
const heatmapContext = heatmap.getContext('2d', { alpha: false, willReadFrequently: true });
const antenna = document.querySelector('#antenna');
const surfaceLayer = document.querySelector('#surface-layer');
const bobNode = document.querySelector('#bob-node');
const eveNode = document.querySelector('#eve-node');
const bearingOutput = document.querySelector('#bearing');
const bobEnergyOutput = document.querySelector('#bob-energy');
const eveEnergyOutput = document.querySelector('#eve-energy');
const bobOutput = document.querySelector('#bob-link');
const eveOutput = document.querySelector('#eve-link');
const secrecyRateOutput = document.querySelector('#secrecy-rate');
const statusOutput = document.querySelector('#status');
const wallToggle = document.querySelector('#wall-mode');
const randomizeButton = document.querySelector('#randomize');
const optimizeButton = document.querySelector('#optimize');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

heatmap.width = HEATMAP_WIDTH;
heatmap.height = HEATMAP_HEIGHT;

let scenarioNumber = 0;
let scenario = null;
let heading = 0;
let dragging = false;
let wallsEnabled = false;
let optimizing = false;
let optimizationFrame = 0;
let optimizationResult = null;
let lastAction = 'initial';
let heatmapRevision = 0;
let propagationCache = { bob: [], eve: [], grid: [] };
let deterministicFixture = null;

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

function interpolate(first, second, amount) {
  return {
    x: first.x + (second.x - first.x) * amount,
    y: first.y + (second.y - first.y) * amount,
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

function powerToDb(power) {
  return 10 * Math.log10(Math.max(power, 1e-12));
}

function formatDb(db) {
  if (db <= DB_FLOOR) return `≤ −${Math.abs(DB_FLOOR)} dB`;
  return `${db.toFixed(1).replace('-', '−')} dB`;
}

function cross(first, second) {
  return first.x * second.y - first.y * second.x;
}

function subtract(first, second) {
  return { x: first.x - second.x, y: first.y - second.y };
}

function surfaceSide(surface, point) {
  return cross(subtract(surface.b, surface.a), subtract(point, surface.a));
}

function reflectPoint(point, surface) {
  const direction = subtract(surface.b, surface.a);
  const lengthSquared = direction.x ** 2 + direction.y ** 2;
  const offset = subtract(point, surface.a);
  const projection = (offset.x * direction.x + offset.y * direction.y) / lengthSquared;
  const foot = {
    x: surface.a.x + projection * direction.x,
    y: surface.a.y + projection * direction.y,
  };
  return { x: 2 * foot.x - point.x, y: 2 * foot.y - point.y };
}

function segmentIntersection(start, end, surface) {
  const ray = subtract(end, start);
  const edge = subtract(surface.b, surface.a);
  const denominator = cross(ray, edge);
  if (Math.abs(denominator) < EPSILON) return null;
  const offset = subtract(surface.a, start);
  const t = cross(offset, edge) / denominator;
  const u = cross(offset, ray) / denominator;
  return {
    t,
    u,
    point: { x: start.x + t * ray.x, y: start.y + t * ray.y },
  };
}

function segmentIsClear(start, end, blockers) {
  for (const surface of blockers) {
    const hit = segmentIntersection(start, end, surface);
    if (hit && hit.t > 1e-5 && hit.t < 1 - 1e-5 && hit.u > -EPSILON && hit.u < 1 + EPSILON) {
      return false;
    }
  }
  return true;
}

function pathFromSequence(target, sequence, blockers) {
  const images = [ALICE];
  for (const surface of sequence) {
    images.push(reflectPoint(images.at(-1), surface));
  }

  const bounces = new Array(sequence.length);
  let currentTarget = target;
  for (let index = sequence.length - 1; index >= 0; index -= 1) {
    const hit = segmentIntersection(images[index + 1], currentTarget, sequence[index]);
    if (!hit || hit.t <= EPSILON || hit.t >= 1 - EPSILON || hit.u <= 0.002 || hit.u >= 0.998) {
      return null;
    }
    bounces[index] = hit.point;
    currentTarget = hit.point;
  }

  const points = [ALICE, ...bounces, target];
  for (let index = 0; index < bounces.length; index += 1) {
    const firstSide = surfaceSide(sequence[index], points[index]);
    const secondSide = surfaceSide(sequence[index], points[index + 2]);
    if (firstSide * secondSide <= EPSILON) return null;
  }
  for (let index = 0; index < points.length - 1; index += 1) {
    if (!segmentIsClear(points[index], points[index + 1], blockers)) return null;
  }

  let length = 0;
  for (let index = 0; index < points.length - 1; index += 1) {
    length += distanceBetween(points[index], points[index + 1]);
  }
  return {
    bounces: sequence.length,
    surfaces: sequence.map((surface) => surface.id),
    points,
    length,
    departureAngle: angleTo(ALICE, points[1]),
    basePower: propagationPower(length) * REFLECTION_POWER ** sequence.length,
  };
}

function enumeratePathsFor(target, obstacles, includeWalls) {
  const surfaces = includeWalls ? [...obstacles, ...WALLS] : [...obstacles];
  const paths = [];
  if (segmentIsClear(ALICE, target, surfaces)) {
    const length = distanceBetween(ALICE, target);
    paths.push({
      bounces: 0,
      surfaces: [],
      points: [ALICE, target],
      length,
      departureAngle: angleTo(ALICE, target),
      basePower: propagationPower(length),
    });
  }

  const visit = (sequence) => {
    if (sequence.length > 0) {
      const path = pathFromSequence(target, sequence, surfaces);
      if (path) paths.push(path);
    }
    if (sequence.length === MAX_BOUNCES) return;
    for (const surface of surfaces) {
      if (sequence.at(-1)?.id === surface.id) continue;
      visit([...sequence, surface]);
    }
  };
  visit([]);
  return paths;
}

function enumeratePaths(target, includeWalls = wallsEnabled) {
  return enumeratePathsFor(target, scenario.obstacles, includeWalls);
}

function evaluatePaths(paths, angle) {
  let receivedPower = 0;
  let directPower = 0;
  for (const path of paths) {
    const power = path.basePower * antennaPower(angularDistance(angle, path.departureAngle));
    receivedPower += power;
    if (path.bounces === 0) directPower = power;
  }
  const snr = SNR_SCALE * receivedPower;
  return {
    receivedPower,
    receivedDb: powerToDb(receivedPower),
    directPower,
    directVisible: paths.some((path) => path.bounces === 0),
    pathCount: paths.length,
    maxBounces: paths.reduce((maximum, path) => Math.max(maximum, path.bounces), 0),
    snr,
    rate: Math.log2(1 + snr),
    paths,
  };
}

function evaluatePoint(point, angle = heading, includeWalls = wallsEnabled) {
  return evaluatePaths(enumeratePaths(point, includeWalls), normalizeAngle(angle));
}

function evaluate(angle) {
  const bob = evaluatePaths(propagationCache.bob, angle);
  const eve = evaluatePaths(propagationCache.eve, angle);
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

function gridPoint(column, row) {
  return {
    x: ((column + 0.5) / HEATMAP_WIDTH) * VIEWBOX.width,
    y: ((row + 0.5) / HEATMAP_HEIGHT) * VIEWBOX.height,
  };
}

function insideRoom(point) {
  return point.x > ROOM.left && point.x < ROOM.right && point.y > ROOM.top && point.y < ROOM.bottom;
}

function rebuildPropagationCache() {
  propagationCache = {
    bob: enumeratePaths(scenario.bob),
    eve: enumeratePaths(scenario.eve),
    grid: [],
  };
  for (let row = 0; row < HEATMAP_HEIGHT; row += 1) {
    for (let column = 0; column < HEATMAP_WIDTH; column += 1) {
      const point = gridPoint(column, row);
      propagationCache.grid.push(insideRoom(point) ? enumeratePaths(point) : []);
    }
  }
}

function paletteColor(amount) {
  const dark = document.documentElement.dataset.theme === 'dark';
  const background = dark ? [23, 27, 29] : [255, 255, 255];
  const blue = dark ? [96, 165, 250] : [37, 99, 235];
  const opacity = 0.26 * clamp(amount) ** 1.35;
  return background.map((value, index) =>
    Math.round(value + (blue[index] - value) * opacity),
  );
}

function renderHeatmap() {
  const image = heatmapContext.createImageData(HEATMAP_WIDTH, HEATMAP_HEIGHT);
  for (let index = 0; index < propagationCache.grid.length; index += 1) {
    const power = evaluatePaths(propagationCache.grid[index], heading).receivedPower;
    const db = clamp(powerToDb(power), DB_FLOOR, DB_CEILING);
    const [red, green, blue] = paletteColor((db - DB_FLOOR) / (DB_CEILING - DB_FLOOR));
    const offset = index * 4;
    image.data[offset] = red;
    image.data[offset + 1] = green;
    image.data[offset + 2] = blue;
    image.data[offset + 3] = 255;
  }
  heatmapContext.putImageData(image, 0, 0);
  heatmapRevision += 1;
  field.dataset.heatmapRevision = String(heatmapRevision);
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

function renderSurfaces() {
  surfaceLayer.replaceChildren();
  scenario.obstacles.forEach((surface, index) => {
    const line = createSvgElement('line', 'surface reflective-surface obstacle-surface');
    line.dataset.surface = surface.id;
    line.dataset.surfaceType = 'obstacle';
    setLine(line, surface.a, surface.b);
    const centre = interpolate(surface.a, surface.b, 0.5);
    const dot = createSvgElement('circle', 'reflector-dot');
    dot.setAttribute('cx', centre.x.toFixed(2));
    dot.setAttribute('cy', centre.y.toFixed(2));
    dot.setAttribute('r', '3.2');
    const label = createSvgElement('text', 'reflector-label');
    label.setAttribute('x', centre.x.toFixed(2));
    label.setAttribute('y', (centre.y - 11).toFixed(2));
    label.textContent = `R${index + 1}`;
    surfaceLayer.append(line, dot, label);
  });
}

function statusText(metrics) {
  if (optimizing) {
    return text('Scanning every azimuth for the highest secrecy rate…', '正在遍历全部方位角，搜索最高保密速率…');
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
          'Walls and obstacles now use the same opaque mirror model, with up to three reflections in total.',
          '墙面与障碍物现采用同一种不透射镜面模型，合计最多发生三次反射。',
        )
      : text(
          'Wall reflections are off; opaque obstacles still block and reflect the signal.',
          '墙面反射已关闭；不透射障碍物仍会遮挡并反射信号。',
        );
  }
  if (lastAction === 'randomized') {
    return text('A new room is ready. Steer Alice or run the search.', '新场景已生成，可手动调整 Alice 天线或直接运行搜索。');
  }
  if (metrics.secure) {
    return text(
      "Secure delivery: Bob meets the codeword rate while Eve stays below the redundancy rate.",
      '满足安全传输条件：Bob 的可达速率达到码字传输速率，Eve 的可达速率低于冗余速率。',
    );
  }
  if (!metrics.bobCovered) {
    return text(
      "Bob's achievable rate is below the codeword rate. Steer energy toward a viable reflected corridor.",
      'Bob 的可达速率低于码字传输速率，请把能量引向可用的直达或反射通道。',
    );
  }
  if (metrics.eveListening) {
    return text(
      "Eve's achievable rate exceeds the redundancy rate. Increase the Bob–Eve rate gap.",
      'Eve 的可达速率已超过冗余速率，请进一步扩大 Bob 与 Eve 的速率差。',
    );
  }
  return text('The secrecy rate is positive, but one link condition still fails.', '保密速率为正，但仍有一项链路条件未满足。');
}

function setNodeEnergy(node, receivedDb) {
  const strength = clamp((receivedDb - DB_FLOOR) / (DB_CEILING - DB_FLOOR));
  node.querySelector('.node-halo').style.opacity = String(0.28 + 0.72 * strength);
}

function render() {
  const metrics = evaluate(heading);
  const roundedHeading = Math.round(normalizeAngle(heading)) % 360;

  antenna.setAttribute('transform', `rotate(${heading} 0 0)`);
  bobNode.setAttribute('transform', `translate(${scenario.bob.x} ${scenario.bob.y})`);
  eveNode.setAttribute('transform', `translate(${scenario.eve.x} ${scenario.eve.y})`);
  bobNode.classList.toggle('is-active', metrics.bobCovered);
  eveNode.classList.toggle('is-active', metrics.eveListening);
  setNodeEnergy(bobNode, metrics.bob.receivedDb);
  setNodeEnergy(eveNode, metrics.eve.receivedDb);
  renderSurfaces();
  renderHeatmap();

  bearingOutput.textContent = `${roundedHeading}°`;
  bobEnergyOutput.textContent = formatDb(metrics.bob.receivedDb);
  eveEnergyOutput.textContent = formatDb(metrics.eve.receivedDb);
  bobOutput.textContent = `${metrics.bob.rate.toFixed(2)} bit/s/Hz`;
  eveOutput.textContent = `${metrics.eve.rate.toFixed(2)} bit/s/Hz`;
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
    text(
      `Bob ${metrics.bobCovered ? 'meets' : 'is below'} the codeword rate: ${bobOutput.textContent}`,
      `Bob ${metrics.bobCovered ? '达到' : '低于'}码字传输速率：${bobOutput.textContent}`,
    ),
  );
  eveOutput.setAttribute(
    'aria-label',
    text(
      `Eve ${metrics.eveListening ? 'has eavesdropping risk' : 'is below redundancy'}: ${eveOutput.textContent}`,
      `Eve ${metrics.eveListening ? '存在窃听风险' : '低于冗余速率'}：${eveOutput.textContent}`,
    ),
  );

  statusOutput.textContent = statusText(metrics);
  statusOutput.dataset.state = metrics.secure ? 'secure' : metrics.eveListening ? 'exposed' : 'weak';

  field.dataset.objective = 'secrecy-rate';
  field.dataset.reflectionModel = REFLECTION_MODEL;
  field.dataset.powerCombination = POWER_COMBINATION;
  field.dataset.maxBounces = String(MAX_BOUNCES);
  field.dataset.reflectionCoefficient = String(REFLECTION_COEFFICIENT);
  field.dataset.dbFloor = String(DB_FLOOR);
  field.dataset.heatmapWidth = String(HEATMAP_WIDTH);
  field.dataset.heatmapHeight = String(HEATMAP_HEIGHT);
  field.dataset.obstacleCount = String(scenario.obstacles.length);
  field.dataset.angle = String(roundedHeading);
  field.dataset.optimizing = String(optimizing);
  field.dataset.walls = String(wallsEnabled);
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
  field.dataset.bobDirectVisible = String(metrics.bob.directVisible);
  field.dataset.eveDirectVisible = String(metrics.eve.directVisible);
  field.dataset.bobPathCount = String(metrics.bob.pathCount);
  field.dataset.evePathCount = String(metrics.eve.pathCount);
  field.dataset.bobMaxBounces = String(metrics.bob.maxBounces);
  field.dataset.eveMaxBounces = String(metrics.eve.maxBounces);
  field.dataset.bobReceivedDb = metrics.bob.receivedDb.toFixed(6);
  field.dataset.eveReceivedDb = metrics.eve.receivedDb.toFixed(6);
  field.setAttribute('aria-valuenow', String(roundedHeading));
  field.setAttribute(
    'aria-valuetext',
    text(
      `${roundedHeading} degrees. Secrecy rate ${metrics.secrecyRate.toFixed(2)}. Bob energy ${metrics.bob.receivedDb.toFixed(1)} dB; Eve energy ${metrics.eve.receivedDb.toFixed(1)} dB.`,
      `${roundedHeading} 度。保密速率 ${metrics.secrecyRate.toFixed(2)}。Bob 接收能量 ${metrics.bob.receivedDb.toFixed(1)} dB；Eve 接收能量 ${metrics.eve.receivedDb.toFixed(1)} dB。`,
    ),
  );

  randomizeButton.disabled = optimizing;
  optimizeButton.disabled = optimizing;
  wallToggle.disabled = optimizing;
  optimizeButton.textContent = optimizing ? text('Searching…', '搜索中…') : text('Maximize secrecy rate', '最大化保密速率');
  randomizeButton.textContent = text('New scene', '随机场景');
}

function makeTarget() {
  return {
    x: Math.round(randomBetween(248, 324)),
    y: Math.round(randomBetween(38, 174)),
  };
}

function obstacleAcross(target, index) {
  const centre = interpolate(ALICE, target, randomBetween(0.48, 0.62));
  const angle = angleTo(ALICE, target) + 90 + randomBetween(-14, 14);
  const halfLength = randomBetween(18, 24);
  return makeSurface(`obstacle-${index}`, 'obstacle', pointAt(centre, angle, -halfLength), pointAt(centre, angle, halfLength));
}

function obstacleCentre(surface) {
  return interpolate(surface.a, surface.b, 0.5);
}

function randomObstacle(index, existing, targets) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const centre = { x: randomBetween(132, 226), y: randomBetween(30, 180) };
    const angle = randomBetween(0, 180);
    const halfLength = randomBetween(17, 24);
    const candidate = makeSurface(
      `obstacle-${index}`,
      'obstacle',
      pointAt(centre, angle, -halfLength),
      pointAt(centre, angle, halfLength),
    );
    const clearOfNodes = targets.every((target) => distanceBetween(centre, target) > 44);
    const clearOfSurfaces = existing.every((surface) => distanceBetween(centre, obstacleCentre(surface)) > 42);
    if (clearOfNodes && clearOfSurfaces && insideRoom(candidate.a) && insideRoom(candidate.b)) return candidate;
  }
  return makeSurface(
    `obstacle-${index}`,
    'obstacle',
    { x: 162, y: index === 2 ? 48 : 162 },
    { x: 202, y: index === 2 ? 72 : 138 },
  );
}

function publicScenario() {
  const copyPoint = (point) => ({ x: Number(point.x.toFixed(4)), y: Number(point.y.toFixed(4)) });
  return {
    alice: copyPoint(ALICE),
    bob: copyPoint(scenario.bob),
    eve: copyPoint(scenario.eve),
    obstacles: scenario.obstacles.map((surface) => ({
      id: surface.id,
      kind: surface.kind,
      a: copyPoint(surface.a),
      b: copyPoint(surface.b),
    })),
  };
}

function newScenario() {
  scenarioNumber += 1;
  const bob = makeTarget();
  let eve = makeTarget();
  for (let attempts = 0; attempts < 30; attempts += 1) {
    if (distanceBetween(bob, eve) >= 52 && angularDistance(angleTo(ALICE, bob), angleTo(ALICE, eve)) >= 10) break;
    eve = makeTarget();
  }

  const blockedTarget = Math.random() < 0.5 ? bob : eve;
  const obstacles = [obstacleAcross(blockedTarget, 1)];
  if (Math.random() < 0.52) obstacles.push(randomObstacle(2, obstacles, [ALICE, bob, eve]));
  scenario = { bob, eve, obstacles };
  heading = normalizeAngle(angleTo(ALICE, bob) + randomBetween(-42, 42));
  field.dataset.config = JSON.stringify({
    scene: scenarioNumber,
    bob: [bob.x, bob.y],
    eve: [eve.x, eve.y],
    obstacles: obstacles.map((surface) => [
      Number(surface.a.x.toFixed(3)),
      Number(surface.a.y.toFixed(3)),
      Number(surface.b.x.toFixed(3)),
      Number(surface.b.y.toFixed(3)),
    ]),
  });
  rebuildPropagationCache();
}

function summarizePaths(paths) {
  return {
    directVisible: paths.some((path) => path.bounces === 0),
    pathCount: paths.length,
    maxBounces: paths.reduce((maximum, path) => Math.max(maximum, path.bounces), 0),
    paths: paths.map((path) => ({
      bounces: path.bounces,
      surfaces: [...path.surfaces],
      departureAngle: Number(path.departureAngle.toFixed(4)),
      length: Number(path.length.toFixed(4)),
      segments: path.points.slice(0, -1).map((point, index) => [point, path.points[index + 1]]),
    })),
  };
}

function deterministicGeometry() {
  if (deterministicFixture) return deterministicFixture;
  const targets = [
    { x: 300, y: 105 },
    { x: 280, y: 58 },
    { x: 280, y: 152 },
    { x: 180, y: 105 },
  ];
  for (const target of targets) {
    const paths = enumeratePathsFor(target, [], true);
    if (paths.some((path) => path.bounces === MAX_BOUNCES)) {
      deterministicFixture = { target, summary: summarizePaths(paths) };
      return deterministicFixture;
    }
  }
  deterministicFixture = { target: targets[0], summary: summarizePaths(enumeratePathsFor(targets[0], [], true)) };
  return deterministicFixture;
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
  if (Math.abs(candidate.secrecyRate - best.secrecyRate) > 1e-9) return candidate.secrecyRate > best.secrecyRate;
  if (Math.abs(candidate.bob.rate - best.bob.rate) > 1e-9) return candidate.bob.rate > best.bob.rate;
  if (Math.abs(candidate.eve.rate - best.eve.rate) > 1e-9) return candidate.eve.rate < best.eve.rate;
  return candidate.angle < best.angle;
}

function bestBearing() {
  let best = null;
  for (let angle = 0; angle < 360; angle += 1) {
    const candidate = { angle, ...evaluate(angle) };
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
      heading = normalizeAngle(startingHeading + settleTurn * (1 - (1 - settle) ** 3));
    }
    render();
    if (progress < 1) optimizationFrame = window.requestAnimationFrame(animate);
    else finishOptimization();
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
  if (field.hasPointerCapture(event.pointerId)) field.releasePointerCapture(event.pointerId);
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
  rebuildPropagationCache();
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

window.__secrecyDebug = Object.freeze({
  constants: Object.freeze({
    reflectionModel: REFLECTION_MODEL,
    powerCombination: POWER_COMBINATION,
    reflectionCoefficient: REFLECTION_COEFFICIENT,
    wallReflectionCoefficient: REFLECTION_COEFFICIENT,
    obstacleReflectionCoefficient: REFLECTION_COEFFICIENT,
    maxBounces: MAX_BOUNCES,
    dbFloor: DB_FLOOR,
  }),
  scenario: publicScenario,
  evaluatePoint,
  pathSummary: (point, includeWalls = wallsEnabled) => summarizePaths(enumeratePaths(point, includeWalls)),
  sampleHeatmap: (point) => evaluatePoint(point, heading, wallsEnabled).receivedDb,
  deterministicGeometry,
});

window.PocketRuntime.onChange(render);
wallToggle.checked = false;
newScenario();
render();
