const SIZE = 4;
const CELL_COUNT = SIZE * SIZE;
const BEST_SCORE_KEY = 'pocket-play.merge-garden.best.v1';

const TILE_STAGES = new Map([
  [2, { symbol: '🌰', en: 'Seed', zh: '种子' }],
  [4, { symbol: '🌱', en: 'Sprout', zh: '萌芽' }],
  [8, { symbol: '🍃', en: 'Leaf', zh: '叶片' }],
  [16, { symbol: '🌿', en: 'Seedling', zh: '幼苗' }],
  [32, { symbol: '🪴', en: 'Potted plant', zh: '盆栽' }],
  [64, { symbol: '🌼', en: 'Bloom', zh: '花朵' }],
  [128, { symbol: '🧫', en: 'Specimen', zh: '标本' }],
  [256, { symbol: '🔬', en: 'Observation', zh: '观察' }],
  [512, { symbol: '📓', en: 'Notes', zh: '记录' }],
  [1024, { symbol: '💡', en: 'Discovery', zh: '发现' }],
  [2048, { symbol: '📄', en: 'Paper', zh: '论文' }],
  [4096, { symbol: '🌳', en: 'Garden', zh: '花园' }],
]);

const KEY_DIRECTIONS = {
  ArrowLeft: 'left',
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowRight: 'right',
};

const boardElement = document.querySelector('#board');
const scoreboardElement = document.querySelector('.scoreboard');
const directionPad = document.querySelector('.direction-pad');
const scoreElement = document.querySelector('#score');
const bestScoreElement = document.querySelector('#best-score');
const statusElement = document.querySelector('#status');
const announcerElement = document.querySelector('#announcer');
const toggleButton = document.querySelector('#toggle-game');
const restartButton = document.querySelector('#restart-game');
const directionButtons = [...document.querySelectorAll('[data-direction]')];

let board = Array(CELL_COUNT).fill(0);
let score = 0;
let storageAvailable = true;
let bestScore = readBestScore();
let phase = 'idle';
let keyboardArmed = false;
let newestTileIndex = -1;
let mergedTileIndices = new Set();
let highestAnnouncedValue = 32;
let announceTimer = 0;
let statusState = { kind: 'idle' };
let announcementState = null;

function text(english, chinese) {
  return window.PocketRuntime.text(english, chinese);
}

function readBestScore() {
  try {
    const storedValue = Number.parseInt(localStorage.getItem(BEST_SCORE_KEY) ?? '0', 10);
    return Number.isFinite(storedValue) && storedValue >= 0 ? storedValue : 0;
  } catch {
    storageAvailable = false;
    return 0;
  }
}

function saveBestScore() {
  if (!storageAvailable) return;

  try {
    localStorage.setItem(BEST_SCORE_KEY, String(bestScore));
  } catch {
    storageAvailable = false;
  }
}

function tileStage(value) {
  return TILE_STAGES.get(value) ?? { symbol: '🧬', en: 'New species', zh: '新物种' };
}

function stageLabel(value) {
  const stage = tileStage(value);
  return text(stage.en, stage.zh);
}

function directionName(direction) {
  const names = {
    left: text('left', '左'),
    right: text('right', '右'),
    up: text('up', '上'),
    down: text('down', '下'),
  };
  return names[direction];
}

function statusText() {
  if (statusState.kind === 'started') {
    return text(
      'Growing started: push identical research samples together.',
      '培育开始：把相同阶段的研究样本推到一起。',
    );
  }
  if (statusState.kind === 'running') {
    return text(
      'Growing: push identical research samples together.',
      '培育进行中：把相同阶段的研究样本推到一起。',
    );
  }
  if (statusState.kind === 'paused') {
    return text('Growing is paused.', '培育已暂停。');
  }
  if (statusState.kind === 'hidden-paused') {
    return text(
      'The page was hidden, so growing paused automatically.',
      '页面已隐藏，已自动暂停。',
    );
  }
  if (statusState.kind === 'gameover') {
    return text(
      'The greenhouse is full and no samples can merge.',
      '棋盘已经排满，且没有可以继续合并的方块。',
    );
  }
  if (statusState.kind === 'no-change') {
    return text(
      'Nothing moved in that direction. Try another one.',
      '这一方向无法移动，换个方向试试。',
    );
  }
  if (statusState.kind === 'gained') {
    return text(
      `This move gained ${statusState.gained} points.`,
      `本步收获 ${statusState.gained} 分。`,
    );
  }
  if (statusState.kind === 'rearranged') {
    return text('Research samples rearranged.', '研究样本已重新排列。');
  }
  return text(
    'Select “Start growing”, then move every sample.',
    '点击“开始培育”，再用方向按钮移动棋盘上的方块。',
  );
}

