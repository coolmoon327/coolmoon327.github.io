(() => {
  'use strict';

  const SIZE = 4;
  const CELL_COUNT = SIZE * SIZE;
  const EDGE_COUNT = CELL_COUNT - 1;
  const BEST_KEY = 'pocket-play.resource.best.v1';
  const RESOURCE_ROLES = ['compute', 'storage', 'image', 'resource'];
  const DIRECTIONS = [
    { bit: 1, opposite: 4, row: -1, column: 0, en: 'north', zh: '上' },
    { bit: 2, opposite: 8, row: 0, column: 1, en: 'east', zh: '右' },
    { bit: 4, opposite: 1, row: 1, column: 0, en: 'south', zh: '下' },
    { bit: 8, opposite: 2, row: 0, column: -1, en: 'west', zh: '左' },
  ];
  const ROLE_COPY = {
    node: { en: 'relay', zh: '中继' },
    coordinator: { en: 'coordinator', zh: '协调器' },
    compute: { en: 'compute', zh: '计算资源' },
    storage: { en: 'storage', zh: '存储资源' },
    image: { en: 'image', zh: '镜像资源' },
    resource: { en: 'resource', zh: '通用资源' },
  };
  const ROLE_BADGES = {
    coordinator: 'C',
    compute: 'CPU',
    storage: 'DB',
    image: 'IMG',
    resource: 'R',
  };

  const board = document.querySelector('#board');
  const movesOutput = document.querySelector('#moves');
  const connectedOutput = document.querySelector('#connected-resources');
  const bestOutput = document.querySelector('#best');
  const status = document.querySelector('#status');
  const summary = document.querySelector('#board-summary');
  const newBoardButton = document.querySelector('#new-board');
  const resetButton = document.querySelector('#reset-board');

  const params = new URLSearchParams(window.location.search);
  let nextSeed = normalizeSeed(params.get('seed'));
  let round = 0;
  let best = readBest();
  let state;

  function text(english, chinese) {
    return window.PocketRuntime?.text(english, chinese) ?? english;
  }

  function normalizeSeed(value) {
    if (value !== null && value.trim() !== '') {
      const numeric = Number(value);
      if (Number.isFinite(numeric)) return numeric >>> 0 || 1;

      let hash = 2166136261;
      for (const character of value) {
        hash ^= character.codePointAt(0);
        hash = Math.imul(hash, 16777619);
      }
      return hash >>> 0 || 1;
    }

    if (window.crypto?.getRandomValues) {
      return window.crypto.getRandomValues(new Uint32Array(1))[0] || 1;
    }
    return Date.now() >>> 0 || 1;
  }

  function mulberry32(seed) {
    let value = seed >>> 0;
    return () => {
      value = (value + 0x6d2b79f5) | 0;
      let result = Math.imul(value ^ (value >>> 15), 1 | value);
      result ^= result + Math.imul(result ^ (result >>> 7), 61 | result);
      return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
    };
  }

  function randomInteger(random, maximum) {
    return Math.floor(random() * maximum);
  }

  function shuffled(values, random) {
    const copy = [...values];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const target = randomInteger(random, index + 1);
      [copy[index], copy[target]] = [copy[target], copy[index]];
    }
    return copy;
  }

  function neighborIndex(index, direction) {
    const row = Math.floor(index / SIZE) + direction.row;
    const column = (index % SIZE) + direction.column;
    if (row < 0 || row >= SIZE || column < 0 || column >= SIZE) return -1;
    return row * SIZE + column;
  }

  function rotateMask(mask, turns = 1) {
    let rotated = mask;
    for (let turn = 0; turn < turns; turn += 1) {
      rotated = ((rotated << 1) & 15) | ((rotated >> 3) & 1);
    }
    return rotated;
  }

  function makeTree(random, coordinator) {
    const masks = Array(CELL_COUNT).fill(0);
    const visited = new Set([coordinator]);
    const stack = [coordinator];

    while (stack.length) {
      const current = stack[stack.length - 1];
      const options = shuffled(DIRECTIONS, random).filter((direction) => {
        const neighbor = neighborIndex(current, direction);
        return neighbor !== -1 && !visited.has(neighbor);
      });

      if (!options.length) {
        stack.pop();
        continue;
      }

      const direction = options[0];
      const neighbor = neighborIndex(current, direction);
      masks[current] |= direction.bit;
      masks[neighbor] |= direction.opposite;
      visited.add(neighbor);
      stack.push(neighbor);
    }

    return masks;
  }

  function treeDistances(masks, start) {
    const distances = Array(CELL_COUNT).fill(Number.POSITIVE_INFINITY);
    const queue = [start];
    distances[start] = 0;

    for (let cursor = 0; cursor < queue.length; cursor += 1) {
      const current = queue[cursor];
      for (const direction of DIRECTIONS) {
        if (!(masks[current] & direction.bit)) continue;
        const neighbor = neighborIndex(current, direction);
        if (neighbor === -1 || distances[neighbor] !== Number.POSITIVE_INFINITY) continue;
        distances[neighbor] = distances[current] + 1;
        queue.push(neighbor);
      }
    }

    return distances;
  }

  function assignRoles(masks, coordinator, random) {
    const distances = treeDistances(masks, coordinator);
    const candidates = shuffled(
      Array.from({ length: CELL_COUNT }, (_, index) => index).filter(
        (index) => index !== coordinator,
      ),
      random,
    );

    candidates.sort((first, second) => {
      const firstIsLeaf = Number(bitCount(masks[first]) === 1);
      const secondIsLeaf = Number(bitCount(masks[second]) === 1);
      return secondIsLeaf - firstIsLeaf || distances[second] - distances[first];
    });

    const roles = Array(CELL_COUNT).fill('node');
    roles[coordinator] = 'coordinator';
    const resourceIndexes = [];
    RESOURCE_ROLES.forEach((role, index) => {
      const cell = candidates[index];
      roles[cell] = role;
      resourceIndexes.push(cell);
    });
    return { roles, resourceIndexes };
  }

  function bitCount(mask) {
    let count = 0;
    let value = mask;
    while (value) {
      count += value & 1;
      value >>= 1;
    }
    return count;
  }

  function masksFromRotations(solvedMasks, rotations) {
    return solvedMasks.map((mask, index) => rotateMask(mask, rotations[index]));
  }

  function inspectNetwork(masks, coordinator, resourceIndexes) {
    const linkedPorts = Array.from({ length: CELL_COUNT }, () => new Set());
    let loosePorts = 0;

    masks.forEach((mask, index) => {
      DIRECTIONS.forEach((direction) => {
        if (!(mask & direction.bit)) return;
        const neighbor = neighborIndex(index, direction);
        if (neighbor !== -1 && masks[neighbor] & direction.opposite) {
          linkedPorts[index].add(direction.bit);
        } else {
          loosePorts += 1;
        }
      });
    });

    const connected = new Set([coordinator]);
    const parent = Array(CELL_COUNT).fill(-1);
    const queue = [coordinator];
    for (let cursor = 0; cursor < queue.length; cursor += 1) {
      const current = queue[cursor];
      DIRECTIONS.forEach((direction) => {
        if (!linkedPorts[current].has(direction.bit)) return;
        const neighbor = neighborIndex(current, direction);
        if (neighbor === -1 || connected.has(neighbor)) return;
        connected.add(neighbor);
        parent[neighbor] = current;
        queue.push(neighbor);
      });
    }

    const connectedResources = resourceIndexes.filter((index) => connected.has(index)).length;
    return {
      connected,
      connectedResources,
      linkedPorts,
      loosePorts,
      parent,
      solved: connected.size === CELL_COUNT && loosePorts === 0,
    };
  }

  function scramble(solvedMasks, coordinator, resourceIndexes, random) {
    for (let attempt = 0; attempt < 96; attempt += 1) {
      const rotations = solvedMasks.map(() => randomInteger(random, 4));
      const inspection = inspectNetwork(
        masksFromRotations(solvedMasks, rotations),
        coordinator,
        resourceIndexes,
      );
      if (!inspection.solved && inspection.connectedResources <= 2 && inspection.loosePorts >= 3) {
        return rotations;
      }
    }

    const rotations = Array(CELL_COUNT).fill(0);
    rotations[coordinator] = 1;
    return rotations;
  }

  function createBoard(seed) {
    const random = mulberry32(seed);
    const centers = [5, 6, 9, 10];
    const coordinator = centers[randomInteger(random, centers.length)];
    const solvedMasks = makeTree(random, coordinator);
    const { roles, resourceIndexes } = assignRoles(solvedMasks, coordinator, random);
    const initialRotations = scramble(solvedMasks, coordinator, resourceIndexes, random);

    return {
      seed,
      coordinator,
      solvedMasks,
      roles,
      resourceIndexes,
      initialRotations,
      rotations: [...initialRotations],
      moves: 0,
      solved: false,
      message: 'ready',
    };
  }

  function readBest() {
    try {
      const value = Number.parseInt(window.localStorage.getItem(BEST_KEY), 10);
      return Number.isInteger(value) && value > 0 ? value : null;
    } catch {
      return null;
    }
  }

  function writeBest(value) {
    try {
      window.localStorage.setItem(BEST_KEY, String(value));
    } catch {
      // The game remains fully playable when storage is unavailable.
    }
  }

  function newBoard() {
    state = createBoard(nextSeed);
    nextSeed = (nextSeed + 0x9e3779b9) >>> 0 || 1;
    round += 1;
    render(true);
  }

  function resetBoard() {
    state.rotations = [...state.initialRotations];
    state.moves = 0;
    state.solved = false;
    state.message = 'reset';
    render(false);
  }

  function rotateTile(index) {
    if (state.solved) return;
    state.rotations[index] = (state.rotations[index] + 1) % 4;
    state.moves += 1;
    state.message = 'playing';

    const masks = masksFromRotations(state.solvedMasks, state.rotations);
    const inspection = inspectNetwork(masks, state.coordinator, state.resourceIndexes);
    if (inspection.solved) {
      state.solved = true;
      state.message = 'solved';
      if (best === null || state.moves < best) {
        best = state.moves;
        writeBest(best);
      }
    }
    render(false);
  }

  function roleName(role) {
    const copy = ROLE_COPY[role] ?? ROLE_COPY.node;
    return text(copy.en, copy.zh);
  }

  function portsLabel(mask) {
    const active = DIRECTIONS.filter((direction) => mask & direction.bit);
    if (!active.length) return text('none', '无');
    return active.map((direction) => text(direction.en, direction.zh)).join(text(', ', '、'));
  }

  function tileLabel(index, mask, inspection) {
    const row = Math.floor(index / SIZE) + 1;
    const column = (index % SIZE) + 1;
    const connection = inspection.connected.has(index)
      ? text('connected', '已连接')
      : text('disconnected', '未连接');
    const role = roleName(state.roles[index]);
    const ports = portsLabel(mask);
    return text(
      `Row ${row}, column ${column}, ${role}; ports ${ports}; ${connection}. Activate to rotate clockwise.`,
      `第 ${row} 行第 ${column} 列，${role}；接口朝${ports}；${connection}。按下可顺时针旋转。`,
    );
  }

  function directionBetween(first, second) {
    return DIRECTIONS.find((direction) => neighborIndex(first, direction) === second);
  }

  function requestPaths(inspection) {
    return state.resourceIndexes.map((resource) => {
      const reversePath = [resource];
      let current = resource;
      while (current !== state.coordinator && inspection.parent[current] !== -1) {
        current = inspection.parent[current];
        reversePath.push(current);
      }
      return reversePath.reverse();
    });
  }

  function addRequestPulses(inspection) {
    requestPaths(inspection).forEach((path, routeIndex) => {
      for (let step = 0; step < path.length - 1; step += 1) {
        const current = path[step];
        const next = path[step + 1];
        const direction = directionBetween(current, next);
        if (!direction) continue;
        const outgoingPipe = board.children[current]?.querySelector(`.pipe-${direction.en[0]}`);
        const incomingDirection = DIRECTIONS.find(
          (candidate) => candidate.bit === direction.opposite,
        );
        const incomingPipe = board.children[next]?.querySelector(
          `.pipe-${incomingDirection.en[0]}`,
        );
        const baseDelay = routeIndex * 0.29 + step * 0.22;

        if (outgoingPipe) {
          const pulse = document.createElement('span');
          pulse.className = 'request-pulse';
          pulse.setAttribute('aria-hidden', 'true');
          pulse.style.setProperty('--pulse-delay', `${baseDelay.toFixed(2)}s`);
          outgoingPipe.append(pulse);
        }

        if (incomingPipe) {
          const pulse = document.createElement('span');
          pulse.className = 'request-pulse is-inbound';
          pulse.setAttribute('aria-hidden', 'true');
          pulse.style.setProperty('--pulse-delay', `${(baseDelay + 0.1).toFixed(2)}s`);
          incomingPipe.append(pulse);
        }
      }
    });
  }

  function updateStatus(inspection) {
    status.classList.toggle('is-complete', state.solved);
    if (state.message === 'solved') {
      status.textContent = text(
        `OpenRaaS mesh complete in ${state.moves} moves. Requests are flowing.`,
        `OpenRaaS 资源网络已在 ${state.moves} 步内连通，请求开始沿网络传输。`,
      );
      summary.textContent = text(
        `Solved. All four resources and all ${CELL_COUNT} tiles are connected.`,
        `已完成。四项资源和全部 ${CELL_COUNT} 个方块均已连通。`,
      );
      return;
    }

    if (state.message === 'reset') {
      status.textContent = text(
        'Board reset to its starting rotations.',
        '棋盘已恢复到本轮初始方向。',
      );
      summary.textContent = status.textContent;
      return;
    }

    if (state.message === 'ready') {
      status.textContent = text(
        'Rotate tiles to assemble one OpenRaaS resource mesh.',
        '旋转节点，组出一张没有悬空接口的 OpenRaaS 资源网络。',
      );
      summary.textContent = text(
        `New solvable OpenRaaS topology. ${inspection.connectedResources} of 4 resources are online.`,
        `已生成一个保证可解的 OpenRaaS 拓扑。4 项资源中已有 ${inspection.connectedResources} 项在线。`,
      );
      return;
    }

    status.textContent = text(
      `${inspection.connectedResources} of 4 resources online · ${inspection.loosePorts} loose ends.`,
      `4 项资源中 ${inspection.connectedResources} 项在线 · ${inspection.loosePorts} 个断口。`,
    );
    summary.textContent = text(
      `${state.moves} moves. ${inspection.connected.size} of ${CELL_COUNT} tiles connected; ${inspection.loosePorts} loose ends.`,
      `已走 ${state.moves} 步。${CELL_COUNT} 个方块中 ${inspection.connected.size} 个已连接；还有 ${inspection.loosePorts} 个断口。`,
    );
  }

  function render(rebuild) {
    const masks = masksFromRotations(state.solvedMasks, state.rotations);
    const inspection = inspectNetwork(masks, state.coordinator, state.resourceIndexes);

    if (rebuild || board.children.length !== CELL_COUNT) {
      board.replaceChildren();
      for (let index = 0; index < CELL_COUNT; index += 1) {
        const tile = document.createElement('button');
        tile.type = 'button';
        tile.className = 'tile';
        tile.dataset.index = String(index);
        tile.dataset.testid = `resource-tile-${index}`;
        tile.setAttribute(
          'aria-keyshortcuts',
          'Enter Space ArrowUp ArrowRight ArrowDown ArrowLeft',
        );
        board.append(tile);
      }
    }

    masks.forEach((mask, index) => {
      const tile = board.children[index];
      const role = state.roles[index];
      tile.replaceChildren();
      tile.classList.toggle('is-connected', inspection.connected.has(index));
      tile.classList.toggle(
        'has-loose-port',
        DIRECTIONS.some(
          (direction) => mask & direction.bit && !inspection.linkedPorts[index].has(direction.bit),
        ),
      );
      tile.dataset.row = String(Math.floor(index / SIZE));
      tile.dataset.column = String(index % SIZE);
      tile.dataset.role = role;
      tile.dataset.mask = String(mask);
      tile.dataset.solvedMask = String(state.solvedMasks[index]);
      tile.dataset.rotation = String(state.rotations[index]);
      tile.dataset.initialRotation = String(state.initialRotations[index]);
      tile.dataset.connected = String(inspection.connected.has(index));
      tile.dataset.loose = String(tile.classList.contains('has-loose-port'));
      tile.setAttribute('aria-label', tileLabel(index, mask, inspection));
      tile.setAttribute('aria-disabled', String(state.solved));

      DIRECTIONS.forEach((direction) => {
        if (!(mask & direction.bit)) return;
        const pipe = document.createElement('span');
        const suffix = direction.en[0];
        const linked = inspection.linkedPorts[index].has(direction.bit);
        pipe.className = `pipe pipe-${suffix} ${linked ? 'is-linked' : 'is-loose'}`;
        pipe.dataset.direction = direction.en;
        pipe.dataset.linked = String(linked);
        pipe.setAttribute('aria-hidden', 'true');
        tile.append(pipe);
      });

      const hub = document.createElement('span');
      hub.className = 'hub';
      hub.setAttribute('aria-hidden', 'true');
      tile.append(hub);

      if (ROLE_BADGES[role]) {
        const badge = document.createElement('span');
        badge.className = 'node-badge';
        badge.textContent = ROLE_BADGES[role];
        badge.setAttribute('aria-hidden', 'true');
        tile.append(badge);
      }
    });

    movesOutput.textContent = String(state.moves);
    connectedOutput.textContent = `${inspection.connectedResources} / 4`;
    bestOutput.textContent = best === null ? '—' : String(best);

    board.dataset.seed = String(state.seed);
    board.dataset.round = String(round);
    board.dataset.edgeCount = String(EDGE_COUNT);
    board.dataset.solved = String(state.solved);
    board.dataset.connectedCount = String(inspection.connected.size);
    board.dataset.connectedResources = String(inspection.connectedResources);
    board.dataset.loosePorts = String(inspection.loosePorts);
    board.dataset.solution = state.solvedMasks.join('-');
    board.dataset.rotations = state.rotations.join('-');
    board.dataset.initialRotations = state.initialRotations.join('-');
    board.dataset.paused = String(document.hidden);
    board.setAttribute(
      'aria-label',
      text(
        `Four by four OpenRaaS Mesh board, ${inspection.connectedResources} of 4 resources online`,
        `4×4 OpenRaaS 组网棋盘，4 项资源中 ${inspection.connectedResources} 项在线`,
      ),
    );

    updateStatus(inspection);
    if (state.solved) addRequestPulses(inspection);
  }

  board.addEventListener('click', (event) => {
    const tile = event.target.closest('.tile');
    if (!tile || !board.contains(tile)) return;
    rotateTile(Number(tile.dataset.index));
  });

  board.addEventListener('keydown', (event) => {
    const tile = event.target.closest('.tile');
    if (!tile) return;
    const offsets = {
      ArrowUp: -SIZE,
      ArrowRight: 1,
      ArrowDown: SIZE,
      ArrowLeft: -1,
    };
    if (!(event.key in offsets)) return;

    const index = Number(tile.dataset.index);
    const row = Math.floor(index / SIZE);
    const column = index % SIZE;
    if (event.key === 'ArrowUp' && row === 0) return;
    if (event.key === 'ArrowDown' && row === SIZE - 1) return;
    if (event.key === 'ArrowLeft' && column === 0) return;
    if (event.key === 'ArrowRight' && column === SIZE - 1) return;

    event.preventDefault();
    board.children[index + offsets[event.key]]?.focus();
  });

  newBoardButton.addEventListener('click', newBoard);
  resetButton.addEventListener('click', resetBoard);
  document.addEventListener('visibilitychange', () => {
    board.dataset.paused = String(document.hidden);
  });
  window.PocketRuntime?.onChange(() => render(false));

  newBoard();
})();
