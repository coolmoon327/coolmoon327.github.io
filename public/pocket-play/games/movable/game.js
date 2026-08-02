(() => {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";
  const STATION_COUNT = 4;
  const ANTENNAS_PER_STATION = 3;
  const USER_COUNT = 24;
  const GRID_SIZE = 16;
  const SECTOR_SIZE = 120;
  const FIELD_MARGIN = 13;
  const BEAM_RADIUS = 36;
  const COVERAGE_THRESHOLD = 0.235;
  const INTERFERENCE_THRESHOLD = 0.165;
  const INTERFERENCE_RATIO = 0.54;

  const runtime = window.PocketRuntime;
  const field = document.querySelector("#field");
  const heatLayer = document.querySelector("#heat-layer");
  const beamLayer = document.querySelector("#beam-layer");
  const userLayer = document.querySelector("#user-layer");
  const stationLayer = document.querySelector("#station-layer");
  const coverageOutput = document.querySelector("#coverage");
  const interferenceOutput = document.querySelector("#interference");
  const servedOutput = document.querySelector("#served");
  const statusOutput = document.querySelector("#status");
  const announcer = document.querySelector("#announcer");
  const optimizeButton = document.querySelector("#optimize");
  const randomizeButton = document.querySelector("#randomize");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const state = {
    stations: [],
    users: [],
    heatCells: [],
    beamNodes: [],
    userNodes: [],
    handleNodes: [],
    drag: null,
    optimizing: false,
    optimizationToken: 0,
    sceneId: 0,
    metrics: { coverage: 0, interference: 0, served: 0 },
  };

  function text(english, chinese) {
    return runtime ? runtime.text(english, chinese) : english;
  }

  function svgElement(name, attributes = {}) {
    const node = document.createElementNS(SVG_NS, name);
    Object.entries(attributes).forEach(([key, value]) =>
      node.setAttribute(key, String(value)),
    );
    return node;
  }

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function normalizeAngle(angle) {
    return ((angle % 360) + 360) % 360;
  }

  function angleDifference(a, b) {
    return Math.abs(((a - b + 540) % 360) - 180);
  }

  function pointAt(x, y, distance, angle) {
    const radians = (angle * Math.PI) / 180;
    return {
      x: x + Math.cos(radians) * distance,
      y: y + Math.sin(radians) * distance,
    };
  }

  function arcPath(x, y, radius, startAngle, endAngle) {
    const start = pointAt(x, y, radius, startAngle);
    const end = pointAt(x, y, radius, endAngle);
    return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${radius} ${radius} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
  }

  function wedgePath(x, y, radius, centerAngle) {
    const halfWidth = 27;
    const start = pointAt(x, y, radius, centerAngle - halfWidth);
    const end = pointAt(x, y, radius, centerAngle + halfWidth);
    return `M ${x.toFixed(2)} ${y.toFixed(2)} L ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${radius} ${radius} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)} Z`;
  }

  function squaredDistance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
  }

  function minimumPairDistance(points) {
    let minimum = Infinity;
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        minimum = Math.min(
          minimum,
          Math.sqrt(squaredDistance(points[i], points[j])),
        );
      }
    }
    return Number.isFinite(minimum) ? minimum : 0;
  }

  // Mitchell's best-candidate sampler: each new point maximizes its minimum
  // distance to all accepted points. Several trials make the four-point set
  // reliably blue-noise-like while keeping scene generation instant.
  function generateMaximinBases() {
    let bestSet = [];
    let bestSpacing = -Infinity;

    for (let trial = 0; trial < 8; trial += 1) {
      const points = [
        {
          x: FIELD_MARGIN + Math.random() * (100 - FIELD_MARGIN * 2),
          y: FIELD_MARGIN + Math.random() * (100 - FIELD_MARGIN * 2),
        },
      ];

      while (points.length < STATION_COUNT) {
        let bestCandidate = null;
        let bestCandidateScore = -Infinity;

        for (let attempt = 0; attempt < 96; attempt += 1) {
          const candidate = {
            x: FIELD_MARGIN + Math.random() * (100 - FIELD_MARGIN * 2),
            y: FIELD_MARGIN + Math.random() * (100 - FIELD_MARGIN * 2),
          };
          const score = Math.min(
            ...points.map((point) => squaredDistance(candidate, point)),
          );
          if (score > bestCandidateScore) {
            bestCandidate = candidate;
            bestCandidateScore = score;
          }
        }

        points.push(bestCandidate);
      }

      const spacing = minimumPairDistance(points);
      if (spacing > bestSpacing) {
        bestSet = points;
        bestSpacing = spacing;
      }
    }

    field.dataset.minBaseDistance = bestSpacing.toFixed(1);
    return bestSet;
  }

  function createStation(point) {
    const phase = Math.random() * 360;
    const antennas = Array.from(
      { length: ANTENNAS_PER_STATION },
      (_, antennaIndex) => {
        const minimum = phase + antennaIndex * SECTOR_SIZE;
        return {
          minimum,
          maximum: minimum + SECTOR_SIZE,
          angle: minimum + 12 + Math.random() * 96,
        };
      },
    );
    return { x: point.x, y: point.y, phase, antennas };
  }

  function createUsers() {
    return Array.from({ length: USER_COUNT }, () => ({
      x: 5 + Math.random() * 90,
      y: 5 + Math.random() * 90,
    }));
  }

  function initializeHeatGrid() {
    const cellSize = 100 / GRID_SIZE;
    for (let row = 0; row < GRID_SIZE; row += 1) {
      for (let column = 0; column < GRID_SIZE; column += 1) {
        const node = svgElement("rect", {
          class: "heat-cell",
          x: (column * cellSize + 0.18).toFixed(2),
          y: (row * cellSize + 0.18).toFixed(2),
          width: (cellSize - 0.36).toFixed(2),
          height: (cellSize - 0.36).toFixed(2),
          rx: "0.65",
        });
        heatLayer.append(node);
        state.heatCells.push({
          x: (column + 0.5) * cellSize,
          y: (row + 0.5) * cellSize,
          node,
        });
      }
    }
  }

  function rebuildSceneNodes() {
    beamLayer.replaceChildren();
    userLayer.replaceChildren();
    stationLayer.replaceChildren();
    state.beamNodes = [];
    state.userNodes = [];
    state.handleNodes = [];

    state.users.forEach((user) => {
      const node = svgElement("circle", {
        class: "user uncovered",
        cx: user.x.toFixed(2),
        cy: user.y.toFixed(2),
        r: "1.45",
      });
      userLayer.append(node);
      state.userNodes.push(node);
    });

    state.stations.forEach((station, stationIndex) => {
      const stationGroup = svgElement("g", { class: "station" });

      station.antennas.forEach((antenna, antennaIndex) => {
        const beam = svgElement("path", {
          class: `beam beam-a${antennaIndex}`,
        });
        beamLayer.append(beam);
        state.beamNodes.push(beam);

        const guide = svgElement("path", {
          class: `sector-guide sector-a${antennaIndex}`,
          d: arcPath(
            station.x,
            station.y,
            6.5,
            antenna.minimum + 2,
            antenna.maximum - 2,
          ),
        });
        stationGroup.append(guide);
      });

      stationGroup.append(
        svgElement("circle", {
          class: "station-halo",
          cx: station.x.toFixed(2),
          cy: station.y.toFixed(2),
          r: "4.15",
        }),
      );
      stationGroup.append(
        svgElement("circle", {
          class: "station-core",
          cx: station.x.toFixed(2),
          cy: station.y.toFixed(2),
          r: "1.75",
        }),
      );

      const label = svgElement("text", {
        class: "station-label",
        x: station.x.toFixed(2),
        y: (station.y - 5.5).toFixed(2),
      });
      label.textContent = `B${stationIndex + 1}`;
      stationGroup.append(label);

      station.antennas.forEach((_, antennaIndex) => {
        const handle = svgElement("g", {
          class: `antenna-handle antenna-a${antennaIndex}`,
          tabindex: "0",
          focusable: "true",
          role: "slider",
          "aria-valuemin": "0",
          "aria-valuemax": String(SECTOR_SIZE),
          "aria-describedby": "keyboard-help",
          "data-station": stationIndex,
          "data-antenna": antennaIndex,
        });
        handle.append(
          svgElement("line", { class: "antenna-hit" }),
          svgElement("line", { class: "antenna-line" }),
          svgElement("circle", { class: "antenna-knob", r: "1.85" }),
        );
        handle.addEventListener("pointerdown", beginDrag);
        handle.addEventListener("keydown", handleAntennaKeydown);
        handle.addEventListener("focus", () =>
          handle.classList.add("is-active"),
        );
        handle.addEventListener("blur", () =>
          handle.classList.remove("is-active"),
        );
        stationGroup.append(handle);
        state.handleNodes.push(handle);
      });

      stationLayer.append(stationGroup);
    });
  }

  function signalAt(point) {
    const stationSignals = state.stations.map((station) => {
      const dx = point.x - station.x;
      const dy = point.y - station.y;
      const distanceSquared = dx * dx + dy * dy;
      const bearing = normalizeAngle((Math.atan2(dy, dx) * 180) / Math.PI);
      const distanceGain = Math.exp(-distanceSquared / (2 * 29 * 29));

      return Math.max(
        ...station.antennas.map((antenna) => {
          const delta = angleDifference(bearing, normalizeAngle(antenna.angle));
          const directionalGain =
            0.055 +
            0.945 * Math.pow(Math.max(0, Math.cos((delta * Math.PI) / 180)), 6);
          return directionalGain * distanceGain;
        }),
      );
    });

    stationSignals.sort((a, b) => b - a);
    const strongest = stationSignals[0] || 0;
    const second = stationSignals[1] || 0;
    const covered = strongest >= COVERAGE_THRESHOLD;
    const interfered =
      covered &&
      second >= INTERFERENCE_THRESHOLD &&
      second / Math.max(strongest, 0.0001) >= INTERFERENCE_RATIO;

    return { strongest, second, covered, interfered };
  }

  function calculateMetrics() {
    let coveredCells = 0;
    let interferedCells = 0;
    let servedUsers = 0;

    state.heatCells.forEach((cell) => {
      const result = signalAt(cell);
      if (result.covered) coveredCells += 1;
      if (result.interfered) interferedCells += 1;
    });

    state.users.forEach((user) => {
      const result = signalAt(user);
      if (result.covered && !result.interfered) servedUsers += 1;
    });

    return {
      coverage: (coveredCells / state.heatCells.length) * 100,
      interference: (interferedCells / state.heatCells.length) * 100,
      served: servedUsers,
    };
  }

  function objective(metrics) {
    return (
      metrics.served * 12 + metrics.coverage * 0.11 - metrics.interference * 0.2
    );
  }

  function updateConfigurationHook() {
    const bases = state.stations
      .map((station) => `${station.x.toFixed(1)},${station.y.toFixed(1)}`)
      .join(";");
    const angles = state.stations
      .flatMap((station) =>
        station.antennas.map((antenna) =>
          normalizeAngle(antenna.angle).toFixed(1),
        ),
      )
      .join(",");
    field.dataset.config = `s${state.sceneId}|b:${bases}|a:${angles}`;
  }

  function updateHandleAccessibility() {
    state.handleNodes.forEach((handle, flatIndex) => {
      const stationIndex = Math.floor(flatIndex / ANTENNAS_PER_STATION);
      const antennaIndex = flatIndex % ANTENNAS_PER_STATION;
      const antenna = state.stations[stationIndex].antennas[antennaIndex];
      const offset = clamp(antenna.angle - antenna.minimum, 0, SECTOR_SIZE);
      const absolute = Math.round(normalizeAngle(antenna.angle));
      handle.setAttribute("aria-valuenow", offset.toFixed(1));
      handle.setAttribute(
        "aria-valuetext",
        text(`${absolute} degrees azimuth`, `方位角 ${absolute} 度`),
      );
      handle.setAttribute(
        "aria-label",
        text(
          `Base ${stationIndex + 1}, antenna ${antennaIndex + 1}`,
          `基站 ${stationIndex + 1}，天线 ${antennaIndex + 1}`,
        ),
      );
    });
  }

  function render() {
    state.stations.forEach((station, stationIndex) => {
      station.antennas.forEach((antenna, antennaIndex) => {
        const flatIndex = stationIndex * ANTENNAS_PER_STATION + antennaIndex;
        const beam = state.beamNodes[flatIndex];
        const handle = state.handleNodes[flatIndex];
        const end = pointAt(station.x, station.y, 9.1, antenna.angle);
        const hit = handle.querySelector(".antenna-hit");
        const line = handle.querySelector(".antenna-line");
        const knob = handle.querySelector(".antenna-knob");

        beam.setAttribute(
          "d",
          wedgePath(station.x, station.y, BEAM_RADIUS, antenna.angle),
        );
        [hit, line].forEach((node) => {
          node.setAttribute("x1", station.x.toFixed(2));
          node.setAttribute("y1", station.y.toFixed(2));
          node.setAttribute("x2", end.x.toFixed(2));
          node.setAttribute("y2", end.y.toFixed(2));
        });
        knob.setAttribute("cx", end.x.toFixed(2));
        knob.setAttribute("cy", end.y.toFixed(2));
      });
    });

    let coveredCells = 0;
    let interferedCells = 0;
    state.heatCells.forEach((cell) => {
      const result = signalAt(cell);
      cell.node.classList.toggle(
        "covered",
        result.covered && !result.interfered,
      );
      cell.node.classList.toggle("interfered", result.interfered);
      const visible = result.covered || result.interfered;
      cell.node.style.opacity = visible
        ? String(clamp(0.13 + result.strongest * 0.25, 0.14, 0.36))
        : "0";
      if (result.covered) coveredCells += 1;
      if (result.interfered) interferedCells += 1;
    });

    let servedUsers = 0;
    state.users.forEach((user, index) => {
      const result = signalAt(user);
      const node = state.userNodes[index];
      node.classList.toggle("served", result.covered && !result.interfered);
      node.classList.toggle("interfered", result.interfered);
      node.classList.toggle("uncovered", !result.covered);
      if (result.covered && !result.interfered) servedUsers += 1;
    });

    state.metrics = {
      coverage: (coveredCells / state.heatCells.length) * 100,
      interference: (interferedCells / state.heatCells.length) * 100,
      served: servedUsers,
    };
    coverageOutput.value = `${Math.round(state.metrics.coverage)}%`;
    coverageOutput.textContent = coverageOutput.value;
    interferenceOutput.value = `${Math.round(state.metrics.interference)}%`;
    interferenceOutput.textContent = interferenceOutput.value;
    servedOutput.value = String(state.metrics.served);
    servedOutput.textContent = servedOutput.value;
    servedOutput.dataset.total = String(USER_COUNT);
    updateConfigurationHook();
    updateHandleAccessibility();
  }

  function setStatus(english, chinese, announce = false) {
    const message = text(english, chinese);
    statusOutput.textContent = message;
    if (announce) announcer.textContent = message;
  }

  function createScene() {
    state.sceneId += 1;
    state.stations = generateMaximinBases().map(createStation);
    state.users = createUsers();
    rebuildSceneNodes();
    render();
  }

  function pointerPosition(event) {
    const bounds = field.getBoundingClientRect();
    return {
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    };
  }

  function unwrapIntoSector(rawAngle, antenna) {
    const midpoint = (antenna.minimum + antenna.maximum) / 2;
    const candidates = [
      rawAngle - 360,
      rawAngle,
      rawAngle + 360,
      rawAngle + 720,
    ];
    const closest = candidates.reduce((best, candidate) =>
      Math.abs(candidate - midpoint) < Math.abs(best - midpoint)
        ? candidate
        : best,
    );
    return clamp(closest, antenna.minimum, antenna.maximum);
  }

  function updateAngleFromPointer(event) {
    if (!state.drag || state.drag.pointerId !== event.pointerId) return;
    const station = state.stations[state.drag.stationIndex];
    const antenna = station.antennas[state.drag.antennaIndex];
    const point = pointerPosition(event);
    const rawAngle = normalizeAngle(
      (Math.atan2(point.y - station.y, point.x - station.x) * 180) / Math.PI,
    );
    antenna.angle = unwrapIntoSector(rawAngle, antenna);
    render();
  }

  function beginDrag(event) {
    if (state.optimizing || event.button > 0) return;
    const handle = event.currentTarget;
    state.drag = {
      pointerId: event.pointerId,
      stationIndex: Number(handle.dataset.station),
      antennaIndex: Number(handle.dataset.antenna),
      handle,
    };
    handle.focus();
    handle.classList.add("is-active");
    handle.setPointerCapture(event.pointerId);
    updateAngleFromPointer(event);
    event.preventDefault();
  }

  function moveDrag(event) {
    if (!state.drag) return;
    updateAngleFromPointer(event);
    event.preventDefault();
  }

  function endDrag(event) {
    if (!state.drag || state.drag.pointerId !== event.pointerId) return;
    const { stationIndex, antennaIndex, handle } = state.drag;
    if (handle.hasPointerCapture(event.pointerId))
      handle.releasePointerCapture(event.pointerId);
    state.drag = null;
    setStatus(
      `Base ${stationIndex + 1}, antenna ${antennaIndex + 1} updated.`,
      `已更新基站 ${stationIndex + 1} 的第 ${antennaIndex + 1} 根天线。`,
    );
  }

  function handleAntennaKeydown(event) {
    if (state.optimizing) return;
    const handledKeys = [
      "ArrowLeft",
      "ArrowDown",
      "ArrowRight",
      "ArrowUp",
      "Home",
      "End",
    ];
    if (!handledKeys.includes(event.key)) return;

    const handle = event.currentTarget;
    const stationIndex = Number(handle.dataset.station);
    const antennaIndex = Number(handle.dataset.antenna);
    const antenna = state.stations[stationIndex].antennas[antennaIndex];
    const step = event.shiftKey ? 10 : 3;

    if (event.key === "Home") antenna.angle = antenna.minimum;
    if (event.key === "End") antenna.angle = antenna.maximum;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      antenna.angle = clamp(
        antenna.angle - step,
        antenna.minimum,
        antenna.maximum,
      );
    }
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      antenna.angle = clamp(
        antenna.angle + step,
        antenna.minimum,
        antenna.maximum,
      );
    }

    render();
    setStatus(
      `Antenna set to ${Math.round(normalizeAngle(antenna.angle))} degrees.`,
      `天线已转到 ${Math.round(normalizeAngle(antenna.angle))} 度。`,
      true,
    );
    event.preventDefault();
  }

  function setOptimizing(value) {
    state.optimizing = value;
    field.dataset.optimizing = String(value);
    optimizeButton.disabled = value;
    randomizeButton.disabled = value;
  }

  function pause(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  }

  function animateAngle(antenna, target, token) {
    const start = antenna.angle;
    if (reducedMotion.matches || Math.abs(target - start) < 0.1) {
      antenna.angle = target;
      render();
      return Promise.resolve();
    }

    const duration = 115;
    const startedAt = performance.now();
    return new Promise((resolve) => {
      function frame(now) {
        if (token !== state.optimizationToken) {
          resolve();
          return;
        }
        const progress = clamp((now - startedAt) / duration, 0, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        antenna.angle = start + (target - start) * eased;
        render();
        if (progress < 1) window.requestAnimationFrame(frame);
        else resolve();
      }
      window.requestAnimationFrame(frame);
    });
  }

  async function optimizeConfiguration() {
    if (state.optimizing) return;
    const token = state.optimizationToken + 1;
    state.optimizationToken = token;
    setOptimizing(true);
    setStatus(
      "Searching each antenna's 120° sector…",
      "正在逐一搜索每根天线的 120° 扇区…",
      true,
    );

    try {
      let currentMetrics = calculateMetrics();
      let currentScore = objective(currentMetrics);
      const totalSteps = STATION_COUNT * ANTENNAS_PER_STATION * 2;
      let completedSteps = 0;

      for (let pass = 0; pass < 2; pass += 1) {
        for (
          let stationIndex = 0;
          stationIndex < state.stations.length;
          stationIndex += 1
        ) {
          const station = state.stations[stationIndex];
          for (
            let antennaIndex = 0;
            antennaIndex < station.antennas.length;
            antennaIndex += 1
          ) {
            if (token !== state.optimizationToken) return;
            const antenna = station.antennas[antennaIndex];
            const flatIndex =
              stationIndex * ANTENNAS_PER_STATION + antennaIndex;
            const handle = state.handleNodes[flatIndex];
            const originalAngle = antenna.angle;
            let bestAngle = originalAngle;
            let bestMetrics = currentMetrics;
            let bestScore = currentScore;
            const candidates = [originalAngle];

            for (let offset = 0; offset <= SECTOR_SIZE; offset += 15) {
              candidates.push(antenna.minimum + offset);
            }

            handle.classList.add("is-searching");
            candidates.forEach((candidate) => {
              antenna.angle = candidate;
              const candidateMetrics = calculateMetrics();
              const candidateScore = objective(candidateMetrics);
              if (candidateScore > bestScore + 0.0001) {
                bestScore = candidateScore;
                bestAngle = candidate;
                bestMetrics = candidateMetrics;
              }
            });
            antenna.angle = originalAngle;

            completedSteps += 1;
            setStatus(
              `Searching antenna ${completedSteps} of ${totalSteps}…`,
              `正在搜索第 ${completedSteps}/${totalSteps} 根天线…`,
            );
            await animateAngle(antenna, bestAngle, token);
            if (!reducedMotion.matches) await pause(24);
            handle.classList.remove("is-searching");
            currentMetrics = bestMetrics;
            currentScore = bestScore;
          }
        }
      }

      if (token !== state.optimizationToken) return;
      render();
      setStatus(
        `Search complete: ${state.metrics.served} users clear, ${Math.round(state.metrics.coverage)}% covered.`,
        `搜索完成：${state.metrics.served} 位用户无干扰，覆盖率 ${Math.round(state.metrics.coverage)}%。`,
        true,
      );
    } finally {
      if (token === state.optimizationToken) {
        state.handleNodes.forEach((handle) =>
          handle.classList.remove("is-searching"),
        );
        setOptimizing(false);
      }
    }
  }

  function randomizeScene() {
    if (state.optimizing) return;
    createScene();
    setStatus(
      `New maximin scene: bases stay ${field.dataset.minBaseDistance} units apart.`,
      `已生成新的最大最小距离场景：基站间距至少 ${field.dataset.minBaseDistance}。`,
      true,
    );
  }

  function cancelOptimization() {
    if (!state.optimizing) return;
    state.optimizationToken += 1;
    state.handleNodes.forEach((handle) =>
      handle.classList.remove("is-searching"),
    );
    setOptimizing(false);
  }

  field.addEventListener("pointermove", moveDrag);
  field.addEventListener("pointerup", endDrag);
  field.addEventListener("pointercancel", endDrag);
  optimizeButton.addEventListener("click", optimizeConfiguration);
  randomizeButton.addEventListener("click", randomizeScene);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && state.optimizing) {
      cancelOptimization();
      setStatus(
        "Search paused while this game is hidden.",
        "页面隐藏，搜索已暂停。",
        true,
      );
    }
  });

  if (runtime) {
    runtime.onChange(() => {
      updateHandleAccessibility();
      if (!state.optimizing) {
        setStatus(
          "Drag an antenna, use arrow keys, or press the search button.",
          "拖动天线、使用方向键，或点击一键搜索。",
        );
      }
    });
  }

  initializeHeatGrid();
  createScene();
  setStatus(
    "Drag an antenna, use arrow keys, or press the search button.",
    "拖动天线、使用方向键，或点击一键搜索。",
  );
})();