function announcementText() {
  if (!announcementState) return '';
  if (announcementState.kind === 'gameover') {
    return text(
      `Game over. Final score ${announcementState.score}.`,
      `本局结束，最终得分 ${announcementState.score}。`,
    );
  }
  if (announcementState.kind === 'discovery') {
    return text(
      `New discovery: ${stageLabel(announcementState.value)}, level ${announcementState.value}.`,
      `新发现：${stageLabel(announcementState.value)}，方块数值 ${announcementState.value}。`,
    );
  }
  if (announcementState.kind === 'no-change') {
    return text('Nothing moved in that direction.', '这一方向无法移动。');
  }
  if (announcementState.kind === 'move') {
    const gain =
      announcementState.gained > 0
        ? text(
            ` Gained ${announcementState.gained} points.`,
            `获得 ${announcementState.gained} 分，`,
          )
        : '';
    return text(
      `Moved ${directionName(announcementState.direction)}.${gain} Score ${announcementState.score}; highest level ${announcementState.largest}.`,
      `向${directionName(announcementState.direction)}移动，${gain}当前分数 ${announcementState.score}，最高阶方块 ${announcementState.largest}。`,
    );
  }
  if (announcementState.kind === 'hidden-paused') {
    return text(
      'The page was hidden. The game paused automatically.',
      '页面已隐藏，游戏已自动暂停。',
    );
  }
  if (announcementState.kind === 'paused') {
    return text('Game paused.', '游戏已暂停。');
  }
  if (announcementState.kind === 'new-round') {
    return text('A new Paper Garden round began.', '已开始新一局论文花园。');
  }
  if (announcementState.kind === 'started') {
    return text('Paper Garden started.', '论文花园已开始。');
  }
  if (announcementState.kind === 'reset') {
    return text('Board reset. Select Start growing.', '棋盘已重置，点击开始培育。');
  }
  return '';
}

function renderStatus() {
  statusElement.textContent = statusText();
}

function renderAnnouncement() {
  announcerElement.textContent = announcementText();
}

function setStatus(kind, details = {}) {
  statusState = { kind, ...details };
  renderStatus();
}

function announce(kind, details = {}) {
  announcementState = { kind, ...details };
  window.clearTimeout(announceTimer);
  announcerElement.textContent = '';
  announceTimer = window.setTimeout(renderAnnouncement, 20);
}

function addRandomTile() {
  const emptyIndices = [];

  board.forEach((value, index) => {
    if (value === 0) emptyIndices.push(index);
  });

  if (emptyIndices.length === 0) return -1;

  const index = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  board[index] = Math.random() < 0.9 ? 2 : 4;
  return index;
}

function mergeLine(values) {
  const compact = values.filter((value) => value !== 0);
  const merged = [];
  const mergedPositions = [];
  let gained = 0;

  for (let index = 0; index < compact.length; index += 1) {
    const value = compact[index];

    if (value === compact[index + 1]) {
      const combined = value * 2;
      merged.push(combined);
      mergedPositions.push(merged.length - 1);
      gained += combined;
      index += 1;
    } else {
      merged.push(value);
    }
  }

  while (merged.length < SIZE) merged.push(0);

  return { values: merged, gained, mergedPositions };
}

function lineIndices(direction, line) {
  const forward = Array.from({ length: SIZE }, (_, index) => index);
  const backward = [...forward].reverse();

  switch (direction) {
    case 'left':
      return forward.map((column) => line * SIZE + column);
    case 'right':
      return backward.map((column) => line * SIZE + column);
    case 'up':
      return forward.map((row) => row * SIZE + line);
    case 'down':
      return backward.map((row) => row * SIZE + line);
    default:
      return [];
  }
}

function calculateMove(direction) {
  const nextBoard = Array(CELL_COUNT).fill(0);
  const nextMergedIndices = new Set();
  let gained = 0;

  for (let line = 0; line < SIZE; line += 1) {
    const indices = lineIndices(direction, line);
    const result = mergeLine(indices.map((index) => board[index]));
    gained += result.gained;

    indices.forEach((boardIndex, position) => {
      nextBoard[boardIndex] = result.values[position];
      if (result.mergedPositions.includes(position)) {
        nextMergedIndices.add(boardIndex);
      }
    });
  }

  const changed = nextBoard.some((value, index) => value !== board[index]);
  return { board: nextBoard, gained, mergedIndices: nextMergedIndices, changed };
}

function hasAvailableMove() {
  if (board.some((value) => value === 0)) return true;

  for (let row = 0; row < SIZE; row += 1) {
    for (let column = 0; column < SIZE; column += 1) {
      const index = row * SIZE + column;
      const right = column + 1 < SIZE ? index + 1 : -1;
      const below = row + 1 < SIZE ? index + SIZE : -1;

      if (
        (right >= 0 && board[index] === board[right]) ||
        (below >= 0 && board[index] === board[below])
      ) {
        return true;
      }
    }
  }

  return false;
}

function updateBestScore() {
  if (score <= bestScore) return;
  bestScore = score;
  saveBestScore();
}

function updateControls() {
  const isActive = phase === 'active';
  const labels = {
    idle: text('Start growing', '开始培育'),
    active: text('Pause', '暂停'),
    paused: text('Continue growing', '继续培育'),
    gameover: text('Plant again', '重新播种'),
  };
  const directionLabels = {
    left: text('Move left', '向左移动'),
    right: text('Move right', '向右移动'),
    up: text('Move up', '向上移动'),
    down: text('Move down', '向下移动'),
  };

  directionButtons.forEach((button) => {
    button.disabled = !isActive;
    button.setAttribute('aria-label', directionLabels[button.dataset.direction]);
  });

  toggleButton.textContent = labels[phase];
  toggleButton.setAttribute('aria-label', labels[phase]);
  toggleButton.setAttribute('aria-pressed', String(isActive));
  restartButton.setAttribute('aria-label', text('Reset the board', '重置棋盘'));
  scoreboardElement.setAttribute('aria-label', text('Game statistics', '本局统计'));
  directionPad.setAttribute('aria-label', text('Move direction', '移动方向'));
}

function renderBoard() {
  const fragment = document.createDocumentFragment();
  const occupiedCount = board.filter(Boolean).length;
  const largestValue = Math.max(...board);

  for (let rowIndex = 0; rowIndex < SIZE; rowIndex += 1) {
    const rowElement = document.createElement('div');
    rowElement.className = 'board-row';
    rowElement.setAttribute('role', 'row');

    for (let columnIndex = 0; columnIndex < SIZE; columnIndex += 1) {
      const index = rowIndex * SIZE + columnIndex;
      const value = board[index];
      const row = rowIndex + 1;
      const column = columnIndex + 1;
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.setAttribute('role', 'gridcell');
      cell.setAttribute('aria-rowindex', String(row));
      cell.setAttribute('aria-colindex', String(column));

      if (value === 0) {
        cell.setAttribute(
          'aria-label',
          text(`Row ${row}, column ${column}, empty plot`, `第 ${row} 行第 ${column} 列，空地`),
        );
      } else {
        const stage = tileStage(value);
        const labelText = stageLabel(value);
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.dataset.value = String(value);
        if (value > 4096) tile.dataset.large = 'true';
        if (index === newestTileIndex) tile.classList.add('is-new');
        if (mergedTileIndices.has(index)) tile.classList.add('is-merged');

        const symbol = document.createElement('span');
        symbol.className = 'tile-symbol';
        symbol.setAttribute('aria-hidden', 'true');
        symbol.textContent = stage.symbol;

        const label = document.createElement('span');
        label.className = 'tile-label';
        label.textContent = labelText;

        const number = document.createElement('span');
        number.className = 'tile-number';
        number.textContent = String(value);

        tile.append(symbol, label, number);
        cell.append(tile);
        cell.setAttribute(
          'aria-label',
          text(
            `Row ${row}, column ${column}, ${value}, ${labelText}`,
            `第 ${row} 行第 ${column} 列，${value}，${labelText}`,
          ),
        );
      }

      rowElement.append(cell);
    }

    fragment.append(rowElement);
  }

  boardElement.replaceChildren(fragment);
  boardElement.setAttribute(
    'aria-label',
    text(
      `Four by four Paper Garden, ${occupiedCount} samples, highest level ${largestValue || 0}`,
      `4×4 论文花园，已有 ${occupiedCount} 个方块，最高阶方块 ${largestValue || 0}`,
    ),
  );
  scoreElement.textContent = String(score);
  bestScoreElement.textContent = String(bestScore);
  updateControls();
}

function renderUI() {
  renderStatus();
  renderBoard();
  renderAnnouncement();
}

function endGame() {
  phase = 'gameover';
  setStatus('gameover');
  updateControls();
  announce('gameover', { score });
}

function maybeAnnounceDiscovery() {
  const largestValue = Math.max(...board);
  if (largestValue < 64 || largestValue <= highestAnnouncedValue) return;

  highestAnnouncedValue = largestValue;
  announce('discovery', { value: largestValue });
}

function move(direction) {
  if (phase !== 'active') return;

  const result = calculateMove(direction);
  newestTileIndex = -1;
  mergedTileIndices = result.mergedIndices;

  if (!result.changed) {
    setStatus('no-change');
    announce('no-change');
    if (!hasAvailableMove()) endGame();
    return;
  }

  board = result.board;
  score += result.gained;
  updateBestScore();
  newestTileIndex = addRandomTile();
  setStatus(result.gained > 0 ? 'gained' : 'rearranged', { gained: result.gained });
  renderBoard();
  announce('move', {
    direction,
    gained: result.gained,
    score,
    largest: Math.max(...board),
  });
  maybeAnnounceDiscovery();

  if (!hasAvailableMove()) endGame();
}

function resetGame(activate = false) {
  board = Array(CELL_COUNT).fill(0);
  score = 0;
  newestTileIndex = addRandomTile();
  addRandomTile();
  mergedTileIndices = new Set();
  highestAnnouncedValue = 32;
  phase = activate ? 'active' : 'idle';
  keyboardArmed = activate;
  statusState = { kind: activate ? 'started' : 'idle' };
  renderStatus();
  renderBoard();
}

function pauseGame(statusKind = 'paused', announcementKind = 'paused') {
  if (phase !== 'active') return;
  phase = 'paused';
  setStatus(statusKind);
  updateControls();
  announce(announcementKind);
}

function toggleGame() {
  if (phase === 'active') {
    pauseGame();
    return;
  }

  if (phase === 'gameover') {
    resetGame(true);
    announce('new-round');
    return;
  }

  phase = 'active';
  keyboardArmed = true;
  setStatus('running');
  updateControls();
  announce('started');
}

toggleButton.addEventListener('click', toggleGame);

restartButton.addEventListener('click', () => {
  resetGame(false);
  announce('reset');
});

directionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    move(button.dataset.direction);
  });
});

window.addEventListener('keydown', (event) => {
  if (!keyboardArmed || phase !== 'active') return;

  if (event.key === 'Escape') {
    event.preventDefault();
    pauseGame();
    return;
  }

  const direction = KEY_DIRECTIONS[event.key];
  if (!direction) return;
  event.preventDefault();
  move(direction);
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden && phase === 'active') {
    pauseGame('hidden-paused', 'hidden-paused');
  }
});

const embedRequested =
  new URLSearchParams(window.location.search).get('embed') === '1' || window.self !== window.top;
if (embedRequested) document.documentElement.dataset.embed = 'true';

window.PocketRuntime.onChange(renderUI);
resetGame(false);
